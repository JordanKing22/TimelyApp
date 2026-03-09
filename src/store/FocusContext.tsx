import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Phase, FocusConfig, ActiveSession } from '../types/focus';
import { getDatabase } from '../db/database';
import * as SessionsDB from '../db/focusSessions';
import { generateId } from '../utils/id';

interface FocusState {
  active: ActiveSession | null;
  config: FocusConfig;
  configLoaded: boolean;
}

type FocusAction =
  | { type: 'LOAD_CONFIG'; payload: FocusConfig }
  | { type: 'START_SESSION'; payload: ActiveSession }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEXT_PHASE' }
  | { type: 'END_SESSION' }
  | { type: 'JUMP_TIMER'; payload: number } // seconds elapsed while backgrounded
  | { type: 'UPDATE_CONFIG'; payload: FocusConfig };

function nextPhase(state: ActiveSession): Partial<ActiveSession> {
  const { phase, currentCycle, config } = state;
  if (phase === 'work') {
    const newCycle = currentCycle + 1;
    const isLongBreak = newCycle % config.cyclesBeforeLongBreak === 0;
    return {
      phase: isLongBreak ? 'long_break' : 'short_break',
      secondsRemaining: (isLongBreak ? config.longBreakMinutes : config.breakMinutes) * 60,
      currentCycle: newCycle,
    };
  }
  if (phase === 'short_break' || phase === 'long_break') {
    if (state.currentCycle >= config.cyclesBeforeLongBreak * 999) {
      return { phase: 'complete', secondsRemaining: 0 };
    }
    return { phase: 'work', secondsRemaining: config.workMinutes * 60 };
  }
  return { phase: 'complete', secondsRemaining: 0 };
}

function focusReducer(state: FocusState, action: FocusAction): FocusState {
  switch (action.type) {
    case 'LOAD_CONFIG':
      return { ...state, config: action.payload, configLoaded: true };
    case 'UPDATE_CONFIG':
      return { ...state, config: action.payload };
    case 'START_SESSION':
      return { ...state, active: action.payload };
    case 'TICK': {
      if (!state.active || state.active.isPaused) return state;
      const next = state.active.secondsRemaining - 1;
      if (next <= 0) {
        const changes = nextPhase(state.active);
        return { ...state, active: { ...state.active, ...changes } };
      }
      return { ...state, active: { ...state.active, secondsRemaining: next } };
    }
    case 'PAUSE':
      if (!state.active) return state;
      return { ...state, active: { ...state.active, isPaused: true } };
    case 'RESUME':
      if (!state.active) return state;
      return { ...state, active: { ...state.active, isPaused: false } };
    case 'NEXT_PHASE': {
      if (!state.active) return state;
      const changes = nextPhase(state.active);
      return { ...state, active: { ...state.active, ...changes } };
    }
    case 'END_SESSION':
      return { ...state, active: null };
    case 'JUMP_TIMER': {
      if (!state.active || state.active.isPaused) return state;
      let remaining = state.active.secondsRemaining - action.payload;
      let active = { ...state.active };
      while (remaining <= 0) {
        const changes = nextPhase(active);
        active = { ...active, ...changes };
        if (active.phase === 'complete') { remaining = 0; break; }
        // remaining is negative, add the new phase duration
        remaining = active.secondsRemaining + remaining;
      }
      return { ...state, active: { ...active, secondsRemaining: Math.max(0, remaining) } };
    }
    default:
      return state;
  }
}

interface FocusContextValue {
  state: FocusState;
  startSession: (linkedTaskId: string | null) => Promise<void>;
  pause: () => void;
  resume: () => void;
  skipPhase: () => void;
  endSession: (aborted?: boolean) => Promise<void>;
  updateConfig: (config: FocusConfig) => Promise<void>;
}

const FocusContext = createContext<FocusContextValue | null>(null);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(focusReducer, {
    active: null,
    config: { workMinutes: 25, breakMinutes: 5, longBreakMinutes: 15, cyclesBeforeLongBreak: 4 },
    configLoaded: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const backgroundedAtRef = useRef<number | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load config from DB
  useEffect(() => {
    getDatabase().then((db) => SessionsDB.getFocusConfig(db)).then((config) => {
      dispatch({ type: 'LOAD_CONFIG', payload: config });
    });
  }, []);

  // Interval tick
  useEffect(() => {
    if (state.active && !state.active.isPaused && state.active.phase !== 'complete') {
      intervalRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [state.active?.isPaused, state.active?.phase, !!state.active]);

  // Background/foreground time-jumping
  useEffect(() => {
    const sub = AppState.addEventListener('change', (status: AppStateStatus) => {
      if (status === 'background') {
        backgroundedAtRef.current = Date.now();
      } else if (status === 'active' && backgroundedAtRef.current !== null) {
        const elapsed = Math.floor((Date.now() - backgroundedAtRef.current) / 1000);
        backgroundedAtRef.current = null;
        if (elapsed > 2) dispatch({ type: 'JUMP_TIMER', payload: elapsed });
      }
    });
    return () => sub.remove();
  }, []);

  const startSession = useCallback(async (linkedTaskId: string | null) => {
    const db = await getDatabase();
    const config = stateRef.current.config;
    const sessionId = await SessionsDB.createSession(db, linkedTaskId, config);
    dispatch({
      type: 'START_SESSION',
      payload: {
        sessionId,
        phase: 'work',
        secondsRemaining: config.workMinutes * 60,
        currentCycle: 0,
        isPaused: false,
        linkedTaskId,
        config,
      },
    });
  }, []);

  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), []);
  const skipPhase = useCallback(() => dispatch({ type: 'NEXT_PHASE' }), []);

  const endSession = useCallback(async (aborted = false) => {
    const active = stateRef.current.active;
    if (!active) return;
    const db = await getDatabase();
    await SessionsDB.completeSession(db, active.sessionId, active.currentCycle, aborted);
    dispatch({ type: 'END_SESSION' });
  }, []);

  const updateConfig = useCallback(async (config: FocusConfig) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
    const db = await getDatabase();
    await SessionsDB.saveFocusConfig(db, config);
  }, []);

  return (
    <FocusContext.Provider value={{ state, startSession, pause, resume, skipPhase, endSession, updateConfig }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocusContext(): FocusContextValue {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocusContext must be used within FocusProvider');
  return ctx;
}
