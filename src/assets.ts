import available from './generated/available.json';

// `src/generated/available.json` is written by scripts/check-assets.mjs from the
// files actually present under public/assets. Scenes consult it so that a
// missing clip or screenshot renders as an explicit production slate instead of
// failing the render or silently showing something else.

type Avail = {stock: Record<string, string>; screenshots: Record<string, string>; sfx: Record<string, string>};
const a = available as Avail;

export const stockFile = (slot: string): string | undefined => a.stock[slot];
export const screenshotFile = (id: string): string | undefined => a.screenshots[id];
export const sfxFile = (name: string): string | undefined => a.sfx[name];
