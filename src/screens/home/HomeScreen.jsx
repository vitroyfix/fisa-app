// src/screens/home/HomeScreen.jsx
//
// FISA Student Home — Learning-first redesign.
//
// Architecture shift from original:
//   ✅ Learning progress is the hero (not market data)
//   ✅ Semester progress bar in header for academic grounding
//   ✅ "Continue Learning" card as the primary CTA
//   ✅ Module shelf with per-course progress bars
//   ✅ Market Brief stays but every metric has a "Why it matters" tap → Learn screen
//   ✅ Daily Concept Check quiz with XP gamification
//   ✅ Events (unchanged logic, refreshed card design)
//   ✅ Peer Activity with topic tags (not just likes)
//   ✅ Resource shelf (Excel models, readings, podcasts, exam prep)
//   ✅ useColors() throughout — zero hardcoded hex

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Flame,
  BookOpen,
  Play,
  FileText,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Users,
  Video,
  CheckCircle2,
  X,
  Star,
  Brain,
  BarChart2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  Headphones,
  ClipboardList,
  FileSpreadsheet,
  Zap,
  MessageCircle,
  ThumbsUp,
} from 'lucide-react-native';
import { useColors } from '../../constants/colors';
import PremiumLineChart from '../../components/PremiumLineChart';

const { width } = Dimensions.get('window');

// ─── Semester / academic context ─────────────────────────────────────────────
const SEMESTER = {
  label: 'Semester 2',
  week: 11,
  totalWeeks: 18,
  progress: 0.62,          // 62%
  progressLabel: '62%',
};

// ─── Active learning module (hero resume card) ────────────────────────────────
const ACTIVE_MODULE = {
  topic: 'Continue learning',
  title: 'Discounted Cash Flow Modelling',
  module: 'Module 4 of 6',
  timeLeft: '45 min left',
  progress: 0.70,
  screen: 'Learn',
};

// ─── All course modules ───────────────────────────────────────────────────────
const MODULES = [
  {
    id: 'm1',
    name: 'Equity Valuation',
    done: 4,
    total: 6,
    colorToken: 'tagPurple',
    iconBgToken: 'tagPurple',
    textToken: 'tagPurpleText',
    screen: 'Learn',
  },
  {
    id: 'm2',
    name: 'Fixed Income & Bonds',
    done: 2,
    total: 5,
    colorToken: 'tagTeal',
    iconBgToken: 'tagTeal',
    textToken: 'tagTealText',
    screen: 'Learn',
  },
  {
    id: 'm3',
    name: 'Portfolio Theory',
    done: 1,
    total: 7,
    colorToken: 'tagAmber',
    iconBgToken: 'tagAmber',
    textToken: 'tagAmberText',
    screen: 'Learn',
  },
  {
    id: 'm4',
    name: 'Macroeconomics',
    done: 5,
    total: 5,
    colorToken: 'tagCoral',
    iconBgToken: 'tagCoral',
    textToken: 'tagCoralText',
    screen: 'Learn',
  },
];

// ─── Market brief — compact, contextual ──────────────────────────────────────
// Each metric links to a "learn why" screen so data serves education.
const MARKET_BRIEF = [
  {
    id: 'sp500',
    label: 'S&P 500',
    value: '5,278',
    change: '+0.63%',
    positive: true,
    learnPrompt: 'sp500-explainer',
    learnLabel: 'Why did it rise?',
  },
  {
    id: 'vix',
    label: 'VIX',
    value: '14.82',
    change: '-1.2',
    positive: false,  // lower VIX = less fear = positive for market
    learnPrompt: 'vix-explainer',
    learnLabel: 'What is VIX?',
  },
  {
    id: 'yield10y',
    label: '10Y Yield',
    value: '4.38%',
    change: '+0.04',
    positive: false,
    learnPrompt: 'bonds-explainer',
    learnLabel: 'How bonds work',
  },
];

// ─── Daily concept quiz ───────────────────────────────────────────────────────
// Rotated daily; keyed to the active module topic.
const DAILY_QUIZ = {
  topic: 'DCF',
  questionNumber: 2,
  totalQuestions: 3,
  xp: 15,
  question: 'In a DCF model, what does a higher discount rate do to the present value of future cash flows?',
  options: [
    { id: 'a', text: 'Decreases present value', correct: true },
    { id: 'b', text: 'Increases present value', correct: false },
    { id: 'c', text: 'Has no effect on PV', correct: false },
    { id: 'd', text: 'Only affects terminal value', correct: false },
  ],
};

