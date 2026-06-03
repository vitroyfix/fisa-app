import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../src/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// ─── Local palette ─────────────────────────────────────────────────────────────
const BG      = '#000000';
const CARD_BG = '#111111';
const GRAY    = '#888888';
const GREEN   = '#4ADE80';
const RED_NEG = '#F87171';
const PRIMARY = '#C62828';

// ─── Data ──────────────────────────────────────────────────────────────────────
const quickStats = [
  { id: '1', icon: 'account-group',  lib: 'mci', value: '1,500+', label: 'Members',       color: PRIMARY   },
  { id: '2', icon: 'calendar-month', lib: 'mci', value: '12',     label: 'Events',         color: PRIMARY   },
  { id: '3', icon: 'handshake',      lib: 'mci', value: '20+',    label: 'Partners',       color: '#C8A84B' },
  { id: '4', icon: 'briefcase',      lib: 'mci', value: '35',     label: 'Opportunities',  color: '#4ADE80' },
];

const marketData = [
  { id: '1', name: 'NSE 20 Share Index', value: '1,832.40',   change: '+0.65%', positive: true,  icon: 'trending-up', lib: 'ion', iconBg: '#1A1A1A' },
  { id: '2', name: 'USD / KES',          value: '129.25',     change: '-0.21%', positive: false, icon: 'flag',        lib: 'fa5', iconBg: '#1A1A1A' },
  { id: '3', name: 'Bitcoin (BTC)',       value: '$66,541.20', change: '+1.36%', positive: true,  icon: 'bitcoin',     lib: 'fa5', iconBg: '#1A1A1A' },
  { id: '4', name: 'Gold (XAU)',          value: '$2,344.10',  change: '+0.52%', positive: true,  icon: 'coins',       lib: 'fa5', iconBg: '#1A1A1A' },
];

const opportunities = [
  { id: '1', company: 'Equity Bank Internship', sub: 'Application ends in 5 days' },
  { id: '2', company: 'KCB Graduate Programme', sub: 'Application ends in 12 days' },
];

// ─── Icon helper ───────────────────────────────────────────────────────────────
function Icon({ lib, name, size, color }: { lib: string; name: string; size: number; color: string }) {
  if (lib === 'ion') return <Ionicons name={name as any} size={size} color={color} />;
  if (lib === 'fa5') return <FontAwesome5 name={name as any} size={size} color={color} />;
  return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
}

