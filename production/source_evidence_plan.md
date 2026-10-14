# Source-evidence plan

Generated from the timeline. Every evidence scene is a dedicated full-screen graphic: a dark editorial background, the genuine capture inside a browser-style frame (left), and on the right the publisher, headline, date, the specific claim it supports, and a status badge (Official / Reported / Opinion / Disputed / Unverified). A slow controlled push (scale 1.00→1.08–1.10 toward the focus point) keeps the frame alive without drifting off the relevant passage. Evidence scenes are never placed over stock footage.

**Capture status:** none of the 20 planned captures could be made in this session — the environment's network policy blocks every news and government host (see `production/QA_report.md`). Until a capture exists, the frame shows a hatched “SCREENSHOT PENDING CAPTURE” placeholder; the attribution text beside it is already final. `scripts/capture-screenshots.mjs` captures them all once network access is granted, and the render picks them up automatically.

**Framing rules for the capture step**

- Capture at 2× device scale (≥ 2000 px wide) so the 1000 px frame is sharp at 4K.
- Crop to masthead + headline + byline/date + the one passage that carries the claim. Do not capture more than needed.
- Never crop out a qualification that changes the meaning (e.g. “alleged”, “according to”).
- Dismiss cookie banners by clicking the site's own button; do not bypass paywalls. If a page is paywalled, use the alternative source listed in the manifest.

| Shot | Where | Publisher · date | Why it is needed / claim supported | Badge | Framing |
|---|---|---|---|---|---|
| E-02 | i07 · 00:43–00:51 (Introduction) | Gulf Today · Oct 9, 2026 | Sonderling and Vance announced the action; names of the eight companies | reported | Headline block; push 1.00→1.10 toward (0.5, 0.1) |
| E-04 | i12 · 01:18–01:25 (Introduction) | Swarajya · Oct 9, 2026 | India’s Ministry of External Affairs called the remark “deeply offensive”, citing the term’s colonial-era history. | reported | Headline block; push 1.00→1.08 toward (0.5, 0.15) |
| E-05 | c1-02 · 01:58–02:05 (Chapter 1: PERM vs H-1B) | GKToday · Oct 2026 (day unconfirmed) | H-1B status is not suspended; the action covers the PERM labour-certification step for the named employers. | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-01 | c1-11 · 03:38–03:45 (Chapter 1: PERM vs H-1B) | Manifest Law · Oct 8, 2026 | Oct 8 PERM suspension of eight employers; also recaps Cloudera and Cognizant actions | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-06 | c2-15 · 06:16–06:23 (Chapter 2: The Telugu Dream and the Four-Rung Ladder) | Staffing Industry Analysts · 2026 (day unconfirmed) | Indian-born workers received 71% of approved H-1B petitions in FY2024 (USCIS data). | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-07 | c3-02 · 07:20–07:26 (Chapter 3: The Mechanics and the Green Card Backlog) | EIG Law · Jul 2026 | 65,000 regular + 20,000 master’s cap reached, announced July 17, 2026 | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-08 | c3-11 · 08:55–09:01 (Chapter 3: The Mechanics and the Green Card Backlog) | Business Standard · Mar 19, 2026 | 134-year Cato projection; 7% per-country limit | projection | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-09 | c3-15 · 09:34–09:40 (Chapter 3: The Mechanics and the Green Card Backlog) | The Tribune (IANS) · Oct/Nov 2019 | 2019 death of an engineer (reported: Shiva Chalapathi Raju, North Carolina) in the green card queue | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-10 | c4-06 · 10:45–10:51 (Chapter 4: The Tightening Noose, 2017–2026) | The Hitavada · Sep 21, 2025 | Sept 19, 2025 proclamation imposing $100,000 payment on new H-1B petitions | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-11 | c4-09 · 11:10–11:16 (Chapter 4: The Tightening Noose, 2017–2026) | The Tribune · Sep 2025 | Indian passengers left an Emirates flight at SFO; ~3-hour delay | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-12 | c4-10 · 11:16–11:22 (Chapter 4: The Tightening Noose, 2017–2026) | WION · Sep 20, 2025 | Delhi–New York one-way fares reported to jump from ~₹37,000 to ₹70,000–80,000 | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-13 | c4-13 · 11:43–11:50 (Chapter 4: The Tightening Noose, 2017–2026) | SHRM · Jun 2026 | June 8, 2026: Judge Leo Sorokin (D. Mass.) held the fee unlawful and vacated it | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-14 | c4-16 · 12:09–12:16 (Chapter 4: The Tightening Noose, 2017–2026) | U.S. Department of Labor · May 12, 2026 | OFLC suspended processing of Cloudera PERM applications for 180 days | official | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-15 | c5-03 · 12:52–12:58 (Chapter 5: The Silent Returnees) | ThePrint · Aug 2026 (editor file: Aug 3) | Xpheno 15,000+ returnees in 2025; Blind survey 53%; Meta-laid-off manager; Denver VP | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-16 | c5-12 · 14:25–14:32 (Chapter 5: The Silent Returnees) | Gulte · Sep 20, 2026 | The outlet itself notes there is no confirmation the family in the video was on an H-1B visa. | unverified | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-17 | c6-04 · 15:37–15:43 (Chapter 6: The Trap of Shortcuts — Farmington) | Fox News / Detroit Free Press · Feb 2019 | University of Farmington sting; 130 arrested (129 Indian) by early Feb 2019 | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-18 | c6-07 · 16:04–16:10 (Chapter 6: The Trap of Shortcuts — Farmington) | The Week · Feb 5, 2019 | U.S. government position that students knew it was not a real school | disputed | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-19 | c6-11 · 16:36–16:41 (Chapter 6: The Trap of Shortcuts — Farmington) | The News Minute · Jul 2019 | New Jersey staffing case: four executives charged with visa-fraud conspiracy | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-21 | c6-14 · 17:05–17:10 (Chapter 6: The Trap of Shortcuts — Farmington) | South First · May 2023 | Rachakonda police busted a fake U.S. immigration consultancy; four arrested; forged sponsor letters | reported | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
| E-22 | c7-02 · 17:40–17:46 (Chapter 7: The Reality Check and Survival Guide) | Moneylife · Oct 2026 | Argues the companies were penalised before any finding of wrongdoing. | opinion | Headline block; push 1.00→1.08 toward (0.5, 0.2) |
