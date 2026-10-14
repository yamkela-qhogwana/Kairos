import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProductCard } from '../components/ProductCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';
import { fetchProducts, Product } from '../api/products';

const GRID_GAP = 6;
const SCREEN_PADDING = 16;

type Props = {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
};

export function ProductDetailScreen({ product, onBack, onSelectProduct }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();
  const { width } = useWindowDimensions();

  const [activeImage, setActiveImage] = useState(0);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    setActiveImage(0);
    fetchProducts(product.categorySlug)
      .then((all) => setRelated(all.filter((p) => p.productId !== product.productId).slice(0, 6)))
      .catch(() => {});
  }, [product]);

  const images = product.images.length > 0 ? product.images : [undefined];
  const gridItemWidth = (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => String(index)}
            onMomentumScrollEnd={(e) => {
              setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width));
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={[styles.image, { width }]} resizeMode="cover" />
            )}
          />

          <Pressable
            hitSlop={10}
            onPress={onBack}
            style={[styles.backButton, { top: insets.top + 12 }]}
          >
            <MaterialCommunityIcons name="arrow-left" size={scaleFont(22)} color="#fff" />
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

        <View style={styles.content}>
          <Text style={[styles.category, { fontSize: scaleFont(11) }]}>
            {product.categoryName.toUpperCase()}
          </Text>
          <Text style={[styles.title, { fontSize: scaleFont(19) }]}>{product.title}</Text>

          <View style={styles.priceRow}>
            {product.isOnSale && product.salePrice != null ? (
              <>
                <Text style={[styles.salePrice, { fontSize: scaleFont(20) }]}>
                  R{product.salePrice.toFixed(2)}
                </Text>
                <Text style={[styles.originalPrice, { fontSize: scaleFont(14) }]}>
                  R{product.originalPrice.toFixed(2)}
                </Text>
                {product.discountPercentage ? (
                  <View style={styles.discountBadge}>
                    <Text style={[styles.discountBadgeText, { fontSize: scaleFont(11) }]}>
                      -{product.discountPercentage}%
                    </Text>
                  </View>
                ) : null}
              </>
            ) : (
              <Text style={[styles.salePrice, { fontSize: scaleFont(20) }]}>
                R{product.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>

          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="star" size={scaleFont(14)} color={colors.dotGold} />
            <Text style={[styles.ratingText, { fontSize: scaleFont(12) }]}>
              {product.rating.toFixed(1)} · {product.storeName}
            </Text>
          </View>

          {product.description ? (
            <Text style={[styles.description, { fontSize: scaleFont(12.5) }]}>
              {product.description}
            </Text>
          ) : null}
        </View>

        {related.length > 0 ? (
          <View style={styles.relatedSection}>
            <Text style={[styles.relatedTitle, { fontSize: scaleFont(15) }]}>
              You Might Also Like
            </Text>
            <View style={styles.relatedGrid}>
              {related.map((item) => (
                <ProductCard
                  key={item.productId}
                  product={item}
                  scaleFont={scaleFont}
                  width={gridItemWidth}
                  onPress={() => onSelectProduct(item)}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgTop,
  },
  imageWrap: {
    aspectRatio: 0.9,
    backgroundColor: colors.imageBg,
  },
  image: {
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(8, 9, 11, 0.5)',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 18,
  },
  category: {
    fontFamily: typography.semiBold,
    color: colors.dotGold,
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  salePrice: {
    fontFamily: typography.bold,
    color: colors.text,
  },
  originalPrice: {
    fontFamily: typography.regular,
    color: colors.error,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.dotGold,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  discountBadgeText: {
    fontFamily: typography.bold,
    color: '#08090b',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 16,
  },
  ratingText: {
    fontFamily: typography.regular,
    color: colors.muted,
  },
  description: {
    fontFamily: typography.regular,
    color: colors.muted,
    lineHeight: 19,
    marginBottom: 8,
  },
  relatedSection: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 24,
    paddingBottom: 32,
  },
  relatedTitle: {
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 14,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
});
