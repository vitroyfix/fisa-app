import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MoreHorizontal,
  UserPlus,
  MessageCircle,
  MessageSquare,
  Bookmark,
  Share2,
  TrendingUp,
  Award,
  Users,
  Star,
  Briefcase,
  GraduationCap,
  MapPin,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  ThumbsUp,
} from 'lucide-react-native';
import { useColors } from '../../constants/colors';

// ─── Photo map — randomuser.me seeds keyed to peer ID ─────────────────────────
const PEER_PHOTOS = {
  ej: 'https://randomuser.me/api/portraits/women/44.jpg',
  dc: 'https://randomuser.me/api/portraits/men/32.jpg',
  sm: 'https://randomuser.me/api/portraits/women/68.jpg',
  jk: 'https://randomuser.me/api/portraits/men/75.jpg',
  la: 'https://randomuser.me/api/portraits/women/26.jpg',
};

// Cover images — abstract finance-themed via picsum with deterministic seeds
const PEER_COVERS = {
  ej: 'https://picsum.photos/seed/emma-finance/800/220',
  dc: 'https://picsum.photos/seed/david-econ/800/220',
  sm: 'https://picsum.photos/seed/sophia-esg/800/220',
  jk: 'https://picsum.photos/seed/james-fintech/800/220',
  la: 'https://picsum.photos/seed/lily-cpa/800/220',
};

// ─── Peer data ─────────────────────────────────────────────────────────────────
const PEERS_DB = {
  ej: {
    initials: 'EJ',
    name: 'Emma Johnson',
    major: 'Finance',
    year: 'Year 3',
    location: 'Nairobi, Kenya',
    website: 'emmafjohnson.com',
    bio: 'Passionate about markets and FinTech. Investment Club member and aspiring portfolio manager. Currently researching yield curve dynamics and fixed-income strategy.',
    accentColor: '#185FA5',
    badges: ['Investment Club', 'Bloomberg Certified'],
    mutualGroups: ['Finance Hub', 'Bloomberg Users'],
    mutualConnections: 12,
    stats: { posts: 24, followers: 138, following: 62, points: 820 },
    recentPosts: [
      {
        id: 'p1',
        text: 'What are your thoughts on the recent Fed decision? Yield curve inversion is back on the table — duration risk is something every fixed-income investor needs to revisit.',
        likes: 12,
        comments: 5,
        time: '2h ago',
        tag: 'Macro',
      },
      {
        id: 'p2',
        text: 'Sharing my notes from the Bloomberg terminal session — bond duration deep dive. Covered modified duration, convexity, and how to think about rate sensitivity in laddered portfolios.',
        likes: 7,
        comments: 3,
        time: '1d ago',
        tag: 'Resources',
      },
    ],
    topSkills: ['Fixed Income', 'Bloomberg Terminal', 'Portfolio Analysis', 'Valuation'],
  },
  dc: {
    initials: 'DC',
    name: 'David Chen',
    major: 'Economics',
    year: 'Year 4',
    location: 'Nairobi, Kenya',
    website: 'davidchenresearch.io',
    bio: 'Equity research enthusiast tracking macro trends across EM and DM markets. Writing a thesis on capital flows in Sub-Saharan Africa. Open to connect and collaborate.',
    accentColor: '#0F6E56',
    badges: ['FinTech Enthusiasts', 'Top Contributor'],
    mutualGroups: ['Economics Society', 'Trading Talk'],
    mutualConnections: 8,
    stats: { posts: 41, followers: 204, following: 88, points: 1140 },
    recentPosts: [
      {
        id: 'p1',
        text: "Rate pause looks locked in. I'm reassessing duration exposure in bond portfolios now and trimming the belly of the curve. Thread on what I'm watching next below.",
        likes: 9,
        comments: 7,
        time: '9h ago',
        tag: 'Macro',
      },
      {
        id: 'p2',
        text: 'Great session at the Investment Club today — key takeaway: volatility is the friend of the long-term investor. We worked through a real-time options scenario on a high-beta stock.',
        likes: 15,
        comments: 11,
        time: '2d ago',
        tag: 'Club',
      },
    ],
    topSkills: ['Equity Research', 'Macro Analysis', 'Emerging Markets', 'Excel Modeling'],
  },
  sm: {
    initials: 'SM',
    name: 'Sophia Martinez',
    major: 'Finance',
    year: 'Year 3',
    location: 'Nairobi, Kenya',
    website: '',
    bio: 'Women in Finance advocate and Bloomberg-certified analyst. Passionate about credit markets, ESG investing, and sustainable capital allocation. Mentor in the first-year buddy program.',
    accentColor: '#993C1D',
    badges: ['Women in Finance', 'ESG Focus'],
    mutualGroups: ['Women in Finance', 'ESG Circle'],
    mutualConnections: 6,
    stats: { posts: 18, followers: 95, following: 41, points: 670 },
    recentPosts: [
      {
        id: 'p1',
        text: "My summary from last week's Bloomberg session on duration risk is now in the Resources section. Covers key rate duration, spread duration, and how ESG bonds behave differently under rate stress.",
        likes: 5,
        comments: 2,
        time: '30m ago',
        tag: 'Resources',
      },
    ],
    topSkills: ['ESG Analysis', 'Credit Markets', 'Bloomberg', 'Sustainable Finance'],
  },
  jk: {
    initials: 'JK',
    name: 'James Kamau',
    major: 'FinTech',
    year: 'Year 2',
    location: 'Nairobi, Kenya',
    website: 'jameskamau.dev',
    bio: 'Building at the intersection of AI and finance. Into algorithmic trading, DeFi protocols, and hackathons. Currently prototyping a momentum-based signal generator using ML and order book data.',
    accentColor: '#3B6D11',
    badges: ['Trading Talk', 'AI Finance'],
    mutualGroups: ['FinTech Hub', 'Algo Traders'],
    mutualConnections: 15,
    stats: { posts: 31, followers: 176, following: 57, points: 990 },
    recentPosts: [
      {
        id: 'p1',
        text: 'AI-based signal generation is changing how we backtest strategies. Sharing my full notes this week — covering feature engineering, walk-forward testing, and how to avoid look-ahead bias.',
        likes: 48,
        comments: 14,
        time: '1d ago',
        tag: 'FinTech',
      },
      {
        id: 'p2',
        text: 'Just placed top 5 at the FinHack hackathon — built a DeFi lending protocol in 24 hours. Liquidity pools, collateral logic, and a basic liquidation engine all running on testnet.',
        likes: 32,
        comments: 9,
        time: '3d ago',
        tag: 'Achievement',
      },
    ],
    topSkills: ['Python', 'Algorithmic Trading', 'DeFi', 'Machine Learning'],
  },
  la: {
    initials: 'LA',
    name: 'Lily Auma',
    major: 'Accounting',
    year: 'Year 3',
    location: 'Nairobi, Kenya',
    website: '',
    bio: 'CPA-track student interested in financial modeling, M&A advisory, and startup valuations. Building a case study library of African startup valuations. Love connecting with founders and analysts.',
    accentColor: '#993556',
    badges: ['CFA Candidate', 'Investment Club'],
    mutualGroups: ['Investment Club', 'Accounting Society'],
    mutualConnections: 4,
    stats: { posts: 15, followers: 72, following: 39, points: 540 },
    recentPosts: [
      {
        id: 'p1',
        text: 'Just finished building a DCF model for a local startup — the sensitivity analysis on terminal growth rate was eye-opening. A 1% change in perpetuity growth moved equity value by 40%.',
        likes: 7,
        comments: 4,
        time: '2d ago',
        tag: 'Modeling',
      },
    ],
    topSkills: ['Financial Modeling', 'DCF Valuation', 'M&A Analysis', 'Excel'],
  },
};

