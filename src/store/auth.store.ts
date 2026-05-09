import { storage } from './mmkv';
import { User } from '../types/auth.types';

const KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const authStore = {
  getToken(): string | null {
    return storage.getString(KEYS.TOKEN) ?? null;
  },

  setToken(token: string): void {
    storage.set(KEYS.TOKEN, token);
  },

  clearToken(): void {
    storage.remove(KEYS.TOKEN);
  },

  getUser(): User | null {
    const raw = storage.getString(KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    storage.set(KEYS.USER, JSON.stringify(user));
  },

  clearUser(): void {
    storage.remove(KEYS.USER);
  },

  clearAll(): void {
    authStore.clearToken();
    authStore.clearUser();
  },
};
