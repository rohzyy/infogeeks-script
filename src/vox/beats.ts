// Beat sheet for the Vox-style edit of the Telugu voiceover (445.4 s).
// `t` = start time in seconds, taken from phrase-level speech timestamps
// (VAD + Whisper, see production/vox/voice_timing.json). Each beat lasts until
// the next beat's `t`. All on-screen copy is English, written from the source
// script with the fact-check corrections applied (production/fact_check.md).

export type Beat = {t: number; kind: string; props: Record<string, unknown>; ch: string; sfx?: string};

const SRC = {
  procl2020: 'Proclamation 10052 (June 22, 2020); injunction Oct 1, 2020 (N.D. Cal.), limited to members of the plaintiff groups.',
  procl2025: 'Presidential proclamation, Sept 19, 2025. Rupee value at 2025 exchange rates.',
  fares: 'Fares as reported by WION and Business Today, Sept 20, 2025.',
  court: 'Reported by SHRM, Forbes and others. Government appeal pending — not settled law.',
  perm: 'DOL news release (May 12, 2026); DOL Inspector General (Sept 8, 2026); Oct 8, 2026 briefing. No company has been found liable.',
  nasscom: 'NASSCOM via PTI (Aug 25, 2026); company statements via Staffing Industry Analysts.',
  print: 'ThePrint, Aug 2026.',
  xpheno: 'Xpheno estimate, reported by ThePrint (Aug 2026).',
  blind: 'Blind survey of 1,276 verified professionals in India, June 16–25, 2026.',
  viral: 'Social-media claim, Sept 2026. Gulte: no confirmation the family in the viral video was on H-1B.',
  farm: 'ICE figures via Detroit Free Press / Fox News (Feb 2019). ~250 arrested in total by late 2019.',
  nj: 'U.S. District of New Jersey case, 2019 (The News Minute). Charges are allegations.',
  hyd: 'Rachakonda police, May 2023 (South First).',
};

const B: Beat[] = [];
let ch = 'THE TIGHTENING NOOSE';
const b = (t: number, kind: string, props: Record<string, unknown> = {}, sfx?: string) => B.push({t, kind, props, ch, sfx});

/* ---------------- Chapter 4 (continued) ---------------- */
b(0, 'statement', {text: 'Year after year, the door to America *kept narrowing*', dark: true, icon: 'DoorClosed', size: 100}, 'impact');
b(2.73, 'doc', {header: 'PRESIDENTIAL PROCLAMATION 10052', date: 'June 22, 2020', title: 'Pandemic order suspends entry of new H-1B workers', lines: ['Covers H-1B, L-1, H-2B and some J-1 visas', 'Justified as protecting U.S. jobs during COVID-19', 'In force until the end of 2020'], hl: [0], side: 'June 2020: *entry suspended*', source: SRC.procl2020});
b(8.36, 'statement', {kicker: 'October 1, 2020', text: 'A federal judge *blocked it*', icon: 'Gavel', stamp: 'BLOCKED', source: 'Injunction applied to members of the business groups that sued — not nationwide.'}, 'stamp');
b(11.14, 'year', {year: 'SEPT 2025', line: 'The midnight panic', icon: 'Moon'}, 'impact');
b(14.34, 'doc', {header: 'PRESIDENTIAL PROCLAMATION', date: 'September 19, 2025', title: 'Restriction on Entry of Certain Nonimmigrant Workers', lines: ['Applies to new H-1B petitions', 'Requires a payment of $100,000', 'Effective 12:01 a.m. ET, September 21, 2025'], hl: [1], source: SRC.procl2025});
b(19.75, 'money', {source: SRC.procl2025});
b(25.99, 'map', {kind: 'world', zoom: {from: [[-60, 30], 1.0], to: [[-110, 35], 2.6]}, pins: [{at: [-122.38, 37.62], label: 'San Francisco (SFO)', delay: 12}], caption: 'That night, at San Francisco airport…', kicker: 'Sept 2025', focusX: 0.62});
b(29.45, 'deplane', {});
b(37.45, 'fare', {source: SRC.fares});
b(40.49, 'statement', {kicker: 'The White House clarifies', text: 'The fee is for *new petitions* — not existing visa holders', icon: 'Landmark'});
b(47.08, 'doc', {header: 'U.S. DISTRICT COURT · DISTRICT OF MASSACHUSETTS', date: 'June 8, 2026', title: 'Judge rules the $100,000 fee unlawful', lines: ['Congress never authorised the payment', 'The fee is vacated', 'The government has appealed'], hl: [1], stamp: 'UNDER APPEAL', stampColor: '#2f5d8c', source: SRC.court}, 'stamp');
b(49.99, 'statement', {text: 'One signature can rewrite the future of *lakhs of families*', dark: true, icon: 'PenLine'});
b(54.02, 'statement', {kicker: '2026', text: 'Then the target became *PERM* — the first step to a green card', icon: 'Crosshair'});
b(58.34, 'timeline26', {source: SRC.perm});
b(67.78, 'statement', {kicker: 'NASSCOM · August 2026', text: 'Indian IT firms say their H-1B dependence *fell sharply* in five years', icon: 'TrendingDown', source: SRC.nasscom});
b(79.24, 'number', {value: 80, suffix: '%+', label: 'of Wipro’s U.S. workforce is local, the company says', kicker: 'Wipro', source: SRC.nasscom});
b(84.71, 'statement', {kicker: 'Infosys', text: 'Infosys has also *increased local hiring*', icon: 'Building2'});
b(87.05, 'statement', {text: 'The companies adapted. *The individual worker* got trapped.', dark: true, icon: 'UserX'});

