import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Product } from '../api/products';
import { PROMO_BANNERS } from '../data/promoBanners';

const GRID_GAP = 6;

type Props = {
  products: Product[];
};

// Shared marketing carousel used at the top of Home and every category page
// — same promo table, same look, wherever it's shown.
export function PromoCarousel({ products }: Props) {
  const { width } = useWindowDimensions();
  const heroCardWidth = width * 0.68;

  const heroCards = useMemo(() => {
    return PROMO_BANNERS.flatMap((promo) => {
      if (promo.image) {
        return [{ key: promo.key, image: promo.image }];
      }
      const candidates = promo.categorySlug
        ? products.filter((p) => p.categorySlug === promo.categorySlug)
        : products;
      const fallbackUri = candidates[0]?.images[0];
      return fallbackUri ? [{ key: promo.key, image: { uri: fallbackUri } }] : [];
    });
  }, [products]);

  if (heroCards.length === 0) return null;

  return (
    <View style={styles.heroSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.heroCarouselContent}
      >
        {heroCards.map((item) => (
          <Image
            key={item.key}
            source={item.image}
            style={[styles.heroCard, { width: heroCardWidth }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    marginBottom: 18,
  },
  heroCarouselContent: {
    gap: GRID_GAP,
    paddingRight: GRID_GAP,
  },
  heroCard: {
    height: 120,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
});
