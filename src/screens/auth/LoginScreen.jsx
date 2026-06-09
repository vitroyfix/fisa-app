import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}><Text style={styles.logoText}>FISA</Text></View>
        <Text style={styles.tagline}>Inspiring Excellence</Text>
      </View>
      <Text style={styles.title}>Login with your school email</Text>
      <Text style={styles.subtitle}>Enter your school email to continue</Text>
      <TextInput
        style={styles.input}
        placeholder="you@school.edu"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VerifyCode')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>🔒 Only school emails are allowed</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 32, alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginVertical: 32 },
  logo: { width: 80, height: 80, backgroundColor: colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  logoText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  tagline: { color: colors.primary, fontSize: 13 },
  title: { fontSize: 20, fontWeight: '700', color: colors.black, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.darkGray, marginBottom: 24, textAlign: 'center' },
  input: { width: '100%', borderWidth: 1, borderColor: colors.mediumGray, borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 16 },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center', width: '100%', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hint: { fontSize: 12, color: colors.darkGray },
});
