import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { authApi } from '../api/auth.api';
import { authStore } from '../store/auth.store';
import { tasksStore } from '../store/tasks.store';
import { habitsStore } from '../store/habits.store';
import { queueStore } from '../store/queue.store';
import { LoginPayload, SignupPayload } from '../types/auth.types';

/**
 * Provides login, signup, and logout functionality with local persistence.
 */
export function useAuth() {
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      authStore.setToken(data.token);
      authStore.setUser(data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
    onSuccess: (data) => {
      authStore.setToken(data.token);
      authStore.setUser(data.user);
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (email: string) => authApi.sendVerificationEmail(email),
  });

  const logout = useCallback(() => {
    authStore.clearAll();
    tasksStore.clearTasks();
    habitsStore.clearHabits();
    queueStore.clearQueue();
  }, []);

  return {
    loginMutation,
    signupMutation,
    resendVerificationMutation,
    logout,
    currentUser: authStore.getUser(),
    token: authStore.getToken(),
  };
}
