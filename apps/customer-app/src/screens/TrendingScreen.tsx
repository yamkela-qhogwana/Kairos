import React from 'react';
import { ProductGridScreen } from '../components/ProductGridScreen';
import { Product } from '../api/products';

type Props = {
  onSearchPress: () => void;
  onSelectProduct: (product: Product) => void;
};

export function TrendingScreen({ onSearchPress, onSelectProduct }: Props) {
  return (
    <ProductGridScreen
      title="Trending"
      subtitle="What everyone's shopping right now"
      selectProducts={(all) => [...all].sort((a, b) => b.rating - a.rating)}
      onSearchPress={onSearchPress}
      onSelectProduct={onSelectProduct}
    />
  );
}
