import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function ProfileScreen() {
  return <View style={styles.c}><Text style={styles.t}>Profile</Text></View>;
}
const styles = StyleSheet.create({ c: { flex: 1, justifyContent: 'center', alignItems: 'center' }, t: { fontSize: 20, fontWeight: '700', color: '#CC0000' } });
