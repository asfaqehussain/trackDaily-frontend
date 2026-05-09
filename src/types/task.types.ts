export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string; // ISO date string e.g. "2026-05-05"
  createdAt: string;
  updatedAt: string;
  // UI fields
  time?: string;      // "HH:MM" for display on calendar
  category?: string;  // "Work", "Personal", etc.
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
  time?: string;
  category?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
  time?: string;
  category?: string;
  updatedAt?: string;
}
