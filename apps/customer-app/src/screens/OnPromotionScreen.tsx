import React from 'react';
import { ProductGridScreen } from '../components/ProductGridScreen';
import { Product } from '../api/products';

type Props = {
  onSearchPress: () => void;
  onSelectProduct: (product: Product) => void;
};

export function OnPromotionScreen({ onSearchPress, onSelectProduct }: Props) {
  return (
    <ProductGridScreen
      title="On Promotion"
      subtitle="Everything currently on sale"
      selectProducts={(all) =>
        all
          .filter((p) => p.isOnSale)
          .sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0))
      }
      onSearchPress={onSearchPress}
      onSelectProduct={onSelectProduct}
    />
  );
}