/* ---------------- Chapter 5 ---------------- */
ch = 'THE SILENT RETURNEES';
b(92.74, 'chapter', {n: '05', title: 'The Silent Returnees', sub: 'Hyderabad · Bengaluru'}, 'impact');
b(96.04, 'statement', {text: 'Behind the headlines, another reality: *reverse migration*', icon: 'PlaneLanding'});
b(101.57, 'doc', {header: 'REPORT SUMMARY · THEPRINT, AUGUST 2026', title: 'More U.S.-based tech workers are moving back to Hyderabad and Bengaluru', lines: ['Tech layoffs', 'Job cuts linked to AI automation', 'Visa uncertainty'], hl: [0, 1, 2], source: SRC.print});
b(109.96, 'map', {kind: 'world', zoom: {from: [[-30, 30], 1.0], to: [[20, 25], 1.15]}, arcs: [{from: [-122.3, 47.6], to: [78.48, 17.39], at: 6}, {from: [-74, 40.7], to: [77.59, 12.97], at: 18, color: '#2f5d8c'}], pins: [{at: [78.48, 17.39], label: 'Hyderabad', delay: 40}, {at: [77.59, 12.97], label: 'Bengaluru', delay: 54, side: 'left'}], highlight: ['India'], caption: 'U.S. → India', kicker: 'The return trip'});
b(114.5, 'number', {value: 15000, suffix: '+', label: 'IT professionals moved from the U.S. to India in 2025', kicker: 'Xpheno estimate', icon: 'PlaneLanding', source: SRC.xpheno});
b(121.06, 'number', {value: 53, suffix: '%', label: 'of verified tech workers said colleagues had returned over visa issues', kicker: 'Blind survey · June 2026', sub: '1,276 respondents in India', source: SRC.blind});
b(128.55, 'iconarray', {total: 100, hi: 53, icon: 'User', title: 'More than half had *seen it happen*', legend: 'Saw colleagues return over visa issues', legend2: '1 icon = 1% of respondents', source: SRC.blind});
const people = [
  {icon: 'Briefcase', who: 'Seattle tech manager', story: 'Laid off by Meta. No new sponsor within the 60-day grace period. Now works in Hyderabad.'},
  {icon: 'Rocket', who: 'Startup VP, Denver', story: 'Reached vice-president level, then moved his family back to Hyderabad after 15 years.'},
  {icon: 'Users', who: 'Couple, 12 years at Microsoft', story: 'Visa restrictions and family health stress — they chose to return.', flag: 'Return date unclear; may predate 2025–26'},
];
b(136.93, 'profiles', {cards: people, source: SRC.print});
b(139.05, 'profiles', {cards: people, focus: 0, source: SRC.print});
b(147.37, 'profiles', {cards: people, focus: 1, source: SRC.print});
b(152.65, 'profiles', {cards: people, focus: 2, source: 'Business Today, Jan 11, 2026 (podcast interview).'});
b(161.4, 'statement', {text: 'Then a *sensational claim* went viral', dark: true, icon: 'Smartphone'});
b(164.42, 'map', {kind: 'us', zoom: {from: [[-98, 38], 1.0], to: [[-96.7, 33.3], 4.2]}, highlight: ['Texas'], pins: [{at: [-96.78, 33.32], label: 'Celina', delay: 30}, {at: [-96.57, 33.29], label: 'Melissa', delay: 40, side: 'left'}], caption: 'Dallas suburbs, Texas', kicker: 'Collin County', focusX: 0.6});
b(167.3, 'viral', {text: '10 Telugu families lost their jobs, abandoned their houses and cars, and flew home.', side: 'Is it *true?*', source: SRC.viral});
b(173.67, 'statement', {text: 'We checked the *ground reality*', icon: 'Search'});
b(176.84, 'statement', {kicker: 'Claim', text: 'Collin County home prices fell *9%*', stamp: 'NOT VERIFIED', source: 'Secondhand figure attributed to Bloomberg/Redfin; the original report could not be located.'}, 'stamp');
b(180.84, 'viral', {text: '10 Telugu families lost their jobs, abandoned their houses and cars, and flew home.', stamp: 'UNVERIFIED', side: 'Not one piece of *independent proof*', source: SRC.viral}, 'stamp');
b(185.99, 'statement', {text: 'The 60-day grace-period pressure is *real*', icon: 'Timer', source: 'After a layoff, H-1B workers generally have up to 60 days to find a sponsor, change status or leave (8 CFR 214.1(l)(2)).'});
b(189.09, 'statement', {text: 'But unverified viral videos spread *panic* among ordinary families', dark: true, icon: 'TriangleAlert'});

