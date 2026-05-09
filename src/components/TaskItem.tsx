import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Task } from '../types/task.types';
import { formatDate } from '../utils/date';

interface Props {
  task: Task;
  onToggleComplete: (id: string, currentStatus: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: Props) {
  const isCompleted = task.status === 'completed';

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}
        {task.dueDate ? (
          <Text style={styles.dueDate}>Due: {formatDate(task.dueDate)}</Text>
        ) : null}
        <Text style={styles.status}>Status: {task.status}</Text>
        {task.id.startsWith('temp-') ? (
          <Text style={styles.pending}>(Pending sync)</Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button
          title={isCompleted ? 'Undo' : 'Done'}
          onPress={() => onToggleComplete(task.id, task.status)}
        />
        <Button title="Edit" onPress={() => onEdit(task)} />
        <Button title="Delete" onPress={() => onDelete(task.id)} color="red" />
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  dueDate: {
    fontSize: 13,
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    marginTop: 2,
    textTransform: 'capitalize',
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
