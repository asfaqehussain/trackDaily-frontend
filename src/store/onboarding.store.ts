import { storage } from './mmkv';

const KEY = 'onboarding_completed';

export const onboardingStore = {
  isCompleted(): boolean {
    return storage.getBoolean(KEY) === true;
  },
  markCompleted(): void {
    storage.set(KEY, true);
  },
};
