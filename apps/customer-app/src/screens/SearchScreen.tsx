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
import { KairosWordmark } from '../components/KairosWordmark';
import { SubcategoryBanner } from '../components/SubcategoryBanner';
import { TrendingBanner } from '../components/TrendingBanner';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';
import { fetchProducts, Product } from '../api/products';
import { fetchCategories, Category } from '../api/categories';
import { fetchSearch, fetchSuggestions, SearchSuggestion } from '../api/search';
import { addRecentSearch, clearRecentSearches, getRecentSearches, removeRecentSearch } from '../api/searchHistory';

const GRID_GAP = 6;
const SCREEN_PADDING = 16;
const DOT_COLORS = ['#e8c9a0', '#ddaba8', '#c6a3c9', '#a3b9cf', '#f5d78e', '#9fd8c9'];

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
  const [correctedQuery, setCorrectedQuery] = useState<string | null>(null);

  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterSubcategories, setFilterSubcategories] = useState<string[]>([]);
  const [filterSize, setFilterSize] = useState<string | null>(null);
  const [filterPriceCondition, setFilterPriceCondition] = useState<'under' | 'over' | null>(null);
  const [filterPriceValue, setFilterPriceValue] = useState('');
  const [filterSpecial, setFilterSpecial] = useState<'luxe' | 'rent' | null>(null);

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
    setFilterCategories([]);
    setFilterSubcategories([]);
    setFilterSize(null);
    setFilterPriceCondition(null);
    setFilterPriceValue('');
    setFilterSpecial(null);

    let correctedTerm: string | null = null;
    try {
      const result = await fetchSearch(trimmed);
      setResults(result.products);
      correctedTerm = result.correctedQuery;
      setCorrectedQuery(result.correctedQuery ? result.interpretation : null);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }

    addRecentSearch(correctedTerm ?? trimmed).then(setRecentSearches);
  }, []);

  const handleClear = () => {
    setQueryText('');
    setHasSearched(false);
    setCorrectedQuery(null);
  };

  const handleRemoveRecent = (term: string) => {
    removeRecentSearch(term).then(setRecentSearches);
  };

  const handleClearAllRecent = () => {
    clearRecentSearches().then(setRecentSearches);
  };

  const isTyping = !hasSearched && queryText.trim().length >= 2;
  const gridItemWidth = (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;

  const resultCategories = useMemo(() => {
    const seen = new Map<string, string>();
    results.forEach((p) => seen.set(p.categorySlug, p.categoryName));
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [results]);

  const resultSubcategories = useMemo(() => {
    const seen = new Map<string, string>();
    results.forEach((p) => {
      if (p.subcategorySlug && p.subcategoryName) seen.set(p.subcategorySlug, p.subcategoryName);
    });
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [results]);

  const resultSizes = useMemo(() => {
    const seen = new Set<string>();
    results.forEach((p) => p.sizes.forEach((s) => s.quantity > 0 && seen.add(s.size)));
    return Array.from(seen);
  }, [results]);

  const filteredResults = useMemo(() => {
    const priceNum = parseFloat(filterPriceValue);
    const hasPriceFilter = filterPriceCondition !== null && !Number.isNaN(priceNum);

    return results.filter((p) => {
      if (filterCategories.length > 0 && !filterCategories.includes(p.categorySlug)) return false;
      if (
        filterSubcategories.length > 0 &&
        (!p.subcategorySlug || !filterSubcategories.includes(p.subcategorySlug))
      )
        return false;
      if (filterSize && !p.sizes.some((s) => s.size === filterSize && s.quantity > 0)) return false;
      if (hasPriceFilter) {
        const price = p.salePrice ?? p.originalPrice;
        if (filterPriceCondition === 'under' && price > priceNum) return false;
        if (filterPriceCondition === 'over' && price < priceNum) return false;
      }
      if (filterSpecial === 'luxe' && !p.isLuxe) return false;
      if (filterSpecial === 'rent' && !p.isRentable) return false;
      return true;
    });
  }, [
    results,
    filterCategories,
    filterSubcategories,
    filterSize,
    filterPriceCondition,
    filterPriceValue,
    filterSpecial,
  ]);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTopRow}>
          <Pressable hitSlop={10} onPress={onClose} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={scaleFont(22)} color={colors.text} />
          </Pressable>
          <KairosWordmark fontSize={scaleFont(16)} />
          <View style={styles.headerIconsRow}>
            <Pressable hitSlop={10} style={styles.headerIconButton}>
              <MaterialCommunityIcons name="heart-outline" size={scaleFont(20)} color={colors.text} />
            </Pressable>
            <Pressable hitSlop={10} style={styles.headerIconButton}>
              <MaterialCommunityIcons name="shopping-outline" size={scaleFont(20)} color={colors.text} />
            </Pressable>
            <Pressable hitSlop={10} style={styles.headerIconButton}>
              <MaterialCommunityIcons name="account-circle-outline" size={scaleFont(22)} color={colors.text} />
            </Pressable>
          </View>
        </View>
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
                  <View style={styles.sectionHeaderRow}>
                    <Text style={[styles.sectionTitle, { fontSize: scaleFont(13) }]}>
                      Recent Searches
                    </Text>
                    <Pressable hitSlop={8} onPress={handleClearAllRecent}>
                      <Text style={[styles.clearAllText, { fontSize: scaleFont(10.5) }]}>
                        Clear All
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.chipWrap}>
                    {recentSearches.map((term) => (
                      <Pressable key={term} style={styles.recentChip} onPress={() => runSearch(term)}>
                        <Text style={[styles.recentChipText, { fontSize: scaleFont(10.5) }]}>
                          {term}
                        </Text>
                        <Pressable
                          hitSlop={8}
                          onPress={() => handleRemoveRecent(term)}
                          style={styles.recentChipDelete}
                        >
                          <MaterialCommunityIcons name="close" size={scaleFont(12)} color={colors.muted} />
                        </Pressable>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}

              {categories.length > 0 ? (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { fontSize: scaleFont(13), marginBottom: 12 }]}>
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

              <View style={styles.hotListRow}>
                <KairosWordmark fontSize={scaleFont(13)} />
                <Text style={[styles.sectionTitle, { fontSize: scaleFont(13) }]}> HOT LIST</Text>
              </View>
            </View>
          }
        />
      ) : isSearching ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={colors.dotGold} />
          <Text style={[styles.loadingText, { fontSize: scaleFont(11.5) }]}>
            Searching…
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerFill}>
          <Text style={[styles.errorText, { fontSize: scaleFont(12) }]}>{error}</Text>
        </View>
      ) : (
        <View style={styles.resultsWrap}>
          <View style={styles.fixedSubcategoryWrap}>
            <SubcategoryBanner
              subcategories={resultSubcategories}
              products={results}
              active={filterSubcategories.length === 1 ? filterSubcategories[0] : null}
              onSelect={(slug) => setFilterSubcategories(slug ? [slug] : [])}
            />
          </View>

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
              {correctedQuery ? (
                <Text style={[styles.correctedText, { fontSize: scaleFont(11.5) }]}>
                  {correctedQuery}
                </Text>
              ) : null}

              <TrendingBanner products={results} query={queryText} onPress={onSelectProduct} />

              <SearchFilterBar
                sizes={resultSizes}
                categories={resultCategories}
                subcategories={resultSubcategories}
                filterSize={filterSize}
                filterCategories={filterCategories}
                filterSubcategories={filterSubcategories}
                filterSpecial={filterSpecial}
                priceCondition={filterPriceCondition}
                priceValue={filterPriceValue}
                onSetSize={setFilterSize}
                onToggleCategory={(slug) =>
                  setFilterCategories((prev) =>
                    prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
                  )
                }
                onToggleSubcategory={(slug) =>
                  setFilterSubcategories((prev) =>
                    prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
                  )
                }
                onClearCategoryFilters={() => {
                  setFilterCategories([]);
                  setFilterSubcategories([]);
                }}
                onSetSpecial={setFilterSpecial}
                onSetPrice={(condition, value) => {
                  setFilterPriceCondition(condition);
                  setFilterPriceValue(value);
                }}
              />
            </View>
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { fontSize: scaleFont(12) }]}>No results found.</Text>
          }
          />
        </View>
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
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 14,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  backButton: {
    padding: 4,
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 'auto',
  },
  headerIconButton: {
    padding: 4,
  },
  searchBar: {
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
  resultsWrap: {
    flex: 1,
  },
  fixedSubcategoryWrap: {
    paddingHorizontal: SCREEN_PADDING,
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
  correctedText: {
    fontFamily: typography.regular,
    color: colors.muted,
    marginBottom: 10,
  },
  section: {
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: typography.bold,
    color: colors.text,
  },
  hotListRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  clearAllText: {
    fontFamily: typography.semiBold,
    color: colors.dotGold,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  recentChipDelete: {
    marginLeft: -2,
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
