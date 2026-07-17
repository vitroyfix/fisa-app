// src/screens/auth/VerificationSuccessScreen.jsx

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import colors from '../../constants/colors';

const AnimatedPath   = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const TICK_PATH     = 'M22 52 L42 72 L78 32';
const TICK_LENGTH   = 83;
const CIRCLE_RADIUS = 46;
const CIRCLE_CIRCUM = 2 * Math.PI * CIRCLE_RADIUS;

export default function VerificationSuccessScreen({ navigation, onLogin }) {  // ✅ onLogin added

  const circleScale    = useRef(new Animated.Value(0)).current;
  const circleDash     = useRef(new Animated.Value(0)).current;
  const tickDash       = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY       = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([

      Animated.spring(circleScale, {
        toValue:  1,
        friction: 8,
        tension:  55,
        useNativeDriver: true,
      }),

      Animated.parallel([
        Animated.timing(circleDash, {
          toValue:  1,
          duration: 550,
          easing:   Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(tickDash, {
          toValue:  1,
          duration: 600,
          delay:    100,
          easing:   Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: false,
        }),
      ]),

      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue:  1,
          duration: 400,
          easing:   Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(contentY, {
          toValue:  0,
          duration: 400,
          easing:   Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

    ]).start();
  }, []);

  const circleOffset = circleDash.interpolate({
    inputRange:  [0, 1],
    outputRange: [CIRCLE_CIRCUM, 0],
  });

  const tickOffset = tickDash.interpolate({
    inputRange:  [0, 1],
    outputRange: [TICK_LENGTH, 0],
  });

  return (
    <SafeAreaView style={styles.container}>

      <Animated.View style={[
        styles.iconContainer,
        { transform: [{ scale: circleScale }] },
      ]}>
        <Svg width={100} height={100} viewBox="0 0 100 100">

          <Circle
            cx="50" cy="50" r={CIRCLE_RADIUS}
            fill={colors.primary}
          />

          <AnimatedCircle
            cx="50" cy="50"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="3"
            strokeDasharray={CIRCLE_CIRCUM}
            strokeDashoffset={circleOffset}
            strokeLinecap="round"
            rotation="-90"
            origin="50,50"
          />

          <AnimatedPath
            d={TICK_PATH}
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={TICK_LENGTH}
            strokeDashoffset={tickOffset}
          />

        </Svg>
      </Animated.View>

      <Animated.View style={[
        styles.content,
        {
          opacity:   contentOpacity,
          transform: [{ translateY: contentY }],
        },
      ]}>
        <Text style={styles.title}>Success!</Text>
        <Text style={styles.subtitle}>
          You have successfully verified your account.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onLogin}          // ✅ triggers auth state switch in AppNavigator
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 36,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 44,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});