import { SQLiteDatabase } from 'expo-sqlite';
import { Task, SubStep, Priority } from '../types/task';
import { generateId } from '../utils/id';
import { nowISO } from '../utils/time';

// --- Row mappers ---

interface TaskRow {
  id: string;
  title: string;
  notes: string | null;
  priority: string;
  estimated_minutes: number;
  is_complete: number;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
  sort_order: number;
}

interface SubStepRow {
  id: string;
  task_id: string;
  title: string;
  is_complete: number;
  sort_order: number;
  created_at: string;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes,
    priority: row.priority as Priority,
    estimatedMinutes: row.estimated_minutes,
    isComplete: row.is_complete === 1,
    dueDate: row.due_date,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    sortOrder: row.sort_order,
  };
}

function rowToSubStep(row: SubStepRow): SubStep {
  return {
    id: row.id,
    taskId: row.task_id,
    title: row.title,
    isComplete: row.is_complete === 1,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

// --- Tasks CRUD ---

export async function getAllTasks(db: SQLiteDatabase): Promise<Task[]> {
  const rows = await db.getAllAsync<TaskRow>(
    'SELECT * FROM tasks ORDER BY sort_order ASC, created_at DESC'
  );
  return rows.map(rowToTask);
}

export async function getTaskById(db: SQLiteDatabase, id: string): Promise<Task | null> {
  const row = await db.getFirstAsync<TaskRow>('SELECT * FROM tasks WHERE id = ?', [id]);
  return row ? rowToTask(row) : null;
}

export async function createTask(
  db: SQLiteDatabase,
  data: {
    title: string;
    notes?: string | null;
    priority: Priority;
    estimatedMinutes: number;
    dueDate?: string | null;
    sortOrder?: number;
  }
): Promise<Task> {
  const id = generateId();
  const now = nowISO();
  await db.runAsync(
    `INSERT INTO tasks (id, title, notes, priority, estimated_minutes, is_complete, due_date, created_at, completed_at, sort_order)
     VALUES (?, ?, ?, ?, ?, 0, ?, ?, NULL, ?)`,
    [id, data.title, data.notes ?? null, data.priority, data.estimatedMinutes, data.dueDate ?? null, now, data.sortOrder ?? 0]
  );
  return (await getTaskById(db, id))!;
}

export async function updateTask(
  db: SQLiteDatabase,
  id: string,
  data: {
    title?: string;
    notes?: string | null;
    priority?: Priority;
    estimatedMinutes?: number;
    dueDate?: string | null;
    sortOrder?: number;
  }
): Promise<void> {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }
  if (data.priority !== undefined) { fields.push('priority = ?'); values.push(data.priority); }
  if (data.estimatedMinutes !== undefined) { fields.push('estimated_minutes = ?'); values.push(data.estimatedMinutes); }
  if (data.dueDate !== undefined) { fields.push('due_date = ?'); values.push(data.dueDate); }
  if (data.sortOrder !== undefined) { fields.push('sort_order = ?'); values.push(data.sortOrder); }

  if (fields.length === 0) return;
  values.push(id);
  await db.runAsync(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function toggleTaskComplete(db: SQLiteDatabase, id: string, isComplete: boolean): Promise<void> {
  await db.runAsync(
    'UPDATE tasks SET is_complete = ?, completed_at = ? WHERE id = ?',
    [isComplete ? 1 : 0, isComplete ? nowISO() : null, id]
  );
}

export async function deleteTask(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}

// --- Sub-steps CRUD ---

export async function getSubStepsForTask(db: SQLiteDatabase, taskId: string): Promise<SubStep[]> {
  const rows = await db.getAllAsync<SubStepRow>(
    'SELECT * FROM sub_steps WHERE task_id = ? ORDER BY sort_order ASC',
    [taskId]
  );
  return rows.map(rowToSubStep);
}

export async function createSubStep(
  db: SQLiteDatabase,
  taskId: string,
  title: string,
  sortOrder: number
): Promise<SubStep> {
  const id = generateId();
  const now = nowISO();
  await db.runAsync(
    'INSERT INTO sub_steps (id, task_id, title, is_complete, sort_order, created_at) VALUES (?, ?, ?, 0, ?, ?)',
    [id, taskId, title, sortOrder, now]
  );
  return { id, taskId, title, isComplete: false, sortOrder, createdAt: now };
}

export async function toggleSubStep(db: SQLiteDatabase, id: string, isComplete: boolean): Promise<void> {
  await db.runAsync('UPDATE sub_steps SET is_complete = ? WHERE id = ?', [isComplete ? 1 : 0, id]);
}

export async function deleteSubStep(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM sub_steps WHERE id = ?', [id]);
}

export async function bulkCreateSubSteps(db: SQLiteDatabase, subSteps: SubStep[]): Promise<void> {
  await db.withTransactionAsync(async () => {
    for (const step of subSteps) {
      await db.runAsync(
        'INSERT INTO sub_steps (id, task_id, title, is_complete, sort_order, created_at) VALUES (?, ?, ?, 0, ?, ?)',
        [step.id, step.taskId, step.title, step.sortOrder, step.createdAt]
      );
    }
  });
}
