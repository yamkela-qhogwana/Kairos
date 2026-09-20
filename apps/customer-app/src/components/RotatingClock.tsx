import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type Props = {
  size?: number;
  color?: string;
};

export function RotatingClock({ size = 22, color = colors.dotGold }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spinLoop.start();
    return () => spinLoop.stop();
  }, [rotation]);

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <MaterialIcons name="access-time" size={size} color={color} />
    </Animated.View>
  );
}
