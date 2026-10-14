import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { ProductCard } from '../components/ProductCard';
import { PromoCarousel } from '../components/PromoCarousel';
import { CategoryCollage } from '../components/CategoryCollage';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';
import { fetchProducts, Product } from '../api/products';
import { fetchCategories, Category } from '../api/categories';

const GRID_GAP = 6;
const SCREEN_PADDING = 16;
const CATEGORY_COLORS = ['#e8c9a0', '#ddaba8', '#c6a3c9', '#a3b9cf', '#f5d78e', '#9fd8c9'];

type Props = {
  onSearchPress: () => void;
  onSelectProduct: (product: Product) => void;
};

export function HomeScreen({ onSearchPress, onSelectProduct }: Props) {
  const scaleFont = useScaleFont();
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        // The category collage is a nice-to-have — if this fails the
        // product grid below still works, so fail silently here.
      });
  }, []);

  const loadProducts = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      setError('Could not load products. Pull down to try again.');
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().finally(() => setIsLoading(false));
  }, [loadProducts]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadProducts();
    setIsRefreshing(false);
  }, [loadProducts]);

  const gridItemWidth = (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;

  return (
    <View style={styles.screen}>
      <AppHeader onSearchPress={onSearchPress} />

      {isLoading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={colors.dotGold} />
        </View>
      ) : error && products.length === 0 ? (
        <View style={styles.centerFill}>
          <Text style={[styles.errorText, { fontSize: scaleFont(12) }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          key="grid-2col"
          keyExtractor={(item) => String(item.productId)}
          numColumns={2}
          columnWrapperStyle={{ gap: GRID_GAP }}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.dotGold}
            />
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              scaleFont={scaleFont}
              width={gridItemWidth}
              onPress={() => onSelectProduct(item)}
            />
          )}
          ListHeaderComponent={
            <View>
              <PromoCarousel products={products} />

              <CategoryCollage categories={categories} products={products} />

              {categories.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryButtonRow}
                >
                  {categories.map((category, index) => (
                    <Pressable
                      key={category.categoryId}
                      style={[
                        styles.categoryButton,
                        { backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] },
                      ]}
                    >
                      <Text style={[styles.categoryButtonText, { fontSize: scaleFont(11) }]}>
                        {category.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { fontSize: scaleFont(12) }]}>
              No products found.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgTop,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: typography.regular,
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: typography.regular,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 40,
  },
  gridContent: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 24,
  },
  categoryButtonRow: {
    gap: 8,
    paddingBottom: 18,
  },
  categoryButton: {
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryButtonText: {
    fontFamily: typography.semiBold,
    color: '#08090b',
  },
});
