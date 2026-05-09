import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, IconName, isValidIconName } from './Icon';
import { Habit } from '../types/habit.types';
import { Colors, BorderRadius, Shadows, Typography, Spacing } from '../theme';
import { ProgressDots } from './ProgressDots';
import { isToday } from '../utils/date';

interface Props {
  habit: Habit;
  onCheckIn: (id: string) => void;
  onPress?: (habit: Habit) => void;
}

export function HabitRow({ habit, onCheckIn, onPress }: Props) {
  const color = habit.color ?? Colors.primary;
  const iconName = habit.icon && isValidIconName(habit.icon) ? habit.icon : 'target';
  const bgColor = Colors.habitBg(color, 0.15);
  const checkedInToday = habit.checkIns.some((d) => isToday(d));

  // Progress dots: fill based on streak (max 8 dots)
  const filled = Math.min(Math.ceil((habit.streak / 20) * 8), 8);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress?.(habit)}
    >
      {/* Icon */}
      <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
        <Icon name={iconName} size={20} color={color} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
        <View style={styles.meta}>
          <ProgressDots total={8} filled={filled} color={color} size={7} />
          <View style={styles.streakRow}>
            <Icon name="flame" size={13} color={color} />
            <Text style={[styles.streak, { color }]}> {habit.streak}</Text>
          </View>
        </View>
      </View>

      {/* Check circle */}
      <TouchableOpacity
        style={[
          styles.checkCircle,
          checkedInToday && { backgroundColor: color, borderColor: color },
        ]}
        onPress={() => onCheckIn(habit.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {checkedInToday && (
          <Icon name="check" size={16} color="#fff" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  streak: {
    ...Typography.smallMedium,
    fontWeight: '600',
  },
  checkCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
});
