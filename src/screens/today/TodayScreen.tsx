import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits, useCheckIn } from '../../hooks/useHabits';
import { useTasks } from '../../hooks/useTasks';
import { HabitRow } from '../../components/HabitRow';
import { Icon } from '../../components/Icon';
import { Colors, BorderRadius, Spacing, Typography, Shadows, FontFamily } from '../../theme';
import { todayISO, formatDate, dateOnly } from '../../utils/date';
import { GradientCard } from '../../components/GradientCard';

export function TodayScreen() {
  const { data: habits = [], refetch: refetchHabits, isRefetching: isRefetchingHabits } = useHabits();
  const { data: tasks = [], refetch: refetchTasks, isRefetching: isRefetchingTasks } = useTasks();
  const checkIn = useCheckIn();
  const today = todayISO();

  const isRefreshing = isRefetchingHabits || isRefetchingTasks;
  const handleRefresh = useCallback(() => {
    refetchHabits();
    refetchTasks();
  }, [refetchHabits, refetchTasks]);

  const todayTasks = tasks.filter((t) => t.dueDate && dateOnly(t.dueDate) === today && t.status === 'pending');
  const todayHabits = habits.filter((h) => !h.checkIns.includes(today));
  const doneHabits = habits.filter((h) => h.checkIns.includes(today));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        <Text style={styles.dateLabel}>{formatDate(today)}</Text>
        <Text style={styles.title}>Today</Text>

        {/* Summary chips */}
        <View style={styles.chips}>
          <View style={styles.chip}>
            <Icon name="check" size={14} color={Colors.primary} />
            <Text style={styles.chipTxt}>
              <Text style={styles.chipNum}>{todayTasks.length}</Text> tasks
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: 'rgba(245, 160, 122, 0.12)' }]}>
            <Icon name="flame" size={14} color={Colors.habitColors[1]} />
            <Text style={[styles.chipTxt, { color: Colors.habitColors[1] }]}>
              <Text style={[styles.chipNum, { color: Colors.habitColors[1] }]}>{doneHabits.length}/{habits.length}</Text> habits
            </Text>
          </View>
        </View>

        {/* Habits section */}
        {todayHabits.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>HABITS TO DO</Text>
            {todayHabits.map((h) => (
              <HabitRow key={h.id} habit={h} onCheckIn={(id) => checkIn.mutate(id)} />
            ))}
          </>
        )}

        {/* Tasks section */}
        {todayTasks.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>TASKS DUE</Text>
            {todayTasks.map((t) => (
              <View key={t.id} style={styles.taskCard}>
                <Text style={styles.taskTitle}>{t.title}</Text>
                {t.category ? <Text style={styles.taskCat}>{t.category}</Text> : null}
              </View>
            ))}
          </>
        )}

        {todayTasks.length === 0 && todayHabits.length === 0 && (
          <GradientCard colors={['#FDFCFB', '#F5F7FA']} style={styles.allDone}>
            <Text style={styles.allDoneTitle}>You're all set!</Text>
            <Text style={styles.allDoneSub}>Everything for today is completed.</Text>
            <View style={styles.streakBadge}>
              <Icon name="flame" size={16} color="#fff" />
              <Text style={styles.streakBadgeTxt}>Keep it up</Text>
            </View>
          </GradientCard>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.xl, paddingTop: Spacing.xxxl },
  dateLabel: { ...Typography.caption, color: Colors.textSecondary },
  title: { ...Typography.h1, color: Colors.textPrimary, marginBottom: Spacing.lg },
  chips: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
  },
  chipTxt: { ...Typography.smallMedium, color: Colors.primary },
  chipNum: { fontFamily: FontFamily.monoSemiBold, fontSize: 14 },
  sectionLabel: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  taskCard: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginBottom: Spacing.sm, ...Shadows.card,
  },
  taskTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
  taskCat: { ...Typography.small, color: Colors.textSecondary, marginTop: 2 },
  allDone: {
    alignItems: 'center',
    paddingVertical: 48,
    borderRadius: BorderRadius.xxl,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allDoneTitle: { fontFamily: FontFamily.display, fontSize: 24, color: Colors.textPrimary, marginBottom: 4 },
  allDoneSub: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.xl },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    paddingHorizontal: 12, paddingVertical: 6, marginTop: Spacing.xl,
  },
  streakBadgeTxt: { ...Typography.smallMedium, color: '#fff' },
});
