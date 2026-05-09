import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../theme';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface Props {
  year: number;
  month: number; // 0-indexed
  selectedDate: string; // ISO "YYYY-MM-DD"
  dotDates?: string[];  // ISO dates that have tasks (show dot)
  onSelectDate: (iso: string) => void;
}

function isoDate(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function CalendarView({ year, month, selectedDate, dotDates = [], onSelectDate }: Props) {
  const today = todayISO();

  // Build grid rows
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  // Shift so Monday=0
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Fill a flat array of cells (null = empty, number = day)
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const dotSet = new Set(dotDates);

  return (
    <View style={styles.container}>
      {/* Day headers */}
      <View style={styles.row}>
        {DAY_LABELS.map((d, i) => (
          <View key={i} style={styles.cell}>
            <Text style={styles.dayLabel}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Date rows */}
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((day, ci) => {
            if (!day) return <View key={ci} style={styles.cell} />;
            const iso = isoDate(year, month, day);
            const isToday = iso === today;
            const isSelected = iso === selectedDate;
            const hasDot = dotSet.has(iso);

            return (
              <TouchableOpacity
                key={ci}
                style={styles.cell}
                onPress={() => onSelectDate(iso)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.dayCircle,
                    isSelected && styles.dayCircleSelected,
                    isToday && !isSelected && styles.dayCircleToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      isToday && !isSelected && styles.dayTextToday,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
                {hasDot && (
                  <View style={[styles.dot, isSelected && styles.dotSelected]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const CELL_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cell: {
    width: CELL_SIZE,
    alignItems: 'center',
    paddingVertical: 2,
  },
  dayLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: Colors.primary,
  },
  dayCircleToday: {
    backgroundColor: Colors.primaryLight,
  },
  dayText: {
    ...Typography.smallMedium,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  dayTextSelected: {
    color: Colors.textWhite,
    fontWeight: '700',
  },
  dayTextToday: {
    color: Colors.primary,
    fontWeight: '700',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 2,
  },
  dotSelected: {
    backgroundColor: Colors.textWhite,
  },
});
