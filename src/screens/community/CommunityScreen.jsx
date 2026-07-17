// src/screens/community/CommunityScreen.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  StatusBar,
  Animated,
  LayoutAnimation,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Users, Bell, Heart, MessageCircle,
  Plus, Send, TrendingUp,
} from 'lucide-react-native';
import { useColors } from '../../constants/colors';

// ─── Constants ────────────────────────────────────────────────────────────────

const PROFILE_PHOTOS = {
  ej: 'https://randomuser.me/api/portraits/women/44.jpg',
  dc: 'https://randomuser.me/api/portraits/men/32.jpg',
  sm: 'https://randomuser.me/api/portraits/women/68.jpg',
  jk: 'https://randomuser.me/api/portraits/men/75.jpg',
  la: 'https://randomuser.me/api/portraits/women/21.jpg',
  me: 'https://randomuser.me/api/portraits/men/11.jpg',
};

const SUGGESTED_PEERS = [
  { id: 'ej', initials: 'EJ', name: 'Emma J.',   bg: '#B5D4F4', color: '#185FA5', photo: PROFILE_PHOTOS.ej },
  { id: 'dc', initials: 'DC', name: 'David C.',  bg: '#9FE1CB', color: '#0F6E56', photo: PROFILE_PHOTOS.dc },
  { id: 'sm', initials: 'SM', name: 'Sophia M.', bg: '#F5C4B3', color: '#993C1D', photo: PROFILE_PHOTOS.sm },
  { id: 'jk', initials: 'JK', name: 'James K.',  bg: '#C0DD97', color: '#3B6D11', photo: PROFILE_PHOTOS.jk },
  { id: 'la', initials: 'LA', name: 'Lily A.',   bg: '#F4C0D1', color: '#993556', photo: PROFILE_PHOTOS.la },
];

const INITIAL_POSTS = [
  {
    id: '1', authorId: 'ej', authorName: 'Emma Johnson', authorInitials: 'EJ',
    authorBg: '#B5D4F4', authorColor: '#185FA5', authorPhoto: PROFILE_PHOTOS.ej,
    badge: 'Finance Major', group: 'Investment Club', time: '2h ago',
    likes: 12, liked: false, replies: [], reactions: {},
    text: "What are your thoughts on the recent Fed decision? Anyone following the yield curve closely?",
  },
  {
    id: '2', authorId: 'dc', authorName: 'David Chen', authorInitials: 'DC',
    authorBg: '#9FE1CB', authorColor: '#0F6E56', authorPhoto: PROFILE_PHOTOS.dc,
    badge: 'Investment Club', group: 'FinTech Enthusiasts', time: '9h ago',
    likes: 5, liked: false, reactions: {},
    replies: [
      {
        id: 'r1', authorId: 'sm', authorName: 'Sophia M.', authorInitials: 'SM',
        authorBg: '#F5C4B3', authorColor: '#993C1D', authorPhoto: PROFILE_PHOTOS.sm,
        text: 'Totally agree, duration is key right now.', time: '1h ago', reactions: {},
      }
    ],
    text: "It signals a shift in market sentiment. Rate pause looks likely next quarter — tracking since the last FOMC meeting.",
  },
  {
    id: '3', authorId: 'sm', authorName: 'Sophia Martinez', authorInitials: 'SM',
    authorBg: '#F5C4B3', authorColor: '#993C1D', authorPhoto: PROFILE_PHOTOS.sm,
    badge: 'Finance Major', group: 'Women in Finance', time: '30m ago',
    likes: 3, liked: false, replies: [], reactions: {},
    text: "Agreed! Let's discuss in our next meet. Sharing a summary from last week's Bloomberg session on duration risk.",
  },
];

const TRENDING_TAGS = ['#FedRate', '#YieldCurve', '#BlockchainFinance', '#InternshipTips', '#CFA2025'];

const TRENDING_TOPICS_LIST = [
  { id: '1', rank: 1, tag: '#YieldCurve',        category: 'Macroeconomics',  posts: '342' },
  { id: '2', rank: 2, tag: '#FedRate',           category: 'Monetary Policy', posts: '289' },
  { id: '3', rank: 3, tag: '#InternshipTips',    category: 'Careers',         posts: '156' },
  { id: '4', rank: 4, tag: '#CFA2025',           category: 'Certifications',  posts: '112' },
  { id: '5', rank: 5, tag: '#BlockchainFinance', category: 'FinTech',         posts: '84'  },
];

