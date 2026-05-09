import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Habit } from '../types/habit.types';
import { isToday } from '../utils/date';

interface Props {
  habit: Habit;
  onCheckIn: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitItem({ habit, onCheckIn, onDelete }: Props) {
  const checkedInToday = habit.checkIns.some((d) => isToday(d));

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{habit.name}</Text>
        {habit.description ? (
          <Text style={styles.description}>{habit.description}</Text>
        ) : null}
        <Text style={styles.streak}>
          🔥 Streak: {habit.streak} day{habit.streak !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.checkInStatus}>
          Today: {checkedInToday ? '✅ Done' : '⬜ Not done'}
        </Text>
        {habit.id.startsWith('temp-') ? (
          <Text style={styles.pending}>(Pending sync)</Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button
          title={checkedInToday ? 'Checked In' : 'Check In'}
          onPress={() => onCheckIn(habit.id)}
          disabled={checkedInToday}
        />
        <Button title="Delete" onPress={() => onDelete(habit.id)} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
  },
  info: {
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  streak: {
    fontSize: 14,
    marginTop: 6,
  },
  checkInStatus: {
    fontSize: 13,
    marginTop: 4,
  },
  pending: {
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});
