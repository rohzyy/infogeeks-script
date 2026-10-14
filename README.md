# H-1B Visa — 21-minute documentary (Remotion project)

A premium, English-only, sound-effects-only documentary built from `H1B_Visa.pdf` (script, Romanized Telugu) and `h1b_editor_links.md` (research index).

> **Current state: assembly cut.** The edit, motion graphics, timing, sound design and fact-check are complete and rendered. The stock clips and source screenshots could **not** be downloaded or captured in the production environment, because its network policy blocks pexels.com, pixabay.com and every news and government site. Those slots render as clearly labelled placeholder slates. Once the assets are added (two commands below), the final 4K master renders with one command, with no code changes.

## What's here

| Path | Contents |
|---|---|
| `src/timeline.ts` | The film: 146 scenes, durations, on-screen English copy, SFX cues |
| `src/scenes/` | Custom scene components (typography, data viz, diagrams, evidence, stock, outro) |
| `src/components/ui.tsx`, `src/theme.ts`, `src/anim.ts` | Design tokens, shared primitives, easing and animation helpers |
| `src/data/sources.ts` | 52 research sources (URL, publisher, date, quality, claim, caveats) |
| `src/data/stock.ts` | 42 stock slots: shot description, search query, real candidate clip URLs |
| `public/assets/sound_effects/` | 15 original synthesised SFX (`scripts/generate_sfx.py`) |
| `public/assets/stock/`, `public/assets/source_screenshots/` | Drop-in folders (`S-001.mp4`, `E-01.png`, …) |
| `production/` | Storyboard, shot list, timing map, asset/screenshot/SFX manifests, evidence plan, motion-graphics plan, sound design, **fact-check**, QA reports |
| `output/` | Renders (git-ignored: files exceed GitHub's 100 MB limit) |

## Requirements

Node 22+, Python 3 with numpy, ffmpeg/ffprobe, and a Chromium headless shell. `remotion.config.ts` points at `/opt/pw-browsers/…`; override it with `REMOTION_BROWSER=/path/to/chrome-headless-shell`.

```bash
npm install
```

## Completing the assets (needs open network access)

```bash
# 1. Source screenshots (Playwright, 2x scale, headline + short passage; no paywall bypass)
npm run capture            # logs to production/screenshot_capture_log.csv
#    -> review every PNG in public/assets/source_screenshots/

# 2. Stock footage via the official APIs (free keys)
PEXELS_API_KEY=... PIXABAY_API_KEY=... npm run fetch-stock
#    -> watch every clip; replace any that don't match production/shotlist.csv
#    -> manual alternative: download the clip, save as public/assets/stock/S-0xx.mp4

npm run check:strict       # fails if any referenced clip/screenshot is missing
npm run manifests          # refresh assets.csv / screenshot manifest with real filenames
```

`trim` (seconds into a clip) can be set per stock scene in `src/timeline.ts` to choose the best moment.

## Rendering

```bash
npm run render:prototype   # Stage C sample, 3840x2160 (~14 min on 4 cores)
npm run render:preview     # full film 1920x1080 (assembly cut if assets are missing)
npm run render:final       # full film 3840x2160 -> output/H1B_Visa_Final_4K.mp4 (strict asset check)
npm run qa -- output/H1B_Visa_Final_4K.mp4 3840 2160
```

At 4K, rendering ran at about 3.2 fps on 4 cores (about 3.3 h for 37,800 frames). It can be split with `FRAMES=0-18899` / `FRAMES=18900-37799` and joined with `ffmpeg -f concat -c copy`.

## Editorial rules enforced in code

- **No overlays on stock footage.** `StockShot` accepts only footage props; `build-timing` and `text-audit` fail the build otherwise. All text, figures and screenshots live in dedicated graphic/evidence scenes.
- **English only.** `text-audit` scans all on-screen strings for Telugu script and Romanized Telugu.
- **Sound effects only.** Stock video is always `muted`; the only audio is the synthesised SFX.
- **Exact timing.** 21:00 = 37,800 frames at 30 fps; chapter boundaries are validated on every build.
- **Integrity badges.** Contested numbers carry status labels (Official claim / Reported / Projection / Opinion / Disputed / Unverified). See `production/fact_check.md`.
