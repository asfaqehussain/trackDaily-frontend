import axios from 'axios';
import { Platform } from 'react-native';
import { authStore } from '../store/auth.store';

// Configure BASE_URL via environment or fallback to localhost
// 10.0.2.2 is the alias to host loopback interface for Android emulators
let BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

if (Platform.OS === 'android' && BASE_URL.includes('localhost')) {
  BASE_URL = BASE_URL.replace('localhost', '10.0.2.2');
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach Bearer token ────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = authStore.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ──────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored credentials — navigation handled by AppNavigator
      authStore.clearAll();
    }
    return Promise.reject(error);
  }
);
