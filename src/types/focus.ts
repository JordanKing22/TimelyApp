export type Phase = 'idle' | 'work' | 'short_break' | 'long_break' | 'complete';

export interface FocusConfig {
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
}

export interface FocusSession {
  id: string;
  taskId: string | null;
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  startedAt: string;
  endedAt: string | null;
  completedCycles: number;
  wasAborted: boolean;
}

export interface ActiveSession {
  sessionId: string;
  phase: Phase;
  secondsRemaining: number;
  currentCycle: number;
  isPaused: boolean;
  linkedTaskId: string | null;
  config: FocusConfig;
}
