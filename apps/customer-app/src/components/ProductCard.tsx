import React, { useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '../api/products';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = {
  product: Product;
  scaleFont: (size: number) => number;
  width: number;
};

export function ProductCard({ product, scaleFont, width }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const images = product.images.length > 0 ? product.images : [undefined];

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveImage(index);
  };

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.imageWrap}>
        {images.length > 1 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
          >
            {images.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={[styles.image, { width }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : (
          <Image source={{ uri: images[0] }} style={styles.image} resizeMode="cover" />
        )}

        {product.isOnSale && product.discountPercentage ? (
          <View style={styles.saleBadge}>
            <Text style={[styles.saleBadgeText, { fontSize: scaleFont(9) }]}>
              -{product.discountPercentage}%
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={() => setIsLiked((v) => !v)}
          hitSlop={8}
          style={styles.likeButton}
        >
          <MaterialCommunityIcons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={scaleFont(16)}
            color={isLiked ? colors.error : '#fff'}
          />
        </Pressable>

        {images.length > 1 ? (
          <View style={styles.dotsRow}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === activeImage && styles.dotActive]}
              />
            ))}
          </View>
        ) : null}
      </View>

      <Text style={[styles.title, { fontSize: scaleFont(11) }]} numberOfLines={1}>
        {product.title}
      </Text>

      <View style={styles.priceRow}>
        {product.isOnSale && product.salePrice != null ? (
          <>
            <Text style={[styles.salePrice, { fontSize: scaleFont(12) }]}>
              R{product.salePrice.toFixed(2)}
            </Text>
            <Text style={[styles.originalPrice, { fontSize: scaleFont(10) }]}>
              R{product.originalPrice.toFixed(2)}
            </Text>
          </>
        ) : (
          <Text style={[styles.salePrice, { fontSize: scaleFont(12) }]}>
            R{product.originalPrice.toFixed(2)}
          </Text>
        )}
      </View>

      <View style={styles.ratingRow}>
        <MaterialCommunityIcons name="star" size={scaleFont(11)} color={colors.dotGold} />
        <Text style={[styles.ratingText, { fontSize: scaleFont(9.5) }]}>
          {product.rating.toFixed(1)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
  },
  imageWrap: {
    aspectRatio: 0.85,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.error,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  saleBadgeText: {
    fontFamily: typography.bold,
    color: '#fff',
  },
  likeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: typography.medium,
    color: colors.text,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  salePrice: {
    fontFamily: typography.bold,
    color: colors.text,
  },
  originalPrice: {
    fontFamily: typography.regular,
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontFamily: typography.regular,
    color: colors.muted,
  },
});
