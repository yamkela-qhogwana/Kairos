import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Product } from '../api/products';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

const TILE_SIZE = 64;

type Subcategory = { slug: string; name: string };

type Props = {
  subcategories: Subcategory[];
  products: Product[];
  active: string | null;
  onSelect: (slug: string | null) => void;
};

// Same visual language as CategoryCollage (light panel, circular image
// tiles, no icons) but scoped to whatever subcategories are present in the
// current search results, not the full catalog.
export function SubcategoryBanner({ subcategories, products, active, onSelect }: Props) {
  const scaleFont = useScaleFont();

  if (subcategories.length === 0) return null;

  return (
    <View style={styles.panel}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {subcategories.map((sub) => {
          const image = products.find((p) => p.subcategorySlug === sub.slug)?.images[0];
          const isActive = active === sub.slug;
          return (
            <Pressable
              key={sub.slug}
              style={styles.tile}
              onPress={() => onSelect(isActive ? null : sub.slug)}
            >
              <View style={[styles.imageWrap, isActive && styles.imageWrapActive]}>
                {image ? <Image source={{ uri: image }} style={styles.image} resizeMode="cover" /> : null}
              </View>
              <Text numberOfLines={1} style={[styles.tileLabel, { fontSize: scaleFont(8) }]}>
                {sub.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#eeece6',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 16,
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
  imageWrapActive: {
    borderWidth: 2,
    borderColor: '#08090b',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tileLabel: {
    fontFamily: typography.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: '#9c6b2e',
    textAlign: 'center',
  },
});
