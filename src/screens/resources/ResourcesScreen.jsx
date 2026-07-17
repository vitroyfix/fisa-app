// src/screens/resources/ResourcesScreen.jsx
//
// Resource library for finance & investment students.
// ✅ useColors() — fully dark/light aware, zero hardcoded hex
// ✅ Mock server fetch with loading skeleton + error state
// ✅ Search bar with live filter
// ✅ Category filter strip (asset-class style chips)
// ✅ Featured horizontal scroll (hero cards)
// ✅ All Resources vertical list with save toggle
// ✅ Consistent with FISA design language (same tokens, same icon library)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Animated,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  BookOpen,
  TrendingUp,
  BarChart2,
  Globe,
  DollarSign,
  Layers,
  FileText,
  Video,
  Link2,
  Bookmark,
  Clock,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Star,
  Download,
  X,
} from 'lucide-react-native';
import { useColors } from '../../constants/colors';

// ─── Category config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',          label: 'All',           Icon: Layers     },
  { id: 'equity',       label: 'Equity',        Icon: TrendingUp },
  { id: 'fixed-income', label: 'Fixed Income',  Icon: BarChart2  },
  { id: 'macro',        label: 'Macro',         Icon: Globe      },
  { id: 'valuation',    label: 'Valuation',     Icon: DollarSign },
  { id: 'fintech',      label: 'FinTech',       Icon: Layers     },
  { id: 'careers',      label: 'Careers',       Icon: BookOpen   },
];

// ─── Resource type → icon map ─────────────────────────────────────────────────
const TYPE_ICONS = {
  article: FileText,
  video:   Video,
  pdf:     Download,
  link:    Link2,
};

// ─── Tag tokens (reuse app-wide palette) ─────────────────────────────────────
const TAG_TOKENS = {
  equity:       { bg: 'tagBlue',   text: 'tagBlueText'   },
  'fixed-income':{ bg: 'tagTeal',  text: 'tagTealText'   },
  macro:        { bg: 'tagPurple', text: 'tagPurpleText' },
  valuation:    { bg: 'tagAmber',  text: 'tagAmberText'  },
  fintech:      { bg: 'tagGreen',  text: 'tagGreenText'  },
  careers:      { bg: 'tagGray',   text: 'tagGrayText'   },
};

