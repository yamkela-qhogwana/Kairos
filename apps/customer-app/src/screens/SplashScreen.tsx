import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SplashBackground } from '../components/SplashBackground';
import { GradientText } from '../components/GradientText';
import { KairosWordmark } from '../components/KairosWordmark';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

export function SplashScreen() {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();

  return (
    <View style={styles.container}>
      <SplashBackground />

      <KairosWordmark fontSize={scaleFont(38)} />

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
    // Solid fallback behind the absolute-fill background SVG — on some
    // Android devices the SVG's JS-computed width/height comes out a pixel
    // or two short of the real screen, leaving a sliver of native white.
    backgroundColor: colors.bgBottom,
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
