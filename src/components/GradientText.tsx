import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Text, TextStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  children: string;
  colors: [string, string, ...string[]];
  locations?: [number, number, ...number[]];
  style?: TextStyle;
  animated?: boolean;
  animationDuration?: number;
};

export function GradientText({
  children,
  colors,
  locations,
  style,
  animated = false,
  animationDuration = 3200,
}: Props) {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated || measuredWidth === 0) return;
    shift.setValue(0);
    // Ping-pong (there and back) instead of a one-way loop, which snaps
    // the gradient back to its start position every cycle and looks glitchy.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shift, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(shift, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animated, measuredWidth, shift, animationDuration]);

  const handleMeasure = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== measuredWidth) setMeasuredWidth(w);
  };

  if (measuredWidth === 0) {
    // First pass: render invisibly just to measure intrinsic text width.
    return (
      <Text style={[style, { opacity: 0 }]} numberOfLines={1} onLayout={handleMeasure}>
        {children}
      </Text>
    );
  }

  const fontSize = style?.fontSize ?? 32;
  const height = fontSize * 1.4;
  const gradientWidth = animated ? measuredWidth * 3 : measuredWidth;
  const translateX = shift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(gradientWidth - measuredWidth)],
  });

  return (
    <MaskedView
      style={{ width: measuredWidth, height }}
      maskElement={
        <Text style={style} numberOfLines={1} onLayout={handleMeasure}>
          {children}
        </Text>
      }
    >
      <Animated.View
        style={{
          width: gradientWidth,
          height,
          transform: animated ? [{ translateX }] : undefined,
        }}
      >
        <LinearGradient
          colors={colors}
          locations={locations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: gradientWidth, height }}
        />
      </Animated.View>
    </MaskedView>
  );
}
