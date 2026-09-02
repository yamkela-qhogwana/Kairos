import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Mask,
  Pattern,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { colors } from '../theme/colors';

export function SplashBackground() {
  const { width, height } = Dimensions.get('window');

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="bg" cx="50%" cy="30%" r="75%">
          <Stop offset="0%" stopColor={colors.bgTop} />
          <Stop offset="100%" stopColor={colors.bgBottom} />
        </RadialGradient>
        <RadialGradient id="fade" cx="50%" cy="42%" r="70%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
          <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </RadialGradient>
        <Mask id="dotMask">
          <Rect x={0} y={0} width={width} height={height} fill="url(#fade)" />
        </Mask>
        <Pattern id="dots" width={26} height={26} patternUnits="userSpaceOnUse">
          <Circle cx={13} cy={13} r={1.2} fill="#ffffff" opacity={0.14} />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#bg)" />
      <Rect x={0} y={0} width={width} height={height} fill="url(#dots)" mask="url(#dotMask)" />
    </Svg>
  );
}
