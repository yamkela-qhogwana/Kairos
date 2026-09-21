import React from 'react';
import { ProductGridScreen } from '../components/ProductGridScreen';

export function OnPromotionScreen() {
  return (
    <ProductGridScreen
      title="On Promotion"
      subtitle="Everything currently on sale"
      selectProducts={(all) =>
        all
          .filter((p) => p.isOnSale)
          .sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0))
      }
    />
  );
}
