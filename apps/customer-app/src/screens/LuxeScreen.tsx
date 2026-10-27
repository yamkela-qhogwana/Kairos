import React from 'react';
import { ProductGridScreen } from '../components/ProductGridScreen';
import { Product } from '../api/products';

type Props = {
  onBack: () => void;
  onSearchPress: () => void;
  onSelectProduct: (product: Product) => void;
};

export function LuxeScreen({ onBack, onSearchPress, onSelectProduct }: Props) {
  return (
    <ProductGridScreen
      title="Luxe"
      subtitle="Verified authentic, verified premium"
      selectProducts={(all) => all.filter((p) => p.isLuxe).sort((a, b) => b.originalPrice - a.originalPrice)}
      onBack={onBack}
      onSearchPress={onSearchPress}
      onSelectProduct={onSelectProduct}
    />
  );
}