// ─── Mock API ─────────────────────────────────────────────────────────────────
const MOCK_RESOURCES = [
  // Featured (pinned top)
  {
    id: 'r1',
    title: 'Understanding Yield Curve Inversions',
    summary: 'A deep dive into why yield curves invert, what it signals for recession risk, and how fixed-income investors should reposition duration exposure.',
    category: 'fixed-income',
    type: 'article',
    author: 'CFA Institute',
    readTime: '8 min',
    featured: true,
    saved: false,
    rating: 4.8,
    date: 'Jun 2025',
  },
  {
    id: 'r2',
    title: 'DCF Valuation — From Scratch',
    summary: 'Build a full discounted cash flow model step-by-step. Covers FCF projection, WACC, terminal value, and sensitivity analysis on a real African listed company.',
    category: 'valuation',
    type: 'pdf',
    author: 'FISA Learning',
    readTime: '25 min',
    featured: true,
    saved: false,
    rating: 4.9,
    date: 'May 2025',
  },
  {
    id: 'r3',
    title: 'Equity Research: Initiating Coverage',
    summary: 'How sell-side analysts structure an initiating coverage note. Walk through a real example covering thesis, valuation, risks, and price target derivation.',
    category: 'equity',
    type: 'video',
    author: 'David Chen',
    readTime: '18 min',
    featured: true,
    saved: false,
    rating: 4.7,
    date: 'Jun 2025',
  },
  // Regular
  {
    id: 'r4',
    title: "Fed Policy & EM Capital Flows",
    summary: 'How US rate decisions ripple through emerging markets — currency pressure, portfolio outflows, and central bank response playbooks.',
    category: 'macro',
    type: 'article',
    author: 'IMF Research',
    readTime: '6 min',
    featured: false,
    saved: false,
    rating: 4.5,
    date: 'Jun 2025',
  },
  {
    id: 'r5',
    title: 'Bloomberg Terminal: Bond Functions',
    summary: 'Master YAS, CRVF, SRCH, and DES for fixed-income. Includes shortcut cheat sheet and practice exercises built for the Bloomberg Certification exam.',
    category: 'fixed-income',
    type: 'pdf',
    author: 'Emma Johnson',
    readTime: '12 min',
    featured: false,
    saved: false,
    rating: 4.9,
    date: 'May 2025',
  },
  {
    id: 'r6',
    title: 'DeFi Protocols & Lending Risk',
    summary: 'How algorithmic lending pools price collateral, handle liquidations, and compare to traditional credit risk frameworks. Accessible to TradFi students.',
    category: 'fintech',
    type: 'article',
    author: 'James Kamau',
    readTime: '10 min',
    featured: false,
    saved: false,
    rating: 4.6,
    date: 'Jun 2025',
  },
  {
    id: 'r7',
    title: 'ESG Credit Analysis Framework',
    summary: 'How ESG factors affect credit spreads and default risk. Includes a scoring rubric tested on NSE-listed issuers across energy, real estate, and consumer sectors.',
    category: 'fixed-income',
    type: 'pdf',
    author: 'Sophia Martinez',
    readTime: '15 min',
    featured: false,
    saved: false,
    rating: 4.7,
    date: 'Apr 2025',
  },
  {
    id: 'r8',
    title: "Breaking into Investment Banking",
    summary: "What African IB recruiters actually look for: deal exposure, financial modeling skills, and how to frame a non-target background into a compelling story.",
    category: 'careers',
    type: 'video',
    author: 'FISA Career Hub',
    readTime: '22 min',
    featured: false,
    saved: false,
    rating: 4.8,
    date: 'May 2025',
  },
  {
    id: 'r9',
    title: 'Options Pricing — Black-Scholes Intuition',
    summary: 'Strip away the maths and understand what Black-Scholes is actually measuring. Covers delta, gamma, vega, and theta through real trade examples.',
    category: 'equity',
    type: 'article',
    author: 'CFA Institute',
    readTime: '9 min',
    featured: false,
    saved: false,
    rating: 4.6,
    date: 'Mar 2025',
  },
  {
    id: 'r10',
    title: 'Sub-Saharan Africa: Macro Outlook 2025',
    summary: "Key macro themes for SSA markets — fiscal trajectories, FX reserves, Eurobond refinancing risk, and which economies are best positioned for portfolio inflows.",
    category: 'macro',
    type: 'pdf',
    author: 'World Bank Group',
    readTime: '20 min',
    featured: false,
    saved: false,
    rating: 4.9,
    date: 'Jan 2025',
  },
];

function mockFetch() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) {         // 5 % chance of error for demo
        reject(new Error('Network error'));
      } else {
        resolve(MOCK_RESOURCES);
      }
    }, 1200);
  });
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ colors, wide }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] });

  return (
    <Animated.View
      style={[
        wide ? styles.featuredSkeletonCard : styles.listSkeletonCard,
        { backgroundColor: colors.surface, borderColor: colors.border, opacity },
      ]}
    >
      <View style={[styles.skeletonLine, { width: '40%', backgroundColor: colors.skeleton, marginBottom: 10 }]} />
      <View style={[styles.skeletonLine, { width: '90%', backgroundColor: colors.skeleton }]} />
      <View style={[styles.skeletonLine, { width: '75%', backgroundColor: colors.skeleton, marginTop: 6 }]} />
      {wide && <View style={[styles.skeletonLine, { width: '60%', backgroundColor: colors.skeleton, marginTop: 6 }]} />}
      <View style={[styles.skeletonMeta, { marginTop: 14 }]}>
        <View style={[styles.skeletonDot, { backgroundColor: colors.skeleton }]} />
        <View style={[styles.skeletonLine, { width: '30%', backgroundColor: colors.skeleton }]} />
      </View>
    </Animated.View>
  );
}

