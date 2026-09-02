import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SplashBackground } from '../components/SplashBackground';
import { GradientText } from '../components/GradientText';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <SplashBackground />

      <View style={styles.wordmarkRow}>
        <GradientText
          colors={colors.wordmarkGradient}
          locations={colors.wordmarkGradientLocations}
          style={styles.wordmarkText}
        >
          KAIR
        </GradientText>

        <View style={styles.oWrap}>
          <GradientText
            colors={colors.wordmarkGradient}
            locations={colors.wordmarkGradientLocations}
            style={styles.wordmarkText}
          >
            O
          </GradientText>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, { backgroundColor: colors.dotGold }]} />
            <View style={[styles.dot, { backgroundColor: colors.dotBlue }]} />
          </View>
        </View>

        <GradientText
          colors={colors.wordmarkGradient}
          locations={colors.wordmarkGradientLocations}
          style={styles.wordmarkText}
        >
          S
        </GradientText>
      </View>

      <View style={styles.tagline}>
        <Text style={styles.taglineLine1}>SHOP BETTER</Text>
        <GradientText
          colors={colors.taglineGradient}
          locations={colors.taglineGradientLocations}
          style={styles.taglineLine2}
          animated
        >
          SHOP KAIROS
        </GradientText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  wordmarkText: {
    fontFamily: typography.wordmark,
    fontSize: 38,
    letterSpacing: 5,
  },
  oWrap: {
    position: 'relative',
  },
  dotsRow: {
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagline: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  taglineLine1: {
    fontFamily: typography.medium,
    fontSize: 9,
    letterSpacing: 3.5,
    color: colors.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  taglineLine2: {
    fontFamily: typography.bold,
    fontSize: 13,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});