/* ---------------- Chapter 6 ---------------- */
ch = 'THE TRAP OF SHORTCUTS';
b(193.9, 'chapter', {n: '06', title: 'The Trap of Shortcuts', sub: 'The University of Farmington'}, 'impact');
b(199.62, 'statement', {text: 'Visa desperation leads to a bigger trap: *illegal shortcuts*', icon: 'TriangleAlert'});
b(205.16, 'year', {year: '2019', line: 'One of the biggest shocks: the University of Farmington', icon: 'GraduationCap'}, 'impact');
b(210.18, 'map', {kind: 'us', zoom: {from: [[-95, 39], 1.0], to: [[-83.37, 42.48], 3.6]}, highlight: ['Michigan'], pins: [{at: [-83.37, 42.48], label: 'Farmington Hills, Michigan', delay: 28}], caption: 'It had a website and admissions…', kicker: 'Michigan', focusX: 0.6});
b(213.9, 'statement', {text: 'No classes. *No professors.*', icon: 'School', stamp: 'FAKE'}, 'stamp');
b(216.58, 'statement', {kicker: 'Why?', text: 'It was an undercover *sting* run by U.S. Homeland Security', dark: true, icon: 'Siren'});
b(223.56, 'statement', {kicker: 'The lure', text: '*Day-1 CPT*: work full-time while keeping F-1 student status', icon: 'Briefcase'});
b(229.09, 'iconarray', {total: 600, hi: 130, per: 5, title: '*600* students enrolled. *130* arrested in the first ICE round.', legend: 'Arrested by early Feb 2019', legend2: '1 icon = 5 students', source: SRC.farm});
b(234.98, 'number', {value: 129, label: 'of the first 130 arrested were Indian — many from the Telugu states', kicker: 'February 2019', source: SRC.farm});
b(239.49, 'statement', {text: 'Students were held in *detention centres* across the U.S.', icon: 'Lock', source: 'The script’s figure of 34 centres could not be independently confirmed.'});
b(242.6, 'folders', {active: 0, title: 'Three kinds of fraud'});
b(245.25, 'folders', {active: 1, title: 'Fake client projects — workers kept on the *bench*', points: ['Staffing consultancies file visas for jobs that do not exist', 'Workers wait unpaid for “projects”']});
b(252.49, 'map', {kind: 'us', zoom: {from: [[-90, 39], 1.0], to: [[-74.4, 40.2], 4.0]}, highlight: ['New Jersey'], pins: [{at: [-74.4, 40.4], label: 'New Jersey', delay: 22, side: 'left'}], caption: 'Staffing owners charged — two of Telugu origin', kicker: '2019', focusX: 0.62, source: SRC.nj});
b(257.06, 'folders', {active: 2, title: 'Fake experience letters', points: ['Caught at airport immigration', 'Refused entry and sent back']});
b(263.27, 'statement', {text: 'A *5-year* ban — or a *permanent* one', icon: 'Ban', stamp: 'BANNED', source: 'Removal at the border: generally a 5-year bar. Fraud or misrepresentation: permanent inadmissibility (INA 212(a)(6)(C)(i)).'}, 'stamp');
b(268.1, 'folders', {active: 3, title: 'Fake agencies, fake sponsorship promises', points: ['Some Hyderabad agencies take lakhs of rupees from students', 'May 2023: police busted one such racket — four arrested'], source: SRC.hyd});
b(278.09, 'statement', {text: 'A website does not make a university *real*', icon: 'Globe'});
b(284.2, 'statement', {text: 'Shortcuts can *destroy a career* — permanently', dark: true, icon: 'Ban'});

