import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '../api/products';
import { KairosWordmark } from './KairosWordmark';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

const BORDER_WIDTH = 2;

type Props = {
  products: Product[];
  query: string;
  onPress: (product: Product) => void;
};

// Single-line, text-only banner showing whether anything in the current
// search results has real sales — driven by UnitsSold, not a guess. Hidden
// entirely if nothing in this result set has ever been purchased. Rendered
// once per screen state (not inside a recycled list row), so the gradient
// border and glow animation here are safe — unlike the virtualized-list
// cases that broke before.
export function TrendingBanner({ products, query, onPress }: Props) {
  const scaleFont = useScaleFont();
  const pulseA = useRef(new Animated.Value(0)).current;
  const pulseB = useRef(new Animated.Value(0)).current;
  const pulseC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeLoop = (value: Animated.Value, duration: number, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, { toValue: 1, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );
    const loopA = makeLoop(pulseA, 1500, 0);
    const loopB = makeLoop(pulseB, 1800, 350);
    const loopC = makeLoop(pulseC, 1300, 700);
    loopA.start();
    loopB.start();
    loopC.start();
    return () => {
      loopA.stop();
      loopB.stop();
      loopC.stop();
    };
  }, [pulseA, pulseB, pulseC]);

  const topProduct = useMemo(() => {
    return products
      .map((p) => ({ product: p, sold: p.sizes.reduce((sum, s) => sum + s.unitsSold, 0) }))
      .filter((t) => t.sold > 0)
      .sort((a, b) => b.sold - a.sold)[0]?.product;
  }, [products]);

  if (!topProduct) return null;

  // Don't just grab the last query word — it might not even relate to what
  // actually matched (e.g. "green party theme" finding "Party Glasses"
  // should show "PARTY", not "THEME"). Pick the query word that's actually
  // a whole word in the top product's title, falling back to its own
  // subcategory/category if nothing lines up — always grounded in what's
  // really being shown. Whole-word Set lookup (not .includes substring
  // matching) so short connector words like "and" can't win just because
  // they happen to appear inside the title text too.
  const STOP_WORDS = new Set(['and', 'or', 'the', 'a', 'an', 'in', 'of', 'for', 'with']);
  const titleWords = new Set(topProduct.title.toLowerCase().split(/\s+/));
  const queryWords = query.trim().split(/\s+/).filter(Boolean);
  const matchedWord = queryWords.find((w) => {
    const lower = w.toLowerCase();
    return lower.length > 2 && !STOP_WORDS.has(lower) && titleWords.has(lower);
  });
  const label = matchedWord ?? topProduct.subcategoryName ?? topProduct.categoryName ?? queryWords.at(-1) ?? query;

  const glowAStyle = {
    opacity: pulseA.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.55] }),
    transform: [{ scale: pulseA.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.2] }) }],
  };
  const glowBStyle = {
    opacity: pulseB.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.45] }),
    transform: [{ scale: pulseB.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1.25] }) }],
  };
  const glowCStyle = {
    opacity: pulseC.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.4] }),
    transform: [{ scale: pulseC.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.3] }) }],
  };

  return (
    <LinearGradient
      colors={['#ff2fd4', '#8b5cf6', '#2fd4ff', '#ff2fd4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.borderWrap}
    >
      <Pressable style={styles.banner} onPress={() => onPress(topProduct)}>
        {/* Glow lives inside the banner's own bounds — clipped by overflow:
            hidden on this container, never spilling past the border. */}
        <Animated.View pointerEvents="none" style={[styles.glow, styles.glowA, glowAStyle]} />
        <Animated.View pointerEvents="none" style={[styles.glow, styles.glowB, glowBStyle]} />
        <Animated.View pointerEvents="none" style={[styles.glow, styles.glowC, glowCStyle]} />

        <View style={styles.row}>
          <KairosWordmark fontSize={scaleFont(13)} />
          <Text style={[styles.text, { fontSize: scaleFont(13) }]} numberOfLines={1}>
            {' '}TRENDING IN {label.toUpperCase()}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={scaleFont(18)} color={colors.dotGold} />
      </Pressable>
    </LinearGradient>
  );
}

const GLOW_SIZE = 20;

const styles = StyleSheet.create({
  borderWrap: {
    padding: BORDER_WIDTH,
    marginBottom: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#08090b',
    paddingHorizontal: 14,
    paddingVertical: 14,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
  },
  glowA: {
    left: 24,
    top: 8,
    backgroundColor: '#ff2fd4',
  },
  glowB: {
    right: 40,
    bottom: 6,
    backgroundColor: '#2fd4ff',
  },
  glowC: {
    left: '45%',
    top: 18,
    backgroundColor: '#8b5cf6',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexShrink: 1,
  },
  text: {
    fontFamily: typography.bold,
    color: '#ffffff',
  },
});
