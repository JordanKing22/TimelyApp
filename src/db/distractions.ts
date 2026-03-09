import { SQLiteDatabase } from 'expo-sqlite';
import { Distraction, DistractionCategory, DistractionStats } from '../types/distraction';
import { generateId } from '../utils/id';
import { nowISO, getLastNDays } from '../utils/time';

interface DistractionRow {
  id: string;
  session_id: string | null;
  category: string;
  note: string | null;
  logged_at: string;
}

function rowToDistraction(row: DistractionRow): Distraction {
  return {
    id: row.id,
    sessionId: row.session_id,
    category: row.category as DistractionCategory,
    note: row.note,
    loggedAt: row.logged_at,
  };
}

export async function logDistraction(
  db: SQLiteDatabase,
  sessionId: string | null,
  category: DistractionCategory,
  note?: string
): Promise<Distraction> {
  const id = generateId();
  const now = nowISO();
  await db.runAsync(
    'INSERT INTO distractions (id, session_id, category, note, logged_at) VALUES (?, ?, ?, ?, ?)',
    [id, sessionId, category, note ?? null, now]
  );
  return { id, sessionId, category, note: note ?? null, loggedAt: now };
}

export async function getDistractionsForDate(db: SQLiteDatabase, date: string): Promise<Distraction[]> {
  const rows = await db.getAllAsync<DistractionRow>(
    "SELECT * FROM distractions WHERE logged_at LIKE ? ORDER BY logged_at DESC",
    [`${date}%`]
  );
  return rows.map(rowToDistraction);
}

export async function getAllDistractions(db: SQLiteDatabase, limit = 200): Promise<Distraction[]> {
  const rows = await db.getAllAsync<DistractionRow>(
    'SELECT * FROM distractions ORDER BY logged_at DESC LIMIT ?',
    [limit]
  );
  return rows.map(rowToDistraction);
}

export async function deleteDistraction(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM distractions WHERE id = ?', [id]);
}

export async function getDistractionStats(db: SQLiteDatabase, days = 7): Promise<DistractionStats> {
  const allRows = await getAllDistractions(db);
  const recentDays = getLastNDays(days);

  const byCategory: Record<DistractionCategory, number> = {
    phone: 0,
    thought: 0,
    environment: 0,
    other: 0,
  };

  for (const d of allRows) {
    const cat = d.category as DistractionCategory;
    if (cat in byCategory) byCategory[cat]++;
  }

  const byDateMap: Record<string, number> = {};
  for (const day of recentDays) byDateMap[day] = 0;
  for (const d of allRows) {
    const date = d.loggedAt.split('T')[0];
    if (date in byDateMap) byDateMap[date]++;
  }

  const byDate = recentDays
    .map((date) => ({ date, count: byDateMap[date] ?? 0 }))
    .reverse(); // chronological order

  return {
    total: allRows.length,
    byCategory,
    byDate,
  };
}
