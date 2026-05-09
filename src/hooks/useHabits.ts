import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { habitsApi } from '../api/habits.api';
import { habitsStore } from '../store/habits.store';
import { queueStore } from '../store/queue.store';
import { useNetworkStatus } from './useNetworkStatus';
import { Habit, CreateHabitPayload } from '../types/habit.types';
import { computeStreak } from '../utils/streak';
import { todayISO } from '../utils/date';

const HABITS_QUERY_KEY = ['habits'] as const;

function enrichWithStreak(habits: Habit[]): Habit[] {
  return habits.map((h) => ({
    ...h,
    streak: computeStreak(h.checkIns),
  }));
}

/**
 * Fetch all habits with computed streaks.
 * Falls back to MMKV cache when offline.
 */
export function useHabits() {
  const { isOnline } = useNetworkStatus();

  return useQuery<Habit[]>({
    queryKey: HABITS_QUERY_KEY,
    queryFn: async () => {
      if (!isOnline) {
        return enrichWithStreak(habitsStore.getCachedHabits());
      }
      const habits = await habitsApi.getHabits();
      const enriched = enrichWithStreak(habits);
      habitsStore.setCachedHabits(enriched);
      return enriched;
    },
    placeholderData: () => enrichWithStreak(habitsStore.getCachedHabits()),
    retry: isOnline ? 2 : 0,
    staleTime: 30_000,
  });
}

/**
 * Create a new habit with optimistic update.
 */
export function useCreateHabit() {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();

  return useMutation({
    mutationFn: async (payload: CreateHabitPayload) => {
      if (!isOnline) {
        queueStore.enqueue({ type: 'CREATE_HABIT', payload });
        return null;
      }
      return habitsApi.createHabit(payload);
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: HABITS_QUERY_KEY });
      const previous = queryClient.getQueryData<Habit[]>(HABITS_QUERY_KEY) ?? [];

      const optimistic: Habit = {
        id: `temp-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        checkIns: [],
        streak: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        icon: payload.icon,
        color: payload.color,
        repeatType: payload.repeatType,
        repeatDays: payload.repeatDays,
      };

      const updated = [...previous, optimistic];
      queryClient.setQueryData(HABITS_QUERY_KEY, updated);
      habitsStore.setCachedHabits(updated);

      return { previous };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(HABITS_QUERY_KEY, ctx.previous);
      }
    },

    onSettled: () => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
      }
    },
  });
}

/**
 * Check in a habit for today (idempotent).
 */
export function useCheckIn() {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();

  return useMutation({
    mutationFn: async (habitId: string) => {
      const date = todayISO();
      if (!isOnline) {
        queueStore.enqueue({ type: 'CHECK_IN_HABIT', payload: { habitId, date } });
        return null;
      }
      return habitsApi.checkIn(habitId, date);
    },

    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: HABITS_QUERY_KEY });
      const previous = queryClient.getQueryData<Habit[]>(HABITS_QUERY_KEY) ?? [];

      const today = todayISO();
      const updated = previous.map((h) => {
        if (h.id !== habitId) return h;
        const alreadyChecked = h.checkIns.includes(today);
        if (alreadyChecked) return h;
        const newCheckIns = [...h.checkIns, today];
        return {
          ...h,
          checkIns: newCheckIns,
          streak: computeStreak(newCheckIns),
          updatedAt: new Date().toISOString(),
        };
      });

      queryClient.setQueryData(HABITS_QUERY_KEY, updated);
      habitsStore.setCachedHabits(updated);

      return { previous };
    },

    onError: (_err, _habitId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(HABITS_QUERY_KEY, ctx.previous);
      }
    },

    onSettled: () => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
      }
    },
  });
}

/**
 * Delete a habit by ID.
 */
export function useDeleteHabit() {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!isOnline) {
        queueStore.enqueue({ type: 'DELETE_HABIT', payload: id });
        return;
      }
      return habitsApi.deleteHabit(id);
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: HABITS_QUERY_KEY });
      const previous = queryClient.getQueryData<Habit[]>(HABITS_QUERY_KEY) ?? [];

      const updated = previous.filter((h) => h.id !== id);
      queryClient.setQueryData(HABITS_QUERY_KEY, updated);
      habitsStore.setCachedHabits(updated);

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(HABITS_QUERY_KEY, ctx.previous);
      }
    },

    onSettled: () => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
      }
    },
  });
}
