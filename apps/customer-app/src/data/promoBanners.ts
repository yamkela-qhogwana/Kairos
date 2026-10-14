import { ImageSourcePropType } from 'react-native';

export type PromoBanner = {
  key: string;
  // Internal reference only — not rendered. The real Canva-designed
  // creative will have its own text baked in, so the app never draws
  // title/description over these images.
  title: string;
  description: string;
  // A real designed creative, once one exists for this promo.
  image?: ImageSourcePropType;
  // Until there's a real image, borrow a photo from a product in this
  // category as filler art.
  categorySlug?: string;
};

// Marketing banners for the Home screen's hero carousel. This is a curated
// table, not something derived from product data — each entry is its own
// promo, edited here directly until there's an admin screen for it.
export const PROMO_BANNERS: PromoBanner[] = [
  {
    key: 'jeans-ladies-summer',
    title: 'Jeans Promo For Ladies',
    description: 'Summer Sale — 60% Off',
    // No "jeans" category exists yet — borrowing from the closest match
    // (womens-dresses) until real stock/category exists.
    categorySlug: 'womens-dresses',
  },
  {
    key: 'new-season',
    title: 'New Season Arrivals',
    description: 'Fresh styles, just landed',
  },
  {
    key: 'same-day-delivery',
    title: 'Free Same-Day Delivery',
    description: 'Order before 2pm in Johannesburg',
  },
];
