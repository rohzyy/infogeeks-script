# Vox-style edit over the Telugu voiceover

**Input:** `Nested_Sequence_01.mp4`, 7:25.4. Its video track is black; its audio is a Telugu voiceover of the second half of `H1B_Visa.pdf`: Chapter 4 from June 2020 through the outro.
**Output:** `output/H1B_Vox_Edit_1080p.mp4` (composition `VoxEdit`, 13,362 frames at 30 fps).

## How it was synced

1. Speech timing: Silero VAD + Whisper-small (sherpa-onnx, offline), run with Telugu → English translation. Results are in `voice_timing_segments.json` (sentence level) and `voice_timing_phrases.json` (140 phrases, ~3 s each). Script: `scripts/vox/transcribe.py`.
2. The machine translation was used **only to locate each sentence of the known script in time**. All on-screen English is written from the script itself, with the corrections from `production/fact_check.md` applied:
   - Cloudera May 12 and Cognizant Sept 8
   - the June 2026 fee ruling marked as under appeal
   - the 2020 injunction limited to the plaintiff groups
   - "34 detention centres" and "Collin County 9%" flagged as unconfirmed
   - the Microsoft couple's return date flagged as unclear
3. `src/vox/beats.ts` holds 74 beats (one visual change about every 6 s, plus continuous motion within each beat). `beat_sheet.md` lists them.

## Look

Vox-explainer grammar:
- warm paper with fibre grain, plus dark "drama" cards
- yellow highlighter swipes on key words, rubber stamps
- torn paper cut-outs with real shadows, and collage scraps with tape
- real maps (world-atlas / us-atlas) with animated routes and pins
- word-by-word kinetic type, counters, icon arrays, folders and sticky-note checkpoints
- slow 2.5D camera drift, a push-in whip on every cut, a chapter tag and a progress bar

Fonts: Libre Franklin, Libre Baskerville, IBM Plex Mono, Oswald (all OFL, bundled).

## Audio

The original voiceover is unchanged, at full volume. Under it sit quiet synthesised whooshes, impacts and stamps (`public/assets/sound_effects`, all original). No music was added.

## Re-render

```bash
npx remotion render src/index.ts VoxEdit output/H1B_Vox_Edit_1080p.mp4 --crf=16 --audio-bitrate=320k
npx remotion render src/index.ts VoxEdit output/H1B_Vox_Edit_4K.mp4 --scale=2 --crf=16 --audio-bitrate=320k
```
