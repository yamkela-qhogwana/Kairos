import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Category } from '../api/categories';
import { Product } from '../api/products';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

const TILE_SIZE = 64;

type Props = {
  categories: Category[];
  products: Product[];
};

// Light-background "mini collage" panel, deliberately breaking from the dark
// page theme so the category tiles read as their own shelf. Plain ScrollView
// + solid brand-gold text on purpose — a gradient-masked label inside a
// virtualized horizontal list broke twice before, so this keeps the same
// warm brand-font look without that fragile technique.
export function CategoryCollage({ categories, products }: Props) {
  const scaleFont = useScaleFont();

  const tiles = useMemo(() => {
    return categories.map((category) => ({
      category,
      image: products.find((p) => p.categorySlug === category.slug)?.images[0],
    }));
  }, [categories, products]);

  if (tiles.length === 0) return null;

  return (
    <View style={styles.panel}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {tiles.map(({ category, image }) => (
          <View key={category.categoryId} style={styles.tile}>
            <View style={styles.imageWrap}>
              {image ? <Image source={{ uri: image }} style={styles.image} resizeMode="cover" /> : null}
            </View>
            <Text numberOfLines={1} style={[styles.tileLabel, { fontSize: scaleFont(8) }]}>
              {category.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#eeece6',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
  },
  row: {
    paddingHorizontal: 16,
    gap: 14,
  },
  tile: {
    alignItems: 'center',
    width: TILE_SIZE + 10,
  },
  imageWrap: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: TILE_SIZE / 2,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    marginBottom: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tileLabel: {
    fontFamily: typography.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    // A deeper gold than colors.dotGold — the pale champagne tone is tuned
    // for the dark theme and is too low-contrast on this light panel.
    color: '#9c6b2e',
    textAlign: 'center',
  },
});
