// src/screens/mentorship/MentorshipScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../../constants/colors';
import PrivateChatScreen from './PrivateChatScreen';
import PublicBoardScreen from './PublicBoardScreen';

const TABS = [
  { key: 'private', label: 'Private' },
  { key: 'public',  label: 'Public'  },
];

// Chrome heights measured from this file's own StyleSheet:
//   header:      paddingTop(10) + paddingBottom(12) + title fontSize(17) ≈ 52px
//   segmentWrap: paddingBottom(12) + track padding(3+3) + tab paddingVertical(9+9) ≈ 36px
//   ─────────────────────────────────────────────────────────────────────
//   Total KAV offset = 52 + 36 = 88px  (iOS only)
//
// This mirrors exactly how CommunityScreen works:
//   CommunityScreen owns its SafeAreaView + header(50px) + subToggleBar(35px) = 85px
//   KAV sits below that chrome and uses 85 as the offset.
//
//   MentorshipScreen owns its SafeAreaView + header(52px) + segmentWrap(36px) = 88px
//   KAV sits below that chrome and uses 88 as the offset.
//
// PrivateChatScreen no longer needs ANY KAV — this one covers the entire content area.
const KAV_OFFSET = Platform.OS === 'ios' ? 88 : 0;

export default function MentorshipScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState('private');

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mentorship</Text>
      </View>

      {/* ── Segmented Control ── */}
      <View style={[
        styles.segmentWrap,
        { backgroundColor: colors.background, borderBottomColor: colors.divider },
      ]}>
        <View style={[styles.segmentTrack, { backgroundColor: colors.surfaceAlt }]}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.segmentTab,
                activeTab === tab.key && [
                  styles.segmentTabActive,
                  { backgroundColor: colors.primary, shadowColor: colors.primary },
                ],
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.85}
            >
              <Text style={[
                styles.segmentLabel,
                { color: activeTab === tab.key ? colors.white : colors.textSecondary },
                activeTab === tab.key && styles.segmentLabelActive,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── KAV wraps the content area — same pattern as CommunityScreen ── */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={KAV_OFFSET}
      >
        {activeTab === 'private'
          ? <PrivateChatScreen />
          : <PublicBoardScreen />
        }
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:    { flex: 1 },
  header:      { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  segmentWrap: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  segmentTrack:{ flexDirection: 'row', borderRadius: 10, padding: 3 },
  segmentTab:  { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  segmentTabActive: {
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius:  4,
    elevation:     3,
  },
  segmentLabel:       { fontSize: 13, fontWeight: '500' },
  segmentLabelActive: { fontWeight: '600' },
  content: { flex: 1 },
});