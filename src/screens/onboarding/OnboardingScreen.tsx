import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Dimensions, useWindowDimensions,
} from 'react-native';
import { GradientCard } from '../../components/GradientCard';
import { AppButton } from '../../components/AppButton';
import { Icon } from '../../components/Icon';
import { Colors, BorderRadius, Spacing, Typography, Shadows, FontFamily } from '../../theme';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Hero illustrations (built natively) ──────────────────────────────────────

/** Slide 1 hero: task + habit cards on gradient background */
function HeroTodayPlan() {
  return (
    <View style={heroStyles.gradientBg}>
      {/* Task card */}
      <View style={heroStyles.card}>
        <View style={heroStyles.taskRow}>
          <View style={heroStyles.taskDot} />
          <View style={{ flex: 1 }}>
            <Text style={heroStyles.taskTitle}>Ship onboarding flow</Text>
            <Text style={heroStyles.taskSub}>Today · 2:00 PM</Text>
          </View>
          <View style={heroStyles.workChip}>
            <Text style={heroStyles.workChipTxt}>Work</Text>
          </View>
        </View>
      </View>

      {/* Habit card */}
      <View style={[heroStyles.card, { marginTop: Spacing.md }]}>
        <View style={heroStyles.taskRow}>
          <View style={heroStyles.habitIconBox}>
            <Icon name="flame" size={18} color={Colors.habitColors[1]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={heroStyles.taskTitle}>Morning workout</Text>
            <Text style={heroStyles.taskSub}>24-day streak</Text>
          </View>
          <Text style={heroStyles.streakNum}>24</Text>
        </View>
      </View>
    </View>
  );
}

/** Slide 2 hero: Quick-add task card */
function HeroQuickCapture() {
  return (
    <View style={heroStyles.whiteBg}>
      <View style={heroStyles.quickCard}>
        <Text style={heroStyles.quickLabel}>Quick add</Text>
        <Text style={heroStyles.quickTitle}>{'Send invoice tomorrow 2pm'}</Text>
        <Text style={heroStyles.quickPriority}>!high</Text>
        <View style={heroStyles.quickDivider} />
        <View style={heroStyles.tagsRow}>
          <View style={[heroStyles.tag, heroStyles.tagPurple]}>
            <Text style={[heroStyles.tagTxt, { color: '#fff' }]}>Tomorrow</Text>
          </View>
          <View style={[heroStyles.tag, heroStyles.tagSalmon]}>
            <Text style={[heroStyles.tagTxt, { color: '#fff' }]}>2:00 PM</Text>
          </View>
          <View style={[heroStyles.tag, heroStyles.tagAmber]}>
            <Text style={[heroStyles.tagTxt, { color: '#B45309' }]}>High priority</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/** Slide 3 hero: Habit streak heatmap card */
function HeroStreaks() {
  // Generate a static heatmap pattern (5 rows × 11 cols = 55 cells)
  const ROWS = 5;
  const COLS = 11;
  // Pre-defined pattern from the design — mix of filled/empty
  const filledRatio = [0.9, 0.7, 0.5, 0.6, 0.45];

  return (
    <View style={heroStyles.whiteBg}>
      <View style={heroStyles.streakCard}>
        {/* Header */}
        <View style={heroStyles.streakHeader}>
          <View>
            <Text style={heroStyles.streakLabel}>Meditate</Text>
            <Text style={heroStyles.streakDays}>38 days</Text>
          </View>
          <View style={heroStyles.checkCircle}>
            <Icon name="check" size={18} color="#fff" />
          </View>
        </View>

        {/* Heatmap */}
        <Text style={{ fontSize: 20, marginBottom: 6 }}>🔥</Text>
        <View style={heroStyles.heatmap}>
          {Array.from({ length: ROWS }).map((_, ri) => (
            <View key={ri} style={heroStyles.heatRow}>
              {Array.from({ length: COLS }).map((_, ci) => {
                const fill = Math.random() > (1 - filledRatio[ri]);
                const opacity = fill ? (0.4 + Math.random() * 0.6) : 0.12;
                return (
                  <View
                    key={ci}
                    style={[
                      heroStyles.heatCell,
                      { backgroundColor: `rgba(91, 79, 232, ${opacity.toFixed(2)})` },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ── Slide data ────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    key: '1',
    hero: HeroTodayPlan,
    title: 'Plan today.\nBuild tomorrow.',
    subtitle: 'A focused tracker for the tasks you ship and the habits you keep — with a vibe.',
    cta: 'Next',
  },
  {
    key: '2',
    hero: HeroQuickCapture,
    title: 'Quick capture,\nzero friction.',
    subtitle: 'Type fast, schedule faster. Today, tomorrow, or next week — sorted automatically.',
    cta: 'Next',
  },
  {
    key: '3',
    hero: HeroStreaks,
    title: 'Streaks that\nactually stick.',
    subtitle: 'See your momentum at a glance. Each completed day adds to the chain.',
    cta: 'Get started',
  },
];

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  onDone: () => void;
}

export function OnboardingScreen({ onDone }: Props) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  function goNext() {
    if (activeIndex < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
      setActiveIndex((i) => i + 1);
    } else {
      onDone();
    }
  }

  function skip() {
    onDone();
  }

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        {/* App logo */}
        <GradientCard colors={Colors.gradientPurple} style={styles.logo}>
          <Icon name="trendUp" size={18} color="#fff" />
        </GradientCard>
        <TouchableOpacity onPress={skip} hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}>
          <Text style={styles.skipTxt}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // driven by button
        renderItem={({ item }) => {
          const HeroComponent = item.hero;
          return (
            <View style={[styles.slide, { width }]}>
              <HeroComponent />
            </View>
          );
        }}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
      />

      {/* Bottom content (title, subtitle, dots, button) */}
      <View style={styles.bottom}>
        <Text style={styles.title}>{SLIDES[activeIndex].title}</Text>
        <Text style={styles.subtitle}>{SLIDES[activeIndex].subtitle}</Text>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* CTA */}
        <AppButton
          label={SLIDES[activeIndex].cta}
          onPress={goNext}
          style={styles.cta}
        />
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: 56,
    paddingBottom: Spacing.md,
  },
  logo: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  skipTxt: { ...Typography.bodyMedium, color: Colors.textSecondary },
  slide: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -0.5,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.xl },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24, height: 8, borderRadius: 4, backgroundColor: Colors.primary,
  },
  cta: { marginTop: 0 },
});

// ── Hero sub-styles ───────────────────────────────────────────────────────────

const heroStyles = StyleSheet.create({
  // Slide 1
  gradientBg: {
    backgroundColor: '#EEF0FF',
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  taskDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary,
  },
  taskTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
  taskSub: { ...Typography.small, color: Colors.textSecondary, marginTop: 2 },
  workChip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  workChipTxt: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  habitIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.habitBg(Colors.habitColors[1], 0.15),
    alignItems: 'center', justifyContent: 'center',
  },
  streakNum: { fontSize: 22, fontWeight: '800', color: Colors.habitColors[1] },

  // Slide 2
  whiteBg: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  quickCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    width: '100%',
    borderWidth: 1, borderColor: Colors.border,
    ...Shadows.card,
  },
  quickLabel: { ...Typography.small, color: Colors.textMuted, marginBottom: Spacing.sm },
  quickTitle: {
    fontSize: 18, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'monospace', lineHeight: 26,
  },
  quickPriority: {
    fontSize: 16, fontWeight: '700', color: Colors.primary,
    fontFamily: 'monospace', marginTop: 2,
  },
  quickDivider: {
    height: 2, backgroundColor: Colors.primary, marginVertical: Spacing.md,
    borderRadius: 1,
  },
  tagsRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  tag: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
  },
  tagTxt: { fontSize: 13, fontWeight: '600' },
  tagPurple: { backgroundColor: Colors.primary },
  tagSalmon: { backgroundColor: Colors.habitColors[1] },
  tagAmber: { backgroundColor: '#FEF3C7' },

  // Slide 3
  streakCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    width: '100%',
    borderWidth: 1, borderColor: Colors.border,
    ...Shadows.card,
  },
  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  streakLabel: { ...Typography.small, color: Colors.textSecondary },
  streakDays: { fontSize: 28, fontWeight: '800', color: Colors.primary, lineHeight: 34 },
  checkCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  heatmap: { gap: 4 },
  heatRow: { flexDirection: 'row', gap: 4 },
  heatCell: { width: 20, height: 20, borderRadius: 4 },
});
