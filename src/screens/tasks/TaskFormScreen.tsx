import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { TasksStackParamList } from '../../navigation/MainTabs';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks';
import { AppHeader } from '../../components/AppHeader';
import { AppInput } from '../../components/AppInput';
import { Icon } from '../../components/Icon';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<TasksStackParamList, 'TaskForm'>;
  route: RouteProp<TasksStackParamList, 'TaskForm'>;
};

const CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'];

export function TaskFormScreen({ navigation, route }: Props) {
  const existing = route.params?.task;
  const isEditing = !!existing;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? route.params?.initialDate ?? '');
  const [time, setTime] = useState(existing?.time ?? '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isLoading = createTask.isPending || updateTask.isPending;

  async function handleSave() {
    if (!title.trim()) { Alert.alert('Required', 'Please enter a task title.'); return; }
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD format.'); return;
    }
    try {
      if (isEditing && existing) {
        await updateTask.mutateAsync({ id: existing.id, payload: { title: title.trim(), description: description.trim() || undefined, dueDate: dueDate || undefined, time: time || undefined, category: category || undefined } });
      } else {
        await createTask.mutateAsync({ title: title.trim(), description: description.trim() || undefined, dueDate: dueDate || undefined, time: time || undefined, category: category || undefined });
      }
      navigation.goBack();
    } catch { Alert.alert('Error', 'Could not save task.'); }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <AppHeader
        title={isEditing ? 'Edit task' : 'New task'}
        cancelLabel="Cancel"
        onCancel={() => navigation.goBack()}
        rightLabel="Save"
        onRight={handleSave}
        rightLoading={isLoading}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <TextInput
          style={styles.titleInput}
          placeholder="Task title"
          placeholderTextColor={Colors.textMuted}
          value={title}
          onChangeText={setTitle}
          autoFocus={!isEditing}
        />

        {/* Fields */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Icon name="calendar" size={18} color={Colors.primary} />
            </View>
            <TextInput
              style={styles.fieldInput}
              placeholder="Due date (YYYY-MM-DD)"
              placeholderTextColor={Colors.textMuted}
              value={dueDate}
              onChangeText={setDueDate}
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Icon name="clock" size={18} color={Colors.primary} />
            </View>
            <TextInput
              style={styles.fieldInput}
              placeholder="Time (HH:MM)"
              placeholderTextColor={Colors.textMuted}
              value={time}
              onChangeText={setTime}
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Icon name="edit" size={18} color={Colors.primary} />
            </View>
            <TextInput
              style={[styles.fieldInput, styles.multiline]}
              placeholder="Notes (optional)"
              placeholderTextColor={Colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Category */}
        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
              onPress={() => setCategory(category === cat ? '' : cat)}
            >
              <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.xl, gap: Spacing.lg },
  titleInput: {
    ...Typography.h3, color: Colors.textPrimary, backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: 20, ...Shadows.card,
  },
  fieldGroup: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg, ...Shadows.card },
  fieldRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  fieldIcon: {
    width: 36, height: 36, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  fieldInput: { flex: 1, ...Typography.body, color: Colors.textPrimary },
  multiline: { textAlignVertical: 'top', minHeight: 60 },
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: 68 },
  sectionLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  categoryChip: {
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, backgroundColor: Colors.cardBg,
  },
  categoryChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  categoryText: { ...Typography.small, color: Colors.textSecondary },
  categoryTextActive: { color: Colors.primary, fontWeight: '600' },
});
