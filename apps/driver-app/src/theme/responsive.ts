import { useWindowDimensions } from 'react-native';

// Design was tuned against a 375pt-wide reference (iPhone SE/13 mini).
// Moderate scale (not 1:1) so text grows on larger phones/tablets without
// ballooning out of proportion the way a linear width-ratio scale would.
const BASE_WIDTH = 375;
const MODERATE_FACTOR = 0.35;

export function scaleFont(size: number, width: number): number {
  const scale = width / BASE_WIDTH;
  return size + (size * scale - size) * MODERATE_FACTOR;
}

export function useScaleFont() {
  const { width } = useWindowDimensions();
  return (size: number) => scaleFont(size, width);
}
