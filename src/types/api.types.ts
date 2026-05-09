export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export type StatsPeriod = 'week' | 'month' | 'year';

export interface DailyTask {
  date: string;
  count: number;
}

export interface HabitBreakdown {
  id: string;
  name: string;
  consistency: number;
}

export interface StatsData {
  period: StatsPeriod;
  tasksDone: number;
  tasksDoneChange: string;
  bestStreak: number;
  habitConsistency: number;
  avgPerDay: number;
  dailyTasks: DailyTask[];
  habitBreakdown: HabitBreakdown[];
  totalHabits: number;
  pendingTasks: number;
}

export interface SyncTaskPayload {
  toCreate: import('./task.types').CreateTaskPayload[];
  toUpdate: { id: string; data: import('./task.types').UpdateTaskPayload }[];
}

export interface SyncHabitPayload {
  toCreate: import('./habit.types').CreateHabitPayload[];
  toUpdate: { id: string; data: import('./habit.types').UpdateHabitPayload }[];
}

export interface SyncRequest {
  tasks: SyncTaskPayload;
  habits: SyncHabitPayload;
}

export interface SyncResponse {
  tasks: { synced: number; conflicts: number };
  habits: { synced: number; conflicts: number };
}
