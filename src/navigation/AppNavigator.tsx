import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { authStore } from '../store/auth.store';
import { onboardingStore } from '../store/onboarding.store';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { User } from '../types/auth.types';

/**
 * Root navigator flow:
 *
 *  1. First-time user → Onboarding (3 slides)
 *  2. Not logged in   → AuthStack (Login / Signup / EmailVerification)
 *  3. Logged in       → MainTabs (Today / Tasks / Habits / Stats / You)
 *
 * Onboarding state is persisted in MMKV so it only shows once.
 * Auth state is polled from MMKV every 500ms to detect login/logout.
 */
export function AppNavigator() {
  const [onboardingDone, setOnboardingDone] = useState(onboardingStore.isCompleted());
  const [authState, setAuthState] = useState<{
    token: string | null;
    user: User | null;
  }>({
    token: authStore.getToken(),
    user: authStore.getUser(),
  });

  // Poll auth state for login/logout transitions
  useEffect(() => {
    const interval = setInterval(() => {
      const token = authStore.getToken();
      const user = authStore.getUser();
      setAuthState((prev) => {
        if (prev.token !== token || prev.user?.id !== user?.id) {
          return { token, user };
        }
        return prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  function handleOnboardingDone() {
    onboardingStore.markCompleted();
    setOnboardingDone(true);
  }

  const isAuthenticated = !!authState.token && !!authState.user?.isVerified;

  // ── Render ────────────────────────────────────────────────────────────────

  // Onboarding wraps the entire NavigationContainer so we can show it
  // before navigation is set up, keeping it simple.
  if (!onboardingDone) {
    return <OnboardingScreen onDone={handleOnboardingDone} />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
