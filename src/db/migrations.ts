import type { SQLiteDatabase } from 'expo-sqlite';

interface Migration {
  version: number;
  description: string;
  sql: string[];
}

// Add new migrations at the END of this array.
// Never modify existing migrations — add new ones instead.
const migrations: Migration[] = [
  {
    version: 1,
    description: 'Initial schema: tasks, sub_steps, focus_sessions, distractions, app_settings',
    sql: [
      `CREATE TABLE IF NOT EXISTS tasks (
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
      )`,
      `CREATE TABLE IF NOT EXISTS sub_steps (
        id           TEXT PRIMARY KEY,
        task_id      TEXT NOT NULL,
        title        TEXT NOT NULL,
        is_complete  INTEGER NOT NULL DEFAULT 0,
        sort_order   INTEGER NOT NULL DEFAULT 0,
        created_at   TEXT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS focus_sessions (
        id                          TEXT PRIMARY KEY,
        task_id                     TEXT,
        work_minutes                INTEGER NOT NULL DEFAULT 25,
        break_minutes               INTEGER NOT NULL DEFAULT 5,
        long_break_minutes          INTEGER NOT NULL DEFAULT 15,
        sessions_before_long_break  INTEGER NOT NULL DEFAULT 4,
        started_at                  TEXT NOT NULL,
        ended_at                    TEXT,
        completed_cycles            INTEGER NOT NULL DEFAULT 0,
        was_aborted                 INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS distractions (
        id          TEXT PRIMARY KEY,
        session_id  TEXT,
        category    TEXT NOT NULL,
        note        TEXT,
        logged_at   TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS app_settings (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`,
      `INSERT OR IGNORE INTO app_settings (key, value) VALUES ('work_minutes', '25')`,
      `INSERT OR IGNORE INTO app_settings (key, value) VALUES ('break_minutes', '5')`,
      `INSERT OR IGNORE INTO app_settings (key, value) VALUES ('long_break_minutes', '15')`,
      `INSERT OR IGNORE INTO app_settings (key, value) VALUES ('sessions_before_long_break', '4')`,
      `INSERT OR IGNORE INTO app_settings (key, value) VALUES ('theme', 'light')`,
      `INSERT OR IGNORE INTO app_settings (key, value) VALUES ('haptics_enabled', 'true')`,
    ],
  },
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  // Get current schema version
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;

  const pending = migrations.filter((m) => m.version > currentVersion);
  if (pending.length === 0) return;

  for (const migration of pending) {
    console.log(`[DB] Running migration v${migration.version}: ${migration.description}`);
    await db.withTransactionAsync(async () => {
      for (const sql of migration.sql) {
        await db.execAsync(sql);
      }
      await db.execAsync(`PRAGMA user_version = ${migration.version}`);
    });
  }

  console.log(`[DB] Migrations complete. Schema version: ${pending[pending.length - 1].version}`);
}
