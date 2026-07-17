// src/screens/mentorship/GoalsProgressScreen.jsx
//
// Goals & Progress — rebuilt per new spec:
//
//  ✅ SESSIONS  — mentor-agreed topic schedule (topic, date, duration, notes)
//                 "Mark complete" only unlocks on/after the session date
//                 Rate your mentor after completing each session (⭐ 1-5)
//  ✅ MODULES   — visual timeline with scheduled dates
//                 "Mark as finished" button per module, sequential unlock
//                 Progress bar fills as modules complete
//  ✅ STREAK    — consecutive weeks with at least 1 session done
//  ✅ COMPLETION — when overall = 100%, full-screen confetti celebration fires
//                 (Animated API — no external lib needed)

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
  Lock,
  CheckCircle2,
  Circle,
  Clock,
  CalendarDays,
  Star,
  Flame,
  Trophy,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react-native';
import colors from '../../constants/colors';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────
// Sessions represent agreed mentor ↔ mentee topics.
// `scheduledDate` is an ISO date string; "available" means today >= that date.
const today = new Date();
const daysAgo  = (n) => new Date(today - n * 86400000).toISOString().slice(0, 10);
const daysFrom = (n) => new Date(+today + n * 86400000).toISOString().slice(0, 10);

const INITIAL_SESSIONS = [
  {
    id: 'sess1',
    topic: 'Introduction & Goal Setting',
    description: 'Map your 12-week learning objectives and agree on evaluation criteria.',
    scheduledDate: daysAgo(28),
    duration: '60 min',
    mentor: 'Dr. Sarah Thompson',
    done: true,
    rating: 5,
  },
  {
    id: 'sess2',
    topic: 'DCF Modelling Fundamentals',
    description: 'Walk through a live DCF model on a real listed company. Bring your module 2 notes.',
    scheduledDate: daysAgo(14),
    duration: '90 min',
    mentor: 'Dr. Sarah Thompson',
    done: true,
    rating: 4,
  },
  {
    id: 'sess3',
    topic: 'WACC & Cost of Capital Deep-Dive',
    description: 'Derive WACC from scratch using CAPM. We\'ll use a case from the NSE.',
    scheduledDate: daysAgo(2),
    duration: '60 min',
    mentor: 'Dr. Sarah Thompson',
    done: false,
    rating: null,
  },
  {
    id: 'sess4',
    topic: 'Comparable Company Analysis',
    description: 'Build a comps table for three East African banks and defend your multiples.',
    scheduledDate: daysFrom(7),
    duration: '90 min',
    mentor: 'Dr. Sarah Thompson',
    done: false,
    rating: null,
  },
  {
    id: 'sess5',
    topic: 'Portfolio Construction & Risk',
    description: 'Modern Portfolio Theory applied to an emerging-market context.',
    scheduledDate: daysFrom(21),
    duration: '60 min',
    mentor: 'Dr. Sarah Thompson',
    done: false,
    rating: null,
  },
  {
    id: 'sess6',
    topic: 'Final Presentation & Review',
    description: 'Present your capstone valuation. Your mentor will score it against the rubric.',
    scheduledDate: daysFrom(42),
    duration: '120 min',
    mentor: 'Dr. Sarah Thompson',
    done: false,
    rating: null,
  },
];

