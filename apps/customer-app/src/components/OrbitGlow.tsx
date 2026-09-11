import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

type Props = {
  size?: number;
};

type ArcConfig = {
  key: string;
  radiusFraction: number;
  arcFraction: number;
  strokeWidth: number;
  rotateDuration: number;
  fadeDuration: number;
  fadeDelay: number;
  reverse?: boolean;
};

// Staggered so the bands never fade in/out in sync with each other, and set
// at different radii so they read as concentric layers rather than one ring.
const ARCS: ArcConfig[] = [
  {
    key: 'a',
    radiusFraction: 1,
    arcFraction: 0.2,
    strokeWidth: 1.4,
    rotateDuration: 8000,
    fadeDuration: 2400,
    fadeDelay: 0,
  },
  {
    key: 'b',
    radiusFraction: 0.82,
    arcFraction: 0.24,
    strokeWidth: 1.2,
    rotateDuration: 10000,
    fadeDuration: 2600,
    fadeDelay: 500,
    reverse: true,
  },
  {
    key: 'c',
    radiusFraction: 0.64,
    arcFraction: 0.28,
    strokeWidth: 1.1,
    rotateDuration: 11500,
    fadeDuration: 2800,
    fadeDelay: 1100,
  },
  {
    key: 'd',
    radiusFraction: 0.48,
    arcFraction: 0.32,
    strokeWidth: 1,
    rotateDuration: 7000,
    fadeDuration: 2200,
    fadeDelay: 1700,
    reverse: true,
  },
  {
    key: 'e',
    radiusFraction: 0.34,
    arcFraction: 0.38,
    strokeWidth: 0.8,
    rotateDuration: 6000,
    fadeDuration: 2000,
    fadeDelay: 2300,
  },
];

function OrbitArc({
  size,
  ringRadius,
  config,
}: {
  size: number;
  ringRadius: number;
  config: ArcConfig;
}) {
  const rotation = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: config.rotateDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const fadeLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(fade, {
          toValue: 1,
          duration: config.fadeDuration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 0,
          duration: config.fadeDuration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    spinLoop.start();
    const delayTimer = setTimeout(() => fadeLoop.start(), config.fadeDelay);
    return () => {
      spinLoop.stop();
      fadeLoop.stop();
      clearTimeout(delayTimer);
    };
  }, [rotation, fade, config]);

  const spinDeg = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: config.reverse ? ['360deg', '0deg'] : ['0deg', '360deg'],
  });
  const opacity = fade.interpolate({ inputRange: [0, 1], outputRange: [0, 0.9] });

  const radius = ringRadius * config.radiusFraction;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * config.arcFraction;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity, transform: [{ rotate: spinDeg }] }]}>
      <MaskedView
        style={{ width: size, height: size }}
        maskElement={
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="white"
              strokeWidth={config.strokeWidth}
              strokeDasharray={`${arcLength} ${circumference - arcLength}`}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        }
      >
        <LinearGradient
          colors={colors.taglineGradient}
          locations={colors.taglineGradientLocations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: size, height: size }}
        />
      </MaskedView>
    </Animated.View>
  );
}

// Brand-native decorative accent for quiet screens: several gradient arc
// bands, set at different concentric radii, each independently rotating and
// fading in and out on its own staggered rhythm, two dots orbiting together
// near the outer edge, and a small gradient glow breathing at the center.
export function OrbitGlow({ size = 90 }: Props) {
  const breathe = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 1900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    const spinLoop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: ARCS[0].rotateDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    breatheLoop.start();
    spinLoop.start();
    return () => {
      breatheLoop.stop();
      spinLoop.stop();
    };
  }, [breathe, rotation]);

  const glowScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.15] });
  const glowOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.75] });
  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const ringRadius = size / 2 - 8;
  const glowSize = size * 0.14;
  const dotSize = size * 0.09;
  const dotOffset = size / 2 - dotSize / 2 - ringRadius;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: glowSize,
          height: glowSize,
          borderRadius: glowSize / 2,
          opacity: glowOpacity,
          transform: [{ scale: glowScale }],
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={colors.taglineGradient}
          locations={colors.taglineGradientLocations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: '100%', height: '100%' }}
        />
      </Animated.View>

      {ARCS.map((config) => (
        <OrbitArc key={config.key} size={size} ringRadius={ringRadius} config={config} />
      ))}

      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: spin }] }]}>
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: colors.dotGold,
              top: dotOffset,
              left: size / 2 - dotSize / 2,
            },
          ]}
        />
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: colors.dotBlue,
              bottom: dotOffset,
              left: size / 2 - dotSize / 2,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
  },
});
