import { storage } from './mmkv';
import { Task } from '../types/task.types';

const KEY = 'cached_tasks';

export const tasksStore = {
  getCachedTasks(): Task[] {
    const raw = storage.getString(KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Task[];
    } catch {
      return [];
    }
  },

  setCachedTasks(tasks: Task[]): void {
    storage.set(KEY, JSON.stringify(tasks));
  },

  clearTasks(): void {
    storage.remove(KEY);
  },
};
