export type DistractionCategory = 'phone' | 'thought' | 'environment' | 'other';

export interface Distraction {
  id: string;
  sessionId: string | null;
  category: DistractionCategory;
  note: string | null;
  loggedAt: string; // ISO 8601 datetime
}

export interface DistractionStats {
  total: number;
  byCategory: Record<DistractionCategory, number>;
  byDate: { date: string; count: number }[];
}
