import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Distraction, DistractionCategory } from '../types/distraction';
import { getDatabase } from '../db/database';
import * as DistractionsDB from '../db/distractions';
import { todayISO } from '../utils/time';

interface DistractionsState {
  distractions: Distraction[];
  loading: boolean;
}

type DistractionsAction =
  | { type: 'LOAD'; payload: Distraction[] }
  | { type: 'ADD'; payload: Distraction }
  | { type: 'DELETE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

function distractionsReducer(state: DistractionsState, action: DistractionsAction): DistractionsState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, distractions: action.payload, loading: false };
    case 'ADD':
      return { ...state, distractions: [action.payload, ...state.distractions] };
    case 'DELETE':
      return { ...state, distractions: state.distractions.filter((d) => d.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

interface DistractionsContextValue {
  state: DistractionsState;
  loadDistractions: () => Promise<void>;
  logDistraction: (sessionId: string | null, category: DistractionCategory, note?: string) => Promise<Distraction>;
  deleteDistraction: (id: string) => Promise<void>;
  todayCount: number;
}

const DistractionsContext = createContext<DistractionsContextValue | null>(null);

export function DistractionsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(distractionsReducer, { distractions: [], loading: true });

  const loadDistractions = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const db = await getDatabase();
    const items = await DistractionsDB.getAllDistractions(db);
    dispatch({ type: 'LOAD', payload: items });
  }, []);

  const logDistraction = useCallback(async (sessionId: string | null, category: DistractionCategory, note?: string) => {
    const db = await getDatabase();
    const item = await DistractionsDB.logDistraction(db, sessionId, category, note);
    dispatch({ type: 'ADD', payload: item });
    return item;
  }, []);

  const deleteDistraction = useCallback(async (id: string) => {
    const db = await getDatabase();
    await DistractionsDB.deleteDistraction(db, id);
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const today = todayISO();
  const todayCount = state.distractions.filter((d) => d.loggedAt.startsWith(today)).length;

  return (
    <DistractionsContext.Provider value={{ state, loadDistractions, logDistraction, deleteDistraction, todayCount }}>
      {children}
    </DistractionsContext.Provider>
  );
}

export function useDistractionsContext(): DistractionsContextValue {
  const ctx = useContext(DistractionsContext);
  if (!ctx) throw new Error('useDistractionsContext must be used within DistractionsProvider');
  return ctx;
}
