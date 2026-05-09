import { Platform } from 'react-native';

export const Colors = {
  primary: '#5B4FE8',
  primaryLight: 'rgba(91, 79, 232, 0.12)',
  primaryBorder: 'rgba(91, 79, 232, 0.35)',

  gradientPurple: ['#7B6BEF', '#E88A80'] as const,
  gradientOrange: ['#F5A07A', '#F07A65'] as const,

  background: '#F4F4F9',
  cardBg: '#FFFFFF',

  textPrimary: '#1C1C2E',
  textSecondary: '#8E8EA9',
  textMuted: '#AEAEC0',
  textWhite: '#FFFFFF',

  border: '#EBEBF5',
  divider: 'rgba(255,255,255,0.2)',

  tabActive: '#5B4FE8',
  tabInactive: '#AEAEC0',

  // Habit color palette (Add Habit picker)
  habitColors: ['#5B4FE8', '#F59B7A', '#4B9EF5', '#F5C842', '#F04F4F'] as const,

  // Habit icon defaults by index (matches habitColors)
  habitBg: (hex: string, opacity = 0.15) => hexToRgba(hex, opacity),

  white: '#FFFFFF',
  black: '#000000',
};

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

// ── Font family references ──────────────────────────────────────────────────
export const FontFamily = {
  // Primary UI
  sansRegular: 'DMSans-Regular',
  sansMedium: 'DMSans-Medium',
  sansSemiBold: 'DMSans-SemiBold',
  sansBold: 'DMSans-Bold',

  // Display / editorial (onboarding, milestones — never body text)
  display: 'Fraunces-Medium',

  // Numerical / tabular (streaks, time, OTP, calendar values)
  monoRegular: 'JetBrainsMono-Regular',
  monoMedium: 'JetBrainsMono-Medium',
  monoSemiBold: 'JetBrainsMono-SemiBold',
} as const;

// ── Type scale ───────────────────────────────────────────────────────────────
export const Typography = {
  /** Onboarding hero / key highlights — Fraunces 500, 34/36 */
  display: {
    fontFamily: FontFamily.display,
    fontSize: 34,
    lineHeight: 36,
    letterSpacing: -0.5,
  },

  /** Screen titles — DM Sans Bold 700, 28/32 */
  h1: {
    fontFamily: FontFamily.sansBold,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.5,
  },

  /** Section headers — DM Sans SemiBold 600, 22/26 */
  h2: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: 22,
    lineHeight: 26,
  },

  /** Card titles — DM Sans SemiBold 600, 17/22 */
  h3: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: 17,
    lineHeight: 22,
  },

  /** Default body — DM Sans Regular 400, 15/22 */
  body: {
    fontFamily: FontFamily.sansRegular,
    fontSize: 15,
    lineHeight: 22,
  },

  /** Medium body — DM Sans Medium 500, 15/22 */
  bodyMedium: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 15,
    lineHeight: 22,
  },

  /** SemiBold body — DM Sans SemiBold 600, 15/22 */
  bodyBold: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: 15,
    lineHeight: 22,
  },

  /** Metadata / captions — DM Sans Regular 400, 13/18 */
  small: {
    fontFamily: FontFamily.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },

  /** Small medium emphasis — DM Sans Medium 500, 13/18 */
  smallMedium: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 13,
    lineHeight: 18,
  },

  /** Tags / pills / CAPS labels — DM Sans SemiBold, 11/14 */
  caption: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },

  /** Streak / stat hero number — JetBrains Mono SemiBold, 48/48 */
  numeric: {
    fontFamily: FontFamily.monoSemiBold,
    fontSize: 48,
    lineHeight: 48,
  },

  /** Time / duration / small data — JetBrains Mono Medium, 12/16 */
  metaMono: {
    fontFamily: FontFamily.monoMedium,
    fontSize: 12,
    lineHeight: 16,
  },
};

export const Shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#8E8EA9',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
    },
    android: { elevation: 2 },
  }),
  cardLg: Platform.select({
    ios: {
      shadowColor: '#8E8EA9',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: { elevation: 4 },
  }),
};

// Habit icon library — maps to custom SVG icons in assets/icons/
export const HABIT_ICONS = [
  'book',
  'droplet',
  'dumbbell',
  'brain',
  'coffee',
  'edit',
  'moon',
  'sun',
  'target',
  'zap',
] as const;

export type HabitIconName = typeof HABIT_ICONS[number];
