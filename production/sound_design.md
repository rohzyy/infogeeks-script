# Sound design — effects only

**Contains:** short, purposeful sound effects, plus three very quiet ambience beds used under specific stock shots.
**Does not contain:** voiceover, narration, dialogue, music, melody, rhythmic beds, or any audio from stock clips (every `OffthreadVideo` is `muted`).

## Library

All 15 effects are **synthesised for this project** by `scripts/generate_sfx.py`, using numpy, filtered noise and simple oscillators with a fixed seed. They are original works, so there are no third-party licences to track. Freesound and other SFX libraries could not be used: the hosts are blocked in this environment, and generating the effects avoids licence uncertainty anyway. See `sound_effects_manifest.csv`.

| Effect | Character | Peak (dBFS) | Where |
|---|---|---|---|
| `whoosh_soft` | Filtered-noise swell, gentle L→R pan, 0.85 s | −9.8 | Cut from footage into a graphic (auto, vol 0.30); some multi-part builds |
| `whoosh_low` | Darker, 1.3 s | −8.2 | Chapter openers (vol 0.40), headline split, map, highway |
| `impact_soft` | 90→42 Hz thud | −6.1 | Chapter openers (0.55), Vance quote, gate STOP, fee card |
| `stamp` | Short mid thud | −7.4 | "UNVERIFIED", strike-through, court card |
| `click` | Short key click | −11.0 | Company tiles, evidence frame settle, checkpoint, subscribe press |
| `tick` | Fine UI tick | −14.1 | Timeline nodes, ladder rungs, process steps, checkpoints |
| `typing` | Irregular keystrokes, 2.4 s | −13.0 | Date-card typewriter |
| `notify` | Single falling "blop" (not a chime or melody) | −12.9 | Three family-chat messages |
| `blip` | Short digital blip | −16.2 | Counters landing |
| `pulse` | Low 62 Hz decay | −9.0 | Map arrival ripple |
| `shimmer` | Sparse high grains | −15.9 | Lottery selection moment |
| `paper` | Paper handling | −13.5 | Every evidence scene opens on it |
| `amb_city` | Low broadband room/city tone | −15.5 (mean −32) | Under S-001, S-024 only |
| `amb_airport` | Terminal-like air tone, no voices | −16.4 | Under S-022 only |
| `amb_road` | Traffic swells | −12.7 | Under S-033 (outro highway) |

## Rules

1. Every cue has a picture event: a tile landing, a node drawing, a stamp, a cut.
2. Transition whooshes only on cuts from footage into graphics, never on graphic-to-graphic cuts, and never doubled.
3. Ambience is short (≤ 9 s), quiet (vol 0.30–0.35), fades in and out, and appears under only four stock shots. It is never continuous.
4. Cue volumes are set per placement in `src/timeline.ts` / `src/Documentary.tsx`; peaks sit around −12 to −18 dBFS after gain. The final mix is measured with `scripts/qa.sh` (integrated loudness, true peak, silence map).
5. QA checks that audio comes only from these files. The composition contains no other `<Audio>` source, and stock video is muted at the component level.
