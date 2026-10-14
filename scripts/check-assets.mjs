#!/usr/bin/env node
// Scans public/assets, writes src/generated/available.json (consumed by the
// composition) and reports which stock clips, screenshots and SFX referenced by
// the timeline are present or missing. Exit code 0 always; pass --strict to
// fail when anything referenced is missing (use before a final render).
// Run: node --experimental-strip-types scripts/check-assets.mjs [--strict]
import {existsSync, readdirSync, writeFileSync} from 'node:fs';
import {SCENES} from '../src/timeline.ts';

const strict = process.argv.includes('--strict');
const list = (dir, exts) => (existsSync(dir) ? readdirSync(dir).filter((f) => exts.some((e) => f.toLowerCase().endsWith(e))) : []);

const stock = {};
for (const f of list('public/assets/stock', ['.mp4', '.mov', '.webm'])) stock[f.replace(/\.[^.]+$/, '')] = `assets/stock/${f}`;
const screenshots = {};
for (const f of list('public/assets/source_screenshots', ['.png', '.jpg', '.jpeg', '.webp'])) screenshots[f.replace(/\.[^.]+$/, '')] = `assets/source_screenshots/${f}`;
const sfx = {};
for (const f of list('public/assets/sound_effects', ['.wav', '.mp3'])) sfx[f.replace(/\.[^.]+$/, '')] = `assets/sound_effects/${f}`;

writeFileSync('src/generated/available.json', JSON.stringify({stock, screenshots, sfx}, null, 2) + '\n');

const needStock = [...new Set(SCENES.filter((s) => s.type === 'stock').map((s) => s.props.slot))];
const needShots = [...new Set(SCENES.filter((s) => s.type === 'evidence').map((s) => s.props.shot))];
const needSfx = [...new Set(SCENES.flatMap((s) => (s.sfx ?? []).map((c) => c.sfx)).concat(['whoosh_soft', 'whoosh_low', 'impact_soft', 'paper', 'click']))];

const missing = {
  stock: needStock.filter((k) => !stock[k]),
  screenshots: needShots.filter((k) => !screenshots[k]),
  sfx: needSfx.filter((k) => !sfx[k]),
};
const line = (label, need, miss) => console.log(`${label.padEnd(12)} ${need.length - miss.length}/${need.length} present${miss.length ? `  missing: ${miss.join(' ')}` : ''}`);
line('Stock', needStock, missing.stock);
line('Screenshots', needShots, missing.screenshots);
line('SFX', needSfx, missing.sfx);
writeFileSync('production/missing-assets.json', JSON.stringify(missing, null, 2) + '\n');

const total = missing.stock.length + missing.screenshots.length + missing.sfx.length;
if (strict && total) {
  console.error(`\n--strict: ${total} referenced asset(s) missing; final render blocked.`);
  process.exit(1);
}
