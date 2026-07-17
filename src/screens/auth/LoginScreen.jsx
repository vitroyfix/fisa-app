// src/screens/auth/LoginScreen.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >

          {/* ── Top spacer ── */}
          <View style={styles.spacer} />

          {/* ── Center block: logo + headings + input ── */}
          <View style={styles.centerBlock}>

            {/* ── Logo ── */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/fisa1.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* ── Headings ── */}
            <Text style={styles.title}>Login with your school email</Text>
            <Text style={styles.subtitle}>Enter your school email to continue</Text>

            {/* ── Email Input ── */}
            <TextInput
              style={styles.input}
              placeholder="example@students.uonbi.ac.ke"
              placeholderTextColor={colors.mediumGray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

          </View>

          {/* ── Bottom spacer ── */}
          <View style={styles.spacer} />

          {/* ── Button + hint always reachable above keyboard ── */}
          <View style={styles.bottomBlock}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('VerifyCode')}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>Only school emails are allowed</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // ── KeyboardAvoidingView fills the safe area ───────────────────────
  keyboardView: {
    flex: 1,
  },

  // ── ScrollView content: full height column ─────────────────────────
  scrollContent: {
    flexGrow: 1,                 // lets spacers work inside ScrollView
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },

  // ── Flex spacers ──────────────────────────────────────────────────
  spacer: {
    flex: 1,
    minHeight: 24,               // prevents spacers collapsing to 0 on small screens
  },

  // ── Center block ──────────────────────────────────────────────────
  centerBlock: {
    alignItems: 'center',
    width: '100%',
  },

  // ── Logo ──────────────────────────────────────────────────────────
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,            // slightly tighter than 40 — input sits higher
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  // ── Headings ──────────────────────────────────────────────────────
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 24,            // tighter than 28 — pulls input up slightly
    textAlign: 'center',
  },

  // ── Input ─────────────────────────────────────────────────────────
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.mediumGray,
    borderRadius: 10,
    padding: 16,
    fontSize: 17,
    color: colors.black,
  },

  // ── Bottom block: button + hint ───────────────────────────────────
  bottomBlock: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  // ── Hint ──────────────────────────────────────────────────────────
  hint: {
    fontSize: 14,
    color: colors.darkGray,
  },
});