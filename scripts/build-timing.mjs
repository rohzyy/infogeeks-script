#!/usr/bin/env node
// Validates the timeline and writes production/timing-map.json and
// production/shotlist.csv. Run with: node --experimental-strip-types scripts/build-timing.mjs
// Convention: zero-based frames, end frame exclusive. 30 fps; 21:00 = 37,800 frames.
import {writeFileSync} from 'node:fs';
import {SCENES, CHAPTERS} from '../src/timeline.ts';
import {STOCK} from '../src/data/stock.ts';

const FPS = 30;
const TOTAL = 37800;
const tc = (f) => {
  const s = Math.floor(f / FPS);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}:${String(f % FPS).padStart(2, '0')}`;
};

let cursor = 0;
const scenes = SCENES.map((s) => {
  const frames = Math.round(s.sec * FPS);
  if (frames !== s.sec * FPS) throw new Error(`${s.id}: ${s.sec}s is not frame-exact`);
  const out = {id: s.id, chapter: s.chapter, type: s.type, startFrame: cursor, endFrame: cursor + frames, durationFrames: frames, start: tc(cursor), end: tc(cursor + frames), script: s.script};
  cursor += frames;
  return out;
});

const errors = [];
const chapters = CHAPTERS.map((c) => {
  const inCh = scenes.filter((s) => s.chapter === c.key);
  const start = inCh[0].startFrame;
  const end = inCh[inCh.length - 1].endFrame;
  const want = {start: c.start * FPS, end: c.end * FPS};
  if (start !== want.start || end !== want.end) {
    const sum = inCh.reduce((a, s) => a + s.durationFrames, 0) / FPS;
    errors.push(`${c.key}: frames ${start}-${end}, expected ${want.start}-${want.end} (scene sum ${sum}s, need ${c.end - c.start}s)`);
  }
  return {key: c.key, title: c.title, startFrame: start, endFrame: end, start: tc(start), end: tc(end), scenes: inCh.length};
});
if (cursor !== TOTAL) errors.push(`Total ${cursor} frames, expected ${TOTAL}`);

// No two stock shots back-to-back without a cut point is fine, but a stock shot
// must never carry overlay props; enforce the data contract here.
for (const s of SCENES) {
  if (s.type === 'stock') {
    const extra = Object.keys(s.props).filter((k) => !['slot', 'desc', 'grade', 'move', 'trim'].includes(k));
    if (extra.length) errors.push(`${s.id}: stock scene has non-footage props ${extra.join(',')}`);
  }
}

if (errors.length) {
  console.error('TIMING ERRORS:\n  ' + errors.join('\n  '));
  process.exit(1);
}

const counts = scenes.reduce((a, s) => ((a[s.type] = (a[s.type] ?? 0) + 1), a), {});
const stockFrames = scenes.filter((s) => s.type === 'stock').reduce((a, s) => a + s.durationFrames, 0);
writeFileSync(
  'production/timing-map.json',
  JSON.stringify({fps: FPS, totalFrames: TOTAL, convention: 'zero-based frames; endFrame exclusive', chapters, sceneTypeCounts: counts, stockShare: +(stockFrames / TOTAL).toFixed(3), scenes}, null, 2),
);

const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const rows = [['scene_id', 'chapter', 'type', 'start_tc', 'end_tc', 'start_frame', 'end_frame_excl', 'dur_frames', 'script_passage', 'visual', 'stock_slot']];
for (const s of SCENES) {
  const t = scenes.find((x) => x.id === s.id);
  const visual = s.type === 'stock' ? STOCK.find((x) => x.slot === s.props.slot).desc : s.type === 'evidence' ? `Source evidence ${s.props.shot}: ${s.props.publisher}` : `${s.type}: ${s.props.headline ?? s.props.title ?? ''}`;
  rows.push([s.id, s.chapter, s.type, t.start, t.end, t.startFrame, t.endFrame, t.durationFrames, s.script, visual, s.props.slot ?? '']);
}
writeFileSync('production/shotlist.csv', rows.map((r) => r.map(esc).join(',')).join('\n') + '\n');

console.log(`OK: ${scenes.length} scenes, ${cursor} frames (${tc(cursor)}), stock share ${(100 * stockFrames / TOTAL).toFixed(1)}%`);
for (const c of chapters) console.log(`  ${c.start} – ${c.end}  ${c.title} (${c.scenes} scenes)`);
