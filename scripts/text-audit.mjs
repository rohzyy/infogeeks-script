#!/usr/bin/env node
// Audits every string that can appear on screen (scene props + source
// attribution) for Telugu script and Romanized Telugu, and re-checks the
// no-overlay-on-stock contract. Exit 1 on any finding.
// Run: node --experimental-strip-types scripts/text-audit.mjs
import {SCENES} from '../src/timeline.ts';

const TELUGU = /[ఀ-౿]/;
// Common Romanized Telugu words from the source script (whole-word match).
const ROMAN = ['chesthu', 'chesaru', 'chesindi', 'undhi', 'undi', 'ledu', 'ledhu', 'kaadhu', 'kani', 'mana', 'manam', 'vallu', 'valla', 'intlo', 'lakshalu', 'lakshala', 'ayindi', 'ayyayi', 'cheyandi', 'cheskondi', 'aipoyi', 'gurinchi', 'ippudu', 'akkada', 'ikkada', 'emi', 'enti', 'nijame', 'nijamena', 'padmavyooham', 'chepthunnaru', 'theeskovadam', 'velladam', 'meedha', 'lekunda', 'mathrame', 'kooda', 'kuda', 'antaru', 'anukundam', 'amma', 'nanna', 'akka', 'anna', 'babu', 'abbayi', 'ammayi'];
const ROMAN_RE = new RegExp(`\\b(${ROMAN.join('|')})\\b`, 'i');

const findings = [];
const walk = (v, path, id) => {
  if (typeof v === 'string') {
    if (TELUGU.test(v)) findings.push(`${id} ${path}: Telugu script: ${v}`);
    const m = v.match(ROMAN_RE);
    if (m) findings.push(`${id} ${path}: Romanized Telugu "${m[1]}": ${v}`);
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`, id));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`, id);
};

let strings = 0;
for (const s of SCENES) {
  // `script` is an internal production note and is never rendered.
  walk(s.props, 'props', s.id);
  strings += JSON.stringify(s.props).length;
  if (s.type === 'stock') {
    const extra = Object.keys(s.props).filter((k) => !['slot', 'desc', 'grade', 'move', 'trim'].includes(k));
    if (extra.length) findings.push(`${s.id}: stock scene carries overlay props: ${extra}`);
  }
}

if (findings.length) {
  console.error('TEXT AUDIT FAILED:\n  ' + findings.join('\n  '));
  process.exit(1);
}
console.log(`Text audit OK: ${SCENES.length} scenes, ~${strings} chars of on-screen props; no Telugu script, no Romanized Telugu, no overlays on stock.`);
