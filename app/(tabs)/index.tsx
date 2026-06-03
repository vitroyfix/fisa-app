import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import SectionHeader from '../../components/SectionHeader';
import EventCard from '../../components/EventCard';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>Peter Wangimwa 👋</Text>
            <Text style={styles.subtitle}>Ready to grow today?</Text>
          </View>
          <TouchableOpacity style={styles.notification}>
            <Feather name="bell" size={24} color={Colors.dark.text} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Featured Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>INVESTING IN{'\n'}FUTURE LEADERS</Text>
          <View style={styles.bannerDiamond} />
        </View>

        {/* Grid Menu Placeholder */}
        <View style={styles.grid}>
          {['Events', 'Learning', 'Resources', 'Community', 'Mentorship', 'Opportunities'].map((item, index) => (
            <TouchableOpacity key={index} style={styles.gridItem}>
              <View style={styles.iconBox}>
                <Feather name={['calendar', 'book-open', 'file-text', 'users', 'user-check', 'briefcase'][index] as any} size={24} color={Colors.dark.tint} />
              </View>
              <Text style={styles.gridText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Events */}
        <SectionHeader title="Upcoming Event" />
        <EventCard 
          month="MAY" 
          day="24" 
          title="Investment Analysis Workshop" 
          time="2:00 PM - 5:00 PM" 
          location="CBK Auditorium" 
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.dark.background },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  greeting: { color: Colors.dark.textMuted, fontSize: 16, marginBottom: 4 },
  name: { color: Colors.dark.text, fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: Colors.dark.textMuted, fontSize: 14 },
  notification: { padding: 8, position: 'relative' },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.dark.tint },
  banner: { backgroundColor: Colors.dark.surface, borderRadius: 20, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  bannerText: { color: Colors.dark.text, fontSize: 18, fontWeight: 'bold', lineHeight: 26 },
  bannerDiamond: { width: 40, height: 40, backgroundColor: '#333', transform: [{ rotate: '45deg' }] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: -8 },
  gridItem: { width: '33.33%', padding: 8, alignItems: 'center', marginBottom: 16 },
  iconBox: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.dark.surface, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  gridText: { color: Colors.dark.text, fontSize: 12, textAlign: 'center' }
});
