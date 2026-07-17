// src/screens/mentorship/ProgressScreen.jsx
//
// Mentorship Progress page.
// Matches the design:
//   ✅ "Your Progress" header with subtitle
//   ✅ Overall Progress card — red bar + percentage
//   ✅ Current Module card — module name, "In Progress" green badge, green bar + percentage
//   ✅ Next Module card — module name + "Locked" label
//   ✅ Completed Modules card — large count number
//   ✅ All sections separated by a light gray divider / background

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock } from 'lucide-react-native';
import colors from '../../constants/colors';

// ─── Progress data (swap with real store/API later) ───────────────────────────
const PROGRESS_DATA = {
  overall: 67,
  currentModule: {
    title: 'Company Valuation',
    progress: 76,
  },
  nextModule: {
    title: 'Portfolio Management',
  },
  completedCount: 2,
};

// ─── Reusable progress bar ────────────────────────────────────────────────────
function ProgressBar({ percent, color }) {
  return (
    <View style={styles.barTrack}>
      <View
        style={[
          styles.barFill,
          { width: `${percent}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function SectionCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProgressScreen() {
  const { overall, currentModule, nextModule, completedCount } = PROGRESS_DATA;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Page header ── */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Your Progress</Text>
          <Text style={styles.pageSubtitle}>Track your mentorship journey</Text>
        </View>

        {/* ── Overall Progress ── */}
        <SectionCard>
          <View style={styles.rowBetween}>
            <Text style={styles.cardLabel}>Overall Progress</Text>
            <Text style={styles.percentText}>{overall}%</Text>
          </View>
          <ProgressBar percent={overall} color={colors.primary} />
        </SectionCard>

        {/* ── Section divider label ── */}
        <Text style={styles.sectionLabel}>Current Module</Text>

        {/* ── Current Module ── */}
        <SectionCard>
          <View style={styles.rowBetween}>
            <Text style={styles.moduleName}>{currentModule.title}</Text>
            <Text style={styles.percentText}>{currentModule.progress}%</Text>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.inProgressBadge}>
              <Text style={styles.inProgressText}>In Progress</Text>
            </View>
          </View>
          <ProgressBar percent={currentModule.progress} color='#22C55E' />
        </SectionCard>

        {/* ── Next Module ── */}
        <SectionCard style={styles.nextModuleCard}>
          <Text style={styles.sectionLabelInline}>Next Module</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.moduleName}>{nextModule.title}</Text>
            <View style={styles.lockedRow}>
              <Lock size={13} color={colors.textSecondary} strokeWidth={2} />
              <Text style={styles.lockedText}>Locked</Text>
            </View>
          </View>
        </SectionCard>

        {/* ── Completed Modules ── */}
        <SectionCard style={styles.completedCard}>
          <Text style={styles.sectionLabelInline}>Completed Modules</Text>
          <Text style={styles.completedCount}>{completedCount}</Text>
        </SectionCard>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
};

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: '#F4F4F4' },
  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Page header (white background)
  pageHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 0,
  },
  pageTitle:    { fontSize: 22, fontWeight: '700', color: colors.black, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: colors.textSecondary },

  // Section label between cards
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 8,
  },

  // Inline label inside a card (Next Module, Completed Modules)
  sectionLabelInline: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    ...CARD_SHADOW,
  },
  nextModuleCard:  { marginTop: 12 },
  completedCard:   { marginTop: 12 },

  // Row helpers
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  cardLabel:   { fontSize: 15, fontWeight: '600', color: colors.black },
  moduleName:  { fontSize: 15, fontWeight: '600', color: colors.black, flex: 1, marginRight: 8 },
  percentText: { fontSize: 14, fontWeight: '700', color: colors.black },

  // In Progress badge
  badgeRow: { marginBottom: 8 },
  inProgressBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  inProgressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },

  // Locked label
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockedText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Progress bar
  barTrack: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },

  // Completed count
  completedCount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.black,
    marginTop: 4,
    letterSpacing: -1,
  },
});