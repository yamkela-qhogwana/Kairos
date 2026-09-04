import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const collage1 = require('../assets/onboarding/collage-1.jpg');
const collage2 = require('../assets/onboarding/collage-2.jpg');
const collage3 = require('../assets/onboarding/collage-3.jpg');
const collage4 = require('../assets/onboarding/collage-4.jpg');

// expo-image decodes off the JS thread, caches to memory+disk, and fades
// images in as they finish decoding instead of popping in abruptly.
const TRANSITION_MS = 250;

function AnimatedCell({
  delay,
  style,
  children,
}: {
  delay: number;
  style: any;
  children: React.ReactNode;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1150,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, delay]);

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] });

  return (
    <Animated.View style={[style, { opacity: progress, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}

export function OnboardingCollage() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <AnimatedCell delay={0} style={styles.cell1}>
          <Image
            source={collage1}
            style={styles.fill}
            contentFit="cover"
            transition={TRANSITION_MS}
            cachePolicy="memory-disk"
          />
        </AnimatedCell>

        <View style={styles.rightColumn}>
          <AnimatedCell delay={180} style={styles.cell2}>
            <Image
              source={collage2}
              style={styles.fill}
              contentFit="cover"
              transition={TRANSITION_MS}
              cachePolicy="memory-disk"
            />
          </AnimatedCell>
          <AnimatedCell delay={340} style={styles.cellMid}>
            <Image
              source={collage3}
              style={styles.fill}
              contentFit="cover"
              transition={TRANSITION_MS}
              cachePolicy="memory-disk"
            />
          </AnimatedCell>
          <AnimatedCell delay={500} style={styles.cell4}>
            <Image
              source={collage4}
              style={styles.fill}
              contentFit="cover"
              transition={TRANSITION_MS}
              cachePolicy="memory-disk"
            />
          </AnimatedCell>
        </View>
      </View>

      <LinearGradient
        colors={['rgba(232, 201, 160, 0.22)', 'rgba(8, 9, 11, 0)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.6, y: 0.5 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(232, 201, 160, 0)', 'rgba(232, 201, 160, 0.3)', colors.bgTop]}
        locations={[0, 0.55, 1]}
        style={styles.fade}
        pointerEvents="none"
      />
    </View>
  );
}

const GAP = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: GAP,
    backgroundColor: colors.bgBottom,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: GAP,
  },
  fill: {
    width: '100%',
    height: '100%',
    // Android's native ImageView defaults to a white background until the
    // image finishes decoding — this avoids a white/odd-color flash before
    // the fade-in transition.
    backgroundColor: colors.bgBottom,
  },
  cell1: {
    flex: 1.15,
    height: '100%',
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  rightColumn: {
    flex: 1,
    gap: GAP,
  },
  cell2: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  cellMid: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  cell4: {
    flex: 1,
    width: '100%',
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
  },
});
