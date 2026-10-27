import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader } from '../components/AppHeader';
import { ProductCard } from '../components/ProductCard';
import { PromoCarousel } from '../components/PromoCarousel';
import { CategoryCollage } from '../components/CategoryCollage';
import { HomeSkeleton } from '../components/HomeSkeleton';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';
import { fetchProducts, Product } from '../api/products';
import { fetchCategories, Category } from '../api/categories';
import { fetchCollections, Collection } from '../api/collections';

const GRID_GAP = 6;
const SCREEN_PADDING = 16;

type Props = {
  onSearchPress: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenCollection: (slug: string) => void;
};

export function HomeScreen({ onSearchPress, onSelectProduct, onOpenCollection }: Props) {
  const scaleFont = useScaleFont();
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
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
    fetchCollections()
      .then(setCollections)
      .catch(() => {
        // Same deal as categories — the collection buttons are a
        // nice-to-have, not load-bearing for the product grid.
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
        <HomeSkeleton />
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

              <View style={styles.categoryButtonRow}>
                {collections
                  .filter((collection) => collection.slug !== 'rent')
                  .map((collection) => (
                  <Pressable
                    key={collection.collectionId}
                    style={styles.categoryButton}
                    onPress={() => onOpenCollection(collection.slug)}
                  >
                    <MaterialCommunityIcons
                      name={collection.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
                      size={scaleFont(14)}
                      color="#08090b"
                    />
                    <Text style={[styles.categoryButtonText, { fontSize: scaleFont(9.5) }]}>
                      {collection.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
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
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 18,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 0,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
  },
  categoryButtonText: {
    fontFamily: typography.medium,
    color: '#08090b',
    textAlign: 'center',
  },
});
