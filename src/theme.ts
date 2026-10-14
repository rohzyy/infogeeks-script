// Shared design tokens. The composition is authored on a 1920x1080 canvas and
// rendered at --scale=2 for 3840x2160 delivery, so every value here is in
// 1080p units.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = 21 * 60 * FPS; // 37,800

export const color = {
  bg: '#0d0e10',
  bgRaised: '#14161a',
  panel: '#181b20',
  line: '#2a2f37',
  lineSoft: '#1f232a',
  text: '#ece9e2',
  textDim: '#a3a8b0',
  textMute: '#6c727c',
  blue: '#7aa7d6',
  blueDeep: '#2f557f',
  amber: '#e2a64b',
  red: '#d0563f',
  green: '#7fb48a',
};

export const font = {
  serif: '"Source Serif 4", Georgia, serif',
  sans: 'Inter, "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", "DejaVu Sans Mono", monospace',
};

// Gutter used by every graphic layout so type lines up across scenes.
export const SAFE = {x: 140, y: 110};