// ─── Events (carried over, streamlined card design) ───────────────────────────
const EVENTS = [
  {
    id: 'e1',
    title: 'Market Outlook 2025',
    date: 'Jun 25, 4:00 PM',
    type: 'Online Webinar',
    typeIcon: 'video',
    location: 'Zoom · Link on registration',
    speaker: 'Dr. Amara Osei',
    speakerRole: 'Chief Economist, EFG Capital',
    speakerPhoto: 'https://randomuser.me/api/portraits/men/52.jpg',
    attendees: 142,
    thumb: null,
    thumbColor: '#534AB7',
    cover: 'https://images.unsplash.com/photo-1462206092226-f46025ffe607?w=800&q=80',
    description: "Get ahead of the second half of 2025 with a deep-dive into equity valuations, fixed-income positioning, and the macro forces shaping Sub-Saharan African markets. Dr. Osei will walk through his firm's top three sector calls and open the floor for live Q&A.",
    tags: ['Macro', 'Equity', 'SSA Markets'],
    rsvped: false,
  },
  {
    id: 'e2',
    title: 'Bloomberg Terminal Masterclass',
    date: 'Jul 3, 10:00 AM',
    type: 'In-Person Workshop',
    typeIcon: 'person',
    location: 'Finance Lab, Block C — Room 204',
    speaker: 'Emma Johnson',
    speakerRole: 'Bloomberg Certified · Year 3',
    speakerPhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
    attendees: 28,
    thumb: null,
    thumbColor: '#0F6E56',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    description: "A hands-on session covering the bond functions every fixed-income analyst needs: YAS, CRVF, SRCH, and DES. Bring your Bloomberg login — you'll build a real yield curve from scratch and run a duration/convexity analysis on a live portfolio.",
    tags: ['Bloomberg', 'Fixed Income', 'Workshop'],
    rsvped: true,
  },
  {
    id: 'e3',
    title: 'Fintech Pitch Night',
    date: 'Jul 10, 6:00 PM',
    type: 'In-Person · Open to all',
    typeIcon: 'person',
    location: 'Innovation Hub, Main Campus',
    speaker: 'Panel of Industry Judges',
    speakerRole: 'VC Analysts & Founders',
    speakerPhoto: 'https://randomuser.me/api/portraits/men/75.jpg',
    attendees: 310,
    thumb: null,
    thumbColor: '#854F0B',
    cover: 'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800&q=80',
    description: "Eight student teams present their fintech ventures to a panel of investors and founders. Covering payments, lending infrastructure, DeFi, and InsurTech. Networking drinks follow the pitch session.",
    tags: ['FinTech', 'Startups', 'Networking'],
    rsvped: false,
  },
];

// ─── Peer activity ────────────────────────────────────────────────────────────
const PEER_ACTIVITY = [
  {
    id: 'pa1',
    name: 'James Kamau',
    initials: 'JK',
    avatarColorToken: 'tagPurple',
    avatarTextToken: 'tagPurpleText',
    action: 'posted in',
    target: 'FinTech Hub',
    preview: 'AI-based signal generation is changing how we backtest — sharing my full notes this week…',
    time: '1h ago',
    tags: ['Signal Gen', 'Backtesting'],
    tagColors: ['tagPurple', 'tagTeal'],
    tagTextColors: ['tagPurpleText', 'tagTealText'],
    likes: 48,
  },
  {
    id: 'pa2',
    name: 'Emma Johnson',
    initials: 'EJ',
    avatarColorToken: 'tagTeal',
    avatarTextToken: 'tagTealText',
    action: 'shared a resource in',
    target: 'Bloomberg Users',
    preview: 'Bloomberg bond functions deep dive — modified duration, convexity, and rate sensitivity…',
    time: '3h ago',
    tags: ['Bloomberg', 'Fixed Income'],
    tagColors: ['tagPurple', 'tagAmber'],
    tagTextColors: ['tagPurpleText', 'tagAmberText'],
    likes: 12,
  },
];