// ─── Screen ────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={s.header}>
          <View>
            <Text style={s.greetSmall}>Good Morning,</Text>
            <Text style={s.greetName}>Peter 👋</Text>
            <Text style={s.greetSub}>Welcome to FISA</Text>
          </View>
          <View style={s.headerIcons}>
            <TouchableOpacity style={s.bellWrap}>
              <Ionicons name="notifications-outline" size={26} color="#fff" />
              <View style={s.bellDot} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={s.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Quick Stats ────────────────────────────────────────────────── */}
        <View style={s.rowHeader}>
          <Text style={s.sectionTitle}>Quick Stats</Text>
          <TouchableOpacity><Text style={s.viewAll}>View all</Text></TouchableOpacity>
        </View>
        <View style={s.statsRow}>
          {quickStats.map(stat => (
            <View key={stat.id} style={s.statCard}>
              <Icon lib={stat.lib} name={stat.icon} size={30} color={stat.color} />
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel} numberOfLines={1} adjustsFontSizeToFit>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Today's Market ─────────────────────────────────────────────── */}
        <View style={s.rowHeader}>
          <Text style={s.sectionTitle}>Today's Market</Text>
          <TouchableOpacity><Text style={s.viewAll}>View all</Text></TouchableOpacity>
        </View>
        <View style={s.marketCard}>
          {marketData.map((item, idx) => (
            <View key={item.id}>
              <View style={s.marketRow}>
                <View style={s.marketIconWrap}>
                  <Icon lib={item.lib} name={item.icon} size={18} color="#fff" />
                </View>
                <Text style={s.marketName}>{item.name}</Text>
                <Text style={s.marketValue}>{item.value}</Text>
                <Text style={[s.marketChange, item.positive ? s.pos : s.neg]}>
                  {item.change}
                </Text>
              </View>
              {idx < marketData.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        {/* ── Upcoming Event ─────────────────────────────────────────────── */}
        <View style={s.rowHeader}>
          <Text style={s.sectionTitle}>Upcoming Event</Text>
          <TouchableOpacity><Text style={s.viewAll}>View all</Text></TouchableOpacity>
        </View>
        <View style={s.eventCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' }}
            style={s.eventImg}
          />
          <View style={s.eventInfo}>
            <Text style={s.eventTitle}>FISA Investment Summit</Text>
            <View style={s.eventMeta}>
              <Ionicons name="calendar-outline" size={13} color={GRAY} />
              <Text style={s.eventMetaTxt}>24 May, 2025</Text>
            </View>
            <View style={s.eventMeta}>
              <Ionicons name="location-outline" size={13} color={GRAY} />
              <Text style={s.eventMetaTxt}>Strathmore University</Text>
            </View>
            <TouchableOpacity style={s.registerBtn}>
              <Text style={s.registerTxt}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Latest Opportunities ───────────────────────────────────────── */}
        <View style={s.rowHeader}>
          <Text style={s.sectionTitle}>Latest Opportunities</Text>
          <TouchableOpacity><Text style={s.viewAll}>View all</Text></TouchableOpacity>
        </View>
        <View style={s.oppCard}>
          {opportunities.map((opp, idx) => (
            <View key={opp.id}>
              <TouchableOpacity style={s.oppRow} activeOpacity={0.7}>
                <View style={s.oppIconWrap}>
                  <FontAwesome5 name="university" size={18} color="#fff" />
                </View>
                <View style={s.oppInfo}>
                  <Text style={s.oppTitle}>{opp.company}</Text>
                  <Text style={s.oppSub}>{opp.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={GRAY} />
              </TouchableOpacity>
              {idx < opportunities.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: BG },
  scroll:  { flex: 1, backgroundColor: BG },
  content: { paddingBottom: 24 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  greetSmall: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  greetName: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  greetSub: {
    fontSize: 17,
    color: PRIMARY,
    fontWeight: '700',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  bellWrap: { position: 'relative', padding: 2 },
  bellDot: {
    position: 'absolute',
    top: 2, right: 2,
    width: 9, height: 9,
    borderRadius: 5,
    backgroundColor: PRIMARY,
    borderWidth: 1,
    borderColor: BG,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: PRIMARY,
  },

  // Section row headers
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  viewAll: {
    fontSize: 14,
    color: GRAY,
    fontWeight: '500',
  },

  // Quick Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 12,
    color: GRAY,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Market
  marketCard: {
    marginHorizontal: 20,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingVertical: 4,
  },
  marketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 12,
  },
  marketIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketName:   { flex: 1, fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  marketValue:  { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
  marketChange: { fontSize: 14, fontWeight: '700', minWidth: 58, textAlign: 'right' },
  pos:          { color: GREEN },
  neg:          { color: RED_NEG },
  divider:      { height: 1, backgroundColor: '#222222', marginHorizontal: 16 },

  // Event
  eventCard: {
    marginHorizontal: 20,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  eventImg:  { width: 130, height: 150 },
  eventInfo: { flex: 1, padding: 14, justifyContent: 'space-between' },
  eventTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  eventMeta:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  eventMetaTxt: { fontSize: 12, color: GRAY },
  registerBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 999,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 8,
  },
  registerTxt: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  // Opportunities
  oppCard: {
    marginHorizontal: 20,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    overflow: 'hidden',
  },
  oppRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  oppIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oppInfo:  { flex: 1 },
  oppTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  oppSub:   { fontSize: 12, color: GRAY, marginTop: 3 },
});