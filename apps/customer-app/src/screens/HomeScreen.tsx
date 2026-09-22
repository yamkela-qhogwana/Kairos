import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader } from '../components/AppHeader';
import { ProductCard } from '../components/ProductCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';
import { fetchProducts, Product } from '../api/products';
import { fetchCategories, Category } from '../api/categories';

const GRID_GAP = 6;
const SCREEN_PADDING = 16;
const CATEGORY_COLORS = ['#e8c9a0', '#ddaba8', '#c6a3c9', '#a3b9cf', '#f5d78e', '#9fd8c9'];

type HeroCard =
  | { kind: 'product'; key: string; badge: string; product: Product }
  | {
      kind: 'banner';
      key: string;
      title: string;
      subtitle: string;
      icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    };

export function HomeScreen() {
  const scaleFont = useScaleFont();
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        // Category chips are a nice-to-have — if this fails the product
        // grid below still works, so fail silently here.
      });
  }, []);

  const loadProducts = useCallback(async (category: string | null) => {
    setError(null);
    try {
      const data = await fetchProducts(category ?? undefined);
      setProducts(data);
    } catch {
      setError('Could not load products. Pull down to try again.');
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadProducts(selectedCategory).finally(() => setIsLoading(false));
  }, [selectedCategory, loadProducts]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadProducts(selectedCategory);
    setIsRefreshing(false);
  }, [selectedCategory, loadProducts]);

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = useMemo(
    () => (query ? products.filter((p) => p.title.toLowerCase().includes(query)) : products),
    [products, query],
  );
  const heroCards = useMemo<HeroCard[]>(() => {
    if (products.length === 0) return [];

    const byDiscount = [...products].sort(
      (a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0),
    );
    const byRating = [...products].sort((a, b) => b.rating - a.rating);
    const byNewest = [...products].sort((a, b) => b.productId - a.productId);

    const used = new Set<number>();
    const pick = (list: Product[]) => {
      const found = list.find((p) => !used.has(p.productId));
      if (found) used.add(found.productId);
      return found;
    };

    const cards: HeroCard[] = [];

    const bigSale = pick(byDiscount);
    if (bigSale) {
      cards.push({
        kind: 'product',
        key: 'big-sale',
        badge: `UP TO ${bigSale.discountPercentage}% OFF`,
        product: bigSale,
      });
    }

    const topRated = pick(byRating);
    if (topRated) {
      cards.push({ kind: 'product', key: 'top-rated', badge: 'TOP RATED', product: topRated });
    }

    const categoryDeal = pick(byDiscount.filter((p) => p.categorySlug !== bigSale?.categorySlug));
    if (categoryDeal) {
      cards.push({
        kind: 'product',
        key: 'category-deal',
        badge: `${categoryDeal.categoryName.toUpperCase()} DEALS`,
        product: categoryDeal,
      });
    }

    const newIn = pick(byNewest);
    if (newIn) {
      cards.push({ kind: 'product', key: 'new-in', badge: 'NEW IN', product: newIn });
    }

    cards.push({
      kind: 'banner',
      key: 'delivery',
      title: 'Same-Day Delivery',
      subtitle: 'Order before 2pm in Johannesburg',
      icon: 'lightning-bolt-outline',
    });

    return cards;
  }, [products]);

  const gridItemWidth = (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;
  const heroCardWidth = width - SCREEN_PADDING * 2;

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
          data={filteredProducts}
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
            <ProductCard product={item} scaleFont={scaleFont} width={gridItemWidth} />
          )}
          ListHeaderComponent={
            <View>
              {heroCards.length > 0 && !query ? (
                <View style={styles.heroSection}>
                  <FlatList
                    data={heroCards}
                    horizontal
                    pagingEnabled
                    keyExtractor={(item) => item.key}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                      const index = Math.round(e.nativeEvent.contentOffset.x / heroCardWidth);
                      setActiveHeroIndex(index);
                    }}
                    renderItem={({ item }) =>
                    item.kind === 'banner' ? (
                      <Pressable style={[styles.heroCard, styles.heroBanner, { width: heroCardWidth }]}>
                        <LinearGradient
                          colors={colors.wordmarkGradient}
                          locations={colors.wordmarkGradientLocations}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={StyleSheet.absoluteFillObject}
                        />
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={scaleFont(28)}
                          color="#08090b"
                          style={styles.heroBannerIcon}
                        />
                        <Text style={[styles.heroBannerTitle, { fontSize: scaleFont(16) }]}>
                          {item.title}
                        </Text>
                        <Text style={[styles.heroBannerSubtitle, { fontSize: scaleFont(11) }]}>
                          {item.subtitle}
                        </Text>
                      </Pressable>
                    ) : (
                      <Pressable style={[styles.heroCard, { width: heroCardWidth }]}>
                        <Image
                          source={{ uri: item.product.images[0] }}
                          style={styles.heroImage}
                          resizeMode="cover"
                        />
                        <LinearGradient
                          colors={['transparent', 'rgba(8, 9, 11, 0.9)']}
                          style={styles.heroGradient}
                        />
                        <View style={styles.heroBadge}>
                          <Text style={[styles.heroBadgeText, { fontSize: scaleFont(11) }]}>
                            {item.badge}
                          </Text>
                        </View>
                        <View style={styles.heroTextWrap}>
                          <Text style={[styles.heroCategory, { fontSize: scaleFont(10) }]}>
                            {item.product.categoryName.toUpperCase()}
                          </Text>
                          <Text
                            style={[styles.heroTitle, { fontSize: scaleFont(15) }]}
                            numberOfLines={1}
                          >
                            {item.product.title}
                          </Text>
                          <View style={styles.heroPriceRow}>
                            <Text style={[styles.heroSalePrice, { fontSize: scaleFont(13) }]}>
                              R{(item.product.salePrice ?? item.product.originalPrice).toFixed(2)}
                            </Text>
                            {item.product.isOnSale ? (
                              <Text style={[styles.heroOriginalPrice, { fontSize: scaleFont(10.5) }]}>
                                R{item.product.originalPrice.toFixed(2)}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      </Pressable>
                    )
                  }
                  />
                  {heroCards.length > 1 ? (
                    <View style={styles.heroDotsRow}>
                      {heroCards.map((item, index) => (
                        <View
                          key={item.key}
                          style={[styles.heroDot, index === activeHeroIndex && styles.heroDotActive]}
                        />
                      ))}
                    </View>
                  ) : null}
                </View>
              ) : null}

              {categories.length > 0 ? (
                <FlatList
                  data={categories}
                  horizontal
                  keyExtractor={(item) => String(item.categoryId)}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryList}
                  renderItem={({ item, index }) => {
                    const isSelected = selectedCategory === item.slug;
                    const chipColor = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                    return (
                      <Pressable
                        onPress={() => setSelectedCategory(isSelected ? null : item.slug)}
                        style={[
                          styles.categoryChip,
                          {
                            backgroundColor: chipColor,
                            borderColor: isSelected ? '#08090b' : chipColor,
                            borderWidth: isSelected ? 2 : 1,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            { fontSize: scaleFont(11.5), color: '#08090b' },
                          ]}
                        >
                          {item.name}
                        </Text>
                      </Pressable>
                    );
                  }}
                />
              ) : null}

              <Text style={[styles.sectionTitle, { fontSize: scaleFont(14) }]}>
                {query ? 'Search Results' : 'Recommended'}
              </Text>
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
  categoryList: {
    gap: 8,
    paddingBottom: 20,
  },
  categoryChip: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryChipText: {
    fontFamily: typography.semiBold,
  },
  sectionTitle: {
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 14,
  },
  heroSection: {
    marginBottom: 22,
  },
  heroDotsRow: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  heroDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  heroDotActive: {
    backgroundColor: '#fff',
  },
  heroCard: {
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  heroBanner: {
    padding: 16,
    justifyContent: 'flex-end',
  },
  heroBannerIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  heroBannerTitle: {
    fontFamily: typography.bold,
    color: '#08090b',
    marginBottom: 4,
  },
  heroBannerSubtitle: {
    fontFamily: typography.medium,
    color: '#08090b',
    opacity: 0.75,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  heroBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.dotGold,
    borderRadius: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroBadgeText: {
    fontFamily: typography.bold,
    color: '#08090b',
    letterSpacing: 0.5,
  },
  heroTextWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
  },
  heroCategory: {
    fontFamily: typography.semiBold,
    color: colors.dotGold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 6,
  },
  heroPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroSalePrice: {
    fontFamily: typography.bold,
    color: colors.text,
  },
  heroOriginalPrice: {
    fontFamily: typography.regular,
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
});
