import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHabits, useCheckIn, useDeleteHabit } from '../../hooks/useHabits';
import { HabitRow } from '../../components/HabitRow';
import { GradientCard } from '../../components/GradientCard';
import { Icon } from '../../components/Icon';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../../theme';
import { Habit } from '../../types/habit.types';
import { HabitsStackParamList } from '../../navigation/MainTabs';
import { todayISO } from '../../utils/date';

type Props = {
  navigation: NativeStackNavigationProp<HabitsStackParamList, 'HabitList'>;
};

export function HabitListScreen({ navigation }: Props) {
  const { data: habits = [], isLoading, refetch, isRefetching } = useHabits();
  const checkIn = useCheckIn();
  const deleteHabit = useDeleteHabit();

  const today = todayISO();
  const checkedCount = habits.filter((h) => h.checkIns.includes(today)).length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const longestHabit = habits.find((h) => h.streak === longestStreak);

  function handleDelete(id: string) {
    Alert.alert('Delete habit?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit.mutate(id) },
    ]);
  }

  function handlePress(habit: Habit) {
    navigation.navigate('HabitDetail', { habitId: habit.id });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.subtitle}>{habits.length} HABITS</Text>
            <Text style={styles.title}>Habits</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Icon name="filter" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Streak banner */}
        {habits.length > 0 && (
          <GradientCard colors={Colors.gradientOrange} style={styles.banner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerLeft}>
                <Text style={styles.bannerLabel}>LONGEST STREAK</Text>
                <Text style={styles.bannerStreak}>{longestStreak} days</Text>
                {longestHabit && (
                  <Text style={styles.bannerSub}>{longestHabit.name} · keep it going!</Text>
                )}
              </View>
              <View style={styles.bannerRight}>
                <Icon name="flame" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.bannerToday}>{checkedCount}/{habits.length}</Text>
                <Text style={styles.bannerTodayLabel}>today</Text>
              </View>
            </View>
          </GradientCard>
        )}

        {/* Habit list */}
        <View style={styles.list}>
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              onCheckIn={(id) => checkIn.mutate(id)}
              onPress={handlePress}
            />
          ))}
        </View>

        {habits.length === 0 && !isLoading && (
          <View style={styles.empty}>
            <Icon name="flame" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyTxt}>Tap + to create your first habit</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddHabit')}
        activeOpacity={0.85}
      >
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.xl, paddingTop: Spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  subtitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 2 },
  title: { ...Typography.h1, color: Colors.textPrimary },
  filterBtn: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardBg, alignItems: 'center', justifyContent: 'center', ...Shadows.card,
  },
  banner: { marginBottom: Spacing.xl, padding: Spacing.xl },
  bannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bannerLeft: { flex: 1 },
  bannerLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  bannerStreak: { fontSize: 40, fontWeight: '800', color: '#fff', lineHeight: 44 },
  bannerSub: { ...Typography.small, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  bannerRight: { alignItems: 'flex-end', gap: 2 },
  bannerToday: { fontSize: 22, fontWeight: '800', color: '#fff' },
  bannerTodayLabel: { ...Typography.small, color: 'rgba(255,255,255,0.8)' },
  list: { gap: 0 },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxxl * 2, gap: Spacing.sm },
  emptyTitle: { ...Typography.h3, color: Colors.textSecondary },
  emptyTxt: { ...Typography.small, color: Colors.textMuted },
  fab: {
    position: 'absolute', right: Spacing.xl, bottom: Spacing.xxl,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadows.cardLg,
  },
});
