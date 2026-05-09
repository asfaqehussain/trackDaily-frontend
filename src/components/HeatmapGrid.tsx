import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../theme';

interface Props {
  checkIns: string[]; // ISO date strings
  color?: string;
}

/**
 * Renders a 12-week × 7-day heatmap of habit check-ins.
 * Filled squares use the habit color; empty = light gray.
 */
export function HeatmapGrid({ checkIns, color = Colors.primary }: Props) {
  const checkInSet = new Set(checkIns);

  // Build last 12 weeks (84 days) ending today
  const cells: { iso: string; filled: boolean }[] = [];
  const today = new Date();
  // Start from Monday of the week 12 weeks ago
  const start = new Date(today);
  start.setDate(start.getDate() - 83); // 84 days total

  for (let i = 0; i < 84; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    cells.push({ iso, filled: checkInSet.has(iso) });
  }

  // Group into 12 columns of 7
  const weeks: { iso: string; filled: boolean }[][] = [];
  for (let w = 0; w < 12; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7));
  }

  const filledCount = cells.filter((c) => c.filled).length;
  const pct = Math.round((filledCount / 84) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Last 12 weeks</Text>
        <Text style={styles.pct}>{pct}% on track</Text>
      </View>

      {/* Grid: columns = weeks, rows = days */}
      <View style={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.col}>
            {week.map((cell, di) => (
              <View
                key={di}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell.filled
                      ? Colors.habitBg(color, 0.7)
                      : Colors.border,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Less</Text>
        {[0.15, 0.3, 0.5, 0.7, 0.9].map((op, i) => (
          <View
            key={i}
            style={[styles.legendCell, { backgroundColor: Colors.habitBg(color, op) }]}
          />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>
    </View>
  );
}

const CELL = 10;
const GAP = 3;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  pct: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    gap: GAP,
  },
  col: {
    gap: GAP,
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 4,
  },
  legendLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginHorizontal: 4,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