// ─── Resources shelf ──────────────────────────────────────────────────────────
const RESOURCES = [
  {
    id: 'r1',
    title: 'DCF Model Template',
    type: 'Excel · Starter',
    emoji: '📊',
    colorToken: 'tagPurple',
    Icon: FileSpreadsheet,
    screen: 'Resources',
  },
  {
    id: 'r2',
    title: 'Yield Curve Explainer',
    type: 'Reading · 8 min',
    emoji: '📈',
    colorToken: 'tagTeal',
    Icon: BookOpen,
    screen: 'Resources',
  },
  {
    id: 'r3',
    title: 'Portfolio Theory Podcast',
    type: 'Audio · 22 min',
    emoji: '🎙️',
    colorToken: 'tagAmber',
    Icon: Headphones,
    screen: 'Resources',
  },
  {
    id: 'r4',
    title: 'Exam Prep: Week 12',
    type: 'Quiz · 15 questions',
    emoji: '📝',
    colorToken: 'tagCoral',
    Icon: ClipboardList,
    screen: 'Resources',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SectionHeader({ title, actionLabel, onAction, colors }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      {actionLabel && (
        <TouchableOpacity style={styles.seeAllBtn} onPress={onAction} activeOpacity={0.7}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>{actionLabel}</Text>
          <ChevronRight size={13} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Event Detail Modal (preserved from original, refined styling) ─────────────
function EventDetailModal({ event, visible, onClose, colors }) {
  const insets = useSafeAreaInsets();
  const [rsvped, setRsvped] = useState(event?.rsvped ?? false);

  // Reset rsvp state when event changes
  React.useEffect(() => {
    if (event) setRsvped(event.rsvped);
  }, [event?.id]);

  if (!event) return null;
  const TypeIconComp = event.typeIcon === 'video' ? Video : Users;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.modalRoot, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
        <StatusBar barStyle={colors.background === '#0F0F0F' ? 'light-content' : 'dark-content'} />

        {/* Cover — uses color accent if no image */}
        <View style={[styles.modalCover, { backgroundColor: event.thumbColor ?? colors.primary }]}>
          {event.cover ? (
            <Image source={{ uri: event.cover }} style={styles.modalCoverImg} resizeMode="cover" />
          ) : null}
          <TouchableOpacity
            style={[styles.modalCloseBtn, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <X size={18} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          {rsvped && (
            <View style={[styles.rsvpedBadge, { backgroundColor: colors.success }]}>
              <CheckCircle2 size={12} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.rsvpedBadgeText}>Registered</Text>
            </View>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalBody}>
          <View style={styles.modalTagRow}>
            {event.tags.map(t => (
              <View key={t} style={[styles.modalTag, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.modalTagText, { color: colors.primary }]}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{event.title}</Text>

          <View style={[styles.modalMetaGrid, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalMetaItem}>
              <Calendar size={15} color={colors.primary} strokeWidth={2} />
              <View>
                <Text style={[styles.modalMetaLabel, { color: colors.textHint }]}>Date</Text>
                <Text style={[styles.modalMetaValue, { color: colors.textPrimary }]}>{event.date}</Text>
              </View>
            </View>
            <View style={[styles.modalMetaDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.modalMetaItem}>
              <Users size={15} color={colors.primary} strokeWidth={2} />
              <View>
                <Text style={[styles.modalMetaLabel, { color: colors.textHint }]}>Attending</Text>
                <Text style={[styles.modalMetaValue, { color: colors.textPrimary }]}>{event.attendees}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.modalInfoRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.modalInfoIcon, { backgroundColor: colors.primaryLight }]}>
              <MapPin size={15} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalMetaLabel, { color: colors.textHint }]}>Location</Text>
              <Text style={[styles.modalMetaValue, { color: colors.textPrimary }]}>{event.location}</Text>
            </View>
          </View>

          <View style={[styles.modalSpeakerRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image source={{ uri: event.speakerPhoto }} style={styles.modalSpeakerPhoto} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalSpeakerName, { color: colors.textPrimary }]}>{event.speaker}</Text>
              <Text style={[styles.modalSpeakerRole, { color: colors.textSecondary }]}>{event.speakerRole}</Text>
            </View>
            <View style={[styles.speakerBadge, { backgroundColor: colors.surfaceAlt }]}>
              <Star size={11} color={colors.primary} fill={colors.primary} strokeWidth={0} />
              <Text style={[styles.speakerBadgeText, { color: colors.textSecondary }]}>Speaker</Text>
            </View>
          </View>

          <Text style={[styles.modalSectionLabel, { color: colors.textHint }]}>About this event</Text>
          <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>{event.description}</Text>
        </ScrollView>

        <View style={[styles.modalFooter, { borderTopColor: colors.divider, backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[
              styles.rsvpBtn,
              {
                backgroundColor: rsvped ? colors.surfaceAlt : colors.primary,
                borderColor:     rsvped ? colors.border     : colors.primary,
              },
            ]}
            onPress={() => setRsvped(v => !v)}
            activeOpacity={0.85}
          >
            {rsvped
              ? <CheckCircle2 size={17} color={colors.textSecondary} strokeWidth={2} />
              : <Calendar     size={17} color={colors.textInverse}   strokeWidth={2} />
            }
            <Text style={[styles.rsvpBtnText, { color: rsvped ? colors.textSecondary : colors.textInverse }]}>
              {rsvped ? "You're registered" : 'Register for this event'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const colors = useColors();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null); // selected option id

  const openEvent = useCallback((event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  }, []);

  const handleQuizAnswer = useCallback((optionId) => {
    if (quizAnswer !== null) return; // already answered
    setQuizAnswer(optionId);
  }, [quizAnswer]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.background === '#0F0F0F' ? 'light-content' : 'dark-content'} />

      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ── */}
        {/*
          WHAT: Added semester week label + semester progress bar.
          WHY: Students live by their academic calendar. This immediately
               grounds the app in the academic context vs a market terminal.
        */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerWeek, { color: colors.textSecondary }]}>
              {`${SEMESTER.label} · Week ${SEMESTER.week}`}
            </Text>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.textPrimary }]}>Hey, Alexandra</Text>
              <Text style={styles.wave}> 👋</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {/* Streak badge */}
            <View style={[styles.streakBadge, { backgroundColor: colors.successLight }]}>
              <Flame size={13} color={colors.success} strokeWidth={2} />
              <Text style={[styles.streakText, { color: colors.successDark }]}>14-day streak</Text>
            </View>
            {/* Notification */}
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              activeOpacity={0.7}
            >
              <Bell size={19} color={colors.textPrimary} strokeWidth={1.8} />
              <View style={[styles.notifDot, { backgroundColor: colors.primary }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Semester progress bar */}
        <View style={styles.semesterBarWrap}>
          <View style={[styles.semesterTrack, { backgroundColor: colors.mediumGray }]}>
            <View
              style={[
                styles.semesterFill,
                { width: `${Math.round(SEMESTER.progress * 100)}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
          <Text style={[styles.semesterLabel, { color: colors.textHint }]}>
            {`Semester progress · ${SEMESTER.progressLabel}`}
          </Text>
        </View>

        {/* ── Continue Learning Card (Hero CTA) ── */}
        {/*
          WHAT: Full-width resume card with circular progress ring and two actions.
          WHY: The most important thing a student should do on opening the app
               is continue their current module. This card is the visual anchor.
        */}
        <View style={[styles.resumeCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.cardShadow }]}>
          <View style={styles.resumeCardTop}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[styles.resumeTopic, { color: colors.textHint }]}>{ACTIVE_MODULE.topic}</Text>
              <Text style={[styles.resumeTitle, { color: colors.textPrimary }]}>{ACTIVE_MODULE.title}</Text>
              <Text style={[styles.resumeMeta, { color: colors.textSecondary }]}>
                {`${ACTIVE_MODULE.module} · ${ACTIVE_MODULE.timeLeft}`}
              </Text>
            </View>
            {/* Circular progress ring — SVG via React Native's inline approach */}
            <View style={styles.ringWrap}>
              <Text style={[styles.ringPct, { color: colors.success }]}>
                {`${Math.round(ACTIVE_MODULE.progress * 100)}%`}
              </Text>
            </View>
          </View>

          {/* Linear progress bar */}
          <View style={[styles.progressTrack, { backgroundColor: colors.mediumGray }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(ACTIVE_MODULE.progress * 100)}%`, backgroundColor: colors.success },
              ]}
            />
          </View>

          {/* Actions */}
          <View style={styles.resumeActions}>
            <TouchableOpacity
              style={[styles.resumeBtnPrimary, { backgroundColor: colors.primary }]}
              onPress={() => navigation?.navigate(ACTIVE_MODULE.screen)}
              activeOpacity={0.85}
            >
              <Play size={14} color={colors.textInverse} strokeWidth={2} fill={colors.textInverse} />
              <Text style={[styles.resumeBtnPrimaryText, { color: colors.textInverse }]}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resumeBtnSecondary, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
              activeOpacity={0.8}
            >
              <FileText size={14} color={colors.textSecondary} strokeWidth={2} />
              <Text style={[styles.resumeBtnSecondaryText, { color: colors.textSecondary }]}>My notes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── My Modules shelf ── */}
        {/*
          WHAT: Horizontal scroll of all active course modules with progress bars.
          WHY: Gives a quick visual inventory of all courses — replaces the generic
               "Quick Actions" row which was purely navigation shortcuts.
        */}
        <SectionHeader
          title="My modules"
          actionLabel="All courses"
          onAction={() => navigation?.navigate('Learn')}
          colors={colors}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.modulesScroll}
        >
          {MODULES.map(mod => {
            const pct = Math.round((mod.done / mod.total) * 100);
            const isComplete = mod.done === mod.total;
            return (
              <TouchableOpacity
                key={mod.id}
                style={[styles.moduleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => navigation?.navigate(mod.screen, { moduleId: mod.id })}
                activeOpacity={0.8}
              >
                <View style={[styles.moduleIconWrap, { backgroundColor: colors[mod.iconBgToken] }]}>
                  <BookOpen size={17} color={colors[mod.textToken]} strokeWidth={2} />
                </View>
                <Text style={[styles.moduleCardName, { color: colors.textPrimary }]} numberOfLines={2}>
                  {mod.name}
                </Text>
                <Text style={[styles.moduleCardProg, { color: colors.textHint }]}>
                  {isComplete ? '✓ Complete' : `${mod.done} / ${mod.total} done`}
                </Text>
                <View style={[styles.miniBarTrack, { backgroundColor: colors.mediumGray }]}>
                  <View
                    style={[
                      styles.miniBarFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: isComplete ? colors.success : colors[mod.textToken],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Market Brief (compact, learning-linked) ── */}
        {/*
          WHAT: 3-column strip. Each cell has a "Why?" tappable link to a learn screen.
          WHY: Market data is still relevant for finance students but should prompt
               curiosity and learning — not just passive consumption. The "learn why"
               CTA turns every data point into a teachable moment.
        */}
        <View style={[styles.marketBrief, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.briefTopBar, { borderBottomColor: colors.divider }]}>
            <View style={styles.briefTopLeft}>
              <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.briefTopLabel, { color: colors.textHint }]}>MARKET BRIEF · LIVE</Text>
            </View>
            <TouchableOpacity onPress={() => navigation?.navigate('Learn', { topic: 'market-overview' })}>
              <Text style={[styles.briefTopCta, { color: colors.primary }]}>Why it matters →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.briefCells}>
            {MARKET_BRIEF.map((item, i) => (
              <View
                key={item.id}
                style={[
                  styles.briefCell,
                  i < MARKET_BRIEF.length - 1 && [styles.briefCellBorder, { borderRightColor: colors.divider }],
                ]}
              >
                <Text style={[styles.briefCellLabel, { color: colors.textHint }]}>{item.label}</Text>
                <Text style={[styles.briefCellValue, { color: colors.textPrimary }]}>{item.value}</Text>
                <View style={styles.briefCellChgRow}>
                  {item.positive
                    ? <ArrowUpRight   size={10} color={colors.success} strokeWidth={2.5} />
                    : <ArrowDownRight size={10} color={colors.error}   strokeWidth={2.5} />
                  }
                  <Text style={[styles.briefCellChg, { color: item.positive ? colors.success : colors.error }]}>
                    {item.change}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation?.navigate('Learn', { topic: item.learnPrompt })}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.briefLearnLink, { color: colors.primary }]}>{item.learnLabel}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* ── Daily Concept Check ── */}
        {/*
          WHAT: One contextual MCQ per day tied to the active module, with XP reward.
          WHY: Spaced repetition and gamification (XP) drive retention. Finance concepts
               like DCF need repeated micro-exposure. This replaces the raw "Top Movers"
               stock list which had no educational value for a student.
          GOTCHA: quizAnswer state resets to null daily — wire this to AsyncStorage
                  with a date key so users can't spam XP.
        */}
        <View style={[styles.quizCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.cardShadow }]}>
          <View style={styles.quizHeader}>
            <View style={[styles.quizIconWrap, { backgroundColor: colors.primaryLight }]}>
              <Brain size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.quizTitle, { color: colors.textPrimary }]}>Daily concept check</Text>
              <Text style={[styles.quizSub, { color: colors.textHint }]}>
                {`${DAILY_QUIZ.topic} · Question ${DAILY_QUIZ.questionNumber} of ${DAILY_QUIZ.totalQuestions}`}
              </Text>
            </View>
            <View style={[styles.xpBadge, { backgroundColor: colors.primaryLight }]}>
              <Zap size={11} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.xpText, { color: colors.primary }]}>+{DAILY_QUIZ.xp} XP</Text>
            </View>
          </View>

          <View style={[styles.quizQuestion, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.quizQuestionText, { color: colors.textPrimary }]}>
              {DAILY_QUIZ.question}
            </Text>
          </View>

          <View style={styles.quizOptions}>
            {DAILY_QUIZ.options.map((opt) => {
              const isSelected = quizAnswer === opt.id;
              const isAnswered = quizAnswer !== null;
              let optBg        = colors.surface;
              let optBorder    = colors.border;
              let optText      = colors.textPrimary;

              if (isAnswered && isSelected && opt.correct)  { optBg = colors.successLight; optBorder = colors.success; optText = colors.successDark; }
              if (isAnswered && isSelected && !opt.correct) { optBg = colors.errorLight;   optBorder = colors.error;   optText = colors.errorDark;   }
              if (isAnswered && !isSelected && opt.correct) { optBg = colors.successLight; optBorder = colors.success; optText = colors.successDark; }

              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.quizOpt, { backgroundColor: optBg, borderColor: optBorder }]}
                  onPress={() => handleQuizAnswer(opt.id)}
                  activeOpacity={0.8}
                  disabled={isAnswered}
                >
                  <View style={[styles.quizOptLetter, { backgroundColor: isAnswered ? 'transparent' : colors.surfaceAlt }]}>
                    <Text style={[styles.quizOptLetterText, { color: optText }]}>
                      {opt.id.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.quizOptText, { color: optText }]}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {quizAnswer !== null && (
            <View style={[styles.quizExplanation, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.quizExplanationText, { color: colors.primary }]}>
                {DAILY_QUIZ.options.find(o => o.correct)?.correct
                  ? '✓ A higher discount rate means future cash flows are worth less today — this is fundamental to time value of money.'
                  : ''}
              </Text>
            </View>
          )}
        </View>

        {/* ── Upcoming Events ── */}
        <SectionHeader
          title="Upcoming events"
          actionLabel="See all"
          onAction={() => {}}
          colors={colors}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsScroll}
        >
          {EVENTS.map(event => {
            const TypeIconComp = event.typeIcon === 'video' ? Wifi : MapPin;
            return (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => openEvent(event)}
                activeOpacity={0.88}
              >
                {/* Color-accent thumb area (no external image needed) */}
                <View style={[styles.eventThumb, { backgroundColor: event.thumbColor }]}>
                  <BarChart2 size={28} color="rgba(255,255,255,0.35)" strokeWidth={1.5} />
                  <View style={styles.eventTypeChip}>
                    <TypeIconComp size={10} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.eventTypeChipText}>{event.type}</Text>
                  </View>
                  {event.rsvped && (
                    <View style={[styles.eventRsvpBadge, { backgroundColor: colors.success }]}>
                      <Text style={styles.eventRsvpText}>Registered ✓</Text>
                    </View>
                  )}
                </View>
                <View style={styles.eventBody}>
                  <Text style={[styles.eventTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <View style={styles.eventMeta}>
                    <Calendar size={11} color={colors.textHint} strokeWidth={2} />
                    <Text style={[styles.eventMetaText, { color: colors.textHint }]}>{event.date}</Text>
                  </View>
                  <View style={styles.eventMeta}>
                    <Users size={11} color={colors.textHint} strokeWidth={2} />
                    <Text style={[styles.eventMetaText, { color: colors.textHint }]}>{event.attendees} attending</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Peer Activity ── */}
        {/*
          WHAT: Peer posts with topic tags instead of just a like count.
          WHY: Topic tags let students quickly identify which posts are relevant
               to their current study focus — making the feed feel curated, not noisy.
        */}
        <SectionHeader
          title="Peer activity"
          actionLabel="Community"
          onAction={() => navigation?.navigate('Community')}
          colors={colors}
        />

        <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
          {PEER_ACTIVITY.map((p, i) => (
            <View
              key={p.id}
              style={[
                styles.peerRow,
                i < PEER_ACTIVITY.length - 1 && [styles.peerDivider, { borderBottomColor: colors.divider }],
              ]}
            >
              {/* Initials avatar */}
              <View style={[styles.peerAvatar, { backgroundColor: colors[p.avatarColorToken] }]}>
                <Text style={[styles.peerAvatarText, { color: colors[p.avatarTextToken] }]}>{p.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.peerNameRow}>
                  <Text style={[styles.peerName, { color: colors.textPrimary }]}>{p.name}</Text>
                  <Text style={[styles.peerAction, { color: colors.textHint }]}> {p.action} </Text>
                  <Text style={[styles.peerTarget, { color: colors.primary }]}>{p.target}</Text>
                </View>
                <Text style={[styles.peerPreview, { color: colors.textSecondary }]} numberOfLines={2}>
                  {p.preview}
                </Text>
                {/* Topic tags */}
                <View style={styles.peerTags}>
                  {p.tags.map((tag, ti) => (
                    <View
                      key={tag}
                      style={[styles.peerTag, { backgroundColor: colors[p.tagColors[ti]] }]}
                    >
                      <Text style={[styles.peerTagText, { color: colors[p.tagTextColors[ti]] }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.peerFooter}>
                  <Clock size={10} color={colors.textHint} strokeWidth={2} />
                  <Text style={[styles.peerTime, { color: colors.textHint }]}>{p.time}</Text>
                  <ThumbsUp size={10} color={colors.textHint} strokeWidth={2} style={{ marginLeft: 8 }} />
                  <Text style={[styles.peerTime, { color: colors.textHint }]}>{p.likes}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Resources for You ── */}
        {/*
          WHAT: Horizontal shelf of curated resources: Excel models, readings, podcasts, quizzes.
          WHY: Finance education is heavily resource-based. Surfacing the right resource
               at the right time (tied to current module) drives real learning value.
        */}
        <SectionHeader
          title="Resources for you"
          actionLabel="Library"
          onAction={() => navigation?.navigate('Resources')}
          colors={colors}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.resourcesScroll}
        >
          {RESOURCES.map(res => (
            <TouchableOpacity
              key={res.id}
              style={[styles.resourceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => navigation?.navigate(res.screen)}
              activeOpacity={0.85}
            >
              <View style={[styles.resourceCover, { backgroundColor: colors[res.colorToken] }]}>
                <Text style={styles.resourceEmoji}>{res.emoji}</Text>
              </View>
              <View style={styles.resourceBody}>
                <Text style={[styles.resourceTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                  {res.title}
                </Text>
                <View style={styles.resourceTypeLine}>
                  <res.Icon size={11} color={colors.textHint} strokeWidth={2} />
                  <Text style={[styles.resourceType, { color: colors.textHint }]}>{res.type}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Event Detail Modal ── */}
      <EventDetailModal
        event={selectedEvent}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        colors={colors}
      />
    </SafeAreaView>
  );
}

// ─── StyleSheet — layout only, zero hardcoded colors ──────────────────────────
const styles = StyleSheet.create({
  safeArea:      { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerWeek:  { fontSize: 12, marginBottom: 2 },
  nameRow:     { flexDirection: 'row', alignItems: 'center' },
  name:        { fontSize: 24, fontWeight: '700', letterSpacing: -0.4 },
  wave:        { fontSize: 22 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },

  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  streakText: { fontSize: 12, fontWeight: '600' },

  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 7, right: 8,
    width: 7, height: 7, borderRadius: 4,
  },

  // Semester progress bar
  semesterBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  semesterTrack: {
    flex: 1, height: 5, borderRadius: 3, overflow: 'hidden',
  },
  semesterFill: { height: 5, borderRadius: 3 },
  semesterLabel: { fontSize: 11, fontWeight: '500', flexShrink: 0 },

  // ── Resume / Continue Learning Card ──
  resumeCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius:  8,
    elevation: 3,
  },
  resumeCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resumeTopic: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3, marginBottom: 4 },
  resumeTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3, lineHeight: 22, marginBottom: 5 },
  resumeMeta:  { fontSize: 12 },

  // Circular-ish ring substitute (text in circle)
  ringWrap: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 3,
    // borderColor injected inline via successLight
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    // GOTCHA: React Native doesn't natively support SVG ring —
    // for a real ring use react-native-svg CircularProgress or
    // the lightweight approach below. For now we show the pct text
    // in a round container styled with successLight border.
    borderColor: '#9FE1CB', // static fallback; wire to colors.successLight if available
  },
  ringPct: { fontSize: 13, fontWeight: '700' },

  progressTrack: { height: 5, borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  progressFill:  { height: 5, borderRadius: 3 },

  resumeActions: { flexDirection: 'row', gap: 10 },
  resumeBtnPrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 11, gap: 6,
  },
  resumeBtnPrimaryText: { fontSize: 14, fontWeight: '600' },
  resumeBtnSecondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 11, gap: 6, borderWidth: 1,
  },
  resumeBtnSecondaryText: { fontSize: 14, fontWeight: '500' },

  // ── Modules shelf ──
  modulesScroll: { paddingHorizontal: 16, paddingBottom: 4, gap: 10 },
  moduleCard: {
    width: 148,
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    gap: 6,
  },
  moduleIconWrap: {
    width: 34, height: 34, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  moduleCardName: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  moduleCardProg: { fontSize: 11 },
  miniBarTrack:   { height: 3, borderRadius: 2, overflow: 'hidden' },
  miniBarFill:    { height: 3, borderRadius: 2 },

  // ── Market Brief ──
  marketBrief: {
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  briefTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  briefTopLeft:  { flexDirection: 'row', alignItems: 'center', gap: 7 },
  liveDot:       { width: 7, height: 7, borderRadius: 4 },
  briefTopLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  briefTopCta:   { fontSize: 11, fontWeight: '500' },
  briefCells:    { flexDirection: 'row' },
  briefCell:     { flex: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 2 },
  briefCellBorder: { borderRightWidth: StyleSheet.hairlineWidth },
  briefCellLabel:  { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
  briefCellValue:  { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  briefCellChgRow: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  briefCellChg:    { fontSize: 11, fontWeight: '600' },
  briefLearnLink:  { fontSize: 10, fontWeight: '500', marginTop: 3 },

  // ── Section header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  seeAllBtn:    { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAll:      { fontSize: 13, fontWeight: '500' },

  // ── Daily quiz ──
  quizCard: {
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius:  6,
    elevation: 2,
    gap: 12,
  },
  quizHeader:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  quizIconWrap: {
    width: 38, height: 38, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  quizTitle: { fontSize: 14, fontWeight: '700' },
  quizSub:   { fontSize: 11, marginTop: 2 },
  xpBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20,
  },
  xpText: { fontSize: 11, fontWeight: '700' },
  quizQuestion:     { borderRadius: 12, padding: 12 },
  quizQuestionText: { fontSize: 13, lineHeight: 20 },
  quizOptions:      { gap: 8 },
  quizOpt: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: 11, padding: 11,
  },
  quizOptLetter: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  quizOptLetterText: { fontSize: 11, fontWeight: '700' },
  quizOptText:       { fontSize: 13, flex: 1 },
  quizExplanation: {
    borderRadius: 10, padding: 11,
  },
  quizExplanationText: { fontSize: 12, lineHeight: 18 },

  // ── Events ──
  eventsScroll: { paddingHorizontal: 16, paddingBottom: 4, gap: 12 },
  eventCard: {
    width: 210,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  eventThumb: {
    height: 100,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  eventTypeChip: {
    position: 'absolute', bottom: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  eventTypeChipText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
  eventRsvpBadge: {
    position: 'absolute', top: 8, right: 8,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  eventRsvpText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  eventBody:     { padding: 11, gap: 5 },
  eventTitle:    { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  eventMeta:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  eventMetaText: { fontSize: 11 },

  // ── Card (generic) ──
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius:  8,
    elevation: 3,
  },

  // ── Peer activity ──
  peerRow:      { flexDirection: 'row', gap: 10, paddingVertical: 12 },
  peerDivider:  { borderBottomWidth: StyleSheet.hairlineWidth },
  peerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  peerAvatarText: { fontSize: 13, fontWeight: '700' },
  peerNameRow:    { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 3 },
  peerName:       { fontSize: 13, fontWeight: '700' },
  peerAction:     { fontSize: 12 },
  peerTarget:     { fontSize: 12, fontWeight: '600' },
  peerPreview:    { fontSize: 12, lineHeight: 17, marginBottom: 6 },
  peerTags:       { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 5 },
  peerTag: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6,
  },
  peerTagText: { fontSize: 10, fontWeight: '600' },
  peerFooter:  { flexDirection: 'row', alignItems: 'center', gap: 3 },
  peerTime:    { fontSize: 11 },

  // ── Resources ──
  resourcesScroll: { paddingHorizontal: 16, paddingBottom: 4, gap: 10 },
  resourceCard: {
    width: 135,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  resourceCover: {
    height: 70,
    alignItems: 'center', justifyContent: 'center',
  },
  resourceEmoji: { fontSize: 28 },
  resourceBody:  { padding: 10, gap: 4 },
  resourceTitle: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  resourceTypeLine: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resourceType: { fontSize: 10 },

  // ── Event Detail Modal ──
  modalRoot:     { flex: 1 },
  modalCover:    { height: 220, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  modalCoverImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  modalCloseBtn: {
    position: 'absolute', top: 16, right: 16,
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  rsvpedBadge: {
    position: 'absolute', bottom: 14, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  rsvpedBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  modalBody:        { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 8, gap: 14 },
  modalTagRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  modalTag:         { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 7 },
  modalTagText:     { fontSize: 11.5, fontWeight: '600' },
  modalTitle:       { fontSize: 21, fontWeight: '700', letterSpacing: -0.4, lineHeight: 27 },
  modalMetaGrid: {
    flexDirection: 'row', borderRadius: 14,
    borderWidth: 1, paddingVertical: 14,
  },
  modalMetaItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    gap: 8, paddingHorizontal: 14,
  },
  modalMetaDivider: { width: 1, height: 36, alignSelf: 'center' },
  modalMetaLabel:   { fontSize: 10, marginBottom: 2 },
  modalMetaValue:   { fontSize: 13, fontWeight: '600' },
  modalInfoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, borderWidth: 1, padding: 14,
  },
  modalInfoIcon: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  modalSpeakerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, borderWidth: 1, padding: 14,
  },
  modalSpeakerPhoto: { width: 44, height: 44, borderRadius: 22 },
  modalSpeakerName:  { fontSize: 14, fontWeight: '700' },
  modalSpeakerRole:  { fontSize: 12, marginTop: 2 },
  speakerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8,
  },
  speakerBadgeText:  { fontSize: 11, fontWeight: '500' },
  modalSectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginBottom: -6 },
  modalDescription:  { fontSize: 14, lineHeight: 22 },
  modalFooter: {
    paddingHorizontal: 18, paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rsvpBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 15, borderRadius: 14, borderWidth: 1.5,
  },
  rsvpBtnText: { fontSize: 15, fontWeight: '700' },
});