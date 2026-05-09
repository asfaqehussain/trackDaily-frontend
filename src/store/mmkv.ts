import { createMMKV } from 'react-native-mmkv';

// Single shared MMKV instance for the entire app
// react-native-mmkv v3 uses createMMKV() factory instead of `new MMKV()`
export const storage = createMMKV({
  id: 'task-habit-tracker-storage',
});
