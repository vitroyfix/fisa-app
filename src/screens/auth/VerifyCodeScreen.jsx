// src/screens/auth/VerifyCodeScreen.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

export default function VerifyCodeScreen({ navigation }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);

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

          {/* ── Back button pinned to top ── */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* ── Top spacer ── */}
          <View style={styles.spacer} />

          {/* ── Center content block ── */}
          <View style={styles.centerBlock}>

            <Text style={styles.title}>Verify Code</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.emailBold}>
                petermwangi@students.uonbi.ac.ke
              </Text>
            </Text>

            {/* ── OTP Boxes ── */}
            <View style={styles.codeRow}>
              {code.map((digit, i) => (
                <View key={i} style={styles.codeBox}>
                  <Text style={styles.codeText}>
                    {digit || (i + 1).toString()}
                  </Text>
                </View>
              ))}
            </View>

            {/* ── Resend ── */}
            <Text style={styles.resend}>
              Resend code in{' '}
              <Text style={styles.resendTimer}>00:45</Text>
            </Text>

          </View>

          {/* ── Bottom spacer ── */}
          <View style={styles.spacer} />

          {/* ── Bottom actions ── */}
          <View style={styles.bottomBlock}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('VerificationSuccess')}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.changeContainer}>
              <Text style={styles.change}>Change email</Text>
            </TouchableOpacity>
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

  // ── KeyboardAvoidingView ──────────────────────────────────────────
  keyboardView: {
    flex: 1,
  },

  // ── ScrollView content ────────────────────────────────────────────
  scrollContent: {
    flexGrow: 1,                 // spacers need this to work inside ScrollView
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },

  // ── Back ──────────────────────────────────────────────────────────
  back: {
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 0,
  },
  backText: {
    fontSize: 26,
    color: colors.black,
  },

  // ── Flex spacers ──────────────────────────────────────────────────
  spacer: {
    flex: 1,
    minHeight: 24,               // prevents collapse on small screens
  },

  // ── Center block ──────────────────────────────────────────────────
  centerBlock: {
    alignItems: 'center',
    width: '100%',
  },

  // ── Headings ──────────────────────────────────────────────────────
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  emailBold: {
    fontWeight: '700',
    color: colors.black,
  },

  // ── OTP row ───────────────────────────────────────────────────────
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 12,
    marginBottom: 32,
  },
  codeBox: {
    width: 50,
    height: 60,
    borderWidth: 1.5,
    borderColor: colors.mediumGray,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
  },

  // ── Resend ────────────────────────────────────────────────────────
  resend: {
    fontSize: 15,
    color: colors.darkGray,
  },
  resendTimer: {
    fontWeight: '700',
    color: colors.black,
  },

  // ── Bottom block ──────────────────────────────────────────────────
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

  // ── Change email ──────────────────────────────────────────────────
  changeContainer: {
    paddingVertical: 4,
  },
  change: {
    fontSize: 15,
    color: colors.darkGray,
    fontWeight: '500',
  },
});