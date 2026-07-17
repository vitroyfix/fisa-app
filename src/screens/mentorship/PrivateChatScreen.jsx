// src/screens/mentorship/PrivateChatScreen.jsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Smile, Send } from 'lucide-react-native';
import { useColors } from '../../constants/colors';
import GoalsProgressScreen from './GoalsProgressScreen';

// ─── Data ─────────────────────────────────────────────────────────────────────
const MENTOR = {
  name:   'Dr. Sarah Thompson',
  role:   'Mentor',
  avatar: 'https://i.pravatar.cc/150?img=47',
  online: true,
};

const INITIAL_MESSAGES = [
  { id: '1', text: 'Hi Alexandra, how are you progressing on the valuation module?', time: '10:00 AM', sent: false },
  { id: '2', text: "Good morning! I'm reviewing the DCF model now.",                  time: '10:32 AM', sent: true  },
  { id: '3', text: 'Great! Let me know if you have any questions about the WACC derivation.', time: '10:33 AM', sent: false },
];

// ─── Bubble ───────────────────────────────────────────────────────────────────
function MessageBubble({ message, colors }) {
  const { text, time, sent } = message;
  return (
    <View style={[styles.bubbleRow, sent ? styles.bubbleRowSent : styles.bubbleRowReceived]}>
      {!sent && (
        <Image
          source={{ uri: MENTOR.avatar }}
          style={[styles.bubbleAvatar, { backgroundColor: colors.mediumGray }]}
        />
      )}
      <View style={styles.bubbleContent}>
        <View style={[
          styles.bubble,
          sent
            ? [styles.bubbleSent,     { backgroundColor: colors.primary }]
            : [styles.bubbleReceived, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }],
        ]}>
          <Text style={[styles.bubbleText, { color: sent ? colors.white : colors.textPrimary }]}>
            {text}
          </Text>
        </View>
        <Text style={[
          styles.bubbleTime,
          { color: colors.textSecondary },
          sent && styles.bubbleTimeRight,
        ]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

// ─── Chat view ────────────────────────────────────────────────────────────────
function ChatView({ colors }) {
  const [messages,  setMessages]  = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef               = useRef(null);
  const insets                    = useSafeAreaInsets();

  function sendMessage() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id:   String(Date.now()),
        text: trimmed,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sent: true,
      },
    ]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    // NO KAV here — MentorshipScreen owns the KAV for this entire content area.
    <View style={[styles.chatContainer, { backgroundColor: colors.background }]}>

      {/* ── Mentor info row ── */}
      <View style={[styles.mentorRow, {
        backgroundColor:   colors.surface,
        borderBottomColor: colors.divider,
      }]}>
        <Image
          source={{ uri: MENTOR.avatar }}
          style={[styles.mentorAvatar, { backgroundColor: colors.mediumGray }]}
        />
        <View style={styles.mentorMeta}>
          <Text style={[styles.mentorName, { color: colors.textPrimary }]}>{MENTOR.name}</Text>
          <Text style={[styles.mentorRole, { color: colors.textSecondary }]}>{MENTOR.role}</Text>
        </View>
        <View style={styles.onlineRow}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineLabel}>Online</Text>
        </View>
      </View>

      {/* ── Message list ──
          inverted=true anchors newest messages to the bottom naturally.
          Data reversed so index 0 = newest (visually at the bottom).    */}
      <FlatList
        ref={flatListRef}
        style={styles.messageList}
        data={[...messages].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} colors={colors} />}
        contentContainerStyle={styles.messageListContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        inverted
      />

      {/* ── Input bar ──
          paddingBottom matches CommunityScreen's inputBar exactly:
            iOS     → 45px (home indicator clearance)
            Android → 30px (gesture nav bar clearance)
          The parent KAV in MentorshipScreen pushes this bar up when
          the keyboard appears — no offset math needed here.           */}
      <View style={[
        styles.inputBar,
        {
          backgroundColor: colors.surface,
          borderTopColor:  colors.divider,
          paddingBottom:   Platform.OS === 'ios' ? 45 : 30,
        },
      ]}>
        <TextInput
          style={[
            styles.input,
            {
              color:           colors.textPrimary,
              backgroundColor: colors.inputBackground,
              borderColor:     colors.inputBorder,
            },
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={colors.inputPlaceholder}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
          multiline
          blurOnSubmit={false}
        />
        <TouchableOpacity style={styles.emojiBtn} activeOpacity={0.7}>
          <Smile size={22} color={colors.textSecondary} strokeWidth={1.8} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: colors.primary },
            !inputText.trim() && styles.sendBtnInactive,
          ]}
          onPress={sendMessage}
          activeOpacity={0.8}
        >
          <Send size={18} color={colors.white} strokeWidth={2} />
        </TouchableOpacity>
      </View>

    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
