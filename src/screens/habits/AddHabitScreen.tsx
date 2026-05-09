import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HabitsStackParamList } from '../../navigation/MainTabs';
import { useCreateHabit } from '../../hooks/useHabits';
import { GradientCard } from '../../components/GradientCard';
import { AppHeader } from '../../components/AppHeader';
import { Icon } from '../../components/Icon';
import { IconName } from '../../components/Icon';
import { Colors, BorderRadius, Spacing, Typography, Shadows, HABIT_ICONS } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<HabitsStackParamList, 'AddHabit'>;
};

type RepeatType = 'daily' | 'weekdays' | 'custom';
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function AddHabitScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(HABIT_ICONS[8]); // target
  const [selectedColor, setSelectedColor] = useState<string>(Colors.habitColors[0]);
  const [repeatType, setRepeatType] = useState<RepeatType>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const createHabit = useCreateHabit();

  function toggleDay(i: number) {
    setSelectedDays((prev) => prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i]);
  }

  async function handleSave() {
    if (!name.trim()) { Alert.alert('Required', 'Please enter a habit name.'); return; }
    try {
      await createHabit.mutateAsync({ name: name.trim(), icon: selectedIcon, color: selectedColor, repeatType, repeatDays: selectedDays } as any);
      navigation.goBack();
    } catch { Alert.alert('Error', 'Could not create habit.'); }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader
        title="New habit"
        cancelLabel="Cancel"
        onCancel={() => navigation.goBack()}
        rightLabel="Save"
        onRight={handleSave}
        rightLoading={createHabit.isPending}
      />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Preview Card */}
        <GradientCard colors={Colors.gradientPurple} style={styles.preview}>
          <View style={styles.previewIcon}>
            <Icon name={selectedIcon as IconName} size={28} color="#fff" />
          </View>
          <View style={styles.previewInfo}>
            <Text style={styles.previewLabel}>PREVIEW</Text>
            <Text style={styles.previewName}>{name || 'Habit name'}</Text>
            <Text style={styles.previewSub}>
              {repeatType === 'daily' ? 'Daily' : repeatType === 'weekdays' ? 'Weekdays' : 'Custom'} · Morning
            </Text>
          </View>
        </GradientCard>

        {/* Name Input */}
        <TextInput
          style={styles.nameInput}
          placeholder="Habit name"
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus
          returnKeyType="done"
        />

        {/* Icon Picker */}
        <Text style={styles.sectionLabel}>ICON</Text>
        <View style={styles.iconGrid}>
          {HABIT_ICONS.map((icon) => (
            <TouchableOpacity
              key={icon}
              style={[styles.iconBtn, selectedIcon === icon && { backgroundColor: Colors.primary }]}
              onPress={() => setSelectedIcon(icon)}
            >
              <Icon
                name={icon as IconName}
                size={22}
                color={selectedIcon === icon ? '#fff' : Colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Color Picker */}
        <Text style={styles.sectionLabel}>COLOR</Text>
        <View style={styles.colorRow}>
          {Colors.habitColors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.colorCircleSelected]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        {/* Repeat */}
        <Text style={styles.sectionLabel}>REPEAT</Text>
        <View style={styles.repeatRow}>
          {(['daily', 'weekdays', 'custom'] as RepeatType[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.repeatBtn, repeatType === r && styles.repeatBtnActive]}
              onPress={() => setRepeatType(r)}
            >
              <Text style={[styles.repeatTxt, repeatType === r && styles.repeatTxtActive]}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Day selector */}
        <View style={styles.daysRow}>
          {DAY_LABELS.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.dayBtn, selectedDays.includes(i) && styles.dayBtnActive]}
              onPress={() => toggleDay(i)}
            >
              <Text style={[styles.dayTxt, selectedDays.includes(i) && styles.dayTxtActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.xl, gap: Spacing.lg },
  preview: { flexDirection: 'row', alignItems: 'center', padding: Spacing.xl, gap: Spacing.lg },
  previewIcon: {
    width: 52, height: 52, borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  previewInfo: { flex: 1 },
  previewLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  previewName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  previewSub: { ...Typography.small, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  nameInput: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    fontSize: 18, fontWeight: '600', color: Colors.textPrimary, ...Shadows.card,
  },
  sectionLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm, marginBottom: Spacing.xs },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  iconBtn: {
    width: 52, height: 52, borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardBg, alignItems: 'center', justifyContent: 'center', ...Shadows.card,
  },
  colorRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },
  colorCircleSelected: { borderWidth: 3, borderColor: Colors.textPrimary, transform: [{ scale: 1.12 }] },
  repeatRow: {
    flexDirection: 'row', backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.full, padding: 4, ...Shadows.card,
  },
  repeatBtn: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, alignItems: 'center' },
  repeatBtnActive: { backgroundColor: Colors.primary },
  repeatTxt: { ...Typography.smallMedium, color: Colors.textSecondary },
  repeatTxtActive: { color: Colors.textWhite, fontWeight: '700' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.cardBg, alignItems: 'center', justifyContent: 'center', ...Shadows.card,
  },
  dayBtnActive: { backgroundColor: Colors.primary },
  dayTxt: { ...Typography.smallMedium, color: Colors.textSecondary, fontWeight: '700' },
  dayTxtActive: { color: Colors.textWhite },
});