// Quick-reaction emojis shown in the WhatsApp-style floating bar
const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '👏', '🔥'];

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initials, bg, color, size = 38, photo, onPress, style }) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = photo && !imgError;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        style,
      ]}
      activeOpacity={0.8}
    >
      {showPhoto ? (
        <Image
          source={{ uri: photo }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          onError={() => setImgError(true)}
        />
      ) : (
        <Text style={[styles.avatarText, { color, fontSize: size * 0.35 }]}>{initials}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Emoji Reaction Bar (WhatsApp-style floating picker) ──────────────────────

function EmojiReactionBar({ visible, onSelect, onClose, isMe }) {
  const scaleAnim  = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 1, useNativeDriver: true, tension: 200, friction: 12 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim,   { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.View
          style={[
            styles.reactionBar,
            isMe ? styles.reactionBarRight : styles.reactionBarLeft,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          {QUICK_REACTIONS.map((emoji, i) => (
            <ReactionEmoji key={emoji} emoji={emoji} delay={i * 20} onSelect={onSelect} />
          ))}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Individual emoji with its own bounce-in stagger
function ReactionEmoji({ emoji, delay, onSelect }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 260,
      friction: 10,
      delay,
    }).start();
  }, []);

  const handlePress = () => {
    // Punch animation on press
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.4, useNativeDriver: true, tension: 400, friction: 8 }),
      Animated.spring(scale, { toValue: 1,   useNativeDriver: true, tension: 300, friction: 10 }),
    ]).start(() => onSelect(emoji));
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.reactionEmojiBtn} activeOpacity={0.7}>
      <Animated.Text style={[styles.reactionEmojiChar, { transform: [{ scale }] }]}>
        {emoji}
      </Animated.Text>
    </TouchableOpacity>
  );
}

// Floating reaction badge that sits below a bubble
function ReactionBadges({ reactions, colors }) {
  const entries = Object.entries(reactions).filter(([, count]) => count > 0);
  if (entries.length === 0) return null;

  return (
    <View style={styles.reactionBadgesRow}>
      {entries.map(([emoji, count]) => (
        <FloatingBadge key={emoji} emoji={emoji} count={count} colors={colors} />
      ))}
    </View>
  );
}

function FloatingBadge({ emoji, count, colors }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 260,
      friction: 10,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.reactionBadge,
        { backgroundColor: colors.surface, borderColor: colors.border, transform: [{ scale }] },
      ]}
    >
      <Text style={styles.reactionBadgeEmoji}>{emoji}</Text>
      {count > 1 && (
        <Text style={[styles.reactionBadgeCount, { color: colors.textSecondary }]}>{count}</Text>
      )}
    </Animated.View>
  );
}

// ─── Reply Thread ─────────────────────────────────────────────────────────────

