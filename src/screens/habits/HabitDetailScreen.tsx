import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HabitsStackParamList } from '../../navigation/MainTabs';
import { useHabits, useCheckIn } from '../../hooks/useHabits';
import { GradientCard } from '../../components/GradientCard';
import { HeatmapGrid } from '../../components/HeatmapGrid';
import { AppHeader } from '../../components/AppHeader';
import { Icon, IconName, isValidIconName } from '../../components/Icon';
import { Colors, BorderRadius, Spacing, Typography, Shadows, FontFamily } from '../../theme';
import { todayISO } from '../../utils/date';

type Props = {
  navigation: NativeStackNavigationProp<HabitsStackParamList, 'HabitDetail'>;
  route: RouteProp<HabitsStackParamList, 'HabitDetail'>;
};

function computeBestStreak(checkIns: string[]): number {
  if (!checkIns.length) return 0;
  const sorted = [...new Set(checkIns)].sort();
  let best = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]).getTime();
    const curr = new Date(sorted[i]).getTime();
    if ((curr - prev) / 86400000 === 1) { cur++; best = Math.max(best, cur); }
    else cur = 1;
  }
  return best;
}

function thisWeekCount(checkIns: string[], repeatType?: string): string {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7;
  const total = repeatType === 'weekdays' ? 5 : 7;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  const count = checkIns.filter((d) => { const dd = new Date(d); return dd >= weekStart && dd <= now; }).length;
  return `${count}/${Math.min(total, dayOfWeek + 1)}`;
}

export function HabitDetailScreen({ navigation, route }: Props) {
  const { data: habits = [] } = useHabits();
  const checkIn = useCheckIn();
  const habit = habits.find((h) => h.id === route.params.habitId);

  if (!habit) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.textSecondary }}>Habit not found.</Text>
      </View>
    );
  }

  const iconName = habit.icon && isValidIconName(habit.icon) ? habit.icon : 'dumbbell';
  const checkedToday = habit.checkIns.includes(todayISO());
  const bestStreak = computeBestStreak(habit.checkIns);
  const thisWk = thisWeekCount(habit.checkIns, habit.repeatType);
  const totalDone = habit.checkIns.length;
  const repeatLabel =
    habit.repeatType === 'weekdays' ? 'WEEKDAYS' :
    habit.repeatType === 'custom' ? 'CUSTOM' : 'DAILY';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AppHeader title={habit.name} onBack={() => navigation.goBack()} />

        {/* Main habit card */}
        <GradientCard colors={Colors.gradientOrange} style={styles.mainCard}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.repeatLabel}>{repeatLabel}</Text>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.streakNum}>{habit.streak} <Text style={styles.streakLabel}>day streak</Text></Text>
              <Text style={styles.flame}>🔥</Text>
            </View>
            <View style={styles.iconBox}>
              <Icon name={iconName} size={26} color="#fff" />
            </View>
          </View>

          {/* Check in button */}
          <TouchableOpacity
            style={[styles.checkBtn, checkedToday && styles.checkBtnDone]}
            onPress={() => !checkedToday && checkIn.mutate(habit.id)}
            disabled={checkedToday}
          >
            <Icon name={checkedToday ? 'check' : 'circle'} size={18} color="#fff" />
            <Text style={styles.checkBtnTxt}>{checkedToday ? 'Done today!' : 'Mark done'}</Text>
          </TouchableOpacity>
        </GradientCard>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'BEST', value: `${bestStreak} days` },
            { label: 'THIS WK', value: thisWk },
            { label: 'TOTAL', value: `${totalDone} done` },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        {/* Heatmap */}
        <HeatmapGrid checkIns={habit.checkIns} color={Colors.habitColors[1]} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: Spacing.xl, paddingTop: Spacing.lg, gap: Spacing.lg },
  mainCard: { padding: Spacing.xl },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  repeatLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  habitName: { fontSize: 26, fontWeight: '800', color: '#fff', maxWidth: '75%' },
  streakNum: { fontFamily: FontFamily.monoSemiBold, fontSize: 44, lineHeight: 48, color: '#fff', marginTop: 8 },
  streakLabel: { fontSize: 18, fontWeight: '400' },
  flame: { fontSize: 22, marginTop: 2 },
  iconBox: {
    width: 52, height: 52, borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center',
  },
  checkBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: BorderRadius.full, paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm, alignSelf: 'flex-start', marginTop: Spacing.lg,
  },
  checkBtnDone: { backgroundColor: 'rgba(255,255,255,0.35)' },
  checkBtnTxt: { ...Typography.smallMedium, color: '#fff', fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'flex-start', ...Shadows.card,
  },
  statLabel: { ...Typography.caption, color: Colors.textSecondary, fontSize: 10 },
  statValue: { ...Typography.bodyBold, color: Colors.textPrimary, marginTop: 4, fontSize: 17 },
});
