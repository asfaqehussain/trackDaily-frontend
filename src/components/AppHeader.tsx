import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../theme';

interface Props {
  /** Screen title shown in center */
  title: string;
  /** Show a back (←) button on the left */
  onBack?: () => void;
  /** Label of the right action button (e.g. "Save") */
  rightLabel?: string;
  /** Called when right button is tapped */
  onRight?: () => void;
  /** Shows a loading indicator in place of the right button */
  rightLoading?: boolean;
  /** Left cancel text instead of back arrow (for modals) */
  cancelLabel?: string;
  onCancel?: () => void;
}

/**
 * Global app header used across task form, add habit, habit detail, etc.
 *
 * Two layouts:
 *  - Stack header:  [← back]   Title   [right action]
 *  - Modal header:  [Cancel]    Title   [Save btn]
 */
export function AppHeader({
  title,
  onBack,
  rightLabel,
  onRight,
  rightLoading,
  cancelLabel,
  onCancel,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
      {/* Left: back arrow OR cancel text */}
      <View style={styles.side}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}
        {cancelLabel && onCancel && (
          <TouchableOpacity onPress={onCancel} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.cancelTxt}>{cancelLabel}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center: title */}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      {/* Right: action button OR spacer */}
      <View style={[styles.side, styles.sideRight]}>
        {rightLoading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : rightLabel && onRight ? (
          <TouchableOpacity style={styles.saveBtn} onPress={onRight}>
            <Text style={styles.saveTxt}>{rightLabel}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 56,
  },
  side: {
    minWidth: 64,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTxt: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 7,
  },
  saveTxt: {
    ...Typography.smallMedium,
    color: '#fff',
    fontWeight: '700',
  },
  placeholder: {
    width: 64,
  },
});
