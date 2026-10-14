#!/usr/bin/env node
// Generates production manifests from the timeline and data files so they can
// never drift from what is actually rendered:
//   production/storyboard.md
//   production/assets.csv                      (stock + screenshots + SFX)
//   production/source_screenshot_manifest.csv
//   production/source_evidence_plan.md
//   production/sound_effects_manifest.csv
// Run: node --experimental-strip-types scripts/build-manifests.mjs
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {SCENES, CHAPTERS} from '../src/timeline.ts';
import {SOURCES} from '../src/data/sources.ts';
import {STOCK} from '../src/data/stock.ts';

const timing = JSON.parse(readFileSync('production/timing-map.json', 'utf8'));
const avail = JSON.parse(readFileSync('src/generated/available.json', 'utf8'));
const T = Object.fromEntries(timing.scenes.map((s) => [s.id, s]));
const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const csv = (rows) => rows.map((r) => r.map(esc).join(',')).join('\n') + '\n';
const chTitle = Object.fromEntries(CHAPTERS.map((c) => [c.key, c.title]));
const tcShort = (t) => t.slice(0, 5);

/* ---------------- storyboard ---------------- */
let sb = `# Storyboard — H-1B Visa documentary (21:00, 30 fps)\n\nGenerated from \`src/timeline.ts\` by \`scripts/build-manifests.mjs\`. Timecodes are MM:SS:FF; frames are zero-based with exclusive end.\n\nVisual rule: **stock rows are clean footage only** — every word, number, logo and screenshot appears in a separate graphic or evidence scene.\n`;
for (const c of CHAPTERS) {
  const sc = SCENES.filter((s) => s.chapter === c.key);
  sb += `\n## ${c.title}  ·  ${tcShort(T[sc[0].id].start)}–${tcShort(T[sc[sc.length - 1].id].end)}\n\n| # | Time | Frames | Type | On screen | Script passage (English gist) |\n|---|---|---|---|---|---|\n`;
  for (const s of sc) {
    const t = T[s.id];
    const p = s.props;
    let what = '';
    if (s.type === 'stock') what = `CLEAN FOOTAGE ${p.slot}: ${p.desc}`;
    else if (s.type === 'evidence') what = `Screenshot ${p.shot} — ${p.publisher}, “${p.title}” (${p.date}); status: ${p.status}`;
    else if (s.type === 'checkpoint') what = `Checkpoint ${p.n}: ${p.title}`;
    else what = [p.kicker, p.headline ?? p.title ?? p.claim ?? p.lineA, p.status ? `[${p.status}]` : ''].filter(Boolean).join(' — ') || s.type;
    sb += `| ${s.id} | ${t.start.slice(0, 5)}–${t.end.slice(0, 5)} | ${t.startFrame}–${t.endFrame} | ${s.type} | ${String(what).replace(/\|/g, '/')} | ${s.script.replace(/\|/g, '/')} |\n`;
  }
}
writeFileSync('production/storyboard.md', sb);

/* ---------------- screenshot manifest ---------------- */
const placements = {};
for (const s of SCENES) if (s.type === 'evidence') (placements[s.props.shot] ??= []).push(s);
const qualityLabel = {official: 'Official government source', news: 'Established news report', 'law-firm': 'Law-firm summary (secondary)', opinion: 'Opinion', secondary: 'Secondary report', weak: 'Weak / single source', 'unverified-claim': 'Unverified claim'};
const shotRows = [['screenshot_id', 'chapter', 'timestamp', 'original_url', 'publisher', 'title', 'publication_date', 'screenshot_filename', 'capture_status', 'claim_supported', 'source_quality', 'licence_reuse', 'context_and_limitations', 'included_in_video']];
for (const src of SOURCES) {
  const pl = placements[src.id] ?? [];
  const file = avail.screenshots[src.id];
  shotRows.push([
    src.id,
    pl.length ? chTitle[pl[0].chapter] : src.chapter,
    pl.map((s) => `${T[s.id].start.slice(0, 5)}–${T[s.id].end.slice(0, 5)}`).join('; '),
    src.url,
    src.publisher,
    src.title + (src.titleNote ? ` [${src.titleNote}]` : ''),
    src.date,
    file ? `public/${file}` : `public/assets/source_screenshots/${src.id}.png (planned)`,
    file ? 'CAPTURED' : 'NOT CAPTURED — host blocked by environment egress policy; run scripts/capture-screenshots.mjs',
    src.supports,
    qualityLabel[src.quality],
    src.quality === 'official' ? 'U.S. government work (public domain); cite source' : 'Copyrighted page: capture headline + short passage only, for news reporting/commentary with attribution; review fair-use/fair-dealing before publication',
    src.notes,
    pl.length ? (file ? 'YES' : 'PLANNED — slot in timeline shows a labelled placeholder until captured') : 'NO (retained for research/description)',
  ]);
}
writeFileSync('production/source_screenshot_manifest.csv', csv(shotRows));

