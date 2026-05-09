import { useFonts } from 'expo-font';

/**
 * Loads all custom fonts for the app.
 *
 * Font roles (per design spec):
 *   DM Sans       → Primary UI (buttons, labels, body, navigation)
 *   Fraunces      → Display / editorial (onboarding hero, milestones)
 *   JetBrains Mono→ Numerical / data (streaks, time, OTP, calendar)
 */
export function useAppFonts() {
  return useFonts({
    // ── DM Sans ────────────────────────────────────────────────────────────
    'DMSans-Regular': require('../../node_modules/@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf'),
    'DMSans-Medium': require('../../node_modules/@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf'),
    'DMSans-SemiBold': require('../../node_modules/@expo-google-fonts/dm-sans/600SemiBold/DMSans_600SemiBold.ttf'),
    'DMSans-Bold': require('../../node_modules/@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf'),

    // ── Fraunces (display only) ────────────────────────────────────────────
    'Fraunces-Medium': require('../../node_modules/@expo-google-fonts/fraunces/500Medium/Fraunces_500Medium.ttf'),

    // ── JetBrains Mono ────────────────────────────────────────────────────
    'JetBrainsMono-Regular': require('../../node_modules/@expo-google-fonts/jetbrains-mono/400Regular/JetBrainsMono_400Regular.ttf'),
    'JetBrainsMono-Medium': require('../../node_modules/@expo-google-fonts/jetbrains-mono/500Medium/JetBrainsMono_500Medium.ttf'),
    'JetBrainsMono-SemiBold': require('../../node_modules/@expo-google-fonts/jetbrains-mono/600SemiBold/JetBrainsMono_600SemiBold.ttf'),
  });
}
