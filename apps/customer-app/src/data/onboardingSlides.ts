export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
};

// TODO: delivery estimate is not final — business model (single warehouse vs.
// sourcing near the user, e.g. China malls, same-day tracked delivery) is still
// being decided. Revisit this copy once that's settled.
const DELIVERY_WINDOW = 'under 2 hours';

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'choose',
    title: 'Shop With Ease',
    description:
      'Browse our curated stores and choose from a wide range of styles. Quality pieces, handpicked just for you.',
  },
  {
    id: 'received',
    title: 'Shop With Confidence',
    description:
      'Once you place your order, our team gets right to work. We carefully prepare and pack every item to make sure it arrives exactly as expected.',
  },
  {
    id: 'deliver',
    title: 'Shop With Convenience',
    description: `Sit back and relax. Your order arrives in ${DELIVERY_WINDOW}, depending on what you ordered, straight to your door.`,
  },
];