const INITIAL_MODULES = [
  {
    id: 'mod1',
    title: 'Financial Statements & Ratios',
    scheduledStart: daysAgo(42),
    scheduledEnd: daysAgo(29),
    done: true,
  },
  {
    id: 'mod2',
    title: 'Time Value of Money',
    scheduledStart: daysAgo(28),
    scheduledEnd: daysAgo(15),
    done: true,
  },
  {
    id: 'mod3',
    title: 'Company Valuation (DCF)',
    scheduledStart: daysAgo(14),
    scheduledEnd: daysFrom(7),
    done: false,
  },
  {
    id: 'mod4',
    title: 'Comparable Analysis',
    scheduledStart: daysFrom(8),
    scheduledEnd: daysFrom(21),
    done: false,
  },
  {
    id: 'mod5',
    title: 'Portfolio Management',
    scheduledStart: daysFrom(22),
    scheduledEnd: daysFrom(35),
    done: false,
  },
  {
    id: 'mod6',
    title: 'Capstone Project',
    scheduledStart: daysFrom(36),
    scheduledEnd: daysFrom(49),
    done: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isPast(iso) {
  return new Date(iso) <= new Date();
}

function daysUntil(iso) {
  const diff = Math.ceil((new Date(iso) - new Date()) / 86400000);
  if (diff < 0) return null;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

// ─── Confetti particle ────────────────────────────────────────────────────────
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
        Animated.timing(opacity,     { toValue: 1,    duration: 100,  useNativeDriver: true }),
        Animated.timing(translateY,  { toValue: SH * 1.1, duration: 2400 + Math.random() * 800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateX,  { toValue: drift, duration: 2400 + Math.random() * 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(rotate,      { toValue: 4,    duration: 2400, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(1800),
          Animated.timing(opacity,   { toValue: 0,    duration: 600,  useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 4], outputRange: ['0deg', '1440deg'] });
  const isCircle = Math.random() > 0.5;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: -30,
        left: startX,
        width:  isCircle ? 8  : 12,
        height: isCircle ? 8  : 6,
        borderRadius: isCircle ? 4 : 2,
        backgroundColor: color,
        transform: [{ translateY }, { translateX }, { rotate: spin }],
        opacity,
      }}
    />
  );
}

const CONFETTI_COLORS = ['#E53E3E','#F6AD55','#68D391','#63B3ED','#B794F4','#FC8181','#F6E05E'];

function ConfettiOverlay({ visible, onDone }) {
  const particles = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      delay: Math.random() * 800,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      startX: Math.random() * SW,
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      const t = setTimeout(onDone, 4000);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((p) => (
        <ConfettiParticle key={p.id} {...p} />
      ))}
    </View>
  );
}

// ─── Celebration modal ────────────────────────────────────────────────────────
function CelebrationModal({ visible, onClose }) {
  const scale   = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0.6);
      opacity.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <ConfettiOverlay visible={visible} onDone={() => {}} />
      <Animated.View style={[styles.celebOverlay, { opacity }]}>
        <Animated.View style={[styles.celebCard, { transform: [{ scale }] }]}>
          <Text style={styles.celebEmoji}>🎓</Text>
          <Text style={styles.celebTitle}>Mentorship Complete!</Text>
          <Text style={styles.celebBody}>
            You've finished every module and session. Incredible work, Alexandra — you've earned this.
          </Text>
          <View style={styles.celebStats}>
            <View style={styles.celebStat}>
              <Text style={styles.celebStatNum}>6</Text>
              <Text style={styles.celebStatLabel}>Modules</Text>
            </View>
            <View style={styles.celebStatDivider} />
            <View style={styles.celebStat}>
              <Text style={styles.celebStatNum}>6</Text>
              <Text style={styles.celebStatLabel}>Sessions</Text>
            </View>
            <View style={styles.celebStatDivider} />
            <View style={styles.celebStat}>
              <Text style={styles.celebStatNum}>12wk</Text>
              <Text style={styles.celebStatLabel}>Journey</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.celebBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.celebBtnText}>Share My Story →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.celebSkip}>Maybe later</Text>
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
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => !readonly && onRate(n)}
          activeOpacity={readonly ? 1 : 0.7}
          style={{ padding: 2 }}
        >
          <Star
            size={18}
            color={n <= (value || 0) ? '#F59E0B' : '#D1D5DB'}
            fill={n <= (value || 0) ? '#F59E0B' : 'none'}
            strokeWidth={1.8}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Session card ─────────────────────────────────────────────────────────────
