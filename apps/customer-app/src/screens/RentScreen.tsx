import React from 'react';
import { ProductGridScreen } from '../components/ProductGridScreen';
import { Product } from '../api/products';

type Props = {
  onBack: () => void;
  onSearchPress: () => void;
  onSelectProduct: (product: Product) => void;
};

export function RentScreen({ onBack, onSearchPress, onSelectProduct }: Props) {
  return (
    <ProductGridScreen
      title="Rent"
      subtitle="Pieces available to rent instead of buy"
      selectProducts={(all) => all.filter((p) => p.isRentable)}
      onBack={onBack}
      onSearchPress={onSearchPress}
      onSelectProduct={onSelectProduct}
    />
  );
}
