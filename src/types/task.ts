export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  priority: Priority;
  estimatedMinutes: number;
  isComplete: boolean;
  dueDate: string | null; // ISO 8601 date string e.g. "2024-10-15"
  createdAt: string;      // ISO 8601 datetime
  completedAt: string | null;
  sortOrder: number;
}

export interface SubStep {
  id: string;
  taskId: string;
  title: string;
  isComplete: boolean;
  sortOrder: number;
  createdAt: string;
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'isComplete'>;
export type UpdateTask = Partial<Omit<Task, 'id' | 'createdAt'>>;
