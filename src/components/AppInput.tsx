import React from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet, TextInputProps,
} from 'react-native';
import { Icon } from './Icon';
import { IconName } from './Icon';
import { Colors, BorderRadius, Spacing, Typography } from '../theme';

interface Props extends TextInputProps {
  icon: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
}

/**
 * App-wide styled input with left icon.
 * Uses lavender/light background to match the design system.
 */
export function AppInput({ icon, rightIcon, onRightIconPress, style, ...rest }: Props) {
  return (
    <View style={styles.row}>
      {/* Left icon */}
      <View style={styles.iconBox}>
        <Icon name={icon} size={18} color={Colors.textMuted} />
      </View>

      {/* Text input */}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.textMuted}
        {...rest}
      />

      {/* Optional right icon (e.g. eye toggle) */}
      {rightIcon && (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={onRightIconPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name={rightIcon} size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  iconBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: 2,
  },
  rightIcon: {
    padding: 4,
    marginLeft: Spacing.xs,
  },
});
