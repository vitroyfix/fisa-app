// src/screens/mentorship/PublicBoardScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Image, Modal, TextInput, Platform,
  KeyboardAvoidingView, Animated, Dimensions,
} from 'react-native';
import {
  Heart, MessageCircle, Plus, Star, Award,
  Pin, ChevronRight, Camera, X, CheckCircle2, Lock,
  GraduationCap, Quote,
} from 'lucide-react-native';
import { useColors } from '../../constants/colors';

const { height: SH } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────
const USER_COMPLETED_MENTORSHIP = true;
const USER_ALREADY_SUBMITTED    = false;

const INITIAL_PEER_POSTS = [
  { id: 'p0', author: 'Alexandra', role: 'Mentee', avatar: 'https://i.pravatar.cc/150?img=47', time: '30 min ago', body: 'Just completed session 3 — the WACC deep-dive with Dr. Thompson. It finally clicked. Anyone else find the beta estimation part confusing at first?', likes: 3,  comments: 2,  liked: false, pinned: false },
  { id: 'p1', pinned: true, author: 'FISA Team', role: 'Admin', avatar: 'https://i.pravatar.cc/150?img=3',  time: '1h ago',     body: "Welcome to Cohort 7! Introduce yourself below — share your name, where you're from, and one thing you're hoping to learn.", likes: 22, comments: 18, liked: false },
  { id: 'p2', author: 'Olivia Mwangi', role: 'Mentee', avatar: 'https://i.pravatar.cc/150?img=5',  time: '3h ago',     body: 'Completed the ROE analysis case study — the template Dr. Thompson shared was a game-changer!', likes: 8,  comments: 3,  liked: false, pinned: false },
  { id: 'p3', author: 'Kwame Asante',  role: 'Mentee', avatar: 'https://i.pravatar.cc/150?img=8',  time: '5h ago',     body: 'Anyone else working through the WACC section in module 3? Happy to pair up for a study session.', likes: 5,  comments: 7,  liked: false, pinned: false },
];
const MENTOR_POSTS = [
  { id: 'm1', author: 'Prof. James Lee',      role: 'Mentor', avatar: 'https://i.pravatar.cc/150?img=12', time: '2h ago', body: 'Join the live session on African market trends this Friday at 3 PM EAT. Link in your welcome email. Bring your module 3 notes.', likes: 12, comments: 5, liked: false },
  { id: 'm2', author: 'Dr. Sarah Thompson',   role: 'Mentor', avatar: 'https://i.pravatar.cc/150?img=47', time: '1d ago', body: 'Resource drop: three new WACC practice sets added to module 3. The NSE case study is particularly worth your time.', likes: 19, comments: 4, liked: false },
];
const INITIAL_ALUMNI = [
  { id: 'a1', name: 'Amara Diallo', cohort: 'Cohort 4 · 2023', avatar: 'https://i.pravatar.cc/150?img=20', outcome: 'Equity Research Analyst, Nairobi Securities Exchange', quote: 'The mentorship gave me the technical grounding and confidence to walk into interviews ready. Six months later I was on the trading floor.', likes: 24, liked: false },
  { id: 'a2', name: 'Seren Okafor', cohort: 'Cohort 3 · 2022', avatar: 'https://i.pravatar.cc/150?img=25', outcome: 'Associate — Private Equity, Lagos',                        quote: 'My mentor connected me to the right people and helped me build a deal memo that landed my first role. I still use the DCF template from module 3.', likes: 31, liked: false },
];



// ─── Post card ────────────────────────────────────────────────────────────────
function PostCard({ post, onLike, colors }) {
  return (
    <View style={[
      styles.card,
      { backgroundColor: post.pinned ? colors.surfaceAlt : colors.surface, shadowColor: colors.cardShadow },
      post.pinned && [styles.cardPinned, { borderColor: 'rgba(99,102,241,0.2)' }],
    ]}>
      {post.pinned && (
        <View style={styles.pinnedBadge}>
          <Pin size={11} color="#6366F1" fill="#6366F1" strokeWidth={0} />
          <Text style={styles.pinnedText}>Pinned</Text>
        </View>
      )}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatar }} style={[styles.postAvatar, { backgroundColor: colors.mediumGray }]} />
        <View style={styles.postMeta}>
          <Text style={[styles.postAuthor, { color: colors.textPrimary }]}>{post.author}</Text>
          <View style={styles.metaRow}>
            <Text style={[styles.postRole, { color: colors.textSecondary },
              post.role === 'Admin'  && styles.roleAdmin,
              post.role === 'Mentor' && styles.roleMentor,
            ]}>{post.role}</Text>
            <Text style={[styles.sep,      { color: colors.textSecondary }]}>·</Text>
            <Text style={[styles.postTime, { color: colors.textSecondary }]}>{post.time}</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.postBody, { color: colors.textPrimary }]}>{post.body}</Text>
      <View style={[styles.reactionRow, { borderTopColor: colors.divider }]}>
        <TouchableOpacity style={styles.reactionBtn} onPress={() => onLike(post.id)} activeOpacity={0.7}>
          <Heart size={18} color={post.liked ? colors.primary : colors.textSecondary} fill={post.liked ? colors.primary : 'none'} strokeWidth={1.8} />
          <Text style={[styles.reactionCount, { color: colors.textSecondary }, post.liked && { color: colors.primary }]}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionBtn} activeOpacity={0.7}>
          <MessageCircle size={18} color={colors.textSecondary} strokeWidth={1.8} />
          <Text style={[styles.reactionCount, { color: colors.textSecondary }]}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Mentor spotlight card ────────────────────────────────────────────────────
