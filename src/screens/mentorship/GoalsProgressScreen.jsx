// src/screens/mentorship/GoalsProgressScreen.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Lock, CheckCircle2, Circle, Clock, CalendarDays,
  Star, Flame, Trophy, ChevronDown, ChevronUp, BookOpen,
} from 'lucide-react-native';
import { useColors } from '../../constants/colors';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────
const today    = new Date();
const daysAgo  = (n) => new Date(today - n * 86400000).toISOString().slice(0, 10);
const daysFrom = (n) => new Date(+today + n * 86400000).toISOString().slice(0, 10);

const INITIAL_SESSIONS = [
  { id: 'sess1', topic: 'Introduction & Goal Setting',     description: 'Map your 12-week learning objectives and agree on evaluation criteria.',                                scheduledDate: daysAgo(28), duration: '60 min',  mentor: 'Dr. Sarah Thompson', done: true,  rating: 5    },
  { id: 'sess2', topic: 'DCF Modelling Fundamentals',      description: 'Walk through a live DCF model on a real listed company. Bring your module 2 notes.',                    scheduledDate: daysAgo(14), duration: '90 min',  mentor: 'Dr. Sarah Thompson', done: true,  rating: 4    },
  { id: 'sess3', topic: 'WACC & Cost of Capital Deep-Dive',description: "Derive WACC from scratch using CAPM. We'll use a case from the NSE.",                                   scheduledDate: daysAgo(2),  duration: '60 min',  mentor: 'Dr. Sarah Thompson', done: false, rating: null },
  { id: 'sess4', topic: 'Comparable Company Analysis',     description: 'Build a comps table for three East African banks and defend your multiples.',                           scheduledDate: daysFrom(7), duration: '90 min',  mentor: 'Dr. Sarah Thompson', done: false, rating: null },
  { id: 'sess5', topic: 'Portfolio Construction & Risk',   description: 'Modern Portfolio Theory applied to an emerging-market context.',                                        scheduledDate: daysFrom(21),duration: '60 min',  mentor: 'Dr. Sarah Thompson', done: false, rating: null },
  { id: 'sess6', topic: 'Final Presentation & Review',     description: 'Present your capstone valuation. Your mentor will score it against the rubric.',                       scheduledDate: daysFrom(42),duration: '120 min', mentor: 'Dr. Sarah Thompson', done: false, rating: null },
];

