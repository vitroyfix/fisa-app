import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

const { height, width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>

      {/* ── Logo Section ── */}
      <View style={styles.logoSection}>
        <Image
          source={require('../../../assets/fisa.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* ── Welcome Text Section ── */}
      <View style={styles.textSection}>
        <Text style={styles.title}>Welcome to FISA</Text>
        <Text style={styles.subtitle}>
          Your journey in finance, investing, and leadership starts here.
        </Text>
      </View>

      {/* ── Button Section ── */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Logo — takes up the top half
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.65,
    height: width * 0.65,
  },

  // Text — sits in the middle
  textSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.black,
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 17,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 26,
  },

  // Button — pinned to bottom
  buttonSection: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    borderRadius: 32,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});