function SpotlightCard({ post, onLike, colors }) {
  return (
    <View style={[styles.card, styles.spotlightCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
      <View style={styles.spotlightBadge}>
        <Star size={11} color="#B45309" fill="#B45309" strokeWidth={0} />
        <Text style={styles.spotlightBadgeText}>Mentor Spotlight</Text>
      </View>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatar }} style={[styles.postAvatar, { backgroundColor: colors.mediumGray }]} />
        <View style={styles.postMeta}>
          <Text style={[styles.postAuthor, { color: colors.textPrimary }]}>{post.author}</Text>
          <Text style={[styles.postTime,   { color: colors.textSecondary }]}>{post.time}</Text>
        </View>
      </View>
      <Text style={[styles.postBody, { color: colors.textPrimary }]}>{post.body}</Text>
      <View style={[styles.reactionRow, { borderTopColor: colors.divider }]}>
        <TouchableOpacity style={styles.reactionBtn} onPress={() => onLike(post.id)} activeOpacity={0.7}>
          <Heart size={18} color={post.liked ? colors.primary : colors.textSecondary} fill={post.liked ? colors.primary : 'none'} strokeWidth={1.8} />
          <Text style={[styles.reactionCount, { color: post.liked ? colors.primary : colors.textSecondary }]}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionBtn} activeOpacity={0.7}>
          <MessageCircle size={18} color={colors.textSecondary} strokeWidth={1.8} />
          <Text style={[styles.reactionCount, { color: colors.textSecondary }]}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Alumni story card ────────────────────────────────────────────────────────
function AlumniCard({ story, onLike, colors }) {
  return (
    <View style={[styles.card, styles.alumniCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.cardShadow }]}>
      <View style={styles.alumniHeader}>
        <Image source={{ uri: story.avatar }} style={[styles.alumniAvatar, { backgroundColor: colors.mediumGray }]} />
        <View style={styles.alumniMeta}>
          <Text style={[styles.alumniName,   { color: colors.textPrimary }]}>{story.name}</Text>
          <Text style={[styles.alumniCohort, { color: colors.textSecondary }]}>{story.cohort}</Text>
        </View>
        <Award size={20} color={colors.primary} strokeWidth={1.8} />
      </View>
      <View style={styles.outcomeTag}>
        <Text style={styles.outcomeText}>{story.outcome}</Text>
      </View>
      <View style={styles.alumniQuoteRow}>
        <Quote size={14} color={colors.textSecondary} strokeWidth={1.5} style={styles.quoteIcon} />
        <Text style={[styles.alumniQuote, { color: colors.textSecondary }]}>{story.quote}</Text>
      </View>
      <TouchableOpacity style={styles.storyLikeRow} onPress={() => onLike(story.id)} activeOpacity={0.7}>
        <Heart size={16} color={story.liked ? colors.primary : colors.textSecondary} fill={story.liked ? colors.primary : 'none'} strokeWidth={1.8} />
        <Text style={[styles.storyLikeCount, { color: story.liked ? colors.primary : colors.textSecondary }]}>
          {story.likes} found this helpful
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Add story CTA ────────────────────────────────────────────────────────────
function AddStoryCTA({ completed, alreadySubmitted, onPress, colors }) {
  if (alreadySubmitted) return null;
  if (!completed) {
    return (
      <View style={[styles.addStoryLocked, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <Lock size={20} color={colors.textSecondary} strokeWidth={1.8} />
        <Text style={[styles.addStoryLockedTitle, { color: colors.textPrimary }]}>Complete your mentorship to share your story</Text>
        <Text style={[styles.addStoryLockedSub,   { color: colors.textSecondary }]}>Once you finish all modules and sessions, you'll unlock the ability to inspire the next cohort.</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity style={styles.addStoryCTA} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.addStoryCTAIconWrap, { backgroundColor: 'rgba(234,179,8,0.15)' }]}>
        <GraduationCap size={22} color="#B45309" strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.addStoryCTATitle, { color: colors.textPrimary }]}>Share your story</Text>
        <Text style={[styles.addStoryCTASub,   { color: colors.textSecondary }]}>You finished — inspire the next cohort.</Text>
      </View>
      <ChevronRight size={18} color={colors.primary} strokeWidth={2} />
    </TouchableOpacity>
  );
}

// ─── Submit story modal ───────────────────────────────────────────────────────
function SubmitStoryModal({ visible, onClose, onSubmit, colors }) {
  const [headline, setHeadline] = useState('');
  const [outcome,  setOutcome]  = useState('');
  const [quote,    setQuote]    = useState('');
  const slideAnim = useRef(new Animated.Value(SH)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: visible ? 0 : SH, friction: 18, tension: 100, useNativeDriver: true }).start();
  }, [visible]);

  const canSubmit = headline.trim() && outcome.trim() && quote.trim();

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({ headline, outcome, quote });
    setHeadline(''); setOutcome(''); setQuote('');
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Overlay dim — separate from KAV so it never moves */}
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
        {/* KAV wraps only the sheet so only the sheet lifts */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <Animated.View style={[styles.storySheet, { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] }]}>
            {/* Fixed header — never scrolls away */}
            <View style={styles.storySheetHeader}>
              <Text style={[styles.storySheetTitle, { color: colors.textPrimary }]}>Your success story</Text>
              <TouchableOpacity onPress={onClose} style={styles.sheetClose} activeOpacity={0.7}>
                <X size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Scrollable fields — submit button lives inside so it's always reachable */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.storyScrollContent}
            >
              <Text style={[styles.storySheetSub, { color: colors.textSecondary }]}>
                Your story will appear in the Success Stories section for future cohorts. Be specific — concrete outcomes inspire more than vague praise.
              </Text>

              <TouchableOpacity
                style={[styles.photoPlaceholder, { backgroundColor: colors.surfaceAlt, borderColor: colors.inputBorder }]}
                activeOpacity={0.8}
              >
                <Camera size={20} color={colors.textSecondary} strokeWidth={1.8} />
                <Text style={[styles.photoPlaceholderText, { color: colors.textSecondary }]}>Add a photo (optional)</Text>
              </TouchableOpacity>

              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>Where are you now?</Text>
              <TextInput
                style={[styles.fieldInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.inputBorder }]}
                value={outcome}
                onChangeText={setOutcome}
                placeholder="e.g. Equity Research Analyst, NSE"
                placeholderTextColor={colors.inputPlaceholder}
              />
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>One-line headline</Text>
              <TextInput
                style={[styles.fieldInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.inputBorder }]}
                value={headline}
                onChangeText={setHeadline}
                placeholder="e.g. From student to the trading floor in 6 months"
                placeholderTextColor={colors.inputPlaceholder}
              />
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>In your own words</Text>
              <TextInput
                style={[styles.fieldInput, styles.fieldTextarea, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.inputBorder }]}
                value={quote}
                onChangeText={setQuote}
                placeholder="What changed for you? What would you tell the next cohort?"
                placeholderTextColor={colors.inputPlaceholder}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.submitStoryBtn, { backgroundColor: colors.primary }, !canSubmit && styles.submitStoryBtnDisabled]}
                onPress={handleSubmit} activeOpacity={0.85}
              >
                <Text style={[styles.submitStoryBtnText, { color: colors.white }]}>Publish my story</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── New post modal ───────────────────────────────────────────────────────────