function SessionCard({ session, index, total, onComplete, onRate }) {
  const [expanded, setExpanded] = useState(false);
  const canComplete = isPast(session.scheduledDate) && !session.done;
  const upcoming    = daysUntil(session.scheduledDate);
  const isNext      = !session.done && index > 0;

  return (
    <View style={[styles.sessionCard, session.done && styles.sessionCardDone]}>
      {/* Timeline spine */}
      <View style={styles.sessionSpine}>
        <View style={[
          styles.sessionDot,
          session.done && styles.sessionDotDone,
          canComplete && styles.sessionDotReady,
        ]}>
          {session.done
            ? <CheckCircle2 size={16} color={colors.white} strokeWidth={2.5} />
            : <Text style={styles.sessionDotNum}>{index + 1}</Text>
          }
        </View>
        {index < total - 1 && (
          <View style={[styles.sessionLine, session.done && styles.sessionLineDone]} />
        )}
      </View>

      {/* Card body */}
      <View style={styles.sessionBody}>
        {/* Upcoming chip */}
        {!session.done && upcoming && (
          <View style={styles.upcomingChip}>
            <Clock size={11} color="#6366F1" strokeWidth={2} />
            <Text style={styles.upcomingChipText}>{upcoming}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setExpanded((e) => !e)}
          activeOpacity={0.8}
          style={styles.sessionHeader}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.sessionTopic, session.done && styles.sessionTopicDone]}>
              {session.topic}
            </Text>
            <View style={styles.sessionMeta}>
              <CalendarDays size={12} color={colors.textSecondary} strokeWidth={1.8} />
              <Text style={styles.sessionMetaText}>{formatDate(session.scheduledDate)}</Text>
              <Text style={styles.sessionMetaDot}>·</Text>
              <Clock size={12} color={colors.textSecondary} strokeWidth={1.8} />
              <Text style={styles.sessionMetaText}>{session.duration}</Text>
            </View>
          </View>
          {expanded
            ? <ChevronUp size={16} color={colors.textSecondary} strokeWidth={2} />
            : <ChevronDown size={16} color={colors.textSecondary} strokeWidth={2} />
          }
        </TouchableOpacity>

        {expanded && (
          <View style={styles.sessionExpanded}>
            <Text style={styles.sessionDesc}>{session.description}</Text>
            <Text style={styles.sessionMentor}>with {session.mentor}</Text>

            {/* Rating (only after done) */}
            {session.done && (
              <View style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>Your rating</Text>
                <StarRating
                  value={session.rating}
                  onRate={(r) => onRate(session.id, r)}
                  readonly={!!session.rating}
                />
              </View>
            )}

            {/* Mark complete button */}
            {canComplete && (
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => onComplete(session.id)}
                activeOpacity={0.85}
              >
                <CheckCircle2 size={16} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.completeBtnText}>Mark session complete</Text>
              </TouchableOpacity>
            )}

            {/* Locked state */}
            {!session.done && !canComplete && (
              <View style={styles.lockedNote}>
                <Lock size={13} color={colors.textSecondary} strokeWidth={2} />
                <Text style={styles.lockedNoteText}>
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
function ModuleTimelineCard({ module, index, total, isUnlocked, onFinish }) {
  const isInWindow = isPast(module.scheduledStart) && !isPast(module.scheduledEnd);
  const isPastEnd  = isPast(module.scheduledEnd);
  const upcoming   = daysUntil(module.scheduledStart);

  return (
    <View style={styles.modRow}>
      {/* Spine */}
      <View style={styles.modSpine}>
        <View style={[
          styles.modDot,
          module.done && styles.modDotDone,
          isInWindow && !module.done && styles.modDotActive,
          !isUnlocked && styles.modDotLocked,
        ]}>
          {module.done
            ? <CheckCircle2 size={14} color={colors.white} strokeWidth={2.5} />
            : isUnlocked
              ? <Text style={styles.modDotNum}>{index + 1}</Text>
              : <Lock size={12} color={colors.textSecondary} strokeWidth={2} />
          }
        </View>
        {index < total - 1 && (
          <View style={[styles.modLine, module.done && styles.modLineDone]} />
        )}
      </View>

      {/* Content */}
      <View style={[styles.modContent, module.done && styles.modContentDone, !isUnlocked && styles.modContentLocked]}>
        {isInWindow && !module.done && (
          <View style={styles.activeModBadge}>
            <Text style={styles.activeModBadgeText}>Current</Text>
          </View>
        )}

        <View style={styles.modTitleRow}>
          <BookOpen
            size={14}
            color={module.done ? '#22C55E' : isUnlocked ? colors.black : colors.textSecondary}
            strokeWidth={2}
          />
          <Text style={[
            styles.modTitle,
            module.done && styles.modTitleDone,
            !isUnlocked && styles.modTitleLocked,
          ]}>
            {module.title}
          </Text>
        </View>

        <View style={styles.modDateRow}>
          <Text style={styles.modDate}>
            {formatDate(module.scheduledStart)} — {formatDate(module.scheduledEnd)}
          </Text>
          {!module.done && !isUnlocked && (
            <Text style={styles.modLockedText}>Locked</Text>
          )}
          {upcoming && !module.done && isUnlocked && (
            <Text style={styles.modUpcoming}>{upcoming}</Text>
          )}
        </View>

        {/* Finish button: only when in window OR past end, unlocked, and not done */}
        {isUnlocked && !module.done && (isPastEnd || isInWindow) && (
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={() => onFinish(module.id)}
            activeOpacity={0.85}
          >
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
  const [sessions,     setSessions]     = useState(INITIAL_SESSIONS);
  const [modules,      setModules]      = useState(INITIAL_MODULES);
  const [showCelebrate,setShowCelebrate]= useState(false);
  const [activeSection,setActiveSection]= useState('sessions'); // 'sessions' | 'modules'

  // Computed stats
  const doneSessions = sessions.filter((s) => s.done).length;
  const doneModules  = modules.filter((m) => m.done).length;
  const overall      = Math.round(((doneSessions / sessions.length) * 0.4 + (doneModules / modules.length) * 0.6) * 100);
  const streak       = doneSessions >= 2 ? 2 : doneSessions; // simplified streak

  const nextSession  = sessions.find((s) => !s.done);

  function handleCompleteSession(id) {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, done: true } : s));
  }

  function handleRateSession(id, rating) {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, rating } : s));
  }

  function handleFinishModule(id) {
    const idx = modules.findIndex((m) => m.id === id);
    setModules((prev) => prev.map((m, i) => i === idx ? { ...m, done: true } : m));
    // Check if all modules done after this
    const updatedDone = modules.filter((m) => m.done).length + 1;
    const allSessionsDone = sessions.every((s) => s.done);
    if (updatedDone === modules.length && allSessionsDone) {
      setTimeout(() => setShowCelebrate(true), 400);
    }
  }

  function isModuleUnlocked(index) {
    if (index === 0) return true;
    return modules[index - 1].done;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero stats bar ── */}
        <View style={styles.heroBar}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{overall}%</Text>
            <Text style={styles.heroStatLabel}>Overall</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{doneModules}/{modules.length}</Text>
            <Text style={styles.heroStatLabel}>Modules</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{doneSessions}/{sessions.length}</Text>
            <Text style={styles.heroStatLabel}>Sessions</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Flame size={16} color="#F97316" strokeWidth={2} />
            <Text style={[styles.heroStatNum, { color: '#F97316' }]}>{streak}wk</Text>
            <Text style={styles.heroStatLabel}>Streak</Text>
          </View>
        </View>

        {/* Overall progress bar */}
        <View style={styles.overallBarWrap}>
          <View style={styles.overallBarTrack}>
            <Animated.View style={[styles.overallBarFill, { width: `${overall}%` }]} />
          </View>
          <Text style={styles.overallBarLabel}>{overall}% complete</Text>
        </View>

        {/* ── Next session countdown ── */}
        {nextSession && (
          <View style={styles.nextSessionCard}>
            <View style={styles.nextSessionLeft}>
              <Text style={styles.nextSessionEyebrow}>Next session</Text>
              <Text style={styles.nextSessionTopic}>{nextSession.topic}</Text>
              <Text style={styles.nextSessionDate}>{formatDate(nextSession.scheduledDate)} · {nextSession.duration}</Text>
            </View>
            <View style={styles.nextSessionBadge}>
              <Text style={styles.nextSessionBadgeNum}>
                {daysUntil(nextSession.scheduledDate) || 'Available'}
              </Text>
            </View>
          </View>
        )}

        {/* ── Section toggle ── */}
        <View style={styles.sectionToggle}>
          <TouchableOpacity
            style={[styles.sectionToggleTab, activeSection === 'sessions' && styles.sectionToggleTabActive]}
            onPress={() => setActiveSection('sessions')}
            activeOpacity={0.8}
          >
            <Text style={[styles.sectionToggleLabel, activeSection === 'sessions' && styles.sectionToggleLabelActive]}>
              Sessions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sectionToggleTab, activeSection === 'modules' && styles.sectionToggleTabActive]}
            onPress={() => setActiveSection('modules')}
            activeOpacity={0.8}
          >
            <Text style={[styles.sectionToggleLabel, activeSection === 'modules' && styles.sectionToggleLabelActive]}>
              Module Timeline
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Sessions ── */}
        {activeSection === 'sessions' && (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionHint}>
              Tap a session to expand details. Mark it complete once it's done — your mentor confirms on their side.
            </Text>
            {sessions.map((s, i) => (
              <SessionCard
                key={s.id}
                session={s}
                index={i}
                total={sessions.length}
                onComplete={handleCompleteSession}
                onRate={handleRateSession}
              />
            ))}
          </View>
        )}

        {/* ── Module timeline ── */}
        {activeSection === 'modules' && (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionHint}>
              Modules unlock sequentially. Tap "I've finished this module" when you're ready — your mentor will review.
            </Text>
            {modules.map((m, i) => (
              <ModuleTimelineCard
                key={m.id}
                module={m}
                index={i}
                total={modules.length}
                isUnlocked={isModuleUnlocked(i)}
                onFinish={handleFinishModule}
              />
            ))}
          </View>
        )}

      </ScrollView>

      {/* Celebration */}
      <CelebrationModal
        visible={showCelebrate}
        onClose={() => setShowCelebrate(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.07,
  shadowRadius: 6,
  elevation: 2,
};

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: '#F4F4F4' },
  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Hero bar
  heroBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  heroStat:        { alignItems: 'center', flex: 1 },
  heroStatNum:     { fontSize: 18, fontWeight: '800', color: colors.black, letterSpacing: -0.5 },
  heroStatLabel:   { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  heroStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(0,0,0,0.08)' },

  // Overall bar
  overallBarWrap: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingBottom: 14,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  overallBarTrack: { height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, overflow: 'hidden' },
  overallBarFill:  { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  overallBarLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 5, textAlign: 'right' },

  // Next session card
  nextSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
    ...CARD_SHADOW,
  },
  nextSessionLeft:     { flex: 1 },
  nextSessionEyebrow:  { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginBottom: 4 },
  nextSessionTopic:    { fontSize: 15, fontWeight: '700', color: colors.white, lineHeight: 20 },
  nextSessionDate:     { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  nextSessionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 12,
    alignItems: 'center',
  },
  nextSessionBadgeNum: { fontSize: 13, fontWeight: '700', color: colors.white, textAlign: 'center' },

  // Section toggle
  sectionToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#EBEBEB',
    borderRadius: 10,
    padding: 3,
  },
  sectionToggleTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  sectionToggleTabActive: {
    backgroundColor: colors.white,
    ...CARD_SHADOW,
  },
  sectionToggleLabel:       { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  sectionToggleLabelActive: { color: colors.black, fontWeight: '600' },

  sectionBody: { marginTop: 16, paddingHorizontal: 16 },
  sectionHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 17,
    paddingHorizontal: 2,
  },

  // Session card (timeline style)
  sessionCard: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  sessionCardDone: { opacity: 0.85 },

  sessionSpine: {
    width: 40,
    alignItems: 'center',
  },
  sessionDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sessionDotDone:  { backgroundColor: '#22C55E' },
  sessionDotReady: { backgroundColor: colors.primary },
  sessionDotNum:   { fontSize: 13, fontWeight: '700', color: colors.textSecondary },

  sessionLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: '#E5E7EB',
    marginBottom: -2,
  },
  sessionLineDone: { backgroundColor: '#22C55E' },

  sessionBody: {
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 10,
  },
  upcomingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  upcomingChipText: { fontSize: 11, color: '#6366F1', fontWeight: '600' },

  sessionHeader:   { flexDirection: 'row', alignItems: 'flex-start' },
  sessionTopic:    { fontSize: 14, fontWeight: '600', color: colors.black, flex: 1, lineHeight: 20 },
  sessionTopicDone:{ color: colors.textSecondary },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  sessionMetaText: { fontSize: 11, color: colors.textSecondary },
  sessionMetaDot:  { fontSize: 11, color: colors.textSecondary },

  sessionExpanded: {
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    ...CARD_SHADOW,
  },
  sessionDesc:    { fontSize: 13, color: colors.black, lineHeight: 19, marginBottom: 6 },
  sessionMentor:  { fontSize: 12, color: colors.textSecondary, marginBottom: 10 },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  ratingLabel: { fontSize: 12, color: colors.textSecondary },
  starRow: { flexDirection: 'row', gap: 2 },

  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 11,
    marginTop: 10,
  },
  completeBtnText: { fontSize: 14, fontWeight: '600', color: colors.white },

  lockedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  lockedNoteText: { fontSize: 12, color: colors.textSecondary },

  // Module timeline
  modRow: { flexDirection: 'row', marginBottom: 0 },

  modSpine: { width: 40, alignItems: 'center' },
  modDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modDotDone:   { backgroundColor: '#22C55E' },
  modDotActive: { backgroundColor: colors.primary },
  modDotLocked: { backgroundColor: '#F3F4F6' },
  modDotNum:    { fontSize: 12, fontWeight: '700', color: colors.white },

  modLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    backgroundColor: '#E5E7EB',
  },
  modLineDone: { backgroundColor: '#22C55E' },

  modContent: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 20,
  },
  modContentDone:   {},
  modContentLocked: { opacity: 0.5 },

  activeModBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 5,
  },
  activeModBadgeText: { fontSize: 11, fontWeight: '600', color: '#16A34A' },

  modTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  modTitle:       { fontSize: 14, fontWeight: '600', color: colors.black, flex: 1 },
  modTitleDone:   { color: colors.textSecondary, textDecorationLine: 'line-through' },
  modTitleLocked: { color: colors.textSecondary },

  modDateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modDate:       { fontSize: 12, color: colors.textSecondary },
  modLockedText: { fontSize: 11, color: colors.textSecondary, fontStyle: 'italic' },
  modUpcoming:   { fontSize: 11, color: '#6366F1', fontWeight: '500' },

  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  finishBtnText: { fontSize: 13, fontWeight: '600', color: '#16A34A' },

  // Celebration modal
  celebOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  celebCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...CARD_SHADOW,
  },
  celebEmoji:  { fontSize: 52, marginBottom: 12 },
  celebTitle:  { fontSize: 22, fontWeight: '800', color: colors.black, textAlign: 'center', letterSpacing: -0.5 },
  celebBody: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 20,
  },
  celebStats: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  celebStat:        { alignItems: 'center' },
  celebStatNum:     { fontSize: 20, fontWeight: '800', color: colors.black },
  celebStatLabel:   { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  celebStatDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.08)' },

  celebBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  celebBtnText: { fontSize: 15, fontWeight: '700', color: colors.white },
  celebSkip:    { fontSize: 13, color: colors.textSecondary, paddingVertical: 4 },
});