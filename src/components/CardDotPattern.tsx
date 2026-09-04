import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

// Same dot-grid texture as the splash screen background, sized to fill
// whatever container it's placed in (percentage-based, not a fixed screen size).
export function CardDotPattern() {
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id="cardDots" width={26} height={26} patternUnits="userSpaceOnUse">
          <Circle cx={13} cy={13} r={1.2} fill="#ffffff" opacity={0.08} />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#cardDots)" />
    </Svg>
  );
}