function NewPostModal({ visible, onClose, onSubmit, colors }) {
  const [text, setText] = useState('');

  function handlePost() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Overlay dim — separate from KAV so it never moves */}
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => { onClose(); setText(''); }} activeOpacity={1} />
        {/* KAV wraps only the sheet so only the sheet lifts with the keyboard */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>New Post</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.inputBorder }]}
              value={text}
              onChangeText={setText}
              placeholder="Share something with the community…"
              placeholderTextColor={colors.inputPlaceholder}
              multiline
              autoFocus
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalCancel, { borderColor: colors.border }]} onPress={() => { onClose(); setText(''); }} activeOpacity={0.7}>
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalPost, { backgroundColor: colors.primary }, !text.trim() && styles.modalPostDisabled]}
                onPress={handlePost} activeOpacity={0.8}
              >
                <Text style={[styles.modalPostText, { color: colors.white }]}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, colors }) {
  return (
    <View style={styles.sectionHeaderWrap}>
      <Text style={[styles.sectionTitle,    { color: colors.textPrimary }]}>{title}</Text>
      {subtitle && <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function PublicBoardScreen() {
  const colors = useColors();
  const [peerPosts,         setPeerPosts]         = useState(INITIAL_PEER_POSTS);
  const [mentorPosts,       setMentorPosts]        = useState(MENTOR_POSTS);
  const [alumniStories,     setAlumniStories]      = useState(INITIAL_ALUMNI);
  const [newPostVisible,    setNewPostVisible]     = useState(false);
  const [storyModalVisible, setStoryModalVisible]  = useState(false);
  const [storySubmitted,    setStorySubmitted]     = useState(USER_ALREADY_SUBMITTED);
  const [successToast,      setSuccessToast]       = useState(false);
  const toastAnim = useRef(new Animated.Value(0)).current;

  function likePost(id, setter) {
    setter((prev) => prev.map((p) => p.id === id
      ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
      : p
    ));
  }

  function handleNewPost(text) {
    setPeerPosts((prev) => [{
      id: String(Date.now()), author: 'Alexandra', role: 'Mentee',
      avatar: 'https://i.pravatar.cc/150?img=47',
      time: 'Just now', body: text, likes: 0, comments: 0, liked: false, pinned: false,
    }, ...prev]);
    setNewPostVisible(false);
  }

  function handleStorySubmit({ headline, outcome, quote }) {
    setAlumniStories((prev) => [{
      id: String(Date.now()), name: 'Alexandra', cohort: 'Cohort 7 · 2025',
      avatar: 'https://i.pravatar.cc/150?img=47', outcome, quote, likes: 0, liked: false,
    }, ...prev]);
    setStorySubmitted(true);
    setStoryModalVisible(false);
    showToast();
  }

  function showToast() {
    setSuccessToast(true);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setSuccessToast(false));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <SectionHeader title="Community"         subtitle="What your cohort is talking about"  colors={colors} />
        {peerPosts.map((post)  => <PostCard     key={post.id}  post={post}  onLike={(id) => likePost(id, setPeerPosts)}  colors={colors} />)}

        <SectionHeader title="Mentor Spotlights" subtitle="Updates and resources from your mentors" colors={colors} />
        {mentorPosts.map((post) => <SpotlightCard key={post.id} post={post} onLike={(id) => likePost(id, setMentorPosts)} colors={colors} />)}

        <SectionHeader title="Success Stories"   subtitle="Alumni who've been where you are"   colors={colors} />
        <AddStoryCTA completed={USER_COMPLETED_MENTORSHIP} alreadySubmitted={storySubmitted} onPress={() => setStoryModalVisible(true)} colors={colors} />
        {alumniStories.map((story) => <AlumniCard key={story.id} story={story} onLike={(id) => likePost(id, setAlumniStories)} colors={colors} />)}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating new post button */}
      <View style={styles.newPostWrap}>
        <TouchableOpacity style={[styles.newPostBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => setNewPostVisible(true)} activeOpacity={0.85}>
          <Plus size={16} color={colors.white} strokeWidth={2.5} />
          <Text style={[styles.newPostLabel, { color: colors.white }]}> New Post</Text>
        </TouchableOpacity>
      </View>

      {/* Success toast */}
      {successToast && (
        <Animated.View style={[styles.toast, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }, {
          opacity: toastAnim,
          transform: [{ translateY: toastAnim.interpolate({ inputRange: [0,1], outputRange: [20, 0] }) }],
        }]}>
          <CheckCircle2 size={16} color="#22C55E" strokeWidth={2.5} />
          <Text style={[styles.toastText, { color: colors.textPrimary }]}>Your story is live!</Text>
        </Animated.View>
      )}

      <NewPostModal    visible={newPostVisible}    onClose={() => setNewPostVisible(false)}    onSubmit={handleNewPost}    colors={colors} />
      <SubmitStoryModal visible={storyModalVisible} onClose={() => setStoryModalVisible(false)} onSubmit={handleStorySubmit} colors={colors} />
    </View>
  );
}

// ─── Styles — layout only ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:     { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4 },

  sectionHeaderWrap: { paddingTop: 20, paddingBottom: 10, paddingHorizontal: 2 },
  sectionTitle:      { fontSize: 16, fontWeight: '700' },
  sectionSubtitle:   { fontSize: 12, marginTop: 2 },

  card:       { borderRadius: 14, padding: 14, marginBottom: 10, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardPinned: { borderWidth: 1 },

  pinnedBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: '#EEF2FF', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10 },
  pinnedText:      { fontSize: 11, fontWeight: '600', color: '#6366F1' },
  postHeader:      { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  postAvatar:      { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postMeta:        { flex: 1 },
  metaRow:         { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  postAuthor:      { fontSize: 14, fontWeight: '700' },
  postRole:        { fontSize: 11 },
  roleMentor:      { color: '#B45309', fontWeight: '600' },
  roleAdmin:       { color: '#6366F1', fontWeight: '600' },
  sep:             { fontSize: 11 },
  postTime:        { fontSize: 11 },
  postBody:        { fontSize: 14, lineHeight: 21, marginBottom: 12 },
  reactionRow:     { flexDirection: 'row', gap: 20, borderTopWidth: 1, paddingTop: 10 },
  reactionBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  reactionCount:   { fontSize: 13, fontWeight: '500' },

  spotlightCard:       { borderLeftWidth: 3, borderLeftColor: '#F59E0B' },
  spotlightBadge:      { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: '#FEF3C7', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10 },
  spotlightBadgeText:  { fontSize: 11, fontWeight: '600', color: '#B45309' },

  alumniCard:       { borderWidth: 1 },
  alumniHeader:     { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  alumniAvatar:     { width: 44, height: 44, borderRadius: 22, marginRight: 10 },
  alumniMeta:       { flex: 1 },
  alumniName:       { fontSize: 14, fontWeight: '700' },
  alumniCohort:     { fontSize: 11, marginTop: 2 },
  outcomeTag:       { backgroundColor: '#EEF2FF', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10 },
  outcomeText:      { fontSize: 12, fontWeight: '600', color: '#4338CA', lineHeight: 17 },
  alumniQuoteRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 10 },
  quoteIcon:        { marginTop: 2, flexShrink: 0 },
  alumniQuote:      { flex: 1, fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  storyLikeRow:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  storyLikeCount:   { fontSize: 12 },

  addStoryCTA:          { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF7ED', borderRadius: 14, borderWidth: 1, borderColor: '#FED7AA', padding: 14, marginBottom: 10 },
  addStoryCTAIconWrap:  { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addStoryCTATitle:     { fontSize: 14, fontWeight: '700' },
  addStoryCTASub:       { fontSize: 12, marginTop: 2 },
  addStoryLocked:       { borderRadius: 14, borderWidth: 1, padding: 16, alignItems: 'center', marginBottom: 10 },
  addStoryLockedTitle:  { fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8, marginBottom: 4 },
  addStoryLockedSub:    { fontSize: 12, textAlign: 'center', lineHeight: 17 },

  newPostWrap: { position: 'absolute', bottom: 20, left: 16, right: 16, alignItems: 'center' },
  newPostBtn:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 30, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  newPostLabel:{ fontSize: 15, fontWeight: '600' },

  toast:     { position: 'absolute', bottom: 90, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 30, paddingHorizontal: 18, paddingVertical: 10, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  toastText: { fontSize: 13, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet:   { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24 },
  modalTitle:   { fontSize: 16, fontWeight: '700', marginBottom: 14, textAlign: 'center' },
  modalInput:   { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, minHeight: 100, marginBottom: 14 },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancel:  { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, alignItems: 'center' },
  modalCancelText:   { fontSize: 14, fontWeight: '600' },
  modalPost:         { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  modalPostDisabled: { opacity: 0.4 },
  modalPostText:     { fontSize: 14, fontWeight: '600' },

  storySheet:         { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: SH * 0.88 },
  storyScrollContent: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 28 },
  storySheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, marginBottom: 8 },
  storySheetTitle:  { fontSize: 17, fontWeight: '700' },
  sheetClose:       { padding: 4 },
  storySheetSub:    { fontSize: 13, lineHeight: 18, marginBottom: 16 },
  fieldLabel:    { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  fieldInput:    { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 14 },
  fieldTextarea: { minHeight: 90 },
  photoPlaceholder: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, borderWidth: 1.5, borderStyle: 'dashed', paddingVertical: 16, marginBottom: 16 },
  photoPlaceholderText: { fontSize: 13 },
  submitStoryBtn:         { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  submitStoryBtnDisabled: { opacity: 0.4 },
  submitStoryBtnText:     { fontSize: 15, fontWeight: '700' },
});