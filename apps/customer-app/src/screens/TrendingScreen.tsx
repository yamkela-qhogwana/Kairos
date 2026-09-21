import React from 'react';
import { ProductGridScreen } from '../components/ProductGridScreen';

export function TrendingScreen() {
  return (
    <ProductGridScreen
      title="Trending"
      subtitle="What everyone's shopping right now"
      selectProducts={(all) => [...all].sort((a, b) => b.rating - a.rating)}
    />
  );
}