/* ---------------- Chapter 7 ---------------- */
ch = 'REALITY CHECK & SURVIVAL GUIDE';
b(287.85, 'chapter', {n: '07', title: 'The Reality Check', sub: 'and your survival guide'}, 'impact');
b(294.15, 'statement', {text: 'America and India: *two perspectives*', icon: 'Scale'});
const usPts = ['Jobs should go to local Americans first', 'Companies must not use cheaper foreign labour to cut wages', 'Fraud must be stopped'];
const inPts = ['Indian minds drive Silicon Valley innovation, tax revenue and tech growth', 'Targeting workers who queued legally for years, in the name of investigations, is unfair'];
b(297.89, 'split', {left: {k: 'The U.S. view', pts: usPts}, right: {k: 'The Indian view', pts: inPts}, focus: 'left'});
b(311.27, 'split', {left: {k: 'The U.S. view', pts: usPts}, right: {k: 'The Indian view', pts: inPts}, focus: 'right'});
b(328.61, 'statement', {text: 'Investigations will decide. But if *you* plan to go to the U.S. now…', icon: 'GraduationCap'});
b(337.41, 'statement', {text: '*6* practical checkpoints', dark: true, icon: 'ListChecks', size: 130}, 'impact');
b(339.53, 'checkpoint', {n: 1, title: 'Selection is not a promise', points: ['H-1B selection is chance-based, not a reward for talent', 'Before a ₹50-lakh-scale loan, plan how you would repay it if you are not selected'], check: 'uscis.gov — H-1B cap season'});
b(351.49, 'checkpoint', {n: 2, title: 'Check accreditation', points: ['Avoid colleges selling “Day-1 CPT”', 'Choose universities with real classrooms and real professors'], check: 'studyinthestates.dhs.gov · ope.ed.gov/dapip'});
b(361.73, 'checkpoint', {n: 3, title: 'Verify your employer', points: ['Is there an offer letter and a base salary?', 'Is there a real client project?', 'Consultancies asking you to pay H-1B sponsorship fees? Walk away.'], check: 'dol.gov — H-1B worker protections'});
b(373.38, 'checkpoint', {n: 4, title: 'Zero tolerance on fake documents', points: ['Never submit fake experience letters or bank statements', 'One misrepresentation finding can close U.S. doors permanently'], check: 'uscis.gov — Policy Manual, Vol. 8, Part J'});
b(385.25, 'checkpoint', {n: 5, title: 'Accept the green card reality', points: ['For many Indian applicants the queue runs for decades', 'Plan family and long-term career moves around it'], check: 'travel.state.gov — Visa Bulletin'});
b(395.65, 'checkpoint', {n: 6, title: 'No WhatsApp hysteria', points: ['Trust USCIS, Department of Labor portals and qualified immigration lawyers', 'Never decide in panic because of viral reels'], check: 'uscis.gov · dol.gov · a licensed attorney'});

/* ---------------- Outro ---------------- */
ch = 'OUTRO';
b(410.25, 'statement', {text: 'The H-1B dream *has not ended*', dark: true, icon: 'Plane', size: 110});
b(413.57, 'bridge', {line: 'But the broad highway of ten years ago…', line2: '…is now a narrow bridge.'});
b(418.79, 'statement', {text: 'Rules, elections and politics change. *Hard work, talent and an ethical path* protect you.', size: 80});
b(426.18, 'statement', {text: 'America is great. But America is *not all of life*.', dark: true, size: 96});
b(429.6, 'statement', {text: 'Prepare for Plan A. Build a *bulletproof Plan B*.', icon: 'ShieldCheck', size: 96}, 'impact');
b(432.49, 'statement', {text: 'Friends and family in the U.S.? *Tell us how they feel.*', icon: 'MessageCircle', size: 84});
b(436.71, 'end', {});

export const BEATS = B;
