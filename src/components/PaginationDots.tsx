import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

type Props = {
  count: number;
  activeIndex: number;
};

export function PaginationDots({ count, activeIndex }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, index) =>
        index === activeIndex ? (
          <LinearGradient
            key={index}
            colors={colors.wordmarkGradient}
            locations={colors.wordmarkGradientLocations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.dot, styles.dotActive]}
          />
        ) : (
          <View key={index} style={[styles.dot, styles.dotInactive]} />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(232, 201, 160, 0.25)',
  },
});
