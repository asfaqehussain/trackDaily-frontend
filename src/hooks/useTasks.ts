import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import { tasksStore } from '../store/tasks.store';
import { queueStore } from '../store/queue.store';
import { useNetworkStatus } from './useNetworkStatus';
import { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '../types/task.types';

const TASKS_QUERY_KEY = ['tasks'] as const;

/**
 * Fetch all tasks.
 * Falls back to MMKV cache when offline or on error.
 */
export function useTasks() {
  const { isOnline } = useNetworkStatus();

  return useQuery<Task[]>({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      if (!isOnline) {
        return tasksStore.getCachedTasks();
      }
      const tasks = await tasksApi.getTasks();
      tasksStore.setCachedTasks(tasks); // keep cache fresh
      return tasks;
    },
    placeholderData: tasksStore.getCachedTasks,
    retry: isOnline ? 2 : 0,
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Create a new task with optimistic update.
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();

  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      if (!isOnline) {
        queueStore.enqueue({ type: 'CREATE_TASK', payload });
        return null; // optimistic only
      }
      return tasksApi.createTask(payload);
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY) ?? [];

      const optimistic: Task = {
        id: `temp-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        dueDate: payload.dueDate,
        time: payload.time,
        category: payload.category,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [...previous, optimistic];
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, updated);
      tasksStore.setCachedTasks(updated);

      return { previous };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(TASKS_QUERY_KEY, ctx.previous);
      }
    },

    onSuccess: (serverTask) => {
      if (serverTask) {
        const current = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY) ?? [];
        let replaced = false;
        const updated = current.map((t) => {
          if (!replaced && t.id.startsWith('temp-')) {
            replaced = true;
            return serverTask;
          }
          return t;
        });
        queryClient.setQueryData(TASKS_QUERY_KEY, updated);
        tasksStore.setCachedTasks(updated);
      }
    },

    onSettled: () => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      }
    },
  });
}

/**
 * Update an existing task (title, description, dueDate, status).
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTaskPayload;
    }) => {
      if (!isOnline) {
        queueStore.enqueue({ type: 'UPDATE_TASK', payload: { id, ...payload } });
        return null;
      }
      return tasksApi.updateTask(id, payload);
    },

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY) ?? [];

      const updated = previous.map((t) =>
        t.id === id ? { ...t, ...payload, id: t.id, createdAt: t.createdAt, updatedAt: new Date().toISOString() } : t
      );
      queryClient.setQueryData(TASKS_QUERY_KEY, updated);
      tasksStore.setCachedTasks(updated);

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(TASKS_QUERY_KEY, ctx.previous);
      }
    },

    onSettled: () => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      }
    },
  });
}

/**
 * Delete a task by ID.
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!isOnline) {
        queueStore.enqueue({ type: 'DELETE_TASK', payload: id });
        return;
      }
      return tasksApi.deleteTask(id);
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY) ?? [];

      const updated = previous.filter((t) => t.id !== id);
      queryClient.setQueryData(TASKS_QUERY_KEY, updated);
      tasksStore.setCachedTasks(updated);

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(TASKS_QUERY_KEY, ctx.previous);
      }
    },

    onSettled: () => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      }
    },
  });
}

/**
 * Toggle task completion status.
 */
export function useToggleTask() {
  const updateTask = useUpdateTask();

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: TaskStatus }) => {
      const newStatus: TaskStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      return updateTask.mutateAsync({ id, payload: { status: newStatus } });
    },
  });
}
