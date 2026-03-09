export const CREATE_TASKS = `
  CREATE TABLE IF NOT EXISTS tasks (
    id               TEXT PRIMARY KEY,
    title            TEXT NOT NULL,
    notes            TEXT,
    priority         TEXT NOT NULL DEFAULT 'medium',
    estimated_minutes INTEGER NOT NULL DEFAULT 25,
    is_complete      INTEGER NOT NULL DEFAULT 0,
    due_date         TEXT,
    created_at       TEXT NOT NULL,
    completed_at     TEXT,
    sort_order       INTEGER NOT NULL DEFAULT 0
  );
`;

export const CREATE_SUB_STEPS = `
  CREATE TABLE IF NOT EXISTS sub_steps (
    id           TEXT PRIMARY KEY,
    task_id      TEXT NOT NULL,
    title        TEXT NOT NULL,
    is_complete  INTEGER NOT NULL DEFAULT 0,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
  );
`;

export const CREATE_FOCUS_SESSIONS = `
  CREATE TABLE IF NOT EXISTS focus_sessions (
    id                          TEXT PRIMARY KEY,
    task_id                     TEXT,
    work_minutes                INTEGER NOT NULL DEFAULT 25,
    break_minutes               INTEGER NOT NULL DEFAULT 5,
    long_break_minutes          INTEGER NOT NULL DEFAULT 15,
    sessions_before_long_break  INTEGER NOT NULL DEFAULT 4,
    started_at                  TEXT NOT NULL,
    ended_at                    TEXT,
    completed_cycles            INTEGER NOT NULL DEFAULT 0,
    was_aborted                 INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
  );
`;

export const CREATE_DISTRACTIONS = `
  CREATE TABLE IF NOT EXISTS distractions (
    id          TEXT PRIMARY KEY,
    session_id  TEXT,
    category    TEXT NOT NULL,
    note        TEXT,
    logged_at   TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES focus_sessions(id) ON DELETE SET NULL
  );
`;

export const CREATE_APP_SETTINGS = `
  CREATE TABLE IF NOT EXISTS app_settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;

export const DEFAULT_SETTINGS: { key: string; value: string }[] = [
  { key: 'work_minutes', value: '25' },
  { key: 'break_minutes', value: '5' },
  { key: 'long_break_minutes', value: '15' },
  { key: 'sessions_before_long_break', value: '4' },
  { key: 'theme', value: 'light' },
  { key: 'haptics_enabled', value: 'true' },
];

export const ALL_TABLES = [
  CREATE_TASKS,
  CREATE_SUB_STEPS,
  CREATE_FOCUS_SESSIONS,
  CREATE_DISTRACTIONS,
  CREATE_APP_SETTINGS,
];
