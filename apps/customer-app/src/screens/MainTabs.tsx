import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomTabBar, TabKey } from '../components/BottomTabBar';
import { colors } from '../theme/colors';
import { Product } from '../api/products';
import { HomeScreen } from './HomeScreen';
import { TrendingScreen } from './TrendingScreen';
import { ForYouScreen } from './ForYouScreen';
import { OnPromotionScreen } from './OnPromotionScreen';
import { SearchScreen } from './SearchScreen';
import { ProductDetailScreen } from './ProductDetailScreen';
import { LuxeScreen } from './LuxeScreen';
import { RentScreen } from './RentScreen';

export function MainTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openCollectionSlug, setOpenCollectionSlug] = useState<string | null>(null);

  if (selectedProduct) {
    return (
      <View style={styles.root}>
        <ProductDetailScreen
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onSelectProduct={setSelectedProduct}
        />
      </View>
    );
  }

  if (isSearchOpen) {
    return (
      <View style={styles.root}>
        <SearchScreen onClose={() => setIsSearchOpen(false)} onSelectProduct={setSelectedProduct} />
      </View>
    );
  }

  if (openCollectionSlug === 'luxe') {
    return (
      <View style={styles.root}>
        <LuxeScreen
          onBack={() => setOpenCollectionSlug(null)}
          onSearchPress={() => setIsSearchOpen(true)}
          onSelectProduct={setSelectedProduct}
        />
      </View>
    );
  }

  if (openCollectionSlug === 'rent') {
    return (
      <View style={styles.root}>
        <RentScreen
          onBack={() => setOpenCollectionSlug(null)}
          onSearchPress={() => setIsSearchOpen(true)}
          onSelectProduct={setSelectedProduct}
        />
      </View>
    );
  }

  const openSearch = () => setIsSearchOpen(true);

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {activeTab === 'home' ? (
          <HomeScreen
            onSearchPress={openSearch}
            onSelectProduct={setSelectedProduct}
            onOpenCollection={setOpenCollectionSlug}
          />
        ) : null}
        {activeTab === 'trending' ? (
          <TrendingScreen onSearchPress={openSearch} onSelectProduct={setSelectedProduct} />
        ) : null}
        {activeTab === 'forYou' ? (
          <ForYouScreen onSearchPress={openSearch} onSelectProduct={setSelectedProduct} />
        ) : null}
        {activeTab === 'onPromotion' ? (
          <OnPromotionScreen onSearchPress={openSearch} onSelectProduct={setSelectedProduct} />
        ) : null}
      </View>
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgTop,
  },
  content: {
    flex: 1,
  },
});
