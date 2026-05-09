import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTasks, useDeleteTask, useUpdateTask } from "../../hooks/useTasks";
import { CalendarView } from "../../components/CalendarView";
import { Icon } from "../../components/Icon";
import {
  Colors,
  BorderRadius,
  Spacing,
  Typography,
  Shadows,
} from "../../theme";
import { Task } from "../../types/task.types";
import { TasksStackParamList } from "../../navigation/MainTabs";
import { dateOnly } from "../../utils/date";

type Props = {
  navigation: NativeStackNavigationProp<TasksStackParamList, "TaskList">;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatSelectedDate(iso: string): string {
  const d = new Date(iso);
  return `${DAY_NAMES[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function TasksScreen({ navigation }: Props) {
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth());
  const [selectedDate, setSelectedDate] = React.useState(
    now.toISOString().split("T")[0],
  );

  const { data: tasks = [], isLoading, refetch, isRefetching } = useTasks();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const dotDates = useMemo(
    () => tasks.filter((t) => t.dueDate).map((t) => dateOnly(t.dueDate!)),
    [tasks],
  );

  const dayTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate && dateOnly(t.dueDate) === selectedDate)
        .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? "")),
    [tasks, selectedDate],
  );

  function goMonth(dir: 1 | -1) {
    const d = new Date(year, month + dir, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function handleDelete(id: string) {
    Alert.alert("Delete task?", undefined, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTask.mutate(id),
      },
    ]);
  }

  function handleToggle(task: Task) {
    updateTask.mutate({
      id: task.id,
      payload: {
        status: task.status === "completed" ? "pending" : "completed",
      },
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.monthLabel}>{MONTHS[month].toUpperCase()}</Text>
            <Text style={styles.yearLabel}>{year}</Text>
          </View>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.navBtn} onPress={() => goMonth(-1)}>
              <Icon name="back" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.todayBtn}
              onPress={() => {
                const d = new Date();
                setYear(d.getFullYear());
                setMonth(d.getMonth());
                setSelectedDate(d.toISOString().split("T")[0]);
              }}
            >
              <Text style={styles.todayTxt}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} onPress={() => goMonth(1)}>
              <Icon name="arrowRight" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarWrapper}>
          <CalendarView
            year={year}
            month={month}
            selectedDate={selectedDate}
            dotDates={dotDates}
            onSelectDate={setSelectedDate}
          />
        </View>

        {/* Day tasks header */}
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>
            {formatSelectedDate(selectedDate)}
          </Text>
          <Text style={styles.taskCount}>
            {dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Task rows */}
        {!isLoading && dayTasks.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="check" size={44} color={Colors.border} />
            <Text style={styles.emptyTxt}>No tasks for this day</Text>
          </View>
        ) : (
          dayTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={() => navigation.navigate("TaskForm", { task })}
              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("TaskForm", { initialDate: selectedDate })
        }
        activeOpacity={0.85}
      >
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ── Task Row ──────────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Work: Colors.primary,
  Personal: "#F59B7A",
  Health: "#22C55E",
  Learning: "#F5C842",
  Finance: "#4B9EF5",
  Other: Colors.textSecondary,
};

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isCompleted = task.status === "completed";
  const accent = CATEGORY_COLORS[task.category ?? ""] ?? Colors.primary;

  return (
    <TouchableOpacity
      style={styles.taskCard}
      activeOpacity={0.8}
      onPress={onEdit}
    >
      <Text style={styles.taskTime}>{task.time ?? "  —  "}</Text>
      <View style={[styles.taskInner, { borderLeftColor: accent }]}>
        <Text style={[styles.taskTitle, isCompleted && styles.taskTitleDone]}>
          {task.title}
        </Text>
        {task.category ? (
          <View
            style={[
              styles.catChip,
              { backgroundColor: Colors.habitBg(accent, 0.12) },
            ]}
          >
            <Text style={[styles.catText, { color: accent }]}>
              {task.category}
            </Text>
          </View>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={() => onToggle(task)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon
          name={isCompleted ? "check" : "circle"}
          size={22}
          color={isCompleted ? Colors.primary : Colors.black}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.xl, paddingTop: Spacing.xxxl },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: Spacing.lg,
  },
  monthLabel: { ...Typography.caption, color: Colors.textSecondary },
  yearLabel: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.textPrimary,
    lineHeight: 40,
  },
  navRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.cardBg,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  todayBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
  },
  todayTxt: {
    ...Typography.smallMedium,
    color: Colors.textWhite,
    fontWeight: "700",
  },
  calendarWrapper: {
    ...Shadows.cardLg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  dayTitle: { ...Typography.bodyBold, color: Colors.textPrimary, fontSize: 17 },
  taskCount: { ...Typography.small, color: Colors.textSecondary },
  empty: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyTxt: { ...Typography.small, color: Colors.textMuted },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  taskTime: {
    ...Typography.small,
    color: Colors.textSecondary,
    width: 44,
    textAlign: "right",
  },
  taskInner: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    padding: Spacing.md,
    ...Shadows.card,
  },
  taskTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: Colors.textMuted,
  },
  catChip: {
    alignSelf: "flex-start",
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 2,
  },
  catText: { fontSize: 12, fontWeight: "500" },
  fab: {
    position: "absolute",
    right: Spacing.xl,
    bottom: Spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.cardLg,
  },
});
