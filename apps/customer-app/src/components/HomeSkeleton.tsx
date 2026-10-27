import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';

const GRID_GAP = 6;
const SCREEN_PADDING = 16;

// A static "shape of the page" preview shown while the home feed loads,
// instead of a blank spinner — mirrors PromoCarousel, CategoryCollage, the
// collection button row, and the two-column product grid.
export function HomeSkeleton() {
  const { width } = useWindowDimensions();
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const gridItemWidth = (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;

  return (
    <View style={styles.screen}>
      <Animated.View style={{ opacity: pulse }}>
        <View style={styles.promoBlock} />

        <View style={styles.categoryPanel}>
          <View style={styles.categoryRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={i} style={styles.categoryTileWrap}>
                <View style={styles.categoryCircle} />
                <View style={styles.categoryLabel} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.collectionRow}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={styles.collectionButton} />
          ))}
        </View>

        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={[styles.card, { width: gridItemWidth }]}>
              <View style={styles.cardImage} />
              <View style={styles.cardLineShort} />
              <View style={styles.cardLineLong} />
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const PLACEHOLDER = 'rgba(255, 255, 255, 0.06)';
const PLACEHOLDER_LIGHT = 'rgba(0, 0, 0, 0.06)';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgTop,
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 12,
  },
  promoBlock: {
    height: 140,
    borderRadius: 14,
    backgroundColor: PLACEHOLDER,
    marginBottom: 20,
  },
  categoryPanel: {
    backgroundColor: '#eeece6',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 16,
  },
  categoryTileWrap: {
    alignItems: 'center',
    width: 74,
  },
  categoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PLACEHOLDER_LIGHT,
    marginBottom: 6,
  },
  categoryLabel: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: PLACEHOLDER_LIGHT,
  },
  collectionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  collectionButton: {
    flex: 1,
    height: 38,
    backgroundColor: PLACEHOLDER,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  card: {
    marginBottom: 8,
  },
  cardImage: {
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: PLACEHOLDER,
    marginBottom: 6,
  },
  cardLineShort: {
    width: '70%',
    height: 8,
    borderRadius: 4,
    backgroundColor: PLACEHOLDER,
    marginBottom: 6,
  },
  cardLineLong: {
    width: '40%',
    height: 8,
    borderRadius: 4,
    backgroundColor: PLACEHOLDER,
  },
});
