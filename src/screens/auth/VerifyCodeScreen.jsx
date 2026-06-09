import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

export default function VerifyCodeScreen({ navigation }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Verify Code</Text>
      <Text style={styles.subtitle}>We've sent a 6-digit code to{'\n'}you@school.edu</Text>
      <View style={styles.codeRow}>
        {code.map((digit, i) => (
          <View key={i} style={styles.codeBox}>
            <Text style={styles.codeText}>{digit || (i + 1).toString()}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.resend}>Resend code in 00:45</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VerificationSuccess')}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity><Text style={styles.change}>Change email</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 32, alignItems: 'center' },
  back: { alignSelf: 'flex-start', marginBottom: 32 },
  backText: { fontSize: 24, color: colors.black },
  title: { fontSize: 24, fontWeight: '700', color: colors.black, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.darkGray, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  codeRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  codeBox: { width: 44, height: 52, borderWidth: 1.5, borderColor: colors.mediumGray, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  codeText: { fontSize: 18, fontWeight: '700', color: colors.black },
  resend: { fontSize: 13, color: colors.darkGray, marginBottom: 32 },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center', width: '100%', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  change: { fontSize: 14, color: colors.primary, fontWeight: '600' },
});
