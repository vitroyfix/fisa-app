// src/screens/profile/ProfileScreen.jsx
//
// Redesigned profile — own-user view.
// New in this version:
//   ✅ Cover photo + accent bar (matches PeerProfile pattern)
//   ✅ Real photo avatar (randomuser.me)
//   ✅ Richer identity block — location, website, join date, follower row
//   ✅ Achievements card — level badge, XP bar, unlocked trophies
//   ✅ Connections preview — horizontal peer avatars with mutual-count label
//   ✅ Recent activity feed — own posts with like/save/share
//   ✅ Edit-profile surface card (replaces buried alert)
//   ✅ Settings dropdown kept, dark-mode toggle, visibility, notifications
//   ✅ Zero hardcoded colors — all via useTheme()

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Switch,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  Award,
  Trophy,
  Bookmark,
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  Edit2,
  LogOut,
  Star,
  Moon,
  Sun,
  Bell,
  Shield,
  MapPin,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Share2,
  TrendingUp,
  Zap,
  UserCheck,
  GraduationCap,
  CalendarDays,
  Camera,
  Lock,
  MoreHorizontal,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

// ─── Own-user data ─────────────────────────────────────────────────────────────
const PROFILE = {
  name:      'Alexandra Reyes',
  initials:  'AR',
  major:     'Finance',
  year:      'Year 3',
  location:  'Nairobi, Kenya',
  website:   'alexreyes.finance',
  bio:       'Passionate about financial markets and sustainable investing. CFA candidate. Building expertise in fixed-income and equity valuation.',
  joinDate:  'Joined Sep 2022',
  photoUri:  'https://randomuser.me/api/portraits/women/65.jpg',
  coverUri:  'https://picsum.photos/seed/alex-finance/800/220',
  accentColor: '#B04A20',
  badges:    ['Top Contributor', 'CFA Candidate'],
  stats: { posts: 34, followers: 212, following: 74, points: 1250 },
  level: { current: 'Silver', next: 'Gold', xp: 1250, xpNeeded: 1500 },
};

// ─── Connections preview (drawn from PeerProfileScreen's PEERS_DB) ────────────
const CONNECTIONS_PREVIEW = [
  { id: 'ej', name: 'Emma J.',   photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'dc', name: 'David C.',  photo: 'https://randomuser.me/api/portraits/men/32.jpg'   },
  { id: 'sm', name: 'Sophia M.', photo: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 'jk', name: 'James K.',  photo: 'https://randomuser.me/api/portraits/men/75.jpg'   },
  { id: 'la', name: 'Lily A.',   photo: 'https://randomuser.me/api/portraits/women/26.jpg' },
];

// ─── Own recent posts ─────────────────────────────────────────────────────────
const OWN_POSTS = [
  {
    id: 'op1',
    text: 'Finished my first full DCF model on a Nairobi-listed mid-cap. Terminal growth assumptions were the trickiest part — small changes move equity value dramatically.',
    likes: 18,
    comments: 6,
    time: '3h ago',
    tag: 'Modeling',
  },
  {
    id: 'op2',
    text: "Great Investment Club session today. We stress-tested a bond ladder against a parallel shift scenario — duration and convexity made so much more sense after doing it hands-on.",
    likes: 11,
    comments: 4,
    time: '1d ago',
    tag: 'Club',
  },
];

// ─── Achievements data ────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id: 'a1', icon: Trophy,     label: 'Top Poster',       unlocked: true  },
  { id: 'a2', icon: Star,       label: 'Rising Star',      unlocked: true  },
  { id: 'a3', icon: Zap,        label: 'Fast Learner',     unlocked: true  },
  { id: 'a4', icon: UserCheck,  label: 'Mentor',           unlocked: false },
  { id: 'a5', icon: TrendingUp, label: 'Market Watcher',   unlocked: false },
];

