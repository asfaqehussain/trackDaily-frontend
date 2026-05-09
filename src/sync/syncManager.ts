import { QueryClient } from '@tanstack/react-query';
import { queueStore, QueuedAction } from '../store/queue.store';
import { syncApi } from '../api/sync.api';
import { SyncRequest, SyncResponse } from '../types/api.types';

let queryClient: QueryClient | null = null;

export function initSyncManager(client: QueryClient): void {
  queryClient = client;
}

/**
 * Replays all queued offline actions using the batch POST /sync endpoint.
 * Called whenever the network transitions from offline → online.
 */
export async function replayQueue(): Promise<void> {
  const queue = queueStore.getQueue();
  if (queue.length === 0) return;

  console.log(`[SyncManager] Syncing ${queue.length} queued actions...`);

  const payload = buildSyncPayload(queue);

  try {
    const result: SyncResponse = await syncApi.batchSync(payload);
    console.log(`[SyncManager] ✓ Sync complete — tasks: ${result.tasks.synced}, habits: ${result.habits.synced}`);

    if (result.tasks.conflicts > 0 || result.habits.conflicts > 0) {
      console.warn(`[SyncManager] ⚠ Conflicts — tasks: ${result.tasks.conflicts}, habits: ${result.habits.conflicts}`);
    }

    queueStore.clearQueue();
  } catch (error) {
    console.warn('[SyncManager] ✗ Sync failed, keeping queue for next retry', error);
    return;
  }

  if (queryClient) {
    await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    await queryClient.invalidateQueries({ queryKey: ['habits'] });
  }

  console.log('[SyncManager] Queue replay complete.');
}

function buildSyncPayload(queue: QueuedAction[]): SyncRequest {
  const taskCreates: import('../types/task.types').CreateTaskPayload[] = [];
  const taskUpdates: { id: string; data: import('../types/task.types').UpdateTaskPayload }[] = [];
  const habitCreates: import('../types/habit.types').CreateHabitPayload[] = [];
  const habitUpdates: { id: string; data: import('../types/habit.types').UpdateHabitPayload }[] = [];

  for (const action of queue) {
    const { type, payload } = action;

    switch (type) {
      case 'CREATE_TASK':
        taskCreates.push(payload as import('../types/task.types').CreateTaskPayload);
        break;

      case 'UPDATE_TASK': {
        const { id, ...data } = payload as { id: string } & import('../types/task.types').UpdateTaskPayload;
        taskUpdates.push({ id, data });
        break;
      }

      case 'DELETE_TASK': {
        const id = payload as string;
        taskUpdates.push({ id, data: { status: 'completed' as const } });
        break;
      }

      case 'CREATE_HABIT':
        habitCreates.push(payload as import('../types/habit.types').CreateHabitPayload);
        break;

      case 'CHECK_IN_HABIT': {
        const { habitId, date } = payload as { habitId: string; date: string };
        habitUpdates.push({
          id: habitId,
          data: { updatedAt: new Date().toISOString() } as import('../types/habit.types').UpdateHabitPayload,
        });
        break;
      }

      case 'DELETE_HABIT': {
        const id = payload as string;
        habitUpdates.push({
          id,
          data: { updatedAt: new Date().toISOString() } as import('../types/habit.types').UpdateHabitPayload,
        });
        break;
      }
    }
  }

  return {
    tasks: { toCreate: taskCreates, toUpdate: taskUpdates },
    habits: { toCreate: habitCreates, toUpdate: habitUpdates },
  };
}