// ─── Featured card (horizontal scroll) ────────────────────────────────────────
function FeaturedCard({ resource, colors, onSaveToggle }) {
  const tokens = TAG_TOKENS[resource.category];
  const tagBg   = tokens ? colors[tokens.bg]   : colors.tagGray;
  const tagText = tokens ? colors[tokens.text] : colors.tagGrayText;
  const TypeIcon = TYPE_ICONS[resource.type] ?? FileText;

  return (
    <TouchableOpacity
      style={[styles.featuredCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      activeOpacity={0.85}
      onPress={() => Alert.alert(resource.title, 'Opening resource…')}
    >
      {/* Top row: tag + save */}
      <View style={styles.cardTopRow}>
        <View style={[styles.tagPill, { backgroundColor: tagBg }]}>
          <Text style={[styles.tagText, { color: tagText }]}>
            {CATEGORIES.find(c => c.id === resource.category)?.label ?? resource.category}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onSaveToggle(resource.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Bookmark
            size={16}
            color={resource.saved ? colors.primary : colors.textHint}
            fill={resource.saved ? colors.primary : 'none'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={[styles.featuredTitle, { color: colors.textPrimary }]} numberOfLines={2}>
        {resource.title}
      </Text>

      {/* Summary */}
      <Text style={[styles.featuredSummary, { color: colors.textSecondary }]} numberOfLines={3}>
        {resource.summary}
      </Text>

      {/* Footer */}
      <View style={[styles.cardFooter, { borderTopColor: colors.divider }]}>
        <View style={[styles.typeChip, { backgroundColor: colors.surfaceAlt }]}>
          <TypeIcon size={11} color={colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.typeText, { color: colors.textSecondary }]}>{resource.type}</Text>
        </View>
        <View style={styles.footerMeta}>
          <Clock size={11} color={colors.textHint} strokeWidth={2} />
          <Text style={[styles.metaSmall, { color: colors.textHint }]}>{resource.readTime}</Text>
        </View>
        <View style={styles.footerMeta}>
          <Star size={11} color={colors.primary} fill={colors.primary} strokeWidth={0} />
          <Text style={[styles.metaSmall, { color: colors.textSecondary }]}>{resource.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── List row ─────────────────────────────────────────────────────────────────
function ResourceRow({ resource, colors, onSaveToggle }) {
  const tokens  = TAG_TOKENS[resource.category];
  const tagBg   = tokens ? colors[tokens.bg]   : colors.tagGray;
  const tagText = tokens ? colors[tokens.text] : colors.tagGrayText;
  const TypeIcon = TYPE_ICONS[resource.type] ?? FileText;

  return (
    <TouchableOpacity
      style={[styles.resourceRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
      activeOpacity={0.85}
      onPress={() => Alert.alert(resource.title, 'Opening resource…')}
    >
      {/* Type icon box */}
      <View style={[styles.typeIconBox, { backgroundColor: colors.primaryLight }]}>
        <TypeIcon size={18} color={colors.primary} strokeWidth={2} />
      </View>

      {/* Content */}
      <View style={styles.rowContent}>
        <View style={styles.rowTitleRow}>
          <Text style={[styles.rowTitle, { color: colors.textPrimary }]} numberOfLines={2}>
            {resource.title}
          </Text>
        </View>
        <Text style={[styles.rowAuthor, { color: colors.textHint }]} numberOfLines={1}>
          {resource.author} · {resource.date}
        </Text>
        <View style={styles.rowFooter}>
          <View style={[styles.tagPill, { backgroundColor: tagBg }]}>
            <Text style={[styles.tagText, { color: tagText }]}>
              {CATEGORIES.find(c => c.id === resource.category)?.label ?? resource.category}
            </Text>
          </View>
          <View style={styles.footerMeta}>
            <Clock size={10} color={colors.textHint} strokeWidth={2} />
            <Text style={[styles.metaSmall, { color: colors.textHint }]}>{resource.readTime}</Text>
          </View>
          <View style={styles.footerMeta}>
            <Star size={10} color={colors.primary} fill={colors.primary} strokeWidth={0} />
            <Text style={[styles.metaSmall, { color: colors.textSecondary }]}>{resource.rating}</Text>
          </View>
        </View>
      </View>

      {/* Save */}
      <TouchableOpacity
        onPress={() => onSaveToggle(resource.id)}
        activeOpacity={0.7}
        style={styles.rowSaveBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Bookmark
          size={15}
          color={resource.saved ? colors.primary : colors.textHint}
          fill={resource.saved ? colors.primary : 'none'}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ResourcesScreen() {
  const colors = useColors();

  const [resources,    setResources]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [error,        setError]        = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [query,        setQuery]        = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // ── Fetch ──
  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else            setLoading(true);
    setError(null);
    try {
      const data = await mockFetch();
      setResources(data.map(r => ({ ...r })));   // fresh copy so save state is local
    } catch (e) {
      setError(e.message ?? 'Could not load resources');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Save toggle ──
  const toggleSave = useCallback((id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, saved: !r.saved } : r));
  }, []);

  // ── Filter ──
  const filtered = resources.filter(r => {
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    const matchQ   = query.trim() === '' ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.summary.toLowerCase().includes(query.toLowerCase()) ||
      r.author.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const featured = filtered.filter(r => r.featured);
  const regular  = filtered.filter(r => !r.featured);

  // ── Error state ──
  if (!loading && error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <StatusBar barStyle={colors.background === '#0F0F0F' ? 'light-content' : 'dark-content'} />
        <View style={styles.errorContainer}>
          <AlertCircle size={40} color={colors.error} strokeWidth={1.5} />
          <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>Couldn't load resources</Text>
          <Text style={[styles.errorSub, { color: colors.textSecondary }]}>
            Check your connection and try again.
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={() => load()}
            activeOpacity={0.85}
          >
            <RefreshCw size={15} color={colors.textInverse} strokeWidth={2} />
            <Text style={[styles.retryText, { color: colors.textInverse }]}>Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <StatusBar barStyle={colors.background === '#0F0F0F' ? 'light-content' : 'dark-content'} />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Resources</Text>
          <Text style={[styles.headerSub, { color: colors.textHint }]}>
            Finance & Investment Library
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.savedBtn, { backgroundColor: colors.primaryLight }]}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Saved', 'Your saved resources list coming soon')}
        >
          <Bookmark size={16} color={colors.primary} strokeWidth={2} />
          <Text style={[styles.savedBtnText, { color: colors.primary }]}>Saved</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >

        {/* ── Search bar ── */}
        <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
          <View style={[
            styles.searchBar,
            {
              backgroundColor: colors.inputBackground,
              borderColor: searchFocused ? colors.primary : colors.inputBorder,
            },
          ]}>
            <Search size={16} color={colors.textHint} strokeWidth={2} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search articles, PDFs, videos…"
              placeholderTextColor={colors.inputPlaceholder}
              value={query}
              onChangeText={setQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              returnKeyType="search"
              clearButtonMode="never"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={14} color={colors.textHint} strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Category filter strip ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.filterStrip, { borderBottomColor: colors.divider }]}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? colors.primary       : colors.surface,
                    borderColor:     active ? colors.primary       : colors.border,
                  },
                ]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
              >
                <cat.Icon
                  size={13}
                  color={active ? colors.textInverse : colors.textSecondary}
                  strokeWidth={2}
                />
                <Text style={[
                  styles.filterChipText,
                  { color: active ? colors.textInverse : colors.textSecondary },
                ]}>
                  {cat.label}
                </Text>
                {/* Live-data dot on active chip — the "ticker" signature element */}
                {active && (
                  <View style={[styles.activeDot, { backgroundColor: colors.textInverse }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Loading skeletons ── */}
        {loading && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.skeletonLine, { width: 90, backgroundColor: colors.skeleton }]} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} colors={colors} wide />)}
            </ScrollView>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.skeletonLine, { width: 110, backgroundColor: colors.skeleton }]} />
            </View>
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} colors={colors} wide={false} />)}
          </View>
        )}

        {/* ── Content ── */}
        {!loading && (
          <>
            {/* Featured section — only show when not searching and results exist */}
            {featured.length > 0 && (
              <View>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Featured</Text>
                  <TouchableOpacity
                    style={styles.seeAllBtn}
                    activeOpacity={0.7}
                    onPress={() => Alert.alert('Featured', 'Full featured list coming soon')}
                  >
                    <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
                    <ChevronRight size={14} color={colors.primary} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredScroll}
                >
                  {featured.map(r => (
                    <FeaturedCard key={r.id} resource={r} colors={colors} onSaveToggle={toggleSave} />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* All / filtered resources */}
            {regular.length > 0 && (
              <View>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    {query.trim() || activeCategory !== 'all'
                      ? `Results · ${filtered.length}`
                      : 'All Resources'}
                  </Text>
                </View>
                {regular.map(r => (
                  <ResourceRow key={r.id} resource={r} colors={colors} onSaveToggle={toggleSave} />
                ))}
              </View>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
              <View style={styles.emptyContainer}>
                <BookOpen size={36} color={colors.textHint} strokeWidth={1.5} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No resources found</Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  {query.trim()
                    ? `No results for "${query}" — try a different search.`
                    : 'Nothing in this category yet. Check back soon.'}
                </Text>
                {query.trim() ? (
                  <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
                    <Text style={[styles.emptyAction, { color: colors.primary }]}>Clear search</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── StyleSheet — layout only, zero hardcoded colors ─────────────────────────
const styles = StyleSheet.create({

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4 },
  headerSub:   { fontSize: 12, marginTop: 1 },
  savedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
  },
  savedBtnText: { fontSize: 13, fontWeight: '600' },

  // Search
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },

  // Filter strip
  filterStrip: {
    borderBottomWidth: 0.5,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: { fontSize: 13, fontWeight: '600' },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginLeft: 1,
  },

  // Section headers
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  seeAllBtn:    { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText:   { fontSize: 13, fontWeight: '600' },

  // Featured horizontal scroll
  featuredScroll: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 12,
    paddingBottom: 4,
  },
  featuredCard: {
    width: 270,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 21,
  },
  featuredSummary: {
    fontSize: 13,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 2,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText:    { fontSize: 11, fontWeight: '500' },
  footerMeta:  { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaSmall:   { fontSize: 11 },

  // Tag + shared atoms
  tagPill:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText:  { fontSize: 11, fontWeight: '600' },

  // Resource list rows
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 13,
    gap: 12,
  },
  typeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowContent:  { flex: 1, gap: 4 },
  rowTitleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  rowTitle:    { fontSize: 14, fontWeight: '600', lineHeight: 20, flex: 1 },
  rowAuthor:   { fontSize: 12 },
  rowFooter:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  rowSaveBtn:  { paddingLeft: 4 },

  // Skeletons
  featuredSkeletonCard: {
    width: 270,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginLeft: 16,
  },
  listSkeletonCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 13,
    height: 90,
  },
  skeletonLine: { height: 10, borderRadius: 6 },
  skeletonMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  skeletonDot:  { width: 10, height: 10, borderRadius: 5 },

  // Error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  errorSub:   { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 22,
    marginTop: 8,
  },
  retryText: { fontSize: 14, fontWeight: '600' },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 48,
    gap: 10,
  },
  emptyTitle:  { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  emptySub:    { fontSize: 13.5, textAlign: 'center', lineHeight: 20 },
  emptyAction: { fontSize: 14, fontWeight: '600', marginTop: 4 },
});