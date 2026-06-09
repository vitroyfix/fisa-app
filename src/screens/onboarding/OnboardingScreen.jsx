import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Learn.{'\n'}Connect.{'\n'}<Text style={styles.highlight}>Grow.</Text></Text>
        <Text style={styles.subtitle}>FISA is your hub for finance education, mentorship, and real-world insights.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 32, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 42, fontWeight: '800', color: colors.black, lineHeight: 52, marginBottom: 20 },
  highlight: { color: colors.primary },
  subtitle: { fontSize: 15, color: colors.darkGray, lineHeight: 24 },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