const INITIAL_MODULES = [
  { id: 'mod1', title: 'Financial Statements & Ratios', scheduledStart: daysAgo(42),  scheduledEnd: daysAgo(29),   done: true  },
  { id: 'mod2', title: 'Time Value of Money',           scheduledStart: daysAgo(28),  scheduledEnd: daysAgo(15),   done: true  },
  { id: 'mod3', title: 'Company Valuation (DCF)',       scheduledStart: daysAgo(14),  scheduledEnd: daysFrom(7),   done: false },
  { id: 'mod4', title: 'Comparable Analysis',           scheduledStart: daysFrom(8),  scheduledEnd: daysFrom(21),  done: false },
  { id: 'mod5', title: 'Portfolio Management',          scheduledStart: daysFrom(22), scheduledEnd: daysFrom(35),  done: false },
  { id: 'mod6', title: 'Capstone Project',              scheduledStart: daysFrom(36), scheduledEnd: daysFrom(49),  done: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function isPast(iso)   { return new Date(iso) <= new Date(); }
function daysUntil(iso) {
  const diff = Math.ceil((new Date(iso) - new Date()) / 86400000);
  if (diff < 0)  return null;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#E53E3E','#F6AD55','#68D391','#63B3ED','#B794F4','#FC8181','#F6E05E'];

function ConfettiParticle({ delay, color, startX }) {
  const translateY = useRef(new Animated.Value(-30)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate     = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 120;
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 1,        duration: 100,                                     useNativeDriver: true }),
        Animated.timing(translateY, { toValue: SH * 1.1, duration: 2400 + Math.random() * 800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateX, { toValue: drift,    duration: 2400 + Math.random() * 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(rotate,     { toValue: 4,        duration: 2400,                                    useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(1800),
          Animated.timing(opacity,  { toValue: 0,        duration: 600,                                     useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin     = rotate.interpolate({ inputRange: [0, 4], outputRange: ['0deg', '1440deg'] });
  const isCircle = Math.random() > 0.5;

  return (
    <Animated.View style={{
      position: 'absolute', top: -30, left: startX,
      width: isCircle ? 8 : 12, height: isCircle ? 8 : 6,
      borderRadius: isCircle ? 4 : 2,
      backgroundColor: color,
      transform: [{ translateY }, { translateX }, { rotate: spin }],
      opacity,
    }} />
  );
}

function ConfettiOverlay({ visible, onDone }) {
  const particles = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i, delay: Math.random() * 800,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      startX: Math.random() * SW,
    }))
  ).current;

  useEffect(() => {
    if (visible) { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }
  }, [visible]);

  if (!visible) return null;
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((p) => <ConfettiParticle key={p.id} {...p} />)}
    </View>
  );
}

// ─── Celebration modal ────────────────────────────────────────────────────────
function CelebrationModal({ visible, onClose, colors }) {
  const scale   = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else { scale.setValue(0.6); opacity.setValue(0); }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <ConfettiOverlay visible={visible} onDone={() => {}} />
      <Animated.View style={[styles.celebOverlay, { opacity }]}>
        <Animated.View style={[styles.celebCard, { backgroundColor: colors.surface, transform: [{ scale }] }]}>
          <Text style={styles.celebEmoji}>🎓</Text>
          <Text style={[styles.celebTitle, { color: colors.textPrimary }]}>Mentorship Complete!</Text>
          <Text style={[styles.celebBody,  { color: colors.textSecondary }]}>
            You've finished every module and session. Incredible work, Alexandra — you've earned this.
          </Text>
          <View style={[styles.celebStats, { backgroundColor: colors.surfaceAlt }]}>
            {[['6','Modules'],['6','Sessions'],['12wk','Journey']].map(([num, label], i) => (
              <React.Fragment key={label}>
                {i > 0 && <View style={[styles.celebStatDivider, { backgroundColor: colors.divider }]} />}
                <View style={styles.celebStat}>
                  <Text style={[styles.celebStatNum,   { color: colors.textPrimary }]}>{num}</Text>
                  <Text style={[styles.celebStatLabel, { color: colors.textSecondary }]}>{label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
          <TouchableOpacity style={[styles.celebBtn, { backgroundColor: colors.primary }]} onPress={onClose} activeOpacity={0.85}>
            <Text style={[styles.celebBtnText, { color: colors.white }]}>Share My Story →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={[styles.celebSkip, { color: colors.textSecondary }]}>Maybe later</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ─── Star rating ──────────────────────────────────────────────────────────────
function StarRating({ value, onRate, readonly }) {
  return (
    <View style={styles.starRow}>
      {[1,2,3,4,5].map((n) => (
        <TouchableOpacity key={n} onPress={() => !readonly && onRate(n)} activeOpacity={readonly ? 1 : 0.7} style={{ padding: 2 }}>
          <Star size={18} color={n <= (value || 0) ? '#F59E0B' : '#D1D5DB'} fill={n <= (value || 0) ? '#F59E0B' : 'none'} strokeWidth={1.8} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Session card ─────────────────────────────────────────────────────────────
function SessionCard({ session, index, total, onComplete, onRate, colors }) {
  const [expanded, setExpanded] = useState(false);
  const canComplete = isPast(session.scheduledDate) && !session.done;
  const upcoming    = daysUntil(session.scheduledDate);

  return (
    <View style={[styles.sessionCard, session.done && styles.sessionCardDone]}>
      {/* Timeline spine */}
      <View style={styles.sessionSpine}>
        <View style={[
          styles.sessionDot,
          { backgroundColor: colors.surfaceAlt },
          session.done  && { backgroundColor: '#22C55E' },
          canComplete   && { backgroundColor: colors.primary },
        ]}>
          {session.done
            ? <CheckCircle2 size={16} color={colors.white} strokeWidth={2.5} />
            : <Text style={[styles.sessionDotNum, { color: colors.textSecondary }]}>{index + 1}</Text>
          }
        </View>
        {index < total - 1 && (
          <View style={[styles.sessionLine, { backgroundColor: colors.divider }, session.done && { backgroundColor: '#22C55E' }]} />
        )}
      </View>

      {/* Card body */}
      <View style={styles.sessionBody}>
        {!session.done && upcoming && (
          <View style={styles.upcomingChip}>
            <Clock size={11} color="#6366F1" strokeWidth={2} />
            <Text style={styles.upcomingChipText}>{upcoming}</Text>
          </View>
        )}

        <TouchableOpacity onPress={() => setExpanded((e) => !e)} activeOpacity={0.8} style={styles.sessionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sessionTopic, { color: session.done ? colors.textSecondary : colors.textPrimary }]}>
              {session.topic}
            </Text>
            <View style={styles.sessionMeta}>
              <CalendarDays size={12} color={colors.textSecondary} strokeWidth={1.8} />
              <Text style={[styles.sessionMetaText, { color: colors.textSecondary }]}>{formatDate(session.scheduledDate)}</Text>
              <Text style={[styles.sessionMetaDot,  { color: colors.textSecondary }]}>·</Text>
              <Clock        size={12} color={colors.textSecondary} strokeWidth={1.8} />
              <Text style={[styles.sessionMetaText, { color: colors.textSecondary }]}>{session.duration}</Text>
            </View>
          </View>
          {expanded
            ? <ChevronUp   size={16} color={colors.textSecondary} strokeWidth={2} />
            : <ChevronDown size={16} color={colors.textSecondary} strokeWidth={2} />
          }
        </TouchableOpacity>

        {expanded && (
          <View style={[styles.sessionExpanded, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
            <Text style={[styles.sessionDesc,   { color: colors.textPrimary }]}>{session.description}</Text>
            <Text style={[styles.sessionMentor, { color: colors.textSecondary }]}>with {session.mentor}</Text>

            {session.done && (
              <View style={[styles.ratingRow, { borderTopColor: colors.divider }]}>
                <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Your rating</Text>
                <StarRating value={session.rating} onRate={(r) => onRate(session.id, r)} readonly={!!session.rating} />
              </View>
            )}

            {canComplete && (
              <TouchableOpacity style={[styles.completeBtn, { backgroundColor: colors.primary }]} onPress={() => onComplete(session.id)} activeOpacity={0.85}>
                <CheckCircle2 size={16} color={colors.white} strokeWidth={2.5} />
                <Text style={[styles.completeBtnText, { color: colors.white }]}>Mark session complete</Text>
              </TouchableOpacity>
            )}

            {!session.done && !canComplete && (
              <View style={[styles.lockedNote, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                <Lock size={13} color={colors.textSecondary} strokeWidth={2} />
                <Text style={[styles.lockedNoteText, { color: colors.textSecondary }]}>
                  Available on {formatDate(session.scheduledDate)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Module timeline card ─────────────────────────────────────────────────────
function ModuleTimelineCard({ module, index, total, isUnlocked, onFinish, colors }) {
  const isInWindow = isPast(module.scheduledStart) && !isPast(module.scheduledEnd);
  const isPastEnd  = isPast(module.scheduledEnd);
  const upcoming   = daysUntil(module.scheduledStart);

  return (
    <View style={styles.modRow}>
      <View style={styles.modSpine}>
        <View style={[
          styles.modDot,
          { backgroundColor: colors.surfaceAlt },
          module.done              && { backgroundColor: '#22C55E' },
          isInWindow && !module.done && { backgroundColor: colors.primary },
          !isUnlocked              && { backgroundColor: colors.surfaceAlt },
        ]}>
          {module.done
            ? <CheckCircle2 size={14} color={colors.white} strokeWidth={2.5} />
            : isUnlocked
              ? <Text style={[styles.modDotNum, { color: colors.white }]}>{index + 1}</Text>
              : <Lock size={12} color={colors.textSecondary} strokeWidth={2} />
          }
        </View>
        {index < total - 1 && (
          <View style={[styles.modLine, { backgroundColor: colors.divider }, module.done && { backgroundColor: '#22C55E' }]} />
        )}
      </View>

      <View style={[styles.modContent, !isUnlocked && styles.modContentLocked]}>
        {isInWindow && !module.done && (
          <View style={styles.activeModBadge}>
            <Text style={styles.activeModBadgeText}>Current</Text>
          </View>
        )}

        <View style={styles.modTitleRow}>
          <BookOpen size={14} color={module.done ? '#22C55E' : isUnlocked ? colors.textPrimary : colors.textSecondary} strokeWidth={2} />
          <Text style={[
            styles.modTitle,
            { color: colors.textPrimary },
            module.done    && { color: colors.textSecondary, textDecorationLine: 'line-through' },
            !isUnlocked    && { color: colors.textSecondary },
          ]}>
            {module.title}
          </Text>
        </View>

        <View style={styles.modDateRow}>
          <Text style={[styles.modDate, { color: colors.textSecondary }]}>
            {formatDate(module.scheduledStart)} — {formatDate(module.scheduledEnd)}
          </Text>
          {!module.done && !isUnlocked && <Text style={[styles.modLockedText, { color: colors.textSecondary }]}>Locked</Text>}
          {upcoming && !module.done && isUnlocked && <Text style={styles.modUpcoming}>{upcoming}</Text>}
        </View>

        {isUnlocked && !module.done && (isPastEnd || isInWindow) && (
          <TouchableOpacity style={styles.finishBtn} onPress={() => onFinish(module.id)} activeOpacity={0.85}>
            <CheckCircle2 size={15} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.finishBtnText}>I've finished this module</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function GoalsProgressScreen() {
  const colors = useColors();
  const [sessions,      setSessions]      = useState(INITIAL_SESSIONS);
  const [modules,       setModules]       = useState(INITIAL_MODULES);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [activeSection, setActiveSection] = useState('sessions');

  const doneSessions = sessions.filter((s) => s.done).length;
  const doneModules  = modules.filter((m)  => m.done).length;
  const overall      = Math.round(((doneSessions / sessions.length) * 0.4 + (doneModules / modules.length) * 0.6) * 100);
  const streak       = doneSessions >= 2 ? 2 : doneSessions;
  const nextSession  = sessions.find((s) => !s.done);

  function handleCompleteSession(id) {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, done: true } : s));
  }
  function handleRateSession(id, rating) {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, rating } : s));
  }
  function handleFinishModule(id) {
    const idx        = modules.findIndex((m) => m.id === id);
    const updatedDone = modules.filter((m) => m.done).length + 1;
    setModules((prev) => prev.map((m, i) => i === idx ? { ...m, done: true } : m));
    if (updatedDone === modules.length && sessions.every((s) => s.done)) {
      setTimeout(() => setShowCelebrate(true), 400);
    }
  }
  function isModuleUnlocked(i) { return i === 0 || modules[i - 1].done; }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surfaceAlt }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Hero stats bar ── */}
        <View style={[styles.heroBar, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
          <View style={styles.heroStat}>
            <Text style={[styles.heroStatNum, { color: colors.textPrimary }]}>{overall}%</Text>
            <Text style={[styles.heroStatLabel, { color: colors.textSecondary }]}>Overall</Text>
          </View>
          <View style={[styles.heroStatDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.heroStat}>
            <Text style={[styles.heroStatNum, { color: colors.textPrimary }]}>{doneModules}/{modules.length}</Text>
            <Text style={[styles.heroStatLabel, { color: colors.textSecondary }]}>Modules</Text>
          </View>
          <View style={[styles.heroStatDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.heroStat}>
            <Text style={[styles.heroStatNum, { color: colors.textPrimary }]}>{doneSessions}/{sessions.length}</Text>
            <Text style={[styles.heroStatLabel, { color: colors.textSecondary }]}>Sessions</Text>
          </View>
          <View style={[styles.heroStatDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.heroStat}>
            <Flame size={16} color="#F97316" strokeWidth={2} />
            <Text style={[styles.heroStatNum, { color: '#F97316' }]}>{streak}wk</Text>
            <Text style={[styles.heroStatLabel, { color: colors.textSecondary }]}>Streak</Text>
          </View>
        </View>

        {/* Overall progress bar */}
        <View style={[styles.overallBarWrap, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
          <View style={[styles.overallBarTrack, { backgroundColor: colors.mediumGray }]}>
            <Animated.View style={[styles.overallBarFill, { width: `${overall}%`, backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.overallBarLabel, { color: colors.textSecondary }]}>{overall}% complete</Text>
        </View>

        {/* ── Next session countdown ── */}
        {nextSession && (
          <View style={[styles.nextSessionCard, { backgroundColor: colors.primary }]}>
            <View style={styles.nextSessionLeft}>
              <Text style={styles.nextSessionEyebrow}>Next session</Text>
              <Text style={styles.nextSessionTopic}>{nextSession.topic}</Text>
              <Text style={styles.nextSessionDate}>{formatDate(nextSession.scheduledDate)} · {nextSession.duration}</Text>
            </View>
            <View style={styles.nextSessionBadge}>
              <Text style={styles.nextSessionBadgeNum}>{daysUntil(nextSession.scheduledDate) || 'Available'}</Text>
            </View>
          </View>
        )}

        {/* ── Section toggle ── */}
        <View style={[styles.sectionToggle, { backgroundColor: colors.surfaceAlt }]}>
          {['sessions','modules'].map((sec) => (
            <TouchableOpacity
              key={sec}
              style={[
                styles.sectionToggleTab,
                activeSection === sec && [styles.sectionToggleTabActive, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }],
              ]}
              onPress={() => setActiveSection(sec)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.sectionToggleLabel,
                { color: activeSection === sec ? colors.textPrimary : colors.textSecondary },
                activeSection === sec && { fontWeight: '600' },
              ]}>
                {sec === 'sessions' ? 'Sessions' : 'Module Timeline'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Sessions ── */}
        {activeSection === 'sessions' && (
          <View style={styles.sectionBody}>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              Tap a session to expand details. Mark it complete once it's done — your mentor confirms on their side.
            </Text>
            {sessions.map((s, i) => (
              <SessionCard key={s.id} session={s} index={i} total={sessions.length}
                onComplete={handleCompleteSession} onRate={handleRateSession} colors={colors} />
            ))}
          </View>
        )}

        {/* ── Module timeline ── */}
        {activeSection === 'modules' && (
          <View style={styles.sectionBody}>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
              Modules unlock sequentially. Tap "I've finished this module" when you're ready — your mentor will review.
            </Text>
            {modules.map((m, i) => (
              <ModuleTimelineCard key={m.id} module={m} index={i} total={modules.length}
                isUnlocked={isModuleUnlocked(i)} onFinish={handleFinishModule} colors={colors} />
            ))}
          </View>
        )}

      </ScrollView>

      <CelebrationModal visible={showCelebrate} onClose={() => setShowCelebrate(false)} colors={colors} />
    </SafeAreaView>
  );
}

// ─── Styles — layout only ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea:      { flex: 1 },
  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  heroBar:         { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'space-around', borderBottomWidth: 1 },
  heroStat:        { alignItems: 'center', flex: 1 },
  heroStatNum:     { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  heroStatLabel:   { fontSize: 11, marginTop: 2 },
  heroStatDivider: { width: 1, height: 32 },

  overallBarWrap:  { paddingHorizontal: 20, paddingBottom: 14, paddingTop: 10, borderBottomWidth: 1 },
  overallBarTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  overallBarFill:  { height: 6, borderRadius: 3 },
  overallBarLabel: { fontSize: 11, marginTop: 5, textAlign: 'right' },

  nextSessionCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 16, borderRadius: 14, padding: 16,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  nextSessionLeft:    { flex: 1 },
  nextSessionEyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginBottom: 4 },
  nextSessionTopic:   { fontSize: 15, fontWeight: '700', color: '#FFFFFF', lineHeight: 20 },
  nextSessionDate:    { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  nextSessionBadge:   { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginLeft: 12, alignItems: 'center' },
  nextSessionBadgeNum:{ fontSize: 13, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },

  sectionToggle:           { flexDirection: 'row', marginHorizontal: 16, marginTop: 20, borderRadius: 10, padding: 3 },
  sectionToggleTab:        { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  sectionToggleTabActive:  { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2 },
  sectionToggleLabel:      { fontSize: 13, fontWeight: '500' },

  sectionBody: { marginTop: 16, paddingHorizontal: 16 },
  sectionHint: { fontSize: 12, marginBottom: 16, lineHeight: 17, paddingHorizontal: 2 },

  sessionCard:     { flexDirection: 'row', marginBottom: 0 },
  sessionCardDone: { opacity: 0.85 },
  sessionSpine:    { width: 40, alignItems: 'center' },
  sessionDot:      { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  sessionDotNum:   { fontSize: 13, fontWeight: '700' },
  sessionLine:     { width: 2, flex: 1, minHeight: 24, marginBottom: -2 },
  sessionBody:     { flex: 1, paddingBottom: 20, paddingLeft: 10 },
  upcomingChip:    { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: '#EEF2FF', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  upcomingChipText:{ fontSize: 11, color: '#6366F1', fontWeight: '600' },
  sessionHeader:   { flexDirection: 'row', alignItems: 'flex-start' },
  sessionTopic:    { fontSize: 14, fontWeight: '600', flex: 1, lineHeight: 20 },
  sessionMeta:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  sessionMetaText: { fontSize: 11 },
  sessionMetaDot:  { fontSize: 11 },
  sessionExpanded: { marginTop: 10, borderRadius: 12, padding: 14, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2 },
  sessionDesc:     { fontSize: 13, lineHeight: 19, marginBottom: 6 },
  sessionMentor:   { fontSize: 12, marginBottom: 10 },
  ratingRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, paddingTop: 8, borderTopWidth: 1 },
  ratingLabel:     { fontSize: 12 },
  starRow:         { flexDirection: 'row', gap: 2 },
  completeBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, paddingVertical: 11, marginTop: 10 },
  completeBtnText: { fontSize: 14, fontWeight: '600' },
  lockedNote:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1 },
  lockedNoteText:  { fontSize: 12 },

  modRow:            { flexDirection: 'row', marginBottom: 0 },
  modSpine:          { width: 40, alignItems: 'center' },
  modDot:            { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  modDotNum:         { fontSize: 12, fontWeight: '700' },
  modLine:           { width: 2, flex: 1, minHeight: 20 },
  modContent:        { flex: 1, paddingLeft: 10, paddingBottom: 20 },
  modContentLocked:  { opacity: 0.5 },
  activeModBadge:    { alignSelf: 'flex-start', backgroundColor: '#DCFCE7', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 5 },
  activeModBadgeText:{ fontSize: 11, fontWeight: '600', color: '#16A34A' },
  modTitleRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  modTitle:          { fontSize: 14, fontWeight: '600', flex: 1 },
  modDateRow:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modDate:           { fontSize: 12 },
  modLockedText:     { fontSize: 11, fontStyle: 'italic' },
  modUpcoming:       { fontSize: 11, color: '#6366F1', fontWeight: '500' },
  finishBtn:         { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', backgroundColor: '#DCFCE7', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginTop: 8, borderWidth: 1, borderColor: '#86EFAC' },
  finishBtnText:     { fontSize: 13, fontWeight: '600', color: '#16A34A' },

  celebOverlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  celebCard:         { borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', maxWidth: 340, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  celebEmoji:        { fontSize: 52, marginBottom: 12 },
  celebTitle:        { fontSize: 22, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 },
  celebBody:         { fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: 8, marginBottom: 20 },
  celebStats:        { flexDirection: 'row', borderRadius: 14, padding: 14, width: '100%', justifyContent: 'space-around', marginBottom: 20 },
  celebStat:         { alignItems: 'center' },
  celebStatNum:      { fontSize: 20, fontWeight: '800' },
  celebStatLabel:    { fontSize: 11, marginTop: 2 },
  celebStatDivider:  { width: 1 },
  celebBtn:          { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, width: '100%', alignItems: 'center', marginBottom: 10 },
  celebBtnText:      { fontSize: 15, fontWeight: '700' },
  celebSkip:         { fontSize: 13, paddingVertical: 4 },
});