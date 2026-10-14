#!/usr/bin/env node
// Downloads stock clips for each slot through the official Pexels and Pixabay
// APIs (keys required: PEXELS_API_KEY, PIXABAY_API_KEY — both free). Respects
// each API's documented endpoints; no scraping.
//
// For a slot with a candidate Pexels URL the exact clip is fetched by id.
// Otherwise the slot's query is searched and the top landscape result >= 1920 px
// wide is taken and flagged "auto-selected — REVIEW" in the log: a human must
// still watch every clip and confirm it matches the shot description.
//
// Usage: node --experimental-strip-types scripts/fetch-stock.mjs [S-001 ...] [--force]
import {createWriteStream, existsSync, appendFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {STOCK} from '../src/data/stock.ts';

const args = process.argv.slice(2);
const only = args.filter((a) => /^S-\d+$/.test(a));
const force = args.includes('--force');
const OUT = 'public/assets/stock';
const LOG = 'production/stock_download_log.csv';
mkdirSync(OUT, {recursive: true});
if (!existsSync(LOG)) writeFileSync(LOG, 'timestamp,slot,platform,clip_page,creator,width,height,duration_s,file,selection,licence\n');

const PEXELS = process.env.PEXELS_API_KEY;
const PIXABAY = process.env.PIXABAY_API_KEY;

const pickPexelsFile = (v) =>
  v.video_files
    .filter((f) => f.file_type === 'video/mp4' && f.width >= 1920 && f.width > f.height)
    .sort((a, b) => Math.abs(a.width - 3840) - Math.abs(b.width - 3840))[0];

async function pexelsById(id) {
  const r = await fetch(`https://api.pexels.com/videos/videos/${id}`, {headers: {Authorization: PEXELS}});
  if (!r.ok) throw new Error(`Pexels ${r.status}`);
  return r.json();
}
async function pexelsSearch(q) {
  const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&orientation=landscape&size=large&per_page=10`, {headers: {Authorization: PEXELS}});
  if (!r.ok) throw new Error(`Pexels ${r.status}`);
  return (await r.json()).videos.find((v) => pickPexelsFile(v));
}
async function pixabaySearch(q) {
  const r = await fetch(`https://pixabay.com/api/videos/?key=${PIXABAY}&q=${encodeURIComponent(q)}&video_type=film&per_page=10&safesearch=true`);
  if (!r.ok) throw new Error(`Pixabay ${r.status}`);
  const hit = (await r.json()).hits.find((h) => (h.videos.large?.width ?? 0) >= 1920);
  return hit;
}

for (const st of STOCK.filter((s) => !only.length || only.includes(s.slot))) {
  const file = `${OUT}/${st.slot}.mp4`;
  if (existsSync(file) && !force) {
    console.log(`${st.slot} exists, skipping`);
    continue;
  }
  try {
    let url, meta;
    const cand = st.candidates.find((c) => c.url.includes('pexels.com/video/'));
    if (cand && PEXELS) {
      const v = await pexelsById(cand.url.match(/-(\d+)\/?$/)[1]);
      const f = pickPexelsFile(v);
      url = f.link;
      meta = {platform: 'pexels', page: v.url, creator: v.user?.name, w: f.width, h: f.height, d: v.duration, sel: 'candidate from shot list'};
    } else if (st.source === 'pixabay' && PIXABAY) {
      const h = await pixabaySearch(st.query);
      if (!h) throw new Error('no result');
      url = h.videos.large.url;
      meta = {platform: 'pixabay', page: h.pageURL, creator: h.user, w: h.videos.large.width, h: h.videos.large.height, d: h.duration, sel: 'auto-selected — REVIEW'};
    } else if (PEXELS) {
      const v = await pexelsSearch(st.query);
      if (!v) throw new Error('no result');
      const f = pickPexelsFile(v);
      url = f.link;
      meta = {platform: 'pexels', page: v.url, creator: v.user?.name, w: f.width, h: f.height, d: v.duration, sel: 'auto-selected — REVIEW'};
    } else {
      throw new Error('no API key for this slot (set PEXELS_API_KEY / PIXABAY_API_KEY)');
    }
    const r = await fetch(url);
    if (!r.ok) throw new Error(`download ${r.status}`);
    await pipeline(Readable.fromWeb(r.body), createWriteStream(file));
    const lic = meta.platform === 'pexels' ? 'Pexels License (verify on page)' : 'Pixabay Content License (verify on page)';
    appendFileSync(LOG, [new Date().toISOString(), st.slot, meta.platform, meta.page, `"${meta.creator ?? ''}"`, meta.w, meta.h, meta.d, file, meta.sel, lic].join(',') + '\n');
    console.log(`${st.slot} OK ${meta.w}x${meta.h} ${meta.d}s ${meta.sel}`);
  } catch (e) {
    console.log(`${st.slot} FAILED: ${e.message}`);
  }
}
console.log('\nWatch every clip, replace mismatches, then: npm run check && npm run manifests');
