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
  const [measuredSize, setMeasuredSize] = useState({ width: 0, height: 0 });
  const measuredWidth = measuredSize.width;
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
    const { width: w, height: h } = e.nativeEvent.layout;
    if (w > 0 && h > 0 && (w !== measuredSize.width || h !== measuredSize.height)) {
      setMeasuredSize({ width: w, height: h });
    }
  };

  if (measuredWidth === 0) {
    // First pass: render invisibly just to measure the real intrinsic
    // width/height — a font-size-based guess clips glyphs at small sizes.
    return (
      <Text style={[style, { opacity: 0 }]} numberOfLines={1} onLayout={handleMeasure}>
        {children}
      </Text>
    );
  }

  const height = measuredSize.height;
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