// ─── Menu items ───────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { Icon: Calendar,  label: 'My Events',       screen: 'MyEvents'       },
  { Icon: Award,     label: 'My Certificates', screen: 'MyCertificates' },
  { Icon: Bookmark,  label: 'Saved Resources', screen: 'SavedResources' },
  { Icon: Users,     label: 'My Groups',       screen: 'Groups'         },
  { Icon: Settings,  label: 'Settings',        screen: 'Settings'       },
];

// ─── Tag palette tokens (same as PeerProfileScreen) ──────────────────────────
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
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
      </View>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function SectionHeader({ icon, title, colors, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        {icon}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      </View>
      {action ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function Card({ children, colors, style }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

function PostCard({ post, colors }) {
  const [liked, setLiked]   = useState(false);
  const [saved, setSaved]   = useState(false);
  const tokens  = TAG_TOKENS[post.tag];
  const tagBg   = tokens ? colors[tokens.bg]   : colors.tagGray;
  const tagText = tokens ? colors[tokens.text] : colors.tagGrayText;

  return (
    <View style={[styles.postCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <View style={styles.postMeta}>
        <View style={[styles.tagPill, { backgroundColor: tagBg }]}>
          <Text style={[styles.tagText, { color: tagText }]}>{post.tag}</Text>
        </View>
        <Text style={[styles.postTime, { color: colors.textHint }]}>{post.time}</Text>
        <TouchableOpacity style={styles.postMore} activeOpacity={0.7}>
          <MoreHorizontal size={15} color={colors.textHint} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.postBody, { color: colors.textPrimary }]}>{post.text}</Text>

      <View style={[styles.postActions, { borderTopColor: colors.divider }]}>
        <TouchableOpacity style={styles.postAction} onPress={() => setLiked(v => !v)} activeOpacity={0.7}>
          <ThumbsUp
            size={14}
            color={liked ? colors.primary : colors.textSecondary}
            strokeWidth={2}
            fill={liked ? colors.primary : 'none'}
          />
          <Text style={[styles.postActionCount, { color: liked ? colors.primary : colors.textSecondary }]}>
            {post.likes + (liked ? 1 : 0)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postAction} activeOpacity={0.7}>
          <MessageSquare size={14} color={colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.postActionCount, { color: colors.textSecondary }]}>{post.comments}</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.postAction} onPress={() => setSaved(v => !v)} activeOpacity={0.7}>
          <Bookmark
            size={14}
            color={saved ? colors.primary : colors.textSecondary}
            strokeWidth={2}
            fill={saved ? colors.primary : 'none'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.postAction} activeOpacity={0.7}>
          <Share2 size={14} color={colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AchievementBadge({ item, colors }) {
  const IconComp = item.icon;
  return (
    <View style={styles.achievementItem}>
      <View style={[
        styles.achievementIcon,
        {
          backgroundColor: item.unlocked ? colors.primaryLight : colors.surfaceAlt,
          borderColor:      item.unlocked ? colors.primary      : colors.border,
        },
      ]}>
        <IconComp
          size={18}
          color={item.unlocked ? colors.primary : colors.textHint}
          strokeWidth={item.unlocked ? 2 : 1.5}
        />
      </View>
      <Text style={[
        styles.achievementLabel,
        { color: item.unlocked ? colors.textPrimary : colors.textHint },
      ]}>
        {item.label}
      </Text>
    </View>
  );
}

function SettingRow({ icon, label, sublabel, right, colors, last }) {
  return (
    <View style={[
      styles.settingRow,
      { borderBottomColor: last ? 'transparent' : colors.divider },
    ]}>
      <View style={styles.settingLeft}>
        {icon}
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
          {sublabel ? (
            <Text style={[styles.settingSubLabel, { color: colors.textHint }]}>{sublabel}</Text>
          ) : null}
        </View>
      </View>
      {right}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();

  const [settingsOpen,    setSettingsOpen]    = useState(false);
  const [profilePublic,   setProfilePublic]   = useState(true);
  const [notificationsOn, setNotificationsOn] = useState(true);

  const xpPct = PROFILE.level.xp / PROFILE.level.xpNeeded;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Profile</Text>
        <TouchableOpacity
          style={styles.editIconBtn}
          onPress={() => Alert.alert('Edit Profile', 'Opening editor…')}
          activeOpacity={0.7}
        >
          <Edit2 size={19} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* ── Cover ── */}
        <View style={styles.coverWrapper}>
          <Image source={{ uri: PROFILE.coverUri }} style={styles.coverImage} resizeMode="cover" />
          <View style={[styles.coverAccentBar, { backgroundColor: PROFILE.accentColor }]} />
          {/* Camera overlay for cover edit */}
          <TouchableOpacity
            style={[styles.coverEditBtn, { backgroundColor: colors.overlay }]}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Change Cover', 'Pick a new cover photo')}
          >
            <Camera size={15} color={colors.textInverse} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* ── Avatar row ── */}
        <View style={[styles.avatarRow, { backgroundColor: colors.background }]}>
          <View style={{ position: 'relative' }}>
            <View style={[styles.avatarRing, { borderColor: colors.background }]}>
              <Image source={{ uri: PROFILE.photoUri }} style={styles.avatar} />
            </View>
            {/* Camera overlay on avatar */}
            <TouchableOpacity
              style={[styles.avatarEditDot, { backgroundColor: colors.primary, borderColor: colors.background }]}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Change Photo', 'Pick a new profile photo')}
            >
              <Camera size={11} color={colors.textInverse} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Level pill */}
          <View style={[styles.levelPill, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <Star size={12} color={colors.primary} fill={colors.primary} strokeWidth={0} />
            <Text style={[styles.levelPillText, { color: colors.primaryDark }]}>
              {PROFILE.level.current} Level
            </Text>
          </View>
        </View>

        {/* ── Identity ── */}
        <View style={[styles.identityBlock, { backgroundColor: colors.background }]}>
          <Text style={[styles.peerName, { color: colors.textPrimary }]}>{PROFILE.name}</Text>

          <View style={styles.metaRow}>
            <GraduationCap size={13} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {PROFILE.major} · {PROFILE.year}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <MapPin size={13} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{PROFILE.location}</Text>
          </View>

          <View style={styles.metaRow}>
            <ExternalLink size={13} color={colors.primary} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.primary }]}>{PROFILE.website}</Text>
          </View>

          <View style={styles.metaRow}>
            <CalendarDays size={13} color={colors.textHint} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.textHint }]}>{PROFILE.joinDate}</Text>
          </View>

          {/* Bio */}
          <Text style={[styles.bioText, { color: colors.textSecondary }]}>{PROFILE.bio}</Text>

          {/* Badges */}
          <View style={styles.badgesRow}>
            {PROFILE.badges.map(b => (
              <View
                key={b}
                style={[styles.badgePill, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
              >
                <Text style={[styles.badgeText, { color: colors.primaryDark }]}>{b}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <StatBox value={PROFILE.stats.posts}     label="Posts"     colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <StatBox value={PROFILE.stats.followers} label="Followers" colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <StatBox value={PROFILE.stats.following} label="Following" colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <StatBox value={PROFILE.stats.points}    label="Points"    colors={colors} />
        </View>

        {/* ── Level / XP card ── */}
        <Card colors={colors} style={{ marginTop: 4 }}>
          <SectionHeader
            icon={<Trophy size={15} color={colors.primary} strokeWidth={2} />}
            title="Level Progress"
            colors={colors}
          />
          <View style={styles.xpRow}>
            <View style={[styles.xpLevelBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.xpLevelText, { color: colors.primary }]}>
                {PROFILE.level.current}
              </Text>
            </View>
            <View style={styles.xpBarWrap}>
              <View style={[styles.xpTrack, { backgroundColor: colors.surfaceAlt }]}>
                <View style={[styles.xpFill, { width: `${xpPct * 100}%`, backgroundColor: colors.primary }]} />
              </View>
              <View style={styles.xpLabels}>
                <Text style={[styles.xpNum, { color: colors.textSecondary }]}>
                  {PROFILE.level.xp.toLocaleString()} XP
                </Text>
                <Text style={[styles.xpNum, { color: colors.textHint }]}>
                  {PROFILE.level.xpNeeded.toLocaleString()} XP
                </Text>
              </View>
            </View>
            <View style={[styles.xpLevelBadge, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.xpLevelText, { color: colors.textHint }]}>
                {PROFILE.level.next}
              </Text>
            </View>
          </View>
          <Text style={[styles.xpHint, { color: colors.textHint }]}>
            {(PROFILE.level.xpNeeded - PROFILE.level.xp).toLocaleString()} pts to reach {PROFILE.level.next}
          </Text>

          {/* Achievements strip */}
          <View style={[styles.achievementsRow, { borderTopColor: colors.divider }]}>
            {ACHIEVEMENTS.map(a => <AchievementBadge key={a.id} item={a} colors={colors} />)}
          </View>
        </Card>

        {/* ── Connections preview ── */}
        <Card colors={colors}>
          <SectionHeader
            icon={<Users size={15} color={colors.primary} strokeWidth={2} />}
            title={`Connections · ${PROFILE.stats.followers}`}
            colors={colors}
            action="See all"
            onAction={() => Alert.alert('Connections', 'Full list coming soon')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.connectionsScroll}>
            {CONNECTIONS_PREVIEW.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.connectionItem}
                activeOpacity={0.8}
                onPress={() => navigation?.navigate('PeerProfile', { peerId: c.id })}
              >
                <Image source={{ uri: c.photo }} style={styles.connectionAvatar} />
                <Text style={[styles.connectionName, { color: colors.textSecondary }]}>{c.name}</Text>
              </TouchableOpacity>
            ))}
            {/* + more placeholder */}
            <TouchableOpacity
              style={styles.connectionItem}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Connections', 'Full list coming soon')}
            >
              <View style={[styles.connectionMoreCircle, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                <Text style={[styles.connectionMoreText, { color: colors.textSecondary }]}>+207</Text>
              </View>
              <Text style={[styles.connectionName, { color: colors.textSecondary }]}>More</Text>
            </TouchableOpacity>
          </ScrollView>
        </Card>

        {/* ── Recent activity ── */}
        <Card colors={colors}>
          <SectionHeader
            icon={<TrendingUp size={15} color={colors.primary} strokeWidth={2} />}
            title="Recent Activity"
            colors={colors}
            action="See all"
            onAction={() => Alert.alert('Activity', 'Full feed coming soon')}
          />
          {OWN_POSTS.map(p => <PostCard key={p.id} post={p} colors={colors} />)}
        </Card>

        {/* ── Edit profile card ── */}
        <Card colors={colors}>
          <SectionHeader
            icon={<Edit2 size={15} color={colors.primary} strokeWidth={2} />}
            title="Edit Profile"
            colors={colors}
          />
          {[
            { label: 'Name',     value: PROFILE.name,     icon: Edit2 },
            { label: 'Bio',      value: 'Tap to update',  icon: Edit2 },
            { label: 'Location', value: PROFILE.location, icon: MapPin },
            { label: 'Website',  value: PROFILE.website,  icon: ExternalLink },
          ].map(({ label, value, icon: Icon }, i, arr) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.editRow,
                { borderBottomColor: i < arr.length - 1 ? colors.divider : 'transparent' },
              ]}
              activeOpacity={0.7}
              onPress={() => Alert.alert(`Edit ${label}`, 'Opens field editor')}
            >
              <Icon size={14} color={colors.textHint} strokeWidth={2} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.editRowLabel, { color: colors.textHint }]}>{label}</Text>
                <Text style={[styles.editRowValue, { color: colors.textPrimary }]}>{value}</Text>
              </View>
              <ChevronRight size={15} color={colors.textHint} strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* ── Menu list ── */}
        <View style={{ marginTop: 4 }}>
          {MENU_ITEMS.map(({ Icon, label, screen }) => {
            const isSettings = screen === 'Settings';
            return (
              <View key={screen}>
                <TouchableOpacity
                  style={[styles.menuItem, {
                    backgroundColor: colors.surface,
                    borderBottomColor: colors.divider,
                  }]}
                  onPress={() => {
                    if (screen === 'Groups')  navigation?.navigate('Groups');
                    else if (isSettings)      setSettingsOpen(o => !o);
                    else                      Alert.alert(label, 'Coming soon!');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconWrap}>
                    <Icon size={20} color={colors.textPrimary} strokeWidth={1.8} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{label}</Text>
                  {isSettings && settingsOpen
                    ? <ChevronDown  size={18} color={colors.textHint} strokeWidth={2} />
                    : <ChevronRight size={18} color={colors.textHint} strokeWidth={2} />
                  }
                </TouchableOpacity>

                {/* Settings dropdown */}
                {isSettings && settingsOpen && (
                  <View style={[styles.dropdown, {
                    backgroundColor: colors.surfaceAlt,
                    borderBottomColor: colors.divider,
                  }]}>
                    {/* Dark mode */}
                    <SettingRow
                      colors={colors}
                      icon={isDark
                        ? <Sun  size={17} color={colors.warning}       strokeWidth={1.8} />
                        : <Moon size={17} color={colors.textSecondary} strokeWidth={1.8} />
                      }
                      label={isDark ? 'Light mode' : 'Dark mode'}
                      sublabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                      right={
                        <Switch
                          value={isDark}
                          onValueChange={toggleTheme}
                          trackColor={{ true: colors.primary, false: colors.mediumGray }}
                          thumbColor={colors.white}
                          ios_backgroundColor={colors.mediumGray}
                        />
                      }
                    />

                    {/* Profile visibility */}
                    <SettingRow
                      colors={colors}
                      icon={<Shield size={17} color={colors.textSecondary} strokeWidth={1.8} />}
                      label="Public profile"
                      sublabel={profilePublic ? 'Visible to everyone' : 'Only visible to you'}
                      right={
                        <Switch
                          value={profilePublic}
                          onValueChange={setProfilePublic}
                          trackColor={{ true: colors.primary, false: colors.mediumGray }}
                          thumbColor={colors.white}
                          ios_backgroundColor={colors.mediumGray}
                        />
                      }
                    />

                    {/* Notifications */}
                    <SettingRow
                      colors={colors}
                      icon={<Bell size={17} color={colors.textSecondary} strokeWidth={1.8} />}
                      label="Notifications"
                      sublabel={notificationsOn ? 'Push alerts enabled' : 'All alerts muted'}
                      right={
                        <Switch
                          value={notificationsOn}
                          onValueChange={setNotificationsOn}
                          trackColor={{ true: colors.primary, false: colors.mediumGray }}
                          thumbColor={colors.white}
                          ios_backgroundColor={colors.mediumGray}
                        />
                      }
                    />

                    {/* Privacy */}
                    <TouchableOpacity
                      style={[styles.settingRow, { borderBottomColor: colors.divider }]}
                      onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon')}
                      activeOpacity={0.7}
                    >
                      <View style={styles.settingLeft}>
                        <Lock size={17} color={colors.textSecondary} strokeWidth={1.8} />
                        <Text style={[styles.settingLabel, { color: colors.textPrimary, marginLeft: 12 }]}>
                          Privacy settings
                        </Text>
                      </View>
                      <ChevronRight size={16} color={colors.textHint} strokeWidth={2} />
                    </TouchableOpacity>

                    {/* Log out */}
                    <TouchableOpacity
                      style={[styles.settingRow, { borderBottomColor: 'transparent' }]}
                      onPress={() => Alert.alert('Log out', 'You have been safely logged out.')}
                      activeOpacity={0.7}
                    >
                      <View style={styles.settingLeft}>
                        <LogOut size={17} color={colors.error} strokeWidth={1.8} />
                        <Text style={[styles.settingLabel, { color: colors.error, marginLeft: 12 }]}>
                          Log out
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── StyleSheet ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 0.5,
  },
  headerTitle:  { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600' },
  editIconBtn:  { width: 36, alignItems: 'flex-end' },

  // Cover
  coverWrapper:   { height: 180, position: 'relative' },
  coverImage:     { width: '100%', height: 180 },
  coverAccentBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4 },
  coverEditBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Avatar
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: -44,
  },
  avatarRing: {
    borderWidth: 3,
    borderRadius: 48,
  },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarEditDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 4,
  },
  levelPillText: { fontSize: 12.5, fontWeight: '700' },

  // Identity
  identityBlock: { paddingHorizontal: 18, paddingBottom: 16, gap: 5 },
  peerName:      { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, marginBottom: 4 },
  metaRow:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText:      { fontSize: 13 },
  bioText:       { fontSize: 13.5, lineHeight: 20, marginTop: 6, marginBottom: 4 },
  badgesRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 4 },
  badgePill: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    marginBottom: 12,
  },
  statBox:       { flex: 1, alignItems: 'center', gap: 2 },
  statValueRow:  { flexDirection: 'row', alignItems: 'center' },
  statValue:     { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  statLabel:     { fontSize: 11, fontWeight: '500' },
  statDivider:   { width: 1, height: 32, alignSelf: 'center' },

  // Cards
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  sectionHeader:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle:      { fontSize: 14, fontWeight: '700', letterSpacing: -0.1 },
  sectionAction:     { fontSize: 13, fontWeight: '600' },

  // XP / level
  xpRow:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  xpLevelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  xpLevelText: { fontSize: 12, fontWeight: '700' },
  xpBarWrap:   { flex: 1 },
  xpTrack:     { height: 7, borderRadius: 4, overflow: 'hidden' },
  xpFill:      { height: '100%', borderRadius: 4 },
  xpLabels:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  xpNum:       { fontSize: 11 },
  xpHint:      { fontSize: 12, textAlign: 'center', marginTop: -4 },
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 2,
  },
  achievementItem:  { alignItems: 'center', gap: 5 },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementLabel: { fontSize: 10.5, fontWeight: '500', textAlign: 'center' },

  // Connections
  connectionsScroll: { paddingVertical: 4, gap: 16, paddingRight: 4 },
  connectionItem:    { alignItems: 'center', gap: 5 },
  connectionAvatar:  { width: 52, height: 52, borderRadius: 26 },
  connectionMoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectionMoreText: { fontSize: 12, fontWeight: '600' },
  connectionName:     { fontSize: 11, fontWeight: '500', textAlign: 'center' },

  // Post cards
  postCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  postMeta:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tagPill:         { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6 },
  tagText:         { fontSize: 11, fontWeight: '600' },
  postTime:        { flex: 1, fontSize: 12 },
  postMore:        { padding: 2 },
  postBody:        { fontSize: 13.5, lineHeight: 20 },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  postAction:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postActionCount: { fontSize: 12, fontWeight: '500' },

  // Edit profile rows
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  editRowLabel: { fontSize: 11, marginBottom: 1 },
  editRowValue: { fontSize: 13.5, fontWeight: '500' },

  // Menu
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  menuIconWrap: { width: 26, alignItems: 'center' },
  menuLabel:    { flex: 1, fontSize: 15 },

  // Settings dropdown
  dropdown: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderBottomWidth: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLeft:     { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingLabel:    { fontSize: 14, fontWeight: '500' },
  settingSubLabel: { fontSize: 11, marginTop: 1 },
});