// Vox-style explainer design tokens. Authored at 1920x1080.
export const VFPS = 30;
export const VOICE_SECONDS = 445.4;
export const VOX_FRAMES = Math.round(VOICE_SECONDS * VFPS); // 13,362

export const vc = {
  paper: '#efe9dc',
  paperDeep: '#e4dccb',
  card: '#fbf8f1',
  ink: '#161513',
  inkSoft: '#4a4740',
  inkMute: '#8b867b',
  yellow: '#ffd23f',
  red: '#e2412f',
  blue: '#2f5d8c',
  teal: '#2c7a6b',
  dark: '#121212',
  darkCard: '#1d1c1a',
};

export const vf = {
  head: '"Libre Franklin", "Inter", sans-serif',
  serif: '"Libre Baskerville", Georgia, serif',
  mono: '"IBM Plex Mono", monospace',
  cond: '"Oswald", "Libre Franklin", sans-serif',
};
