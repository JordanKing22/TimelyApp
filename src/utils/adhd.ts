import { SubStep } from '../types/task';
import { generateId } from './id';
import { nowISO } from './time';

/**
 * Auto-chunk a task into sub-steps based on its estimated duration.
 * Each sub-step is roughly 15 minutes or less.
 * Returns suggested sub-steps the user can rename.
 */
export function chunkTask(taskTitle: string, estimatedMinutes: number, taskId: string): SubStep[] {
  const chunkSize = 15; // minutes per sub-step
  const count = Math.max(2, Math.ceil(estimatedMinutes / chunkSize));
  const now = nowISO();

  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    taskId,
    title: `Step ${i + 1} — ${taskTitle}`,
    isComplete: false,
    sortOrder: i,
    createdAt: now,
  }));
}

/**
 * Suggest a priority based on due date and estimated duration.
 * Same-day tasks with high duration → urgent; otherwise reasonable defaults.
 */
export function suggestPriority(dueDate: string | null, estimatedMinutes: number): 'low' | 'medium' | 'high' | 'urgent' {
  if (!dueDate) return 'medium';
  const today = new Date().toISOString().split('T')[0];
  const isToday = dueDate === today;
  if (isToday && estimatedMinutes >= 30) return 'urgent';
  if (isToday) return 'high';
  return estimatedMinutes >= 60 ? 'high' : 'medium';
}