// ─── Tag key → palette token names ───────────────────────────────────────────
// Resolved at render time via colors object so they flip in dark mode.
const TAG_TOKENS = {
  Macro:       { bg: 'tagBlue',   text: 'tagBlueText'   },
  Resources:   { bg: 'tagGreen',  text: 'tagGreenText'  },
  Club:        { bg: 'tagPurple', text: 'tagPurpleText' },
  FinTech:     { bg: 'tagAmber',  text: 'tagAmberText'  },
  Achievement: { bg: 'tagAmber',  text: 'tagAmberText'  },
  Modeling:    { bg: 'tagTeal',   text: 'tagTealText'   },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBox({ value, label, colors }) {
  const isPoints = label === 'Points';
  return (
    <View style={styles.statBox}>
      <View style={styles.statValueRow}>
        {isPoints && (
          <Star size={11} color={colors.primary} fill={colors.primary} strokeWidth={0} style={{ marginRight: 2 }} />
        )}
        <Text style={[styles.statValue, { color: isPoints ? colors.primary : colors.textPrimary }]}>
          {value}
        </Text>
      </View>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function BadgePill({ label, colors }) {
  return (
    <View style={[styles.badgePill, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
      <CheckCircle2 size={12} color={colors.primary} strokeWidth={2.2} />
      <Text style={[styles.badgeText, { color: colors.primaryDark }]}>{label}</Text>
    </View>
  );
}

function SkillChip({ label, colors }) {
  return (
    <View style={[styles.skillChip, { backgroundColor: colors.surfaceAlt }]}>
      <Text style={[styles.skillText, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function MutualGroupRow({ label, colors }) {
  return (
    <View style={[styles.mutualGroupRow, { borderBottomColor: colors.divider }]}>
      <View style={[styles.groupIcon, { backgroundColor: colors.primaryLight }]}>
        <Users size={14} color={colors.primary} strokeWidth={2} />
      </View>
      <Text style={[styles.mutualGroupText, { color: colors.textPrimary }]}>{label}</Text>
      <ChevronRight size={14} color={colors.textHint} strokeWidth={2} />
    </View>
  );
}

function PostCard({ post, colors }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const tokens = TAG_TOKENS[post.tag];
  const tagBg   = tokens ? colors[tokens.bg]   : colors.tagGray;
  const tagText = tokens ? colors[tokens.text] : colors.tagGrayText;

  return (
    <View style={[styles.postCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      {/* Tag + time */}
      <View style={styles.postMeta}>
        <View style={[styles.tagPill, { backgroundColor: tagBg }]}>
          <Text style={[styles.tagText, { color: tagText }]}>{post.tag}</Text>
        </View>
        <Text style={[styles.postTime, { color: colors.textHint }]}>{post.time}</Text>
      </View>

      {/* Body */}
      <Text style={[styles.postBody, { color: colors.textPrimary }]}>{post.text}</Text>

      {/* Actions */}
      <View style={[styles.postActions, { borderTopColor: colors.divider }]}>
        <TouchableOpacity
          style={styles.postAction}
          onPress={() => setLiked(v => !v)}
          activeOpacity={0.7}
        >
          <ThumbsUp
            size={15}
            color={liked ? colors.primary : colors.textSecondary}
            strokeWidth={2}
            fill={liked ? colors.primary : 'none'}
          />
          <Text style={[styles.postActionCount, { color: liked ? colors.primary : colors.textSecondary }]}>
            {post.likes + (liked ? 1 : 0)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postAction} activeOpacity={0.7}>
          <MessageSquare size={15} color={colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.postActionCount, { color: colors.textSecondary }]}>{post.comments}</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={styles.postAction}
          onPress={() => setSaved(v => !v)}
          activeOpacity={0.7}
        >
          <Bookmark
            size={15}
            color={saved ? colors.primary : colors.textSecondary}
            strokeWidth={2}
            fill={saved ? colors.primary : 'none'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.postAction} activeOpacity={0.7}>
          <Share2 size={15} color={colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SectionCard({ icon, title, children, colors }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        {icon}
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function PeerProfileScreen({ route, navigation }) {
  const colors = useColors();
  const peerId = route?.params?.peerId ?? 'jk';
  const peer   = PEERS_DB[peerId] ?? PEERS_DB['jk'];

  const [connected, setConnected] = useState(false);

  const photoUri = PEER_PHOTOS[peerId] ?? PEER_PHOTOS['jk'];
  const coverUri = PEER_COVERS[peerId] ?? PEER_COVERS['jk'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <StatusBar barStyle={colors.background === '#0F0F0F' ? 'light-content' : 'dark-content'} />

      {/* Floating nav buttons — sit above cover image */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.topBarBtn, { backgroundColor: colors.overlay }]}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color={colors.textInverse} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.topBarBtn, { backgroundColor: colors.overlay }]}
          activeOpacity={0.8}
        >
          <MoreHorizontal size={20} color={colors.textInverse} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* ── Cover — accent bar keeps each peer's personal color ── */}
        <View style={styles.coverWrapper}>
          <Image source={{ uri: coverUri }} style={styles.coverImage} resizeMode="cover" />
          <View style={[styles.coverAccentBar, { backgroundColor: peer.accentColor }]} />
        </View>

        {/* ── Avatar row ── */}
        <View style={[styles.avatarRow, { backgroundColor: colors.background }]}>
          <View style={[styles.avatarRing, { borderColor: colors.background }]}>
            <Image source={{ uri: photoUri }} style={styles.avatar} />
            <View style={[styles.onlineDot, { backgroundColor: colors.onlineGreen, borderColor: colors.background }]} />
          </View>

          <View style={styles.avatarActions}>
            {/* Message — outline in brand red */}
            <TouchableOpacity
              style={[styles.outlineBtn, { borderColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <MessageCircle size={15} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.outlineBtnText, { color: colors.primary }]}>Message</Text>
            </TouchableOpacity>

            {/* Connect — filled brand red, becomes outlined when connected */}
            <TouchableOpacity
              style={[
                styles.fillBtn,
                {
                  backgroundColor: connected ? colors.surfaceAlt : colors.primary,
                  borderColor:     connected ? colors.border     : colors.primary,
                },
              ]}
              onPress={() => setConnected(v => !v)}
              activeOpacity={0.85}
            >
              {connected
                ? <CheckCircle2 size={15} color={colors.textSecondary} strokeWidth={2} />
                : <UserPlus     size={15} color={colors.textInverse}   strokeWidth={2} />
              }
              <Text style={[styles.fillBtnText, { color: connected ? colors.textSecondary : colors.textInverse }]}>
                {connected ? 'Connected' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Identity ── */}
        <View style={[styles.identityBlock, { backgroundColor: colors.background }]}>
          <Text style={[styles.peerName, { color: colors.textPrimary }]}>{peer.name}</Text>

          <View style={styles.metaRow}>
            <GraduationCap size={14} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {peer.major} · {peer.year}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <MapPin size={14} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{peer.location}</Text>
          </View>

          {peer.website ? (
            <View style={styles.metaRow}>
              <ExternalLink size={14} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.metaText, { color: colors.primary }]}>{peer.website}</Text>
            </View>
          ) : null}

          <View style={styles.metaRow}>
            <Users size={14} color={colors.textHint} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.textHint }]}>
              {peer.mutualConnections} mutual connections
            </Text>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <StatBox value={peer.stats.posts}     label="Posts"     colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <StatBox value={peer.stats.followers} label="Followers" colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <StatBox value={peer.stats.following} label="Following" colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <StatBox value={peer.stats.points}    label="Points"    colors={colors} />
        </View>

        {/* ── About ── */}
        <SectionCard
          icon={<Briefcase size={16} color={colors.primary} strokeWidth={2} />}
          title="About"
          colors={colors}
        >
          <Text style={[styles.bioText, { color: colors.textSecondary }]}>{peer.bio}</Text>
        </SectionCard>

        {/* ── Skills ── */}
        <SectionCard
          icon={<TrendingUp size={16} color={colors.primary} strokeWidth={2} />}
          title="Skills"
          colors={colors}
        >
          <View style={styles.chipWrap}>
            {peer.topSkills.map(s => <SkillChip key={s} label={s} colors={colors} />)}
          </View>
        </SectionCard>

        {/* ── Credentials ── */}
        <SectionCard
          icon={<Award size={16} color={colors.primary} strokeWidth={2} />}
          title="Credentials & Clubs"
          colors={colors}
        >
          <View style={styles.chipWrap}>
            {peer.badges.map(b => (
              <BadgePill key={b} label={b} colors={colors} />
            ))}
          </View>
        </SectionCard>

        {/* ── Mutual groups ── */}
        <SectionCard
          icon={<Users size={16} color={colors.primary} strokeWidth={2} />}
          title="Mutual Groups"
          colors={colors}
        >
          {peer.mutualGroups.map(g => (
            <MutualGroupRow key={g} label={g} colors={colors} />
          ))}
        </SectionCard>

        {/* ── Activity ── */}
        <SectionCard
          icon={<MessageCircle size={16} color={colors.primary} strokeWidth={2} />}
          title="Recent Activity"
          colors={colors}
        >
          {peer.recentPosts.map(post => (
            <PostCard key={post.id} post={post} colors={colors} />
          ))}
          <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.7}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See all posts</Text>
            <ChevronRight size={14} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </SectionCard>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── StyleSheet — layout only, zero hardcoded colors ─────────────────────────
const styles = StyleSheet.create({
  // Floating top bar
  topBar: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topBarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Cover
  coverWrapper: { height: 180, position: 'relative' },
  coverImage:   { width: '100%', height: 180 },
  coverAccentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  // Avatar row
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: -42,
  },
  avatarRing: {
    borderWidth: 3,
    borderRadius: 46,
    position: 'relative',
  },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  onlineDot: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  avatarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 46,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  outlineBtnText: { fontSize: 13, fontWeight: '600' },
  fillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  fillBtnText: { fontSize: 13, fontWeight: '600' },

  // Identity
  identityBlock: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    gap: 5,
  },
  peerName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: { fontSize: 13.5 },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    marginBottom: 12,
  },
  statBox: { flex: 1, alignItems: 'center', gap: 2 },
  statValueRow: { flexDirection: 'row', alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  statLabel: { fontSize: 11, fontWeight: '500' },
  statDivider: { width: 1, height: 32, alignSelf: 'center' },

  // Section cards
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', letterSpacing: -0.1 },

  // Bio
  bioText: { fontSize: 14, lineHeight: 21 },

  // Chip wrap (skills + badges)
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  skillText: { fontSize: 12.5, fontWeight: '500' },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12.5, fontWeight: '600' },

  // Mutual groups
  mutualGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  groupIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutualGroupText: { flex: 1, fontSize: 13.5, fontWeight: '500' },

  // Post cards
  postCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 13,
    marginBottom: 8,
    gap: 8,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagPill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6 },
  tagText:  { fontSize: 11, fontWeight: '600' },
  postTime: { fontSize: 12 },
  postBody: { fontSize: 13.5, lineHeight: 20 },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 2,
  },
  postAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postActionCount: { fontSize: 12.5, fontWeight: '500' },

  // See all
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    gap: 4,
  },
  seeAllText: { fontSize: 13, fontWeight: '600' },
});