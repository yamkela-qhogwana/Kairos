import React from 'react';
import { ProductGridScreen } from '../components/ProductGridScreen';
import { Product } from '../api/products';

type Props = {
  onSearchPress: () => void;
  onSelectProduct: (product: Product) => void;
};

export function ForYouScreen({ onSearchPress, onSelectProduct }: Props) {
  return (
    <ProductGridScreen
      title="For You"
      subtitle="Picks based on what you tend to like"
      selectProducts={(all) => [...all].sort((a, b) => b.rating - a.rating)}
      onSearchPress={onSearchPress}
      onSelectProduct={onSelectProduct}
    />
  );
}
