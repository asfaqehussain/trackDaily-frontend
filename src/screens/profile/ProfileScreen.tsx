import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useStats } from '../../hooks/useStats';
import { GradientCard } from '../../components/GradientCard';
import { Icon } from '../../components/Icon';
import { IconName } from '../../components/Icon';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../../theme';

const PREF_ROWS: { icon: IconName; label: string; value: string }[] = [
  { icon: 'paint', label: 'Appearance', value: 'Light' },
  { icon: 'bell', label: 'Notifications', value: 'On' },
  { icon: 'globe', label: 'Language', value: 'English' },
  { icon: 'cloud', label: 'Sync & backup', value: 'On' },
];

export function ProfileScreen() {
  const { currentUser, logout } = useAuth();
  const { data: stats } = useStats();

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.pageTitle}>Profile</Text>

      {/* Profile card */}
      <GradientCard colors={Colors.gradientPurple} style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser?.name ?? 'User'}</Text>
            <Text style={styles.profileEmail}>{currentUser?.email ?? ''}</Text>
            <View style={styles.proBadge}>
              <Icon name="star" size={12} color="rgba(255,255,255,0.9)" />
              <Text style={styles.proText}> Pro member</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          {[
            { label: 'Streak', value: String(stats?.bestStreak ?? 0) },
            { label: 'Tasks', value: String(stats?.tasksDone ?? 0) },
            { label: 'Habits', value: String(stats?.totalHabits ?? 0) },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statNum}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </GradientCard>

      {/* Preferences */}
      <Text style={styles.sectionLabel}>PREFERENCES</Text>
      <View style={styles.prefCard}>
        {PREF_ROWS.map((row, i) => (
          <View key={row.label}>
            <TouchableOpacity style={styles.prefRow} activeOpacity={0.7}>
              <View style={styles.prefIcon}>
                <Icon name={row.icon} size={18} color={Colors.primary} />
              </View>
              <Text style={styles.prefLabel}>{row.label}</Text>
              <Text style={styles.prefValue}>{row.value}</Text>
              <Icon name="chevronRight" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
            {i < PREF_ROWS.length - 1 && <View style={styles.rowSep} />}
          </View>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#F04F4F" />
        <Text style={styles.logoutTxt}>Log out</Text>
      </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.xl, paddingTop: Spacing.xxxl },
  pageTitle: { ...Typography.h1, color: Colors.textPrimary, marginBottom: Spacing.xl },
  profileCard: { padding: Spacing.xl, marginBottom: Spacing.xl },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  avatar: {
    width: 60, height: 60, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '700', color: '#fff' },
  profileEmail: { ...Typography.small, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  proBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    marginTop: Spacing.sm, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm + 2, paddingVertical: 3,
  },
  proText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: Spacing.lg },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 26, fontWeight: '800', color: '#fff' },
  statLabel: { ...Typography.small, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sectionLabel: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.sm },
  prefCard: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.xl,
    overflow: 'hidden', marginBottom: Spacing.xl, ...Shadows.card,
  },
  prefRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, gap: Spacing.md,
  },
  prefIcon: {
    width: 36, height: 36, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  prefLabel: { ...Typography.bodyMedium, color: Colors.textPrimary, flex: 1 },
  prefValue: { ...Typography.small, color: Colors.textSecondary },
  rowSep: { height: 1, backgroundColor: Colors.border, marginLeft: 68 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.card,
  },
  logoutTxt: { ...Typography.bodyMedium, color: '#F04F4F', fontWeight: '600' },
});
