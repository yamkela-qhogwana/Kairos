export const colors = {
  bgTop: '#17181c',
  bgBottom: '#08090b',
  muted: '#8b8d97',
  text: '#f0f0f2',

  dotGold: '#e8c9a0',
  dotBlue: '#a3b9cf',
  error: '#e0857e',

  wordmarkGradient: ['#e8c9a0', '#ddaba8', '#c6a3c9', '#a3b9cf'] as [string, string, ...string[]],
  wordmarkGradientLocations: [0, 0.35, 0.65, 1] as [number, number, ...number[]],

  taglineGradient: ['#f5d78e', '#e8a4a0', '#c6a3c9', '#a3b9cf', '#f5d78e'] as [string, string, ...string[]],
  taglineGradientLocations: [0, 0.3, 0.55, 0.8, 1] as [number, number, ...number[]],
} as const;
