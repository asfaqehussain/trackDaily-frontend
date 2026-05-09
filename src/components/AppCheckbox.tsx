import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { Colors, Spacing, Typography } from '../theme';

interface Props {
  checked: boolean;
  onToggle: () => void;
  /** Can be plain string or a <Text> node with mixed styles */
  label: React.ReactNode;
}

/**
 * Reusable checkbox with a label (supports mixed-style text as ReactNode).
 */
export function AppCheckbox({ checked, onToggle, label }: Props) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={onToggle}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Icon name="check" size={13} color="#fff" />}
      </View>
      {typeof label === 'string' ? (
        <Text style={styles.label}>{label}</Text>
      ) : (
        label
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  boxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    ...Typography.small,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
