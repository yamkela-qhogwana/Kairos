import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SplashBackground } from '../components/SplashBackground';
import { GradientText } from '../components/GradientText';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

export function SplashScreen() {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  return (
    <View style={styles.container}>
      <SplashBackground />

      <View style={styles.wordmarkRow}>
        <GradientText
          colors={colors.wordmarkGradient}
          locations={colors.wordmarkGradientLocations}
          style={{ ...styles.wordmarkText, fontSize: scaleFont(38) }}
        >
          KAIR
        </GradientText>

        <View style={styles.oWrap}>
          <GradientText
            colors={colors.wordmarkGradient}
            locations={colors.wordmarkGradientLocations}
            style={{ ...styles.wordmarkText, fontSize: scaleFont(38) }}
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
          style={{ ...styles.wordmarkText, fontSize: scaleFont(38) }}
        >
          S
        </GradientText>
      </View>

      <View style={[styles.tagline, { bottom: 60 + insets.bottom }]}>
        <Text style={[styles.taglineLine1, { fontSize: scaleFont(9) }]}>SHOP BETTER</Text>
        <GradientText
          colors={colors.taglineGradient}
          locations={colors.taglineGradientLocations}
          style={{ ...styles.taglineLine2, fontSize: scaleFont(13) }}
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
