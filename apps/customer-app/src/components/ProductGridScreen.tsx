import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { AppHeader } from './AppHeader';
import { ProductCard } from './ProductCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';
import { fetchProducts, Product } from '../api/products';

const GRID_GAP = 6;
const SCREEN_PADDING = 16;

type Props = {
  title: string;
  subtitle?: string;
  selectProducts: (all: Product[]) => Product[];
};

export function ProductGridScreen({ title, subtitle, selectProducts }: Props) {
  const scaleFont = useScaleFont();
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
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
    load().finally(() => setIsLoading(false));
  }, [load]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await load();
    setIsRefreshing(false);
  }, [load]);

  const gridItemWidth = (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;
  const query = searchQuery.trim().toLowerCase();
  const displayedProducts = useMemo(() => {
    const base = selectProducts(products);
    return query ? base.filter((p) => p.title.toLowerCase().includes(query)) : base;
  }, [products, query, selectProducts]);

  return (
    <View style={styles.screen}>
      <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

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
          data={displayedProducts}
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
            <ProductCard product={item} scaleFont={scaleFont} width={gridItemWidth} />
          )}
          ListHeaderComponent={
            <View style={styles.titleBlock}>
              <Text style={[styles.title, { fontSize: scaleFont(18) }]}>
                {query ? 'Search Results' : title}
              </Text>
              {!query && subtitle ? (
                <Text style={[styles.subtitle, { fontSize: scaleFont(11.5) }]}>{subtitle}</Text>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { fontSize: scaleFont(12) }]}>
              Nothing here yet.
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
  titleBlock: {
    marginBottom: 14,
  },
  title: {
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: typography.regular,
    color: colors.muted,
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
});
