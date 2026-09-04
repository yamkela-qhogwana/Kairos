import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

export function SplashBackground() {
  const { width, height } = useWindowDimensions();

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        {/* Flat, unmasked dot pattern (matching the onboarding card's
            CardDotPattern) — react-native-svg's Mask+Pattern combo renders
            inconsistently on Android, showing a stray color patch. */}
        <Pattern id="dots" width={26} height={26} patternUnits="userSpaceOnUse">
          <Circle cx={13} cy={13} r={1.2} fill="#ffffff" opacity={0.1} />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={colors.bgBottom} />
      <Rect x={0} y={0} width={width} height={height} fill="url(#dots)" />
    </Svg>
  );
}