function ReplyThread({ replies, postId, onAddReply, onAvatarPress, onReactToReply, colors }) {
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const replyInputRef = useRef(null);

  const handleSendReply = useCallback(() => {
    const text = replyText.trim();
    if (!text) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    onAddReply(postId, {
      id: Date.now().toString(),
      authorId: 'me',
      authorName: 'You',
      authorInitials: 'AR',
      authorBg: colors.primaryLight,
      authorColor: colors.primaryDark,
      authorPhoto: PROFILE_PHOTOS.me,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text,
      reactions: {},
    });

    setReplyText('');
    Keyboard.dismiss();
  }, [replyText, postId, onAddReply, colors]);

  const handleReact = useCallback((replyId, emoji) => {
    setActiveReplyId(null);
    onReactToReply(postId, replyId, emoji);
  }, [postId, onReactToReply]);

  return (
    <View style={[styles.replyThread, { borderLeftColor: colors.border }]}>
      {replies.map(reply => (
        <View key={reply.id}>
          <Pressable
            onLongPress={() => setActiveReplyId(prev => prev === reply.id ? null : reply.id)}
            delayLongPress={300}
          >
            <View style={styles.replyRow}>
              <Avatar
                initials={reply.authorInitials}
                bg={reply.authorBg}
                color={reply.authorColor}
                photo={reply.authorPhoto}
                size={24}
                onPress={() => onAvatarPress(reply.authorId)}
              />
              <View style={[styles.replyBubble, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.replyName, { color: colors.textPrimary }]}>{reply.authorName}</Text>
                <Text style={[styles.replyBodyText, { color: colors.textPrimary }]}>{reply.text}</Text>
                <Text style={[styles.replyTime, { color: colors.textHint }]}>{reply.time}</Text>
              </View>
            </View>
          </Pressable>

          {/* Reaction bar for this reply */}
          {activeReplyId === reply.id && (
            <EmojiReactionBar
              visible={true}
              onSelect={(emoji) => handleReact(reply.id, emoji)}
              onClose={() => setActiveReplyId(null)}
              isMe={false}
            />
          )}

          <ReactionBadges reactions={reply.reactions || {}} colors={colors} />
        </View>
      ))}

      <View style={styles.replyInputRow}>
        <Avatar
          initials="AR"
          bg={colors.primaryLight}
          color={colors.primaryDark}
          photo={PROFILE_PHOTOS.me}
          size={24}
        />
        <View style={[styles.replyInputInner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            ref={replyInputRef}
            style={[styles.replyInput, { color: colors.textPrimary }]}
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textHint}
            returnKeyType="send"
            onSubmitEditing={handleSendReply}
            blurOnSubmit={false}
            autoFocus
          />
          <TouchableOpacity
            onPress={handleSendReply}
            disabled={!replyText.trim()}
            style={[!replyText.trim() && { opacity: 0.35 }]}
          >
            <Send size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Feed Bubble ──────────────────────────────────────────────────────────────

function FeedBubble({ post, onAvatarPress, onLike, onToggleReply, isExpanded, onAddReply, onReact, onReactToReply, colors }) {
  const isMe = post.authorId === 'me';
  const [showReactionBar, setShowReactionBar] = useState(false);

  const handleReact = useCallback((emoji) => {
    setShowReactionBar(false);
    onReact(post.id, emoji);
  }, [post.id, onReact]);

  return (
    <View style={styles.bubbleWrapper}>
      <View style={[styles.bubbleRow, isMe ? styles.bubbleRowSent : styles.bubbleRowReceived]}>
        {!isMe && (
          <Avatar
            initials={post.authorInitials}
            bg={post.authorBg}
            color={post.authorColor}
            photo={post.authorPhoto}
            size={32}
            onPress={() => onAvatarPress(post.authorId)}
            style={styles.bubbleAvatar}
          />
        )}

        <View style={[styles.bubbleContent, isMe && styles.bubbleContentSent]}>
          {!isMe && (
            <View style={styles.bubbleHeader}>
              <Text style={[styles.bubbleName, { color: colors.textPrimary }]}>{post.authorName}</Text>
              <View style={[styles.bubbleBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.bubbleBadgeText, { color: colors.primaryDark }]}>{post.badge}</Text>
              </View>
            </View>
          )}

          {/* Long-press triggers reaction bar */}
          <Pressable
            onLongPress={() => setShowReactionBar(prev => !prev)}
            delayLongPress={300}
          >
            <View style={[
              styles.bubble,
              isMe
                ? [styles.bubbleSent,     { backgroundColor: colors.primary }]
                : [styles.bubbleReceived, { backgroundColor: colors.surface }],
            ]}>
              <Text style={[styles.bubbleText, { color: isMe ? '#FFFFFF' : colors.textPrimary }]}>
                {post.text}
              </Text>
            </View>
          </Pressable>

          {/* Reaction picker floats just above the footer */}
          {showReactionBar && (
            <EmojiReactionBar
              visible={showReactionBar}
              onSelect={handleReact}
              onClose={() => setShowReactionBar(false)}
              isMe={isMe}
            />
          )}

          {/* Reaction badges beneath bubble */}
          <ReactionBadges reactions={post.reactions || {}} colors={colors} />

          <View style={[styles.bubbleFooter, isMe && { justifyContent: 'flex-end' }]}>
            <Text style={[styles.bubbleTime, { color: colors.textSecondary }, isMe && styles.bubbleTimeRight]}>
              {post.time}
            </Text>
            {!isMe && (
              <>
                <Text style={[styles.bubbleDot, { color: colors.textHint }]}>•</Text>

                <TouchableOpacity style={styles.bubbleAction} onPress={() => onLike(post.id)}>
                  <Heart
                    size={14}
                    color={post.liked ? colors.primary : colors.textSecondary}
                    fill={post.liked ? colors.primary : 'transparent'}
                  />
                  <Text style={[styles.bubbleActionText, { color: colors.textSecondary }, post.liked && { color: colors.primary, fontWeight: '600' }]}>
                    {post.likes}
                  </Text>
                </TouchableOpacity>

                <Text style={[styles.bubbleDot, { color: colors.textHint }]}>•</Text>

                <TouchableOpacity style={styles.bubbleAction} onPress={() => onToggleReply(post.id)}>
                  <MessageCircle size={14} color={isExpanded ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.bubbleActionText, { color: colors.textSecondary }, isExpanded && { color: colors.primary }]}>
                    {post.replies?.length > 0
                      ? `${post.replies.length} Comment${post.replies.length === 1 ? '' : 's'}`
                      : 'Comment'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      {!isMe && isExpanded && (
        <ReplyThread
          replies={post.replies ?? []}
          postId={post.id}
          onAddReply={onAddReply}
          onAvatarPress={onAvatarPress}
          onReactToReply={onReactToReply}
          colors={colors}
        />
      )}
    </View>
  );
}

// ─── Community Screen ─────────────────────────────────────────────────────────

export default function CommunityScreen({ navigation }) {
  // ✅ Dark mode: useColors() subscribes to ThemeContext — re-renders on toggle
  const colors = useColors();

  const [subTab, setSubTab]                 = useState('all');
  const [posts, setPosts]                   = useState(INITIAL_POSTS);
  const [inputText, setInputText]           = useState('');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const inputRef                            = useRef(null);
  const scrollRef                           = useRef(null);

  const dismissAll = useCallback(() => {
    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedPostId(null);
  }, []);

  const handleLike = useCallback((id) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }, []);

  const handleToggleReply = useCallback((id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedPostId(prev => prev === id ? null : id);
  }, []);

  const handleAddReply = useCallback((postId, reply) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, replies: [...(p.replies ?? []), reply] }
          : p
      )
    );
  }, []);

  // Add or increment an emoji reaction on a post
  const handleReact = useCallback((postId, emoji) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const current = p.reactions?.[emoji] ?? 0;
        return { ...p, reactions: { ...p.reactions, [emoji]: current + 1 } };
      })
    );
  }, []);

  // Add or increment a reaction on a reply
  const handleReactToReply = useCallback((postId, replyId, emoji) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          replies: p.replies.map(r => {
            if (r.id !== replyId) return r;
            const current = r.reactions?.[emoji] ?? 0;
            return { ...r, reactions: { ...r.reactions, [emoji]: current + 1 } };
          }),
        };
      })
    );
  }, []);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newPost = {
      id: Date.now().toString(),
      authorId: 'me',
      authorName: 'You',
      authorInitials: 'AR',
      authorBg: colors.primaryLight,
      authorColor: colors.primaryDark,
      authorPhoto: PROFILE_PHOTOS.me,
      badge: 'Finance Major',
      group: 'All',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      liked: false,
      replies: [],
      reactions: {},
      text,
    };
    setPosts(prev => [...prev, newPost]);
    setInputText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [inputText, colors]);

  const goToProfile = useCallback((peerId) => {
    dismissAll();
    navigation?.navigate('PeerProfile', { peerId });
  }, [navigation, dismissAll]);

  const renderHeader = () => (
    <View style={{ marginBottom: 16 }}>
      <View style={[styles.discoverSection, { borderBottomColor: colors.divider, backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PEOPLE YOU MAY KNOW</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.peerScroll}>
          {SUGGESTED_PEERS.map(p => (
            <TouchableOpacity key={p.id} style={styles.personChip} onPress={() => goToProfile(p.id)}>
              <Avatar initials={p.initials} bg={p.bg} color={p.color} photo={p.photo} size={50} />
              <Text style={[styles.personName, { color: colors.textSecondary }]}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.trendingSection, { borderBottomColor: colors.divider, backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>TRENDING TOPICS</Text>
        <View style={styles.tagsWrap}>
          {TRENDING_TAGS.map(tag => (
            <TouchableOpacity key={tag} style={[styles.trendingTag, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <Text style={[styles.trendingTagText, { color: colors.textPrimary }]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderBubble = useCallback(({ item }) => (
    <FeedBubble
      post={item}
      onAvatarPress={goToProfile}
      onLike={handleLike}
      onToggleReply={handleToggleReply}
      isExpanded={expandedPostId === item.id}
      onAddReply={handleAddReply}
      onReact={handleReact}
      onReactToReply={handleReactToReply}
      colors={colors}
    />
  ), [expandedPostId, goToProfile, handleLike, handleToggleReply, handleAddReply, handleReact, handleReactToReply, colors]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* ✅ StatusBar follows theme */}
      <StatusBar barStyle={colors === colors ? 'dark-content' : 'light-content'} backgroundColor={colors.surface} />

      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} pointerEvents="none">Community</Text>
        <View style={{ flex: 1 }} />
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation?.navigate('Groups')} style={styles.headerIcon}>
            <Users size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Bell size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.subToggleBar, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
        {['all', 'following', 'trending'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.subTab,
              { backgroundColor: colors.surfaceAlt },
              subTab === tab && { backgroundColor: colors.primary },
              tab === 'trending' && subTab === tab && { flexDirection: 'row', alignItems: 'center', gap: 4 },
            ]}
            onPress={() => { setSubTab(tab); if (tab === 'trending') dismissAll(); }}
            activeOpacity={0.8}
          >
            {tab === 'trending' && subTab === tab && <TrendingUp size={13} color="#FFFFFF" />}
            <Text style={[
              styles.subTabLabel,
              { color: colors.textSecondary },
              subTab === tab && { color: '#FFFFFF', fontWeight: '600' },
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 85 : 0}
      >
        <TouchableWithoutFeedback onPress={dismissAll} accessible={false}>
          <View style={{ flex: 1 }}>
            {subTab === 'all' && (
              <FlatList
                ref={scrollRef}
                data={posts}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={renderBubble}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={Platform.OS === 'android'}
                contentContainerStyle={{ paddingBottom: expandedPostId ? (Platform.OS === 'ios' ? 100 : 80) : 16 }}
                onContentSizeChange={() => {
                  if (posts.length > INITIAL_POSTS.length) {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }
                }}
              />
            )}

            {subTab === 'following' && (
              <View style={styles.emptyState}>
                <Users size={42} color={colors.textHint} style={styles.emptyIcon} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Your following feed</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Follow students to see their posts here.</Text>
              </View>
            )}

            {subTab === 'trending' && (
              <ScrollView style={[styles.trendingContainer, { backgroundColor: colors.surface }]} showsVerticalScrollIndicator={false}>
                <Text style={[styles.trendingHeader, { color: colors.textPrimary }]}>What's happening right now</Text>
                {TRENDING_TOPICS_LIST.map(topic => (
                  <TouchableOpacity key={topic.id} style={[styles.trendingListItem, { borderBottomColor: colors.divider }]} onPress={dismissAll}>
                    <Text style={[styles.trendingRank, { color: colors.textHint }]}>{topic.rank}</Text>
                    <View style={styles.trendingInfo}>
                      <Text style={[styles.trendingCategory, { color: colors.textSecondary }]}>{topic.category} · Trending</Text>
                      <Text style={[styles.trendingTagLabel, { color: colors.textPrimary }]}>{topic.tag}</Text>
                      <Text style={[styles.trendingMetrics, { color: colors.textSecondary }]}>{topic.posts} posts today</Text>
                    </View>
                    <TouchableOpacity style={styles.trendingAction}>
                      <Text style={{ fontSize: 18, color: colors.textHint, fontWeight: '700' }}>⋮</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableWithoutFeedback>

        {!expandedPostId && (
          <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
            <TouchableOpacity style={styles.attachBtn}>
              <Plus size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.inputInner, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <TextInput
                ref={inputRef}
                style={[styles.textInput, { color: colors.textPrimary }]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Share something..."
                placeholderTextColor={colors.textHint}
                multiline
                maxLength={500}
                returnKeyType="default"
                blurOnSubmit={false}
                scrollEnabled
              />
            </View>

            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: colors.primary }, !inputText.trim() && { backgroundColor: colors.primaryLight }]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send size={16} color="#FFFFFF" style={styles.sendIcon} />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles (layout only — no color values) ───────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 50,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    position: 'absolute',
    left: 0, right: 0,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    zIndex: 10,
  },
  headerRight: { flexDirection: 'row', gap: 12, zIndex: 20 },
  headerIcon:  { padding: 2 },

  subToggleBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
  },
  subTab:      { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  subTabLabel: { fontSize: 13, fontWeight: '500' },

  discoverSection: { paddingVertical: 10, borderBottomWidth: 0.5 },
  sectionLabel:    { fontSize: 11, fontWeight: '600', paddingHorizontal: 16, marginBottom: 8, letterSpacing: 0.5 },
  peerScroll:      { paddingHorizontal: 16, gap: 12 },
  personChip:      { alignItems: 'center', gap: 4, width: 62 },
  personName:      { fontSize: 11, textAlign: 'center' },
  avatar:          { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarText:      { fontWeight: '600' },

  trendingSection: { padding: 14, paddingHorizontal: 16, borderBottomWidth: 0.5 },
  tagsWrap:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trendingTag:     { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 0.5 },
  trendingTagText: { fontSize: 13 },

  trendingContainer: { flex: 1, padding: 16 },
  trendingHeader:    { fontSize: 18, fontWeight: '700', marginBottom: 20 },
  trendingListItem:  { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0, paddingVertical: 14, borderBottomWidth: 0.5 },
  trendingRank:      { width: 26, fontSize: 15, fontWeight: '600', marginTop: 1 },
  trendingInfo:      { flex: 1 },
  trendingCategory:  { fontSize: 12, marginBottom: 4 },
  trendingTagLabel:  { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  trendingMetrics:   { fontSize: 12 },
  trendingAction:    { paddingHorizontal: 8 },

  bubbleWrapper:     { marginBottom: 4 },
  bubbleRow:         { flexDirection: 'row', marginBottom: 4, alignItems: 'flex-end', paddingHorizontal: 16 },
  bubbleRowReceived: { justifyContent: 'flex-start' },
  bubbleRowSent:     { justifyContent: 'flex-end' },
  bubbleAvatar:      { marginRight: 8 },
  bubbleContent:     { maxWidth: '75%' },
  bubbleContentSent: { marginRight: 0 },

  bubbleHeader:    { flexDirection: 'row', alignItems: 'center', marginBottom: 6, marginLeft: 2, gap: 6 },
  bubbleName:      { fontSize: 13, fontWeight: '600' },
  bubbleBadge:     { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  bubbleBadgeText: { fontSize: 10, fontWeight: '600' },

  bubble:         { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleReceived: { borderBottomLeftRadius: 4, ...CARD_SHADOW },
  bubbleSent:     { borderBottomRightRadius: 4 },

  bubbleText: { fontSize: 14, lineHeight: 20 },

  bubbleFooter:    { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginLeft: 4 },
  bubbleTime:      { fontSize: 11 },
  bubbleTimeRight: { textAlign: 'right', marginRight: 4 },
  bubbleDot:       { fontSize: 11, marginHorizontal: 6 },
  bubbleAction:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bubbleActionText:{ fontSize: 12 },

  // WhatsApp-style reaction bar
  reactionBar: {
    position: 'absolute',
    bottom: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
  },
  reactionBarLeft:  { left: 40 },
  reactionBarRight: { right: 0 },
  reactionEmojiBtn: { padding: 4 },
  reactionEmojiChar:{ fontSize: 26 },

  // Reaction badges shown beneath bubbles
  reactionBadgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4, marginLeft: 4 },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  reactionBadgeEmoji: { fontSize: 14 },
  reactionBadgeCount: { fontSize: 12, fontWeight: '600' },

  replyThread: {
    marginLeft: 56,
    marginRight: 16,
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
  },
  replyRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 6 },
  replyBubble:   { flex: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  replyName:     { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  replyBodyText: { fontSize: 12, lineHeight: 17 },
  replyTime:     { fontSize: 10, marginTop: 3 },

  replyInputRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  replyInputInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  replyInput: { flex: 1, fontSize: 12, minHeight: 20, maxHeight: 60 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon:  { marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  emptyText:  { fontSize: 13, textAlign: 'center' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 45 : 30,
    borderTopWidth: 1,
    gap: 8,
  },
  attachBtn:  { paddingBottom: 6 },
  inputInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 22,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 8,
  },
  textInput: { flex: 1, fontSize: 14, maxHeight: 100, minHeight: 22, lineHeight: 20 },
  sendBtn:   { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sendIcon:  { marginLeft: 2, marginTop: 2 },
});