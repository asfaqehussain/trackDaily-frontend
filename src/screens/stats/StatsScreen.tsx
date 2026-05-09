import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '../../hooks/useHabits';
import { useTasks } from '../../hooks/useTasks';
import { HeatmapGrid } from '../../components/HeatmapGrid';
import { Icon } from '../../components/Icon';
import { Colors, Typography, Spacing, BorderRadius, Shadows, FontFamily } from '../../theme';
import { todayISO, subDaysISO } from '../../utils/date';

export function StatsScreen() {
  const { data: habits = [] } = useHabits();
  const { data: tasks = [] } = useTasks();
  const today = todayISO();

  // ── Metrics calculation ────────────────────────────────────────────────────

  // 1. Completion rate (tasks)
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 2. Best streak calculation (very simplified for UI)
  const allStreaks = habits.map((h) => {
    let streak = 0;
    let d = today;
    // Check back 30 days
    for (let i = 0; i < 30; i++) {
      if (h.checkIns.includes(d)) {
        streak++;
        d = subDaysISO(d, 1);
      } else break;
    }
    return streak;
  });
  const bestStreak = Math.max(0, ...allStreaks);

  // 3. Overall Activity (aggregated habit checkins)
  const allCheckIns = habits.reduce((acc, h) => {
    h.checkIns.forEach(date => acc.add(date));
    return acc;
  }, new Set<string>());

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Stats</Text>

        {/* Overview Row */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: Colors.primaryLight }]}>
            <Text style={styles.metricLabel}>TASK RATE</Text>
            <View style={styles.numRow}>
              <Text style={styles.numeric}>{taskRate}</Text>
              <Text style={styles.percent}>%</Text>
            </View>
          </View>

          <View style={[styles.metricCard, { backgroundColor: 'rgba(245, 160, 122, 0.12)' }]}>
            <Text style={[styles.metricLabel, { color: '#F5A07A' }]}>BEST STREAK</Text>
            <View style={styles.numRow}>
              <Text style={[styles.numeric, { color: '#F5A07A' }]}>{bestStreak}</Text>
              <Text style={[styles.unit, { color: '#F5A07A' }]}>days</Text>
            </View>
          </View>
        </View>

        {/* Activity Heatmap section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity</Text>
            <View style={styles.chip}>
              <Text style={styles.chipTxt}>{allCheckIns.size} active days</Text>
            </View>
          </View>

          <View style={styles.heatmapBox}>
            <HeatmapGrid checkIns={Array.from(allCheckIns)} color={Colors.primary} />
          </View>

          <Text style={styles.heatmapNote}>
            Your activity level over the last 12 weeks.
          </Text>
        </View>

        {/* Totals */}
        <View style={styles.totalsCard}>
          <View style={styles.totalItem}>
            <Icon name="check" size={20} color={Colors.primary} />
            <View>
              <Text style={styles.totalNum}>{completedTasks}</Text>
              <Text style={styles.totalLabel}>Tasks finished</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalItem}>
            <Icon name="flame" size={20} color={Colors.habitColors[1]} />
            <View>
              <Text style={[styles.totalNum, { color: Colors.habitColors[1] }]}>{habits.length}</Text>
              <Text style={styles.totalLabel}>Active habits</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.xl, paddingTop: Spacing.xxxl },
  title: { ...Typography.h1, color: Colors.textPrimary, marginBottom: Spacing.xl },

  metricsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  metricCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
  },
  metricLabel: {
    ...Typography.caption,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  numRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  numeric: {
    fontFamily: FontFamily.monoSemiBold,
    fontSize: 32,
    lineHeight: 38,
    color: Colors.primary,
  },
  percent: {
    ...Typography.bodyBold,
    color: Colors.primary,
    marginBottom: 4,
  },
  unit: {
    ...Typography.smallMedium,
    color: Colors.primary,
    marginBottom: 5,
    marginLeft: 2,
  },

  section: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  chip: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  chipTxt: { ...Typography.smallMedium, color: Colors.textSecondary },
  heatmapBox: { alignItems: 'center', paddingVertical: Spacing.sm },
  heatmapNote: {
    ...Typography.small,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },

  totalsCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.card,
  },
  totalItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  totalNum: {
    fontFamily: FontFamily.monoSemiBold,
    fontSize: 22,
    color: Colors.primary,
  },
  totalLabel: { ...Typography.small, color: Colors.textSecondary },
  divider: { width: 1, height: 32, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
});

