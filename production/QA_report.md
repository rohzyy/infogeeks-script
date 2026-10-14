# Quality-assurance report

Date: 14 October 2026. Every figure below was measured on the rendered files with ffprobe/ffmpeg (`scripts/qa.sh`); raw output is in `production/qa/`.

## Deliverable status

| # | Deliverable | Status |
|---|---|---|
| 1 | `output/H1B_Visa_Final_4K.mp4` | **Not produced, deliberately.** 42 of 42 stock clips and 20 of 20 source screenshots could not be acquired (network policy; see below). A "final" master made of placeholder slates would misrepresent the work. The 4K pipeline is proven by the prototype, and the master is one command away: `npm run render:final` (blocked by `--strict` until every asset exists). |
| 2 | 1080p preview | **Produced as `output/H1B_Visa_AssemblyCut_1080p.mp4`** (full 21:00), named "AssemblyCut" because its stock and screenshot slots are labelled placeholders. `render.sh preview` writes `H1B_Visa_Preview_1080p.mp4` automatically once assets are complete. A 450 kbps review copy is committed at `review/H1B_Visa_AssemblyCut_1080p_review.mp4`, because the full-quality file exceeds GitHub's 100 MB limit. |
| — | Stage C prototype | `output/prototype_4k.mp4`: 3840×2160, 30 fps, 86.0 s, H.264 + AAC. Inspected frame-by-frame at 4K; text is crisp. |
| 3 | Contact sheet | `production/qa/H1B_Visa_AssemblyCut_1080p_contact.jpg` (84 frames, every chapter, every evidence and key graphic scene) |
| 4 | Editable Remotion project | `src/`, `scripts/`, `remotion.config.ts`, `package.json` |
| 5 | Stock assets used | **None acquired.** 42 slots defined; 15 have real candidate clip URLs found via search (`production/assets.csv`) |
| 6 | Screenshots used | **None captured.** The capture script was run and failed with `ERR_TUNNEL_CONNECTION_FAILED` (`production/screenshot_capture_log.csv`) |
| 7 | Timing map, shot list, manifests | `production/timing-map.json`, `shotlist.csv`, `assets.csv`, `sound_effects_manifest.csv` |
| 8 | Evidence plan and screenshot manifest | `production/source_evidence_plan.md`, `source_screenshot_manifest.csv` |
| 9 | Fact-check report | `production/fact_check.md` |
| 10 | QA report | this file |

## Environment limitation (exact)

The session's egress proxy rejected CONNECT to: `www.pexels.com`, `api.pexels.com`, `videos.pexels.com`, `pixabay.com`, `cdn.pixabay.com`, `freesound.org`, `www.uscis.gov`, `www.dol.gov`, `manifestlaw.com`, `theprint.in`, `www.business-standard.com`, `www.google.com`, and every other news host tried. Status: `connect_rejected (organization policy)`. Only package registries (npm, PyPI) were reachable. The server-side page-fetch tool also failed (`getaddrinfo ENOTFOUND`). The only research channel was a search tool returning titles, URLs and summaries; see the method note in `fact_check.md`.

**To unblock:** in the cloud environment settings (Network access), allow `pexels.com`, `api.pexels.com`, `videos.pexels.com`, `pixabay.com`, `cdn.pixabay.com` and the news/government hosts in `source_screenshot_manifest.csv`, or choose a broader access level. Then run `npm run capture`, `npm run fetch-stock` (with API keys), `npm run check:strict`, and `npm run render:final`.

## Measured results: full assembly cut (`output/H1B_Visa_AssemblyCut_1080p.mp4`)

| Check | Result |
|---|---|
| Duration | 1260.011 s container; video **37,800 decoded frames = exactly 21:00:00** at 30 fps |
| Frame rate | 30/1 |
| Resolution | 1920×1080 (preview spec); 4K verified separately on the prototype (3840×2160) |
| Codec | H.264 (pix_fmt yuvj420p, i.e. full-range flag from Remotion's JPEG frames), AAC 48 kHz stereo; 1.51 Mb/s; 238.2 MB |
| Chapter boundaries | All nine exact: 00:00, 01:45, 04:10, 07:00, 09:45, 12:30, 15:00, 17:15, 20:00, 21:00 (validated by `build-timing.mjs`) |
| True-black gaps | **None** (blackdetect, luma ≤ 0.03, ≥ 0.5 s). Dark charcoal graphics are by design (luma ≈ 0.055) |
| Loudness | Integrated −25.7 LUFS, LRA 19.8 LU, **true peak −7.8 dBFS** (no clipping). Quiet by intent for an effects-only track; raise `MASTER_GAIN` in `src/Documentary.tsx` if a platform target (e.g. −16/−18 LUFS) is wanted |
| Silences | ~73 passages ≥ 6 s below −60 dB: graphic scenes with no event to sonify. Expected under the "no continuous ambience, every sound has a purpose" brief |
| Speech, music, source audio | None possible by construction: the only audio sources are 15 synthesised WAVs (no speech or melody); every `OffthreadVideo` is `muted`; no other `<Audio>` in `src/` (grep in QA log) |
| Telugu / Romanized Telugu on screen | **None.** `text-audit.mjs` scans all on-screen strings. During QA it was found that a chat sender was labelled "Amma" (Telugu for mother). It was corrected to "Mother" before the final render, and the word list was extended |
| Overlays on stock | **None.** Stock scenes accept footage props only, enforced by build and audit scripts. The contact sheet shows no text or graphics on any footage slot (slots currently show placeholder slates) |
| Missing media | 42 stock slots and 20 screenshot frames render as labelled placeholders (expected; see above). SFX 15/15 present |
| Screenshot framing / attribution | Attribution panels render correctly (publisher, headline, date, claim, status badge). Image frames await captures |

## Issues found and fixed during QA

1. Chapter-opener subtitle fell back to a default serif font → set to Inter.
2. Status badges stretched to full column width → `alignSelf: flex-start`.
3. Timeline axis: final node misaligned → rebuilt node layout.
4. "7% ceiling" label collided with the headline → spacing increased.
5. Phone mock-up too tall → reduced.
6. Romanized Telugu ("Amma") in chat mock-up → "Mother"; audit extended.
7. Effects mix too quiet (−25 LUFS before gain) → +3.5 dB master gain. True peak after gain: −7.8 dBFS.
8. QA tooling: resolution parse, black-detect threshold and contact-sheet stdin bug fixed.

## Render performance (4 vCPU, 15 GB RAM)

- 4K (`--scale=2`): 3.2 fps (2,580 frames in 13 min 33 s) → full film ≈ 3.3 h.
- 1080p: full 37,800 frames rendered and encoded in ≈ 40 min.
