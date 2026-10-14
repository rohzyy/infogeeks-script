#!/usr/bin/env node
// Captures genuine screenshots of the source pages used in evidence scenes.
//
// Captures the top of each article (masthead, headline, byline/date and the
// opening passage) at 2x device scale. It does NOT bypass paywalls or log in;
// pages that fail or return an error are logged and left for manual capture.
// After running, review each PNG, then `npm run check` so the render uses it.
//
// Usage: node --experimental-strip-types scripts/capture-screenshots.mjs [E-01 E-04 ...] [--all]
//   default: every source placed in the timeline; --all: every source in the manifest
import {chromium} from 'playwright-core';
import {appendFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {SOURCES} from '../src/data/sources.ts';
import {SCENES} from '../src/timeline.ts';

const args = process.argv.slice(2);
const placed = new Set(SCENES.filter((s) => s.type === 'evidence').map((s) => s.props.shot));
const ids = args.filter((a) => /^E-\d+$/.test(a));
const targets = SOURCES.filter((s) => (ids.length ? ids.includes(s.id) : args.includes('--all') || placed.has(s.id)));
const OUT = 'public/assets/source_screenshots';
const LOG = 'production/screenshot_capture_log.csv';
mkdirSync(OUT, {recursive: true});
if (!existsSync(LOG)) writeFileSync(LOG, 'timestamp,screenshot_id,url,result,http_status,file,notes\n');

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const ctx = await browser.newContext({
  viewport: {width: 1280, height: 900},
  deviceScaleFactor: 2,
  locale: 'en-US',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36',
});

for (const src of targets) {
  const page = await ctx.newPage();
  const file = `${OUT}/${src.id}.png`;
  let result = 'ok';
  let status = '';
  let notes = '';
  try {
    const resp = await page.goto(src.url, {waitUntil: 'domcontentloaded', timeout: 45000});
    status = String(resp?.status() ?? '');
    await page.waitForTimeout(3500);
    // Accept cookie/consent banners using the site's own button, if present.
    for (const label of ['Accept', 'Accept all', 'I agree', 'Agree', 'OK', 'Got it']) {
      const b = page.getByRole('button', {name: label, exact: true});
      if (await b.count().catch(() => 0)) {
        await b.first().click({timeout: 2000}).catch(() => {});
        break;
      }
    }
    // Bring the headline to the top of the capture where one exists.
    const h1 = page.locator('h1').first();
    if (await h1.count()) await h1.scrollIntoViewIfNeeded().catch(() => {});
    await page.evaluate(() => window.scrollBy(0, -140));
    await page.waitForTimeout(800);
    if (resp && resp.status() >= 400) {
      result = 'http-error';
      notes = 'Server returned an error; capture manually or use alternative source';
    } else {
      await page.screenshot({path: file, fullPage: false});
    }
    const paywall = await page.locator('text=/subscribe to (continue|read)|already a subscriber/i').count();
    if (paywall) notes += ' Possible paywall/meter visible — review; do not bypass.';
  } catch (e) {
    result = 'failed';
    notes = String(e.message).split('\n')[0].replace(/,/g, ';');
  }
  appendFileSync(LOG, [new Date().toISOString(), src.id, src.url, result, status, result === 'ok' ? file : '', `"${notes.trim()}"`].join(',') + '\n');
  console.log(`${src.id} ${result} ${status} ${notes}`);
  await page.close();
}
await browser.close();
console.log('\nReview every capture, then run: npm run check && npm run manifests');
