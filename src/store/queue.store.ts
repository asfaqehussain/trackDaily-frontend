import { storage } from './mmkv';

export type QueuedActionType =
  | 'CREATE_TASK'
  | 'UPDATE_TASK'
  | 'DELETE_TASK'
  | 'CREATE_HABIT'
  | 'CHECK_IN_HABIT'
  | 'DELETE_HABIT';

export interface QueuedAction {
  id: string;           // UUID for deduplication
  type: QueuedActionType;
  payload: unknown;
  createdAt: string;    // ISO timestamp
  retryCount: number;
}

const KEY = 'offline_action_queue';
const MAX_RETRIES = 3;

export const queueStore = {
  getQueue(): QueuedAction[] {
    const raw = storage.getString(KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as QueuedAction[];
    } catch {
      return [];
    }
  },

  enqueue(action: Omit<QueuedAction, 'id' | 'createdAt' | 'retryCount'>): void {
    const queue = queueStore.getQueue();
    const newAction: QueuedAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    queue.push(newAction);
    storage.set(KEY, JSON.stringify(queue));
  },

  dequeue(id: string): void {
    const queue = queueStore.getQueue().filter((a) => a.id !== id);
    storage.set(KEY, JSON.stringify(queue));
  },

  incrementRetry(id: string): void {
    const queue = queueStore.getQueue().map((a) =>
      a.id === id ? { ...a, retryCount: a.retryCount + 1 } : a
    );
    storage.set(KEY, JSON.stringify(queue));
  },

  removeExpired(): void {
    const queue = queueStore
      .getQueue()
      .filter((a) => a.retryCount < MAX_RETRIES);
    storage.set(KEY, JSON.stringify(queue));
  },

  clearQueue(): void {
    storage.remove(KEY);
  },

  getSize(): number {
    return queueStore.getQueue().length;
  },
};
