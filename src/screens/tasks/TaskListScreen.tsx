import React from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TasksStackParamList } from '../../navigation/MainTabs';
import { useTasks, useToggleTask, useDeleteTask } from '../../hooks/useTasks';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { TaskItem } from '../../components/TaskItem';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Task } from '../../types/task.types';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  navigation: NativeStackNavigationProp<TasksStackParamList, 'TaskList'>;
};

export function TaskListScreen({ navigation }: Props) {
  const { data: tasks, isLoading, isError, refetch } = useTasks();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const { isOnline } = useNetworkStatus();
  const { logout } = useAuth();

  function handleDelete(id: string) {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTask.mutate(id),
      },
    ]);
  }

  function handleEdit(task: Task) {
    navigation.navigate('TaskForm', { task });
  }

  function handleToggle(id: string, currentStatus: Task['status']) {
    toggleTask.mutate({ id, currentStatus });
  }

  const pendingCount = tasks?.filter((t) => t.status === 'pending').length ?? 0;
  const completedCount = tasks?.filter((t) => t.status === 'completed').length ?? 0;

  return (
    <View style={styles.container}>
      <OfflineBanner isOnline={isOnline} />

      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.headerActions}>
          <Button
            title="+ Add Task"
            onPress={() => navigation.navigate('TaskForm', {})}
            testID="add-task-btn"
          />
          <Button title="Logout" onPress={logout} color="gray" />
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Pending: {pendingCount} | Completed: {completedCount}
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} testID="tasks-loading" />
      ) : isError ? (
        <View style={styles.error}>
          <Text>Failed to load tasks.</Text>
          <Button title="Retry" onPress={() => refetch()} />
        </View>
      ) : tasks && tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggleComplete={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          testID="tasks-list"
        />
      ) : (
        <View style={styles.empty}>
          <Text>No tasks yet. Tap "+ Add Task" to get started.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  summary: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  summaryText: { fontSize: 13 },
  loader: { marginTop: 40 },
  error: { padding: 24, alignItems: 'center', gap: 8 },
  empty: { padding: 24, alignItems: 'center' },
});
