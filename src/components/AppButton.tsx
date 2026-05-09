import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { IconName } from './Icon';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
  testID?: string;
}

/**
 * App-wide reusable button component.
 * - primary: solid purple, arrow icon
 * - secondary: outlined purple
 * - ghost: text-only
 */
export function AppButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon,
  variant = 'primary',
  style,
  testID,
}: Props) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : Colors.primary} />
      ) : (
        <>
          {icon && (
            <Icon
              name={icon}
              size={20}
              color={isPrimary ? '#fff' : isSecondary ? Colors.primary : Colors.primary}
            />
          )}
          <Text
            style={[
              styles.label,
              isPrimary && styles.labelPrimary,
              isSecondary && styles.labelSecondary,
              variant === 'ghost' && styles.labelGhost,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg + 2,
    paddingHorizontal: Spacing.xl,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.cardLg,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.sm,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
  },
  labelPrimary: {
    color: '#fff',
  },
  labelSecondary: {
    color: Colors.primary,
  },
  labelGhost: {
    color: Colors.primary,
    fontSize: 15,
  },
});
