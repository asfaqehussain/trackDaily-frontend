/**
 * Common UI styles shared across all screens.
 * Import from here instead of re-defining per-screen.
 */
import { StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from './index';

export const CommonStyles = StyleSheet.create({
  // ── Screen wrappers ───────────────────────────────────────────────────────
  screenFlex: {
    flex: 1,
    backgroundColor: Colors.cardBg,
  },
  screenScroll: {
    flexGrow: 1,
    padding: Spacing.xl,
    paddingTop: 56,
  },

  // ── Auth headings ──────────────────────────────────────────────────────────
  authTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    lineHeight: 38,
  },
  authSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
  },

  // ── Form field ────────────────────────────────────────────────────────────
  fieldLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.lg,
  },
  inputRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  inputIcon: {
    width: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: Spacing.sm,
  },
  inputText: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: 2,
  },

  // ── Primary button ────────────────────────────────────────────────────────
  primaryBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg + 2,
    marginTop: Spacing.xl,
  },
  primaryBtnTxt: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#fff',
  },

  // ── Ghost / text footer link ──────────────────────────────────────────────
  footerRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  footerTxt: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  footerLink: {
    ...Typography.smallMedium,
    color: Colors.primary,
    fontWeight: '700' as const,
  },

  // ── Checkbox row ──────────────────────────────────────────────────────────
  checkboxRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // ── Section label (CAPS) ─────────────────────────────────────────────────
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
});
