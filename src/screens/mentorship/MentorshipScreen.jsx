import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function MentorshipScreen() {
  return <View style={styles.c}><Text style={styles.t}>Mentorship</Text></View>;
}
const styles = StyleSheet.create({ c: { flex: 1, justifyContent: 'center', alignItems: 'center' }, t: { fontSize: 20, fontWeight: '700', color: '#CC0000' } });
