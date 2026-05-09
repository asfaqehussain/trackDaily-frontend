import { queueStore, QueuedActionType } from '../store/queue.store';
import { tasksApi } from '../api/tasks.api';
import { habitsApi } from '../api/habits.api';
import { CreateTaskPayload, UpdateTaskPayload } from '../types/task.types';
import { CreateHabitPayload } from '../types/habit.types';

interface QueueActionOptions {
  isOnline: boolean;
}

/**
 * Executes an API action if online, otherwise queues it for later sync.
 *
 * Callers get a unified interface — they don't need to know whether
 * the action ran immediately or was queued.
 */
export async function queueAction(
  type: QueuedActionType,
  payload: unknown,
  { isOnline }: QueueActionOptions
): Promise<void> {
  if (isOnline) {
    // Execute immediately
    await dispatchApiCall(type, payload);
  } else {
    // Queue for later sync
    queueStore.enqueue({ type, payload });
    console.log(`[Queue] Offline — queued action: ${type}`);
  }
}

async function dispatchApiCall(
  type: QueuedActionType,
  payload: unknown
): Promise<void> {
  switch (type) {
    case 'CREATE_TASK':
      await tasksApi.createTask(payload as CreateTaskPayload);
      break;

    case 'UPDATE_TASK': {
      const { id, ...rest } = payload as { id: string } & UpdateTaskPayload;
      await tasksApi.updateTask(id, rest);
      break;
    }

    case 'DELETE_TASK':
      await tasksApi.deleteTask(payload as string);
      break;

    case 'CREATE_HABIT':
      await habitsApi.createHabit(payload as CreateHabitPayload);
      break;

    case 'CHECK_IN_HABIT': {
      const { habitId, date } = payload as { habitId: string; date: string };
      await habitsApi.checkIn(habitId, date);
      break;
    }

    case 'DELETE_HABIT':
      await habitsApi.deleteHabit(payload as string);
      break;
  }
}
