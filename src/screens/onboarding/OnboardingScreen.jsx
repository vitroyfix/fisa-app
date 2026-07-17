// src/screens/onboarding/OnboardingScreen.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Image, FlatList, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

const { width, height } = Dimensions.get('window');
const AUTO_ADVANCE_MS = 3000;
const DOT_ANIM_MS     = 350;

const slides = [
  {
    id: '1',
    lines: ['Learn.', 'Connect.', 'Grow.'],
    highlight: 'Grow.',
    description: 'FISA is your hub for finance education, mentorship, and real-world insights.',
    image: require('../../../assets/images/learn.png'),
  },
  {
    id: '2',
    lines: ['Track.', 'Invest.', 'Win.'],
    highlight: 'Win.',
    description: 'Monitor live markets, follow top movers, and build your investment portfolio.',
    image: require('../../../assets/images/learn.png'),
  },
  {
    id: '3',
    lines: ['Lead.', 'Network.', 'Excel.'],
    highlight: 'Excel.',
    description: 'Connect with mentors, join communities, and unlock your leadership potential.',
    image: require('../../../assets/images/learn.png'),
  },
];

const LAST_INDEX = slides.length - 1;

export default function OnboardingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef    = useRef(null);
  const indexRef       = useRef(0);
  const timerRef       = useRef(null);
  const isDragging     = useRef(false);

  // One Animated.Value per dot (0 = inactive, 1 = active)
  const dotAnims = useRef(
    slides.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;

  // Finish button fade
  const finishOpacity = useRef(new Animated.Value(0)).current;

  // ── Animate dots smoothly ────────────────────────────────────────
  const animateDots = useCallback((toIndex) => {
    Animated.parallel(
      dotAnims.map((anim, i) =>
        Animated.timing(anim, {
          toValue: i === toIndex ? 1 : 0,
          duration: DOT_ANIM_MS,
          useNativeDriver: false,
        })
      )
    ).start();
  }, [dotAnims]);

  // ── Fade finish button in / out ──────────────────────────────────
  const animateFinish = useCallback((show) => {
    Animated.timing(finishOpacity, {
      toValue: show ? 1 : 0,
      duration: DOT_ANIM_MS,
      useNativeDriver: true,
    }).start();
  }, [finishOpacity]);

  // ── Smooth scroll to index ───────────────────────────────────────
  const scrollToIndex = useCallback((index) => {
    flatListRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
  }, []);

  // ── Start auto-advance from current index ────────────────────────
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      // Skip tick if user is mid-drag
      if (isDragging.current) return;

      const next = indexRef.current + 1;

      if (next >= slides.length) {
        // Reached end — stop, show finish
        clearInterval(timerRef.current);
        animateFinish(true);
        return;
      }

      indexRef.current = next;
      setActiveIndex(next);
      animateDots(next);
      scrollToIndex(next);

      if (next === LAST_INDEX) {
        animateFinish(true);
      }
    }, AUTO_ADVANCE_MS);
  }, [animateDots, scrollToIndex, animateFinish]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  // ── Skip ─────────────────────────────────────────────────────────
  const handleSkip = () => {
    clearInterval(timerRef.current);
    navigation.navigate('Login');
  };

  // ── Finish / Get Started ─────────────────────────────────────────
  const handleFinish = () => {
    clearInterval(timerRef.current);
    navigation.navigate('Login');
  };

  // ── User starts dragging — pause timer ───────────────────────────
  const onScrollBeginDrag = () => {
    isDragging.current = true;
    clearInterval(timerRef.current);
  };

  // ── User lifts finger — sync state, restart timer ────────────────
  const onMomentumScrollEnd = (e) => {
    isDragging.current = false;
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);

    // Always sync even if index unchanged (handles overscroll bounce)
    indexRef.current = newIndex;
    setActiveIndex(newIndex);
    animateDots(newIndex);

    if (newIndex === LAST_INDEX) {
      animateFinish(true);
      clearInterval(timerRef.current);   // stop — user must tap Get Started
      return;
    }

    // Hide finish button if user swiped back from last slide
    animateFinish(false);

    // Resume auto-advance from new position
    startTimer();
  };

  // ── Render slide ─────────────────────────────────────────────────
  const renderSlide = ({ item, index }) => (
    <View style={styles.slide}>
      <Image
        source={item.image}
        style={styles.fullImage}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>

        {/* Top row — Skip hides on last slide */}
        <View style={styles.topRow}>
          <View />
          {index < LAST_INDEX ? (
            <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>

        {/* Headline */}
        <View style={styles.textBlock}>
          {item.lines.map((line) => (
            <Text
              key={line}
              style={[
                styles.title,
                line === item.highlight && styles.titleHighlight,
              ]}
            >
              {line}
            </Text>
          ))}
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* ── Bottom bar: dots left, finish button right ── */}
        <View style={styles.bottomBar}>

          {/* Dots — always visible on every slide */}
          <View style={styles.dots}>
            {slides.map((_, i) => {
              const dotWidth = dotAnims[i].interpolate({
                inputRange:  [0, 1],
                outputRange: [8, 24],
              });
              const dotOpacity = dotAnims[i].interpolate({
                inputRange:  [0, 1],
                outputRange: [0.3, 1],
              });
              const dotColor = dotAnims[i].interpolate({
                inputRange:  [0, 1],
                outputRange: ['rgba(0,0,0,0.25)', colors.primary],
              });
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      width:           dotWidth,
                      opacity:         dotOpacity,
                      backgroundColor: dotColor,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Finish button — bottom right, fades in on last slide */}
          <Animated.View
            style={[styles.finishWrapper, { opacity: finishOpacity }]}
            pointerEvents={activeIndex === LAST_INDEX ? 'auto' : 'none'}
          >
            <TouchableOpacity
              style={styles.finishButton}
              onPress={handleFinish}
              activeOpacity={0.85}
            >
              <Text style={styles.finishText}>Finish &rarr;</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>

      </SafeAreaView>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={slides}
      renderItem={renderSlide}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      decelerationRate="fast"
      onScrollBeginDrag={onScrollBeginDrag}
      onMomentumScrollEnd={onMomentumScrollEnd}
      getItemLayout={(_, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    height,
  },
  fullImage: {
    position: 'absolute',
    width,
    height,
  },
  overlay: {
    flex: 1,
  },

  // ── Top row ───────────────────────────────────────────────────────
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
    minHeight: 48,
  },
  skipText: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  skipPlaceholder: {
    width: 70,                   // same width as skip pill — keeps topRow stable
    height: 32,
  },

  // ── Text block ────────────────────────────────────────────────────
  textBlock: {
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  title: {
    fontSize: 64,
    fontWeight: '800',
    color: colors.black,
    lineHeight: 74,
  },
  titleHighlight: {
    color: colors.primary,
  },
  description: {
    fontSize: 18,
    color: '#333333',
    lineHeight: 30,
    marginTop: 18,
    maxWidth: '75%',
  },

  // ── Bottom bar ────────────────────────────────────────────────────
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // dots left, button right
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  // ── Finish button ─────────────────────────────────────────────────
  finishWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  finishButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});