// NO KAV, NO SafeAreaView — both live in MentorshipScreen.
// This component is a plain flex container, just like how CommunityScreen's
// inner content sits inside its own KAV without adding another one.
export default function PrivateChatScreen() {
  const colors  = useColors();
  const [subTab, setSubTab] = useState('chat');

  return (
    <View style={[styles.screenFlex, { backgroundColor: colors.background }]}>

      {/* Sub-toggle */}
      <View style={[
        styles.subToggleBar,
        { backgroundColor: colors.surface, borderBottomColor: colors.divider },
      ]}>
        {['chat', 'goals'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.subTab,
              { backgroundColor: subTab === tab ? colors.primary : colors.surfaceAlt },
            ]}
            onPress={() => setSubTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.subTabLabel,
              { color: subTab === tab ? colors.white : colors.textSecondary },
              subTab === tab && styles.subTabLabelActive,
            ]}>
              {tab === 'chat' ? 'Chat' : 'Goals & Progress'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {subTab === 'chat'
        ? <ChatView colors={colors} />
        : <GoalsProgressScreen />
      }

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  screenFlex: { flex: 1 },

  subToggleBar: {
    flexDirection:     'row',
    paddingHorizontal: 16,
    paddingVertical:   10,
    gap:                8,
    borderBottomWidth:  1,
  },
  subTab:            { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  subTabLabel:       { fontSize: 13, fontWeight: '500' },
  subTabLabelActive: { fontWeight: '600' },

  chatContainer: { flex: 1 },

  mentorRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 16,
    paddingVertical:   12,
    borderBottomWidth:  1,
  },
  mentorAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  mentorMeta:   { flex: 1 },
  mentorName:   { fontSize: 14, fontWeight: '700' },
  mentorRole:   { fontSize: 12, marginTop: 2 },
  onlineRow:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  onlineLabel:  { fontSize: 12, color: '#22C55E', fontWeight: '500' },

  messageList: { flex: 1 },
  messageListContent: {
    paddingHorizontal: 16,
    paddingTop:         8,
    paddingBottom:     16,
  },

  bubbleRow:         { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  bubbleRowReceived: { justifyContent: 'flex-start' },
  bubbleRowSent:     { justifyContent: 'flex-end' },
  bubbleAvatar:      { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  bubbleContent:     { maxWidth: '72%' },
  bubble:            { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleReceived: {
    borderBottomLeftRadius: 4,
    shadowOffset:           { width: 0, height: 1 },
    shadowOpacity:          0.06,
    shadowRadius:           6,
    elevation:              2,
  },
  bubbleSent:      { borderBottomRightRadius: 4 },
  bubbleText:      { fontSize: 14, lineHeight: 20 },
  bubbleTime:      { fontSize: 11, marginTop: 4, marginLeft: 4 },
  bubbleTimeRight: { textAlign: 'right', marginRight: 4 },

  inputBar: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 12,
    paddingTop:        10,
    borderTopWidth:     1,
    gap:                8,
  },
  input: {
    flex:              1,
    fontSize:          14,
    maxHeight:         100,
    minHeight:         40,
    borderRadius:      20,
    borderWidth:       1,
    paddingHorizontal: 14,
    paddingVertical:   Platform.OS === 'ios' ? 9 : 6,
  },
  emojiBtn: { padding: 4 },
  sendBtn: {
    width:          36,
    height:         36,
    borderRadius:   18,
    justifyContent: 'center',
    alignItems:     'center',
  },
  sendBtnInactive: { opacity: 0.45 },
});