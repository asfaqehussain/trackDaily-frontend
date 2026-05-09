import { storage } from './mmkv';
import { Habit } from '../types/habit.types';

const KEY = 'cached_habits';

export const habitsStore = {
  getCachedHabits(): Habit[] {
    const raw = storage.getString(KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Habit[];
    } catch {
      return [];
    }
  },

  setCachedHabits(habits: Habit[]): void {
    storage.set(KEY, JSON.stringify(habits));
  },

  clearHabits(): void {
    storage.remove(KEY);
  },
};
