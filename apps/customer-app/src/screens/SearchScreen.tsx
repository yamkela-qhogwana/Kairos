import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
import { fetchCategories, Category } from '../api/categories';
import { fetchSearch, fetchSuggestions, SearchSuggestion } from '../api/search';
import { addRecentSearch, getRecentSearches } from '../api/searchHistory';

const GRID_GAP = 6;
const SCREEN_PADDING = 16;
const DOT_COLORS = ['#e8c9a0', '#ddaba8', '#c6a3c9', '#a3b9cf', '#f5d78e', '#9fd8c9'];

const PRICE_BRACKETS: { label: string; min?: number; max?: number }[] = [
  { label: 'Under R500', max: 500 },
  { label: 'R500–R2000', min: 500, max: 2000 },
  { label: 'Over R2000', min: 2000 },
];

type Props = {
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
};

export function SearchScreen({ onClose, onSelectProduct }: Props) {
  const insets = useSafeAreaInsets();
  const scaleFont = useScaleFont();
  const { width } = useWindowDimensions();

  const [queryText, setQueryText] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterPriceLabel, setFilterPriceLabel] = useState<string | null>(null);
  const [filterOnSale, setFilterOnSale] = useState(false);

  useEffect(() => {
    getRecentSearches().then(setRecentSearches);
    fetchCategories()
      .then(setCategories)
      .catch(() => {});
    fetchProducts()
      .then((all) => setTrendingProducts([...all].sort((a, b) => b.rating - a.rating).slice(0, 10)))
      .catch(() => {});
  }, []);

  // Live suggestions as the user types — fast, no AI, just Typesense.
  useEffect(() => {
    const trimmed = queryText.trim();
    if (hasSearched || trimmed.length < 2) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(() => {
      fetchSuggestions(trimmed)
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(handle);
  }, [queryText, hasSearched]);

  const runSearch = useCallback(async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setQueryText(trimmed);
    setHasSearched(true);
    setIsSearching(true);
    setError(null);
    setFilterCategory(null);
    setFilterPriceLabel(null);
    setFilterOnSale(false);

    try {
      const result = await fetchSearch(trimmed);
      setResults(result.products);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }

    addRecentSearch(trimmed).then(setRecentSearches);
  }, []);

  const handleClear = () => {
    setQueryText('');
    setHasSearched(false);
  };

  const isTyping = !hasSearched && queryText.trim().length >= 2;
  const gridItemWidth = (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;

  const resultCategories = useMemo(() => {
    const seen = new Map<string, string>();
    results.forEach((p) => seen.set(p.categorySlug, p.categoryName));
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [results]);

  const filteredResults = useMemo(() => {
    const bracket = PRICE_BRACKETS.find((b) => b.label === filterPriceLabel);
    return results.filter((p) => {
      if (filterCategory && p.categorySlug !== filterCategory) return false;
      if (filterOnSale && !p.isOnSale) return false;
      if (bracket) {
        const price = p.salePrice ?? p.originalPrice;
        if (bracket.min != null && price < bracket.min) return false;
        if (bracket.max != null && price > bracket.max) return false;
      }
      return true;
    });
  }, [results, filterCategory, filterPriceLabel, filterOnSale]);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable hitSlop={10} onPress={onClose} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={scaleFont(22)} color={colors.text} />
        </Pressable>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={scaleFont(18)} color={colors.muted} />
          <TextInput
            autoFocus
            placeholder="Search Kairos"
            placeholderTextColor={colors.muted}
            style={[styles.searchInput, { fontSize: scaleFont(13) }]}
            value={queryText}
            onChangeText={setQueryText}
            onSubmitEditing={() => runSearch(queryText)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {queryText.length > 0 ? (
            <Pressable hitSlop={8} onPress={handleClear}>
              <MaterialCommunityIcons name="close-circle" size={scaleFont(16)} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {isTyping ? (
        <FlatList
          key="suggestions-list"
          data={suggestions}
          keyExtractor={(item, index) => `${item.type}-${item.text}-${index}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.suggestionsList}
          renderItem={({ item }) => (
            <Pressable style={styles.suggestionRow} onPress={() => runSearch(item.text)}>
              <MaterialCommunityIcons
                name={item.type === 'category' ? 'shape-outline' : 'magnify'}
                size={scaleFont(15)}
                color={colors.muted}
              />
              <Text
                style={[styles.suggestionTitle, { fontSize: scaleFont(12.5) }]}
                numberOfLines={1}
              >
                {item.text}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { fontSize: scaleFont(12) }]}>
              No matching products.
            </Text>
          }
        />
      ) : !hasSearched ? (
        <FlatList
          key="trending-grid"
          data={trendingProducts}
          keyExtractor={(item) => String(item.productId)}
          numColumns={2}
          columnWrapperStyle={{ gap: GRID_GAP }}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
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
              {recentSearches.length > 0 ? (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { fontSize: scaleFont(13) }]}>
                    Recent Searches
                  </Text>
                  <View style={styles.chipWrap}>
                    {recentSearches.map((term) => (
                      <Pressable key={term} style={styles.recentChip} onPress={() => runSearch(term)}>
                        <Text style={[styles.recentChipText, { fontSize: scaleFont(10.5) }]}>
                          {term}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}

              {categories.length > 0 ? (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { fontSize: scaleFont(13) }]}>
                    Suggested Searches
                  </Text>
                  <View style={styles.chipWrap}>
                    {categories.slice(0, 6).map((c, index) => (
                      <Pressable
                        key={c.categoryId}
                        style={[
                          styles.suggestedChip,
                          {
                            backgroundColor: DOT_COLORS[index % DOT_COLORS.length],
                            borderColor: DOT_COLORS[index % DOT_COLORS.length],
                          },
                        ]}
                        onPress={() => runSearch(c.name)}
                      >
                        <Text style={[styles.suggestedChipText, { fontSize: scaleFont(10.5) }]}>
                          {c.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}

              <Text style={[styles.sectionTitle, { fontSize: scaleFont(13), marginBottom: 14 }]}>
                Trending Now
              </Text>
            </View>
          }
        />
      ) : isSearching ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={colors.dotGold} />
          <Text style={[styles.loadingText, { fontSize: scaleFont(11.5) }]}>
            Asking Kairos AI what you mean…
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerFill}>
          <Text style={[styles.errorText, { fontSize: scaleFont(12) }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          key="results-grid"
          data={filteredResults}
          keyExtractor={(item) => String(item.productId)}
          numColumns={2}
          columnWrapperStyle={{ gap: GRID_GAP }}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              scaleFont={scaleFont}
              width={gridItemWidth}
              onPress={() => onSelectProduct(item)}
            />
          )}
          ListHeaderComponent={
            <View style={styles.filterBarWrap}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.filterBar}
                data={[
                  { key: 'sale', label: 'On Sale', active: filterOnSale },
                  ...resultCategories.map((c) => ({
                    key: c.slug,
                    label: c.name,
                    active: filterCategory === c.slug,
                  })),
                  ...PRICE_BRACKETS.map((b) => ({
                    key: b.label,
                    label: b.label,
                    active: filterPriceLabel === b.label,
                  })),
                ]}
                keyExtractor={(f) => f.key}
                renderItem={({ item: f }) => (
                  <Pressable
                    style={[styles.filterChip, f.active && styles.filterChipActive]}
                    onPress={() => {
                      if (f.key === 'sale') {
                        setFilterOnSale((v) => !v);
                      } else if (resultCategories.some((c) => c.slug === f.key)) {
                        setFilterCategory((prev) => (prev === f.key ? null : f.key));
                      } else {
                        setFilterPriceLabel((prev) => (prev === f.key ? null : f.key));
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { fontSize: scaleFont(11) },
                        f.active && styles.filterChipTextActive,
                      ]}
                    >
                      {f.label}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { fontSize: scaleFont(12) }]}>No results found.</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 14,
  },
  backButton: {
    padding: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.regular,
    color: colors.text,
    padding: 0,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontFamily: typography.regular,
    color: colors.muted,
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
  filterBarWrap: {
    marginBottom: 16,
  },
  filterBar: {
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.25)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: colors.dotGold,
    borderColor: colors.dotGold,
  },
  filterChipText: {
    fontFamily: typography.medium,
    color: colors.text,
  },
  filterChipTextActive: {
    color: '#08090b',
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  recentChipText: {
    fontFamily: typography.medium,
    color: '#08090b',
  },
  suggestedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  suggestedChipText: {
    fontFamily: typography.medium,
    color: '#08090b',
  },
  suggestionsList: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  suggestionTitle: {
    flex: 1,
    fontFamily: typography.medium,
    color: colors.text,
  },
});
