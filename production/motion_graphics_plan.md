# Motion graphics plan

All graphics are custom React/SVG components in `src/scenes/`, authored on a 1920×1080 canvas and rendered at `--scale=2` (3840×2160). There are no templates or stock graphic packs.

## Visual system

| Token | Value | Use |
|---|---|---|
| Background | `#0d0e10` charcoal, radial blue lift, faint 120 px editorial grid, 6% film grain, heavy vignette | Every graphic scene (`Backdrop`) |
| Text | `#ece9e2` off-white / `#a3a8b0` secondary / `#6c727c` muted | Hierarchy |
| Cool blue `#7aa7d6` | Structure, neutral data, kickers | |
| Amber `#e2a64b` | Emphasis, India in data, projections, "focus" state | |
| Red `#d0563f` | Restriction, disputed/unverified, STOP | Used sparingly |
| Green `#7fb48a` | Official sources, "can continue" | |
| Serif display | Source Serif 4 (600) | Headlines, big numerals, quotes |
| Sans | Inter (400/600/700) | Body, labels |
| Mono | JetBrains Mono | Kickers, dates, source lines, badges |

All three typefaces are bundled through `@fontsource` (SIL OFL), so renders are reproducible offline.

**Motion language:** one easing family (`cubic-bezier(0.16,1,0.3,1)` for reveals, `(0.65,0,0.35,1)` for data). Reveals are a fade plus a 24–30 px rise, staggered 8–16 frames. Every scene fades in over 12 frames and out over 10. No spins, glitches, particles, or zooms without a reason. Counters ease in and out. Rules draw left to right. Evidence frames push in slowly (≤ 10%).

**Readability:** body text is ≥ 24 px at 1080p (≥ 48 px in the 4K master). Headlines are 56–112 px. Each scene holds long enough to read the copy aloud once more slowly (≈ 2.5 words/s plus a 2 s buffer). Source lines are pinned bottom-left in mono, above a hairline rule.

**Integrity devices:** a `StatusBadge` (Official source / Reported / Official claim · not independently verified / Projection / Opinion / Disputed / Unverified) sits on every scene that shows a contested or secondhand number, and an `Evidence` scene carries a badge as well.

## Scene components

| Component | Purpose | Used for |
|---|---|---|
| `ChapterOpener` | Outline numeral, rule draws across, title rises; impact + low whoosh | 7 chapters + intro |
| `DateCard` | Typewriter cold open | "OCT 8, 2026" |
| `ChatPanic` | English rendering of the family WhatsApp panic, messages pop in with typing indicators | Intro |
| `CompanyGrid` | Eight name tiles (text only, no logos) | The eight employers |
| `Statement` | Kicker / headline / body / numbered bullets / badge / source line | Most explanatory beats |
| `QuoteCard` | Large serif italic quote, attribution, badge | Vance |
| `SplitHeadline` | "What headlines said" (struck through) vs "what the order targeted" | Intro thesis |
| `Comparison` | Two columns that build in turn | H-1B vs PERM |
| `ProcessFlow` | Numbered nodes on a drawing line, one node highlighted | How PERM works |
| `GateDiagram` | Worker dot travels the H-1B track; the PERM gate drops to STOP | The suspension's effect |
| `MapArc` | Washington → Hyderabad arc, ripples on arrival, ≈ 13,000 km | "Why does it shake homes here?" |
| `Ladder` | SVG four-rung ladder; build mode and per-rung focus mode (past rungs blue, active amber) | Chapter 2 spine |
| `BarStat` | Horizontal share bars | FY2024 71% |
| `CapDiagram` | 85 squares (1 = 1,000 visas): 65 blue + 20 amber | Annual cap |
| `LotteryPool` | ~340 dots appear; one in four stays lit | Selection odds, weighted draw |
| `CountryCap` | Demand bars clipped at a red 7% ceiling; overflow shown translucent | Per-country limit |
| `BacklogQueue` | 180 figures (1 = 10,000 cases); 110 amber = India | 1.1M of 1.8M |
| `Projection` | Counter to 134 with scale, "what it is / is not" | Cato projection |
| `TimelineScene` | 2017–2026 axis; overview mode and per-event focus mode | Chapter 4 spine |
| `ProfileCards` | Three returnee stories, staggered | Chapter 5 |
| `VerdictCard` | Claim (italic), three checks, "UNVERIFIED" stamp | Viral Dallas claim |
| `RiskCards` | Three fraud categories; overview, then each one expanded with the others dimmed | Chapter 6 |
| `Perspectives` | U.S. view (blue) vs Indian view (amber) | Chapter 7 |
| `Checkpoint` | Big numeral, progress pips, points, "Check with official sources" box | Six checkpoints |
| `CheckpointGrid` | 3×2 recap | Chapter 7 close |
| `Evidence` | Framed genuine website capture with attribution, claim and badge | 20 source scenes |
| `HighwayBridge` | SVG perspective road: six lanes merge to a two-lane bridge, towers rise, water appears, "TEN YEARS AGO" → "TODAY" | Outro metaphor |
| `EndCard` | Info Geeks, Subscribe (press → Subscribed), Share, sources note | Close |

## Rule enforcement

- `StockShot` accepts only `slot / desc / trim / move / grade`; `scripts/build-timing.mjs` fails the build if a stock scene is given any other prop. Stock scenes render the video, a grade filter and a tonal vignette only.
- Graphics and evidence never overlap footage: every scene is its own `<Sequence>` with no layering across scenes.
