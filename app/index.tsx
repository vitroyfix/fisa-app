import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

// Force professional fonts regardless of the user's Android theme
const proFont = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';
const proFontBold = Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif-medium';

export default function WelcomeScreen() {
  // Animation Values
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(30)).current; // Slight slide up for elegance
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence the animations perfectly for the intro
    Animated.sequence([
      // 1. Fade in the background and waves softly
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // 2. Bring in the logo with a fade and slight upward slide
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // 3. Reveal the main association text
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // 4. Reveal the tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bgOpacity, logoOpacity, logoTranslateY, titleOpacity, taglineOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Animated Background Layer */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgOpacity }]}>
        <Image 
          source={require('../assets/images/login3.jpeg')} 
          style={styles.backgroundImage}
        />
        <Image 
          source={require('../assets/images/login3.jpeg')} 
          style={[styles.backgroundImage, { opacity: 0.5 }]} 
        />
        <View style={styles.darkOverlay} />
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          <View style={styles.centerContainer}>
            {/* Animated Logo */}
            <Animated.View style={{ 
              opacity: logoOpacity, 
              transform: [{ translateY: logoTranslateY }],
              alignItems: 'center' 
            }}>
              <Image 
                source={require('../assets/images/Fisa.jpeg')} 
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.divider} />
            </Animated.View>
            
            {/* Animated Title */}
            <Animated.Text style={[styles.associationText, { opacity: titleOpacity }]}>
              FINANCE & INVESTMENTS{'\n'}STUDENTS ASSOCIATION
            </Animated.Text>

            {/* Animated Tagline */}
            <Animated.Text style={[styles.taglineText, { opacity: taglineOpacity }]}>
              Building ambitious minds. Shaping the future.
            </Animated.Text>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000', 
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  darkOverlay: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.65)', 
  },
  safeArea: {
    flex: 1,
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 24, 
    justifyContent: 'center', // Centers everything vertically now that bottom buttons are gone
  },
  centerContainer: { 
    alignItems: 'center', 
    justifyContent: 'center',
    width: '100%',
  },
  logo: { 
    width: 240, 
    height: 180,
    marginBottom: 24
  },
  divider: {
    width: 40, 
    height: 2,
    backgroundColor: '#E62E2D', 
    marginBottom: 24
  },
  associationText: {
    fontFamily: proFontBold,
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 4, 
    textAlign: 'center',
    lineHeight: 22,
  },
  taglineText: {
    fontFamily: proFont,
    color: '#9E9E9E',
    fontSize: 14,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 20,
  }
});