import React from 'react';
import { ProductGridScreen } from '../components/ProductGridScreen';

export function ForYouScreen() {
  return (
    <ProductGridScreen
      title="For You"
      subtitle="Picks based on what you tend to like"
      selectProducts={(all) => [...all].sort((a, b) => b.rating - a.rating)}
    />
  );
}
