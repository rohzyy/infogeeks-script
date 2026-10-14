#!/usr/bin/env node
// Renders still frames from the composition with a single bundle.
// Usage:
//   node scripts/stills.mjs <outDir> <sceneId|frame>... [--scale=1] [--at=0.6]
//   node scripts/stills.mjs out/stills all          # one still per scene
// For a scene id the still is taken at --at (fraction) of the scene.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const outDir = args.shift();
const opt = (k, d) => Number((args.find((a) => a.startsWith(`--${k}=`)) ?? `=${d}`).split('=')[1]);
const scale = opt('scale', 1);
const at = opt('at', 0.6);
const targets = args.filter((a) => !a.startsWith('--'));
const timing = JSON.parse(readFileSync('production/timing-map.json', 'utf8'));
const browserExecutable = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

const jobs = (targets[0] === 'all' ? timing.scenes.map((s) => s.id) : targets).map((t) => {
  if (/^\d+$/.test(t)) return {name: `f${t.padStart(5, '0')}`, frame: Number(t)};
  const s = timing.scenes.find((x) => x.id === t);
  if (!s) throw new Error(`Unknown scene ${t}`);
  return {name: `${String(s.startFrame).padStart(5, '0')}_${s.id}`, frame: Math.min(s.endFrame - 1, s.startFrame + Math.floor(s.durationFrames * at))};
});

mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'H1BDocumentary', browserExecutable});
for (const j of jobs) {
  await renderStill({serveUrl, composition, frame: j.frame, output: path.join(outDir, `${j.name}.jpg`), imageFormat: 'jpeg', jpegQuality: 88, scale, browserExecutable});
  process.stdout.write(`${j.name} `);
}
console.log(`\n${jobs.length} stills -> ${outDir}`);
