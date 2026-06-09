import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const marketData = {
  sp500:  { label: 'S&P 500',  value: '5,278.40', change: '+0.63%', positive: true },
  nasdaq: { label: 'NASDAQ',   value: '16,735.02', change: '+1.02%', positive: true },
  btc:    { label: 'BTC / USD', value: '64,845.30', change: '+2.35%', positive: true },
};

const topMovers = [
  { symbol: 'AAPL', price: '174.25', change: '+1.20%', positive: true },
  { symbol: 'TSLA', price: '183.28', change: '-0.45%', positive: false },
  { symbol: 'AMZN', price: '3,201.15', change: '+0.88%', positive: true },
];

const upcomingEvents = [
  { id: '1', title: 'Market Outlook 2024', date: 'Apr 25, 2024 · 4:00 PM', type: 'Online Webinar' },
];

const timeFilters = ['1D', '1W', '1M', '3M', '1Y'];

// --- Simple SVG-like Chart using Views ---
function SparklineChart() {
  const points = [40, 55, 45, 60, 50, 70, 55, 75, 60, 80, 65, 78];
  const maxVal = Math.max(...points);
  const minVal = Math.min(...points);
  const chartWidth = width - 64;
  const chartHeight = 60;

  return (
    <View style={{ height: chartHeight, width: chartWidth, flexDirection: 'row', alignItems: 'flex-end' }}>
      {points.map((point, index) => {
        const barHeight = ((point - minVal) / (maxVal - minVal)) * chartHeight;
        return (
          <View
            key={index}
            style={{
              flex: 1,
              height: barHeight || 4,
              backgroundColor: 'rgba(204, 0, 0, 0.15)',
              marginHorizontal: 1,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          />
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const [activeTimeFilter, setActiveTimeFilter] = useState('1D');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <View style={styles.nameRow}>
              <Text style={styles.name}>Alexandra</Text>
              <Text style={styles.wave}> 👋</Text>
            </View>
            <Text style={styles.subGreeting}>Welcome back! You've been away for 2 days.</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* ── Live Markets ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Markets</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {/* Market Cards Row */}
          <View style={styles.marketRow}>
            {Object.values(marketData).map((market) => (
              <View key={market.label} style={styles.marketItem}>
                <Text style={styles.marketLabel}>{market.label}</Text>
                <Text style={styles.marketValue}>{market.value}</Text>
                <Text style={[styles.marketChange, { color: market.positive ? colors.success : '#E53935' }]}>
                  {market.change}
                </Text>
              </View>
            ))}
          </View>

          {/* Chart */}
          <View style={styles.chartContainer}>
            <SparklineChart />
          </View>

          {/* Time Filters */}
          <View style={styles.timeFilters}>
            {timeFilters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.timeFilter, activeTimeFilter === filter && styles.timeFilterActive]}
                onPress={() => setActiveTimeFilter(filter)}
              >
                <Text style={[styles.timeFilterText, activeTimeFilter === filter && styles.timeFilterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Upcoming Events ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        {upcomingEvents.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventImagePlaceholder}>
              <Ionicons name="calendar" size={24} color={colors.white} />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
              <Text style={styles.eventType}>{event.type}</Text>
            </View>
          </View>
        ))}

        {/* ── Continue Learning ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.learningRow}>
            <View style={styles.learningIcon}>
              <Ionicons name="bar-chart" size={28} color={colors.primary} />
            </View>
            <View style={styles.learningInfo}>
              <Text style={styles.learningTitle}>Financial Modeling Basics</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '75%' }]} />
              </View>
              <Text style={styles.progressText}>75% Complete</Text>
            </View>
            <Text style={styles.progressPercent}>75%</Text>
          </View>
        </View>

        {/* ── Top Movers ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Movers</Text>
        </View>

        <View style={styles.card}>
          {topMovers.map((stock, index) => (
            <View key={stock.symbol} style={[styles.stockRow, index < topMovers.length - 1 && styles.stockDivider]}>
              <View style={styles.stockIcon}>
                <Text style={styles.stockIconText}>{stock.symbol[0]}</Text>
              </View>
              <Text style={styles.stockSymbol}>{stock.symbol}</Text>
              <Text style={styles.stockPrice}>{stock.price}</Text>
              <Text style={[styles.stockChange, { color: stock.positive ? colors.success : '#E53935' }]}>
                {stock.change}
              </Text>
            </View>
          ))}
        </View>

        {/* ── News for You ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>News for You</Text>
        </View>

        <View style={styles.newsCard}>
          <View style={styles.newsImage}>
            <Ionicons name="newspaper" size={24} color={colors.white} />
          </View>
          <View style={styles.newsInfo}>
            <Text style={styles.newsTitle}>Fed signals possible rate cut later this year</Text>
            <Text style={styles.newsSource}>Yahoo Finance · 2h ago</Text>
          </View>
        </View>

        {/* ── Portfolio Watchlist ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Portfolio Watchlist</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { marginBottom: 24 }]}>
          <Text style={styles.emptyText}>No stocks added yet. Start tracking your portfolio!</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.addButtonText}> Add Stock</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, backgroundColor: colors.lightGray },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, backgroundColor: colors.white },
  greeting: { fontSize: 14, color: colors.darkGray },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 26, fontWeight: '700', color: colors.black },
  wave: { fontSize: 24 },
  subGreeting: { fontSize: 12, color: colors.darkGray, marginTop: 2 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: colors.white, fontSize: 18, fontWeight: '700' },
  notificationDot: { position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.white },

  // Section Headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, backgroundColor: colors.lightGray },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.black },
  viewAll: { fontSize: 13, color: colors.primary, fontWeight: '500' },

  // Cards
  card: { backgroundColor: colors.white, marginHorizontal: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },

  // Markets
  marketRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  marketItem: { alignItems: 'center', flex: 1 },
  marketLabel: { fontSize: 11, color: colors.darkGray, marginBottom: 4 },
  marketValue: { fontSize: 14, fontWeight: '700', color: colors.black },
  marketChange: { fontSize: 12, fontWeight: '600', marginTop: 2 },

  // Chart
  chartContainer: { marginBottom: 12 },
  timeFilters: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 },
  timeFilter: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  timeFilterActive: { backgroundColor: colors.primary },
  timeFilterText: { fontSize: 12, color: colors.darkGray, fontWeight: '500' },
  timeFilterTextActive: { color: colors.white },

  // Events
  eventCard: { flexDirection: 'row', backgroundColor: colors.white, marginHorizontal: 16, borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  eventImagePlaceholder: { width: 70, height: 70, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  eventInfo: { flex: 1, justifyContent: 'center' },
  eventTitle: { fontSize: 14, fontWeight: '700', color: colors.black, marginBottom: 4 },
  eventDate: { fontSize: 12, color: colors.darkGray },
  eventType: { fontSize: 12, color: colors.primary, marginTop: 2, fontWeight: '500' },

  // Learning
  learningRow: { flexDirection: 'row', alignItems: 'center' },
  learningIcon: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#FFF0F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  learningInfo: { flex: 1 },
  learningTitle: { fontSize: 14, fontWeight: '600', color: colors.black, marginBottom: 8 },
  progressBarContainer: { height: 6, backgroundColor: colors.mediumGray, borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  progressText: { fontSize: 11, color: colors.darkGray, marginTop: 4 },
  progressPercent: { fontSize: 14, fontWeight: '700', color: colors.primary, marginLeft: 8 },

  // Stocks
  stockRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  stockDivider: { borderBottomWidth: 1, borderBottomColor: colors.lightGray },
  stockIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.lightGray, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  stockIconText: { fontSize: 14, fontWeight: '700', color: colors.black },
  stockSymbol: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.black },
  stockPrice: { fontSize: 14, fontWeight: '600', color: colors.black, marginRight: 12 },
  stockChange: { fontSize: 13, fontWeight: '600', minWidth: 55, textAlign: 'right' },

  // News
  newsCard: { flexDirection: 'row', backgroundColor: colors.white, marginHorizontal: 16, borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  newsImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: colors.primaryDark, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  newsInfo: { flex: 1, justifyContent: 'center' },
  newsTitle: { fontSize: 13, fontWeight: '600', color: colors.black, lineHeight: 18 },
  newsSource: { fontSize: 11, color: colors.darkGray, marginTop: 4 },

  // Watchlist
  emptyText: { fontSize: 13, color: colors.darkGray, textAlign: 'center', marginBottom: 12 },
  addButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8, borderWidth: 1, borderColor: colors.primary, borderRadius: 8 },
  addButtonText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
});