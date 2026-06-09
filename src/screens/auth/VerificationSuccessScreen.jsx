import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

export default function VerificationSuccessScreen({ onLogin }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
      <Text style={styles.title}>Success!</Text>
      <Text style={styles.subtitle}>You have successfully verified your account.</Text>
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  checkmark: { fontSize: 48, color: '#fff' },
  title: { fontSize: 28, fontWeight: '700', color: colors.black, marginBottom: 12 },
  subtitle: { fontSize: 15, color: colors.darkGray, textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
