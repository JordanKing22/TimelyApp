import { SQLiteDatabase } from 'expo-sqlite';
import { FocusSession, FocusConfig } from '../types/focus';
import { generateId } from '../utils/id';
import { nowISO } from '../utils/time';

interface SessionRow {
  id: string;
  task_id: string | null;
  work_minutes: number;
  break_minutes: number;
  long_break_minutes: number;
  sessions_before_long_break: number;
  started_at: string;
  ended_at: string | null;
  completed_cycles: number;
  was_aborted: number;
}

function rowToSession(row: SessionRow): FocusSession {
  return {
    id: row.id,
    taskId: row.task_id,
    workMinutes: row.work_minutes,
    breakMinutes: row.break_minutes,
    longBreakMinutes: row.long_break_minutes,
    sessionsBeforeLongBreak: row.sessions_before_long_break,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    completedCycles: row.completed_cycles,
    wasAborted: row.was_aborted === 1,
  };
}

export async function createSession(
  db: SQLiteDatabase,
  taskId: string | null,
  config: FocusConfig
): Promise<string> {
  const id = generateId();
  await db.runAsync(
    `INSERT INTO focus_sessions
     (id, task_id, work_minutes, break_minutes, long_break_minutes, sessions_before_long_break, started_at, ended_at, completed_cycles, was_aborted)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 0, 0)`,
    [id, taskId, config.workMinutes, config.breakMinutes, config.longBreakMinutes, config.cyclesBeforeLongBreak, nowISO()]
  );
  return id;
}

export async function completeSession(
  db: SQLiteDatabase,
  id: string,
  completedCycles: number,
  wasAborted: boolean
): Promise<void> {
  await db.runAsync(
    'UPDATE focus_sessions SET ended_at = ?, completed_cycles = ?, was_aborted = ? WHERE id = ?',
    [nowISO(), completedCycles, wasAborted ? 1 : 0, id]
  );
}

export async function getRecentSessions(db: SQLiteDatabase, limit = 20): Promise<FocusSession[]> {
  const rows = await db.getAllAsync<SessionRow>(
    'SELECT * FROM focus_sessions ORDER BY started_at DESC LIMIT ?',
    [limit]
  );
  return rows.map(rowToSession);
}

export async function getFocusConfig(db: SQLiteDatabase): Promise<FocusConfig> {
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    "SELECT key, value FROM app_settings WHERE key IN ('work_minutes','break_minutes','long_break_minutes','sessions_before_long_break')"
  );
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return {
    workMinutes: parseInt(map['work_minutes'] ?? '25', 10),
    breakMinutes: parseInt(map['break_minutes'] ?? '5', 10),
    longBreakMinutes: parseInt(map['long_break_minutes'] ?? '15', 10),
    cyclesBeforeLongBreak: parseInt(map['sessions_before_long_break'] ?? '4', 10),
  };
}

export async function saveFocusConfig(db: SQLiteDatabase, config: FocusConfig): Promise<void> {
  const entries = [
    ['work_minutes', String(config.workMinutes)],
    ['break_minutes', String(config.breakMinutes)],
    ['long_break_minutes', String(config.longBreakMinutes)],
    ['sessions_before_long_break', String(config.cyclesBeforeLongBreak)],
  ];
  await db.withTransactionAsync(async () => {
    for (const [key, value] of entries) {
      await db.runAsync('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)', [key, value]);
    }
  });
}
