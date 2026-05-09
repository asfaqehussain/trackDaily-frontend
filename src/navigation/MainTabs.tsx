import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../theme';
import { Icon } from '../components/Icon';
import { IconName } from '../components/Icon';

// Screens
import { TodayScreen } from '../screens/today/TodayScreen';
import { TasksScreen } from '../screens/tasks/TasksScreen';
import { TaskFormScreen } from '../screens/tasks/TaskFormScreen';
import { HabitListScreen } from '../screens/habits/HabitListScreen';
import { AddHabitScreen } from '../screens/habits/AddHabitScreen';
import { HabitDetailScreen } from '../screens/habits/HabitDetailScreen';
import { StatsScreen } from '../screens/stats/StatsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { Task } from '../types/task.types';

// ── Tasks Stack ───────────────────────────────────────────────────────────────
export type TasksStackParamList = {
  TaskList: undefined;
  TaskForm: { task?: Task; initialDate?: string };
};

const TasksStack = createNativeStackNavigator<TasksStackParamList>();

function TasksNavigator() {
  return (
    <TasksStack.Navigator>
      <TasksStack.Screen name="TaskList" component={TasksScreen} options={{ headerShown: false }} />
      <TasksStack.Screen name="TaskForm" component={TaskFormScreen} options={{ headerShown: false, presentation: 'modal' }} />
    </TasksStack.Navigator>
  );
}

// ── Habits Stack ──────────────────────────────────────────────────────────────
export type HabitsStackParamList = {
  HabitList: undefined;
  AddHabit: undefined;
  HabitDetail: { habitId: string };
};

const HabitsStack = createNativeStackNavigator<HabitsStackParamList>();

function HabitsNavigator() {
  return (
    <HabitsStack.Navigator>
      <HabitsStack.Screen name="HabitList" component={HabitListScreen} options={{ headerShown: false }} />
      <HabitsStack.Screen name="AddHabit" component={AddHabitScreen} options={{ headerShown: false, presentation: 'modal' }} />
      <HabitsStack.Screen name="HabitDetail" component={HabitDetailScreen} options={{ headerShown: false }} />
    </HabitsStack.Navigator>
  );
}

// ── Bottom Tabs ───────────────────────────────────────────────────────────────
type TabParamList = {
  Today: undefined;
  Tasks: undefined;
  Habits: undefined;
  Stats: undefined;
  You: undefined;
};

const TAB_ICONS: Record<keyof TabParamList, IconName> = {
  Today: 'home',
  Tasks: 'list',
  Habits: 'flame',
  Stats: 'chart',
  You: 'user',
};

const Tab = createBottomTabNavigator<TabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.cardBg,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color }) => (
          <Icon
            name={TAB_ICONS[route.name as keyof TabParamList]}
            size={22}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Tasks" component={TasksNavigator} />
      <Tab.Screen name="Habits" component={HabitsNavigator} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="You" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