/* ---------------- evidence plan ---------------- */
let ep = `# Source-evidence plan\n\nGenerated from the timeline. Every evidence scene is a dedicated full-screen graphic: a dark editorial background, the genuine capture inside a browser-style frame (left), and on the right the publisher, headline, date, the specific claim it supports, and a status badge (Official / Reported / Opinion / Disputed / Unverified). A slow controlled push (scale 1.00→1.08–1.10 toward the focus point) keeps the frame alive without drifting off the relevant passage. Evidence scenes are never placed over stock footage.\n\n**Capture status:** none of the ${Object.keys(placements).length} planned captures could be made in this session — the environment's network policy blocks every news and government host (see \`production/QA_report.md\`). Until a capture exists, the frame shows a hatched “SCREENSHOT PENDING CAPTURE” placeholder; the attribution text beside it is already final. \`scripts/capture-screenshots.mjs\` captures them all once network access is granted, and the render picks them up automatically.\n\n**Framing rules for the capture step**\n\n- Capture at 2× device scale (≥ 2000 px wide) so the 1000 px frame is sharp at 4K.\n- Crop to masthead + headline + byline/date + the one passage that carries the claim. Do not capture more than needed.\n- Never crop out a qualification that changes the meaning (e.g. “alleged”, “according to”).\n- Dismiss cookie banners by clicking the site's own button; do not bypass paywalls. If a page is paywalled, use the alternative source listed in the manifest.\n\n| Shot | Where | Publisher · date | Why it is needed / claim supported | Badge | Framing |\n|---|---|---|---|---|---|\n`;
for (const [id, pls] of Object.entries(placements)) {
  for (const s of pls) {
    const src = SOURCES.find((x) => x.id === id);
    const f = s.props.focus ?? {x: 0.5, y: 0.2, z0: 1, z1: 1.08};
    ep += `| ${id} | ${s.id} · ${T[s.id].start.slice(0, 5)}–${T[s.id].end.slice(0, 5)} (${chTitle[s.chapter]}) | ${src.publisher} · ${src.date} | ${s.props.supports} | ${s.props.status} | Headline block; push ${f.z0.toFixed(2)}→${f.z1.toFixed(2)} toward (${f.x}, ${f.y}) |\n`;
  }
}
writeFileSync('production/source_evidence_plan.md', ep);

/* ---------------- assets.csv ---------------- */
const stockUse = {};
for (const s of SCENES) if (s.type === 'stock') (stockUse[s.props.slot] ??= []).push(s.id);
const aRows = [['asset_id', 'category', 'used_in_scenes', 'description', 'platform', 'source_url', 'creator', 'search_query', 'local_file', 'download_status', 'licence_check']];
for (const st of STOCK) {
  const file = avail.stock[st.slot];
  const c = st.candidates[0];
  aRows.push([
    st.slot,
    'stock video',
    (stockUse[st.slot] ?? []).join(' '),
    st.desc,
    st.source,
    c ? c.url + (st.candidates.length > 1 ? ` (alt: ${st.candidates.slice(1).map((x) => x.url).join(' ')})` : '') : `search: https://www.${st.source}.com/${st.source === 'pexels' ? 'search/videos' : 'videos/search'}/${encodeURIComponent(st.query)}/`,
    c?.creator ?? '',
    st.query,
    file ? `public/${file}` : `public/assets/stock/${st.slot}.mp4 (planned)`,
    file ? 'DOWNLOADED' : c ? 'CANDIDATE FOUND VIA SEARCH — page not inspected; awaiting manual review + download' : 'NO CANDIDATE YET — awaiting search/selection',
    file ? 'Check recorded in production/stock_download_log.csv' : `Not checked (host blocked). ${st.source === 'pexels' ? 'Pexels License' : 'Pixabay Content License'}: free use, no attribution required; verify on the clip page; avoid clips with identifiable trademarks.`,
  ]);
}
for (const src of SOURCES.filter((x) => placements[x.id])) {
  aRows.push([src.id, 'source screenshot', placements[src.id].map((s) => s.id).join(' '), src.title, src.publisher, src.url, '', '', avail.screenshots[src.id] ? `public/${avail.screenshots[src.id]}` : `public/assets/source_screenshots/${src.id}.png (planned)`, avail.screenshots[src.id] ? 'CAPTURED' : 'NOT CAPTURED (host blocked)', 'See source_screenshot_manifest.csv']);
}
const sfxUse = {};
for (const s of SCENES) for (const c of s.sfx ?? []) (sfxUse[c.sfx] ??= new Set()).add(s.id);
const sRows = [['sfx_id', 'file', 'origin', 'licence', 'used_in', 'notes']];
for (const [name, file] of Object.entries(avail.sfx)) {
  const used = [...(sfxUse[name] ?? [])].join(' ') || 'default cues (chapter/evidence/transition rules in src/Documentary.tsx)';
  sRows.push([name, `public/${file}`, 'Synthesised in-house by scripts/generate_sfx.py (numpy; seed 20261014)', 'Original work created for this project — no third-party licence', used, 'No speech, melody or rhythm']);
  aRows.push([name, 'sound effect', used, 'Procedural SFX', 'generated', 'scripts/generate_sfx.py', 'project', '', `public/${file}`, existsSync(`public/${file}`) ? 'GENERATED' : 'MISSING', 'Original — no licence required']);
}
writeFileSync('production/assets.csv', csv(aRows));
writeFileSync('production/sound_effects_manifest.csv', csv(sRows));
console.log('Wrote storyboard.md, assets.csv, source_screenshot_manifest.csv, source_evidence_plan.md, sound_effects_manifest.csv');
