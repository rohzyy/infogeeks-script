// Scene-by-scene timeline. Durations are in seconds (integers or .5 at most)
// and are converted to frames at 30 fps. scripts/build-timing.mjs validates
// that every chapter sums exactly to its approved boundary and that the film
// ends on frame 37,800 (zero-based, exclusive end frames).
//
// Every on-screen word here is editorial English. Script meaning is kept;
// where research changed a fact, the corrected wording is used and the
// difference is logged in production/fact_check.md.

import {sourceById} from './data/sources.ts';
import {stockBySlot} from './data/stock.ts';
import {color} from './theme.ts';

export type SceneType =
  | 'stock'
  | 'evidence'
  | 'chapter'
  | 'date'
  | 'statement'
  | 'quote'
  | 'split'
  | 'chat'
  | 'companies'
  | 'numbers'
  | 'bars'
  | 'cap'
  | 'lottery'
  | 'countrycap'
  | 'backlog'
  | 'projection'
  | 'comparison'
  | 'flow'
  | 'gate'
  | 'map'
  | 'ladder'
  | 'timeline'
  | 'profiles'
  | 'verdict'
  | 'risks'
  | 'perspectives'
  | 'checkpoint'
  | 'checkgrid'
  | 'highway'
  | 'endcard';

export type Cue = {sfx: string; at: number; vol?: number}; // at = seconds into scene

export type Scene = {
  id: string;
  chapter: ChapterKey;
  type: SceneType;
  sec: number;
  props: Record<string, unknown>;
  sfx?: Cue[];
  script: string; // which passage of the source script this scene carries
};

export type ChapterKey = 'intro' | 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'ch6' | 'ch7' | 'outro';

export const CHAPTERS: {key: ChapterKey; title: string; start: number; end: number}[] = [
  {key: 'intro', title: 'Introduction', start: 0, end: 105},
  {key: 'ch1', title: 'Chapter 1: PERM vs H-1B', start: 105, end: 250},
  {key: 'ch2', title: 'Chapter 2: The Telugu Dream and the Four-Rung Ladder', start: 250, end: 420},
  {key: 'ch3', title: 'Chapter 3: The Mechanics and the Green Card Backlog', start: 420, end: 585},
  {key: 'ch4', title: 'Chapter 4: The Tightening Noose, 2017–2026', start: 585, end: 750},
  {key: 'ch5', title: 'Chapter 5: The Silent Returnees', start: 750, end: 900},
  {key: 'ch6', title: 'Chapter 6: The Trap of Shortcuts — Farmington', start: 900, end: 1035},
  {key: 'ch7', title: 'Chapter 7: The Reality Check and Survival Guide', start: 1035, end: 1200},
  {key: 'outro', title: 'Outro', start: 1200, end: 1260},
];

let current: ChapterKey = 'intro';
const S: Scene[] = [];
const ch = (k: ChapterKey) => {
  current = k;
};
const add = (id: string, type: SceneType, sec: number, script: string, props: Record<string, unknown> = {}, sfx?: Cue[]) =>
  S.push({id, chapter: current, type, sec, props, sfx, script});

const stock = (id: string, slot: string, sec: number, script: string, opts: {trim?: number; sfx?: Cue[]} = {}) => {
  const d = stockBySlot(slot);
  add(id, 'stock', sec, script, {slot, desc: d.desc, grade: d.grade, move: d.move, trim: opts.trim ?? 0}, opts.sfx);
};

const ev = (
  id: string,
  src: string,
  sec: number,
  script: string,
  p: {supports?: string; status: string; note?: string; focus?: {x: number; y: number; z0: number; z1: number}},
) => {
  const s = sourceById(src);
  add(id, 'evidence', sec, script, {
    shot: src,
    publisher: s.publisher,
    title: s.title,
    date: s.date,
    domain: new URL(s.url).hostname.replace(/^www\./, ''),
    supports: p.supports ?? s.supports,
    status: p.status,
    note: p.note,
    focus: p.focus,
  });
};

/* ================================================================== */
/* INTRODUCTION  00:00 – 01:45                                         */
/* ================================================================== */
ch('intro');
stock('i01', 'S-001', 7, 'Cold open: one press conference reaches Hyderabad, Vijayawada, Vizag', {sfx: [{sfx: 'amb_city', at: 0, vol: 0.35}]});
add('i02', 'date', 5, 'October 8th, 2026', {date: 'OCT 8, 2026', line: 'A single press conference in Washington'}, [{sfx: 'typing', at: 0.25, vol: 0.5}]);
stock('i03', 'S-002', 7, 'Parents in WhatsApp groups, anxious');
add('i04', 'chat', 8, 'WhatsApp panic: "Is H-1B stopped? My son’s company is on the list!"', {
  group: 'Family — Vijayawada',
  messages: [
    {from: 'Mother', text: 'They are saying America has stopped H-1B. Is it true?'},
    {from: 'Uncle', text: 'Our son’s company name is also on that list!'},
    {from: 'Cousin', text: 'Forwarded: “H-1B BLOCKED” 🔴'},
  ],
  caption: 'Within hours, the news reached family groups across Andhra Pradesh and Telangana.',
}, [{sfx: 'notify', at: 0.6, vol: 0.45}, {sfx: 'notify', at: 1.73, vol: 0.4}, {sfx: 'notify', at: 2.86, vol: 0.4}]);
stock('i05', 'S-003', 6, 'Scrolling messages');
add('i06', 'companies', 10, 'Vance and Sonderling read out eight company names', {
  kicker: 'White House briefing · Oct 8, 2026',
  headline: 'Vice President JD Vance and Labor Secretary Keith Sonderling named eight companies',
  names: ['Microsoft', 'Adobe', 'Cognizant', 'Capgemini', 'TCS', 'Infosys', 'Wipro', 'HCLTech'],
  source: 'Reported by Gulf Today, Boundless, Ellis and others, Oct 8–9, 2026',
}, [{sfx: 'whoosh_soft', at: 0}, ...[0.93, 1.16, 1.4, 1.63, 1.86, 2.1, 2.33, 2.56].map((at) => ({sfx: 'click', at, vol: 0.35}))]);
ev('i07', 'E-02', 8, 'What was reported', {status: 'reported', note: 'Headlines said “green cards frozen”. The action concerns PERM labour certification — explained next.', focus: {x: 0.5, y: 0.1, z0: 1.0, z1: 1.1}});
add('i08', 'statement', 8, 'Labor Department: stop PERM now; no new applications, no processing of pending ones', {
  kicker: 'What the Labor Department announced',
  headline: 'For these eight employers, the PERM process was suspended',
  bullets: ['No new PERM applications accepted', 'Pending applications not processed'],
  source: 'As stated at the Oct 8 briefing. No written DOL notice or press release had been located as of Oct 14, 2026.',
});
stock('i09', 'S-004', 6, 'Corporate power');
add('i10', 'quote', 8, 'Vance: laying off while replacing with foreign "indentured servants"', {
  speaker: 'JD Vance',
  role: 'U.S. Vice President · Oct 8, 2026',
  quote: 'Microsoft laid off American workers while relying on foreign workers he described as “indentured servants.”',
  context: 'He cited 6,000 layoffs against 6,300 H-1B visas and almost 3,000 green cards for Microsoft. Microsoft called the allegations false.',
  status: 'claim',
  source: 'Paraphrase with quoted term as reported by Gulf News, Orissa Post and others. Figures are Vance’s; not independently verified.',
}, [{sfx: 'impact_soft', at: 0.2, vol: 0.5}]);
add('i11', 'statement', 5, '(Microsoft response — added for fairness)', {
  kicker: 'Microsoft’s response',
  headline: 'Microsoft rejected the allegations',
  body: 'It said it complies with applicable laws and that most of its recent H-1B filings were for people already employed by the company.',
  status: 'reported',
});
ev('i12', 'E-04', 7, 'India’s MEA: the term recalls colonial-era suffering; deeply offensive', {
  supports: 'India’s Ministry of External Affairs called the remark “deeply offensive”, citing the term’s colonial-era history.',
  status: 'reported',
  focus: {x: 0.5, y: 0.15, z0: 1.0, z1: 1.08},
});
stock('i13', 'S-005', 6, 'Between political allegations and headlines');
add('i14', 'split', 9, 'Did H-1B visas really stop?', {
  left: {k: 'WHAT MANY HEADLINES SAID', v: '“H-1B blocked”'},
  right: {k: 'WHAT THE ORDER TARGETED', v: 'PERM labour certification'},
  foot: 'H-1B status was not suspended by the Oct 8 action.',
}, [{sfx: 'whoosh_low', at: 0.2}, {sfx: 'stamp', at: 1.4, vol: 0.4}]);
add('i15', 'statement', 5, 'Is a silent lock falling on the Telugu American Dream? Let’s break it down from official records', {
  headline: 'Panic, or policy? A look at the rules, the records and the reality.',
  align: 'center',
  size: 70,
});

/* ================================================================== */
/* CHAPTER 1  01:45 – 04:10                                            */
/* ================================================================== */
ch('ch1');
add('c1-00', 'chapter', 6, 'Chapter 1: The PERM vs H-1B Confusion', {num: '01', title: 'PERM vs H-1B', sub: 'Two different things, one confusing headline', range: '01:45'});
add('c1-01', 'statement', 7, 'First, clear the biggest fear: this is not an H-1B ban', {
  kicker: 'First things first',
  headline: 'This is not an H-1B visa ban.',
  body: 'The order concerned PERM — the Program Electronic Review Management system used for permanent labour certification.',
  size: 96,
});
ev('c1-02', 'E-05', 7, 'What is and isn’t affected', {
  supports: 'H-1B status is not suspended; the action covers the PERM labour-certification step for the named employers.',
  status: 'reported',
  note: 'Consistent with Boundless, Colombo & Hurd and Ellis summaries.',
});
stock('c1-03', 'S-006', 7, 'Workers at their desks');
add('c1-04', 'comparison', 16, 'H-1B = temporary work permit, 3–6 years; PERM = first step to a green card', {
  kicker: 'The difference',
  cols: [
    {
      title: 'H-1B',
      tag: 'TEMPORARY WORK STATUS',
      tone: color.blue,
      rows: [
        'Lets an employer hire a foreign professional for a specialty occupation',
        'Granted in periods of up to 3 years; generally 6 years maximum, with some extensions',
        'Existing H-1B status was not cancelled by the Oct 8 action',
      ],
    },
    {
      title: 'PERM',
      tag: 'PERMANENT LABOUR CERTIFICATION',
      tone: color.amber,
      rows: [
        'Filed by the employer with the U.S. Department of Labor',
        'The first step for most employment-based green cards',
        'Suspended on Oct 8 for eight named employers',
      ],
    },
  ],
}, [{sfx: 'whoosh_soft', at: 0}, {sfx: 'whoosh_soft', at: 1.3, vol: 0.6}]);
stock('c1-05', 'S-007', 7, 'Employer paperwork');
add('c1-06', 'flow', 16, 'Employer must prove to DOL no qualified American was found and wages won’t fall', {
  kicker: 'How PERM works',
  headline: 'Before sponsoring a green card, the employer must test the U.S. job market',
  steps: [
    {t: 'Recruit in the U.S.', d: 'Advertise the role under DOL rules'},
    {t: 'No qualified U.S. worker', d: 'Show none was able, willing, qualified and available'},
    {t: 'Wages protected', d: 'Show U.S. workers’ wages are not adversely affected'},
    {t: 'DOL certification', d: 'This approval is “PERM certification”', hl: true},
    {t: 'Next: immigrant petition', d: 'Form I-140 with USCIS, then the green card queue'},
  ],
  source: 'Process summary based on 20 CFR Part 656 as described by U.S. immigration law firms.',
}, [{sfx: 'tick', at: 0.8}, {sfx: 'tick', at: 1.53}, {sfx: 'tick', at: 2.26}, {sfx: 'tick', at: 3.0}, {sfx: 'tick', at: 3.73}]);
add('c1-07', 'gate', 10, 'H-1B holders can work; the green card gate now shows STOP', {}, [{sfx: 'impact_soft', at: 2.7, vol: 0.55}]);
stock('c1-08', 'S-008', 7, 'A closed door');
add('c1-09', 'numbers', 13, 'Since 2009: ~2.3 lakh H-1B approvals and 1 lakh PERM certifications', {
  kicker: 'The Labor Secretary’s figures · since 2009',
  headline: 'The eight companies together, according to Secretary Sonderling:',
  stats: [
    {value: 230000, suffix: '+', label: 'H-1B approvals'},
    {value: 100000, suffix: '+', label: 'PERM labour certifications', tone: color.amber},
  ],
  status: 'claim',
  source: 'Figures as stated by the Labor Secretary on Oct 8, 2026, and repeated by multiple outlets.',
}, [{sfx: 'blip', at: 0.7}, {sfx: 'blip', at: 1.13}]);
stock('c1-09b', 'S-035', 6, 'Two decades of filings');
add('c1-10', 'statement', 11, 'Investigations are under way, so it is a temporary halt, they say', {
  kicker: 'Why, and for how long',
  headline: 'Officials cited active investigations — and set no end date',
  bullets: [
    'Microsoft and Adobe: tied to “multiple active federal investigations”',
    'The six IT services firms: officials pointed to filing volume',
    'Law firms cite 20 CFR 656.31(b): up to 180 days, extendable',
  ],
  status: 'reported',
  source: 'Boundless, Colombo & Hurd, Ellis (Oct 2026). DOL had not named the regulation it relied on.',
});
ev('c1-11', 'E-01', 7, 'Labor Department order', {
  status: 'reported',
  note: 'A law-firm news summary. No official DOL release located.',
});
stock('c1-12', 'S-009', 7, '13,000 km away in the Telugu states');
add('c1-13', 'map', 12, 'Why does an order in one US department cause such a tremor 13,000 km away?', {
  headline: 'Why does an order in Washington shake homes in Telangana and Andhra Pradesh?',
  sub: 'Because of a family plan many households have followed for a generation.',
}, [{sfx: 'whoosh_low', at: 0.5}, {sfx: 'pulse', at: 2.6, vol: 0.4}]);
add('c1-14', 'statement', 6, 'That’s where "The Ladder" comes in', {kicker: 'Next', headline: 'The ladder.', align: 'center', size: 110});

/* ================================================================== */
/* CHAPTER 2  04:10 – 07:00                                            */
/* ================================================================== */
ch('ch2');
add('c2-00', 'chapter', 6, 'Chapter 2: The Telugu Dream & The 4-Rung Ladder', {num: '02', title: 'The Telugu dream and the four-rung ladder', range: '04:10'});
stock('c2-01', 'S-010', 7, 'Families in Andhra Pradesh and Telangana');
add('c2-02', 'statement', 8, 'For lakhs of families, H-1B is a 25-year lifeline for generational growth', {
  headline: 'For many families in Andhra Pradesh and Telangana, H-1B is not just a visa category.',
  body: 'Over roughly 25 years it has become a lifeline for a generation’s upward mobility.',
  size: 66,
});
add('c2-03', 'ladder', 10, 'Imagine the ladder', {active: 0, headline: 'One family plan, four rungs'}, [{sfx: 'tick', at: 0.8}, {sfx: 'tick', at: 1.33}, {sfx: 'tick', at: 1.86}, {sfx: 'tick', at: 2.4}]);
stock('c2-04', 'S-011', 7, 'B.Tech students');
add('c2-05', 'ladder', 8, 'Rung 1: B.Tech in Hyderabad, Vijayawada or a rural town', {active: 1});
stock('c2-06', 'S-012', 7, 'Family finances');
add('c2-07', 'ladder', 12, 'Rung 2: sell land or take a ₹40–50 lakh education loan for a US master’s', {
  active: 2,
  detail: 'Families sell land or take large education loans to pay for a U.S. master’s degree.',
  facts: ['Costs vary widely by university, city and course length.'],
  status: 'unverified',
  statusLabel: 'Script figure ₹40–50 lakh: no source found',
});
stock('c2-08', 'S-013', 7, 'Departure');
stock('c2-09', 'S-014', 6, 'US campus');
add('c2-10', 'ladder', 12, 'Rung 3: work 1–3 years on OPT and win the H-1B lottery', {
  active: 3,
  detail: 'After graduating, students work on Optional Practical Training while trying for H-1B selection.',
  facts: ['OPT: 12 months of work authorisation', 'STEM graduates may qualify for a 24-month extension — up to 3 years in total'],
  source: 'OPT periods per USCIS / Study in the States guidance (8 CFR 214.2(f)); verify current rules on uscis.gov.',
});
stock('c2-11', 'S-015', 6, 'Graduation');
add('c2-12', 'ladder', 9, 'Rung 4: file green card, buy a house in Dallas or the Bay Area, settle kids', {
  active: 4,
  detail: 'File for a green card, buy a home in Dallas or the Bay Area, and settle the children.',
});
stock('c2-13', 'S-016', 7, 'Suburban homes');
add('c2-14', 'bars', 14, 'USCIS: roughly 71% of approved H-1B petitions go to Indians', {
  kicker: 'USCIS data · FY2024',
  headline: 'Share of approved H-1B petitions by country of birth',
  bars: [
    {label: 'India', pct: 71, tone: color.amber},
    {label: 'China', pct: 12},
    {label: 'All others', pct: 17, tone: '#3b4250'},
  ],
  source: 'USCIS, Characteristics of H-1B Specialty Occupation Workers, FY2024 (283,397 of ~399,400 approvals), via Migration Policy Institute and Staffing Industry Analysts.',
}, [{sfx: 'whoosh_soft', at: 0}, {sfx: 'blip', at: 0.8}]);
ev('c2-15', 'E-06', 7, '71% Indian (source)', {status: 'reported', supports: 'Indian-born workers received 71% of approved H-1B petitions in FY2024 (USCIS data).'});
add('c2-16', 'statement', 8, '“And a major chunk of that 71% are Telugu people”', {
  kicker: 'What the data does not show',
  headline: 'There is no official count of Telugu H-1B holders',
  body: 'USCIS reports country of birth, not Indian state or language. The script’s claim that Telugu speakers form a “major chunk” is widely believed but unverified.',
  status: 'unverified',
  size: 64,
});
stock('c2-17', 'S-017', 7, 'Parents’ life savings');
add('c2-18', 'statement', 8, 'The whole ladder rests on parents’ life savings; a small rule change there weighs on parents here', {
  headline: 'The whole ladder rests on parents’ savings and trust.',
  body: 'A small turn of a rule in Washington lands heavily on a middle-class home in India.',
  size: 70,
});
stock('c2-19', 'S-031', 6, 'Late nights');
add('c2-20', 'statement', 8, 'But few know the real nightmare at the top of the ladder', {headline: 'But the hardest part comes after the top rung.', align: 'center', size: 76});

/* ================================================================== */
/* CHAPTER 3  07:00 – 09:45                                            */
/* ================================================================== */
ch('ch3');
add('c3-00', 'chapter', 6, 'Chapter 3: The Mechanics & The Endless Green Card Trap', {num: '03', title: 'The mechanics and the green card backlog', range: '07:00'});
add('c3-01', 'cap', 14, '65,000 regular + 20,000 US master’s = 85,000 new H-1Bs; applicants in lakhs', {
  source: 'Statutory cap (INA 214(g)); FY2027 cap reached per USCIS announcement of July 17, 2026, as reported by EIG Law and others.',
}, [{sfx: 'whoosh_soft', at: 0}, {sfx: 'blip', at: 1.0}, {sfx: 'blip', at: 2.2}]);
ev('c3-02', 'E-07', 6, 'Cap reached', {status: 'reported'});
stock('c3-03', 'S-018', 7, 'Lakhs of applicants');
add('c3-04', 'lottery', 14, 'Even with a 4.0 GPA and a top offer, selection is a pure lottery', {
  source: 'USCIS registration data as reported by law firms (Ogletree, JD Supra). Weighted selection rule effective Feb 27, 2026.',
}, [{sfx: 'shimmer', at: 2.3, vol: 0.4}]);
add('c3-05', 'statement', 8, 'If not selected during OPT, status ends and you pack up', {
  kicker: 'If you are not selected',
  headline: 'When OPT runs out without an H-1B, the student must change status or leave.',
  size: 64,
});
stock('c3-06', 'S-019', 7, 'Packing up');
add('c3-07', 'statement', 7, 'Say you win — the real maze (padmavyuham) begins: the green card backlog', {
  kicker: 'Say you are selected',
  headline: 'Then the real maze begins: the green card backlog.',
  size: 80,
});
add('c3-08', 'countrycap', 14, 'No country may get more than 7% of employment-based green cards', {
  source: 'Per-country limit: INA 202(a)(2). Bars are illustrative of relative demand, not to scale.',
}, [{sfx: 'whoosh_soft', at: 0}, {sfx: 'impact_soft', at: 2.1, vol: 0.4}]);
stock('c3-08b', 'S-036', 6, 'The queue');
add('c3-09', 'backlog', 13, 'India’s applicants are in lakhs but the quota equals smaller countries', {
  source: 'Cato Institute analysis (David Bier, 2023) of government data, as reported by Boundless.',
});
add('c3-10', 'projection', 13, 'Experts say the wait for Indians exceeds 30–50 years', {
  source: 'Cato Institute (2023), reported by Business Standard (Mar 19, 2026). Script’s “30–50 years” is not from a cited source.',
});
ev('c3-11', 'E-08', 6, 'Backlog source', {status: 'projection'});
stock('c3-12', 'S-020', 7, 'Life inside the queue');
add('c3-13', 'statement', 11, 'H-4 spouses can’t work freely; children age out at 21', {
  kicker: 'Living in the queue',
  headline: 'Years of waiting reach the whole family',
  bullets: [
    'H-4 spouses may work only with an H-4 EAD — generally after an approved I-140 or an extension beyond six years',
    'Children who are not U.S.-born can “age out” of dependent status at 21; the Child Status Protection Act protects some, not all',
  ],
  source: 'USCIS H-4 EAD rule (2015) and CSPA as summarised by university ISSS offices. Verify on uscis.gov.',
  size: 64,
});
add('c3-14', 'statement', 9, '2019: a Telugu Oracle engineer in North Carolina died while waiting', {
  kicker: 'North Carolina · October 2019',
  headline: 'A software engineer died suddenly while waiting in the green card queue.',
  body: 'His pregnant wife, whose status depended on his, faced having to leave the U.S. A local Telugu association raised funds to help the family.',
  source: 'Reported as Shiva Chalapathi Raju (IANS / The Tribune; American Bazaar, Oct 31, 2019).',
  tone: color.textDim,
  size: 62,
});
stock('c3-14b', 'S-037', 6, 'Grief and uncertainty');
ev('c3-15', 'E-09', 6, 'Tribune report', {status: 'reported'});
add('c3-16', 'statement', 5, 'And on this frozen queue, new restrictions kept coming', {headline: 'And on top of this frozen queue, new restrictions kept arriving.', align: 'center', size: 68});

/* ================================================================== */
/* CHAPTER 4  09:45 – 12:30                                            */
/* ================================================================== */
ch('ch4');
add('c4-00', 'chapter', 6, 'Chapter 4: The Tightening Noose (2017 to 2026)', {num: '04', title: 'The tightening noose', sub: '2017 – 2026', range: '09:45'});
add('c4-01', 'timeline', 8, 'Chronology of the last decade', {focus: -1}, [{sfx: 'tick', at: 0.33}, {sfx: 'tick', at: 0.73}, {sfx: 'tick', at: 1.13}, {sfx: 'tick', at: 1.53}]);
add('c4-02', 'timeline', 11, '2017: Buy American, Hire American; RFEs shot up', {
  focus: 0,
  date: 'April 18, 2017',
  title: '“Buy American and Hire American” executive order',
  points: ['Executive Order 13788 directed tighter review of H-1B', 'H-1B Requests for Evidence rose from about 21% (FY2017) to 38% (FY2018)'],
  source: 'EO 13788 (Federal Register). RFE rates: USCIS data as analysed by KPMG and law firms.',
}, [{sfx: 'whoosh_soft', at: 0}]);
stock('c4-03', 'S-021', 7, 'Pandemic-era empty airports');
add('c4-04', 'timeline', 11, 'June 2020: proclamation suspends H-1B entry; a federal judge blocked it', {
  focus: 1,
  date: 'June 22, 2020',
  title: 'Pandemic proclamation suspends entry of new H-1B workers',
  points: ['Proclamation 10052 also covered L-1, H-2B and some J-1 visas', 'Oct 1, 2020: Judge Jeffrey White blocked it — for members of the plaintiff business groups only'],
  status: 'verified',
  statusLabel: 'Injunction was partial, not nationwide',
  source: 'Proclamation 10052; Nat’l Ass’n of Manufacturers v. DHS (N.D. Cal.), per Mayer Brown, Oct 6, 2020.',
}, [{sfx: 'whoosh_soft', at: 0}]);
stock('c4-04b', 'S-038', 6, 'Washington, 2025');
add('c4-05', 'timeline', 11, 'Sept 2025: Restriction on Entry order; $100,000 fee on new petitions (~₹85 lakh)', {
  focus: 2,
  date: 'September 19, 2025',
  title: '“Restriction on Entry of Certain Nonimmigrant Workers”',
  points: ['A $100,000 payment imposed on new H-1B petitions', 'Roughly ₹85–90 lakh at 2025 exchange rates', 'Took effect 12:01 a.m. ET, September 21, 2025'],
  source: 'Presidential proclamation of Sept 19, 2025, as summarised by McLane, Yale OISS and others.',
}, [{sfx: 'whoosh_soft', at: 0}, {sfx: 'impact_soft', at: 1.1, vol: 0.45}]);
ev('c4-06', 'E-10', 6, 'Fee announced', {status: 'reported'});
stock('c4-07', 'S-022', 7, 'The airport night', {sfx: [{sfx: 'amb_airport', at: 0, vol: 0.35}]});
add('c4-08', 'statement', 12, 'At SFO, Indian techies got off an Emirates flight to India; Delhi–US tickets hit lakhs', {
  kicker: 'San Francisco airport · Sept 2025',
  headline: 'Fearing they could not return, Indian passengers left an Emirates flight before take-off',
  bullets: ['The flight was delayed by about three hours (reported)', 'Delhi–New York one-way fares reportedly jumped from about ₹37,000 to ₹70,000–80,000 within hours'],
  status: 'reported',
  source: 'The Tribune, Reuters (via Khaleej Times), WION, Business Today. Reuters could not independently verify the video.',
  size: 60,
});
ev('c4-09', 'E-11', 6, 'SFO flight', {status: 'reported', note: 'Video circulated widely; passenger count varies by report.'});
ev('c4-10', 'E-12', 6, 'Fares', {status: 'reported'});
add('c4-11', 'statement', 9, 'White House: only new petitions, not existing holders', {
  kicker: 'Clarification · Sept 20, 2025',
  headline: 'The White House said the fee applied only to new petitions',
  body: 'Not to current visa holders or renewals. USCIS later issued written guidance.',
  status: 'reported',
});
add('c4-12', 'timeline', 12, 'June 2026: the court struck it down', {
  focus: 3,
  date: 'June 8, 2026',
  title: 'A federal judge ruled the fee unlawful',
  points: ['Judge Leo Sorokin (D. Mass.): Congress never authorised it; fee vacated', 'Government appealed; reports conflict on whether a stay applies', 'Sept 30, 2026: a California judge vacated a renewed version'],
  status: 'disputed',
  statusLabel: 'Litigation ongoing · not settled law',
  source: 'SHRM; Forbes (Oct 1, 2026); Univ. of Michigan International Center. Court records not opened from this environment.',
}, [{sfx: 'stamp', at: 0.9, vol: 0.4}]);
ev('c4-13', 'E-13', 7, 'Court ruling', {status: 'reported', note: 'Upgraded from the weak single source in the research file.'});
stock('c4-14', 'S-023', 6, 'One signature');
add('c4-15', 'statement', 13, '2026: May — Cloudera 180-day pause; Sept — Cognizant hold; Oct 8 — the Big 8', {
  kicker: '2026 · PERM enforcement',
  headline: 'Then PERM itself became the target',
  bullets: ['May 12 — Cloudera: PERM processing suspended for 180 days (DOL)', 'Sept 8 — Cognizant and Cloudera: filings suspended, announced by DOL Inspector General', 'Oct 8 — eight employers suspended from PERM'],
  source: 'DOL news release ETA 2026-05-12; Outlook India, Newsweek (Sept 2026). No company has been found liable.',
  size: 64,
}, [{sfx: 'tick', at: 0.8}, {sfx: 'tick', at: 1.13}, {sfx: 'tick', at: 1.46}]);
ev('c4-16', 'E-14', 7, 'Cloudera (official)', {status: 'official', note: 'Followed a DOJ complaint (Apr 28, 2026). An allegation, not a finding.'});
add('c4-17', 'statement', 9, 'NASSCOM Aug 2026: dependence fell; Wipro 80% local; Infosys raised local hiring', {
  kicker: 'Industry response',
  headline: 'Indian IT firms say they have cut H-1B dependence',
  bullets: ['NASSCOM (Aug 2026): H-1B employees at Indian firms in the U.S. fell sharply over five years', 'Wipro: more than 80% of its U.S. workforce is local', 'Infosys: most U.S. employees do not need visas'],
  source: 'PTI / Deccan Chronicle (Aug 25, 2026); Staffing Industry Analysts. Wipro statement date unconfirmed.',
  size: 62,
});
add('c4-18', 'statement', 5, 'Companies prepared; only the individual is trapped', {headline: 'The companies adapted. The individual worker was left inside the system.', align: 'center', size: 66});

/* ================================================================== */
/* CHAPTER 5  12:30 – 15:00                                            */
/* ================================================================== */
ch('ch5');
add('c5-00', 'chapter', 6, 'Chapter 5: The Silent Returnees', {num: '05', title: 'The silent returnees', sub: 'Hyderabad and Bengaluru', range: '12:30'});
stock('c5-01', 'S-024', 7, 'Hyderabad tech district', {sfx: [{sfx: 'amb_city', at: 0, vol: 0.3}]});
add('c5-02', 'statement', 9, 'Reverse migration: layoffs, AI automation, visa uncertainty', {
  kicker: 'Reverse migration',
  headline: 'More tech professionals are returning from the U.S. to Hyderabad and Bengaluru',
  bullets: ['Tech layoffs', 'Cuts linked to AI automation', 'Visa uncertainty'],
  source: 'ThePrint, Aug 2026.',
  size: 64,
});
ev('c5-03', 'E-15', 6, 'ThePrint report', {status: 'reported'});
add('c5-04', 'numbers', 10, 'Xpheno: 15,000+ IT professionals returned in 2025', {
  kicker: 'Talent firm Xpheno · estimate',
  stats: [{value: 15000, suffix: '+', label: 'IT professionals estimated to have returned from the U.S. to India in 2025'}],
  status: 'reported',
  statusLabel: 'Firm estimate',
  source: 'Xpheno, as reported by ThePrint (Aug 2026).',
}, [{sfx: 'blip', at: 0.7}]);
add('c5-05', 'numbers', 11, 'Blind survey: 53% saw colleagues return over visa issues', {
  kicker: 'Blind survey · June 2026',
  stats: [{value: 53, suffix: '%', label: 'of 1,276 verified tech professionals in India said they had seen reverse migration from the U.S. due to visa issues', tone: color.amber}],
  status: 'reported',
  statusLabel: 'Survey of platform users',
  source: 'Blind (fieldwork June 16–25, 2026), via ThePrint and Deccan Herald.',
}, [{sfx: 'blip', at: 0.7}]);
stock('c5-06', 'S-025', 7, 'Arrivals');
add('c5-07', 'profiles', 19, 'Three types of returnees', {
  kicker: 'Who is coming back',
  cards: [
    {who: 'Technical manager, Seattle', story: 'Laid off by Meta. Unable to find a new sponsor within the 60-day grace period, he returned and took a job in Hyderabad.', src: 'ThePrint, Aug 2026'},
    {who: 'Startup VP, Denver', story: 'Rose to vice-president level, then moved back to Hyderabad with his family after 15 years.', src: 'ThePrint, Aug 2026'},
    {who: 'Couple, 12 years at Microsoft', story: 'Visa restrictions and family health pressures led them to return voluntarily.', src: 'Business Today, Jan 11, 2026', flag: 'Return date unclear — may predate the 2025–26 wave'},
  ],
}, [{sfx: 'whoosh_soft', at: 0.3, vol: 0.6}, {sfx: 'whoosh_soft', at: 1.63, vol: 0.6}, {sfx: 'whoosh_soft', at: 2.96, vol: 0.6}]);
stock('c5-08', 'S-026', 7, 'Packing a life');
add('c5-09', 'statement', 9, 'The 60-day grace period pressure is real', {
  kicker: 'The 60-day grace period',
  headline: 'After a layoff, an H-1B worker generally has up to 60 days',
  body: 'To find a new sponsoring employer, change status, or leave the U.S. — whichever comes first, and never beyond the authorised stay.',
  source: '8 CFR 214.1(l)(2). Verify current guidance on uscis.gov.',
  size: 62,
});
stock('c5-10', 'S-027', 7, 'Dallas suburbs');
add('c5-11', 'verdict', 17, 'Viral claim: 10 Telugu families in Celina/Melissa abandoned homes and cars', {
  claim: 'Ten Telugu families who lost their jobs abandoned their houses and cars in Celina and Melissa and flew home.',
  origin: 'Social-media post and news videos, Dallas suburbs, Sept 2026',
  checks: [
    {k: 'ORIGIN', v: 'Social-media posts, repeated by several websites', tone: color.textDim},
    {k: 'VIRAL HOUSE VIDEO', v: 'No confirmation the family was on H-1B or left for immigration reasons', tone: color.amber},
    {k: 'INDEPENDENT EVIDENCE', v: 'None found that anyone abandoned homes and cars', tone: color.red},
  ],
  verdict: 'UNVERIFIED',
  source: 'Gulte (Sept 20, 2026); NewsKarnataka; Aman Shanti News.',
}, [{sfx: 'stamp', at: 4.0, vol: 0.55}]);
ev('c5-12', 'E-16', 7, 'Viral video report', {status: 'unverified', supports: 'The outlet itself notes there is no confirmation the family in the video was on an H-1B visa.'});
add('c5-13', 'statement', 11, 'Collin County home prices fell 9%', {
  kicker: 'A figure we could not verify',
  headline: '“Collin County home prices fell 9%”',
  body: 'This figure circulated secondhand, attributed to Bloomberg and Redfin. We could not locate the original report, so we are not presenting it as fact.',
  status: 'unverified',
  size: 66,
});
stock('c5-14', 'S-028', 7, 'Panic');
add('c5-15', 'statement', 10, 'Grace-period pressure is real, but unverified viral videos create even more dangerous panic', {
  headline: 'The pressure on laid-off workers is real.',
  body: 'Unverified viral videos add panic that ordinary families do not need.',
  size: 74,
});

/* ================================================================== */
/* CHAPTER 6  15:00 – 17:15                                            */
/* ================================================================== */
ch('ch6');
add('c6-00', 'chapter', 6, 'Chapter 6: The Trap of Shortcuts – Farmington University', {num: '06', title: 'The trap of shortcuts', sub: 'The University of Farmington', range: '15:00'});
add('c6-01', 'statement', 7, 'Visa desperation leads to another big trap: illegal shortcuts', {headline: 'Desperation creates a second trap: illegal shortcuts.', align: 'center', size: 76});
stock('c6-02', 'S-029', 7, 'A university building');
add('c6-03', 'statement', 11, 'A Michigan university with a website and admissions — no classes, no professors: a DHS sting', {
  kicker: 'Farmington Hills, Michigan',
  headline: 'The “University of Farmington” had a website and admissions — but no classes and no teachers',
  body: 'It was an undercover sting run by Homeland Security Investigations.',
  size: 62,
});
stock('c6-03b', 'S-039', 6, 'An empty lecture hall');
ev('c6-04', 'E-17', 6, 'Fox / Detroit Free Press', {status: 'reported'});
add('c6-05', 'numbers', 12, '600 enrolled; 130 arrested in first round, 129 Indian; 34 detention centres', {
  kicker: 'The sting in numbers · 2019',
  stats: [
    {value: 600, label: 'students enrolled when it closed'},
    {value: 130, label: 'arrested by early Feb 2019 — 129 from India', tone: color.amber},
    {value: 250, prefix: '~', label: 'arrested in total by late 2019', tone: color.red},
  ],
  source: 'ICE figures via Detroit Free Press / Fox and Michigan Advance. Many students were from the Telugu states (reported). “34 detention centres” could not be confirmed.',
}, [{sfx: 'blip', at: 0.7}, {sfx: 'blip', at: 1.13}, {sfx: 'blip', at: 1.6}]);
add('c6-06', 'statement', 9, 'Lured with Day-1 CPT: full-time work while keeping F-1', {
  kicker: 'The lure',
  headline: '“Day-1 CPT”: full-time work while keeping F-1 student status',
  bullets: ['Prosecutors: students knew there were no classes', 'Students’ lawyers: entrapment — the school was listed on a DHS website', 'Eight recruiters were charged with federal conspiracy'],
  size: 60,
});
ev('c6-07', 'E-18', 6, 'Government’s position', {status: 'disputed', note: 'This headline states the government’s position. Students and their lawyers disputed it.'});
stock('c6-08', 'S-030', 7, 'Consequences');
add('c6-09', 'risks', 9, 'Three kinds of fraud', {active: 0, headline: 'Not every case is the same — and not every victim is guilty.'}, [{sfx: 'whoosh_soft', at: 0.2}]);
add('c6-10', 'risks', 10, 'Employer fraud: fake client projects, benching; NJ staffing owners charged', {
  active: 1,
  headline: 'Fake client projects, workers kept on the “bench”',
  points: ['2019, New Jersey: four staffing executives charged with visa-fraud conspiracy over jobs that allegedly did not exist', 'Two were reported to be of Telugu origin'],
  status: 'reported',
  statusLabel: 'Charges are allegations',
});
ev('c6-11', 'E-19', 5, 'NJ case', {status: 'reported', note: 'Outcome of the case not confirmed in our research.'});
stock('c6-11b', 'S-040', 6, 'Passport control');
add('c6-12', 'risks', 10, 'Applicant mistakes: fake experience letters → 5-year or permanent bans', {
  active: 2,
  headline: 'Fake experience letters and forged papers',
  points: ['Refused at a U.S. port and removed: generally a five-year re-entry bar', 'A finding of fraud or wilful misrepresentation: permanent inadmissibility, with only narrow waivers'],
  source: 'INA 212(a)(9)(A) and 212(a)(6)(C)(i); USCIS Policy Manual Vol. 8, Part J.',
});
add('c6-13', 'risks', 8, 'Innocent victims: fake Hyderabad agencies take lakhs with sponsorship promises', {
  active: 3,
  headline: 'Fake agencies that take money for false promises',
  points: ['May 2023: Rachakonda police busted a fake U.S. immigration consultancy in Secunderabad; four arrested', 'Police said it used forged sponsor letters and documents'],
});
ev('c6-14', 'E-21', 5, 'Hyderabad bust', {status: 'reported'});
add('c6-15', 'statement', 5, 'A website doesn’t make a university real; shortcuts destroy careers', {headline: 'A website does not make a university real.', align: 'center', size: 84});

/* ================================================================== */
/* CHAPTER 7  17:15 – 20:00                                            */
/* ================================================================== */
ch('ch7');
add('c7-00', 'chapter', 6, 'Chapter 7: The Reality Check & Your Survival Guide', {num: '07', title: 'The reality check', sub: 'and a survival guide', range: '17:15'});
add('c7-01', 'perspectives', 19, 'Two viewpoints: US and Indian', {
  sides: [
    {k: 'The U.S. view', tone: color.blue, points: ['Jobs should go to American workers first', 'Companies must not use cheaper foreign labour to push wages down', 'Where there is fraud, it must stop']},
    {k: 'The Indian view', tone: color.amber, points: ['Indian talent has been central to Silicon Valley innovation, tax revenue and tech growth', 'Targeting workers who queued legally for years, in the name of investigations, is unfair']},
  ],
}, [{sfx: 'whoosh_soft', at: 0.2}, {sfx: 'whoosh_soft', at: 3.0}]);
ev('c7-02', 'E-22', 6, 'Indian perspective (opinion)', {status: 'opinion', supports: 'Argues the companies were penalised before any finding of wrongdoing.'});
stock('c7-03', 'S-031', 7, 'A student planning today');
add('c7-04', 'statement', 6, 'Investigations will conclude; meanwhile, six practical checkpoints', {headline: 'Investigations will run their course. If you plan to study in the U.S., here are six checkpoints.', align: 'center', size: 62});
const cp = (n: number, title: string, points: string[], official: string[]) =>
  add(`c7-cp${n}`, 'checkpoint', 16, `Checkpoint ${n}`, {n, title, points, official}, [{sfx: 'tick', at: 0.6}, {sfx: 'click', at: 2.4, vol: 0.3}]);
cp(1, 'Selection is not a promise', ['H-1B selection is chance-based, not a reward for talent', 'Before taking a ₹50-lakh-scale loan, know how you would repay it if you are not selected'], ['uscis.gov — H-1B cap season']);
stock('c7-cp1b', 'S-041', 6, 'Choosing a university');
cp(2, 'Check accreditation and legitimacy', ['Be wary of colleges selling “Day-1 CPT”', 'Choose schools with real classrooms and real faculty', 'SEVP certification alone is not accreditation — Farmington was listed'], ['studyinthestates.dhs.gov — school search', 'ope.ed.gov/dapip — accreditation database']);
cp(3, 'Verify the employer', ['Is there a written offer and a stated base salary?', 'Is there a real client project?', 'Walk away from consultancies that ask you to pay H-1B sponsorship costs'], ['dol.gov/agencies/whd — H-1B worker protections', 'flag.dol.gov — LCA disclosure data']);
stock('c7-cp3b', 'S-042', 6, 'Documents on the table');
cp(4, 'Never submit false documents', ['No fake experience letters, no fake bank statements', 'One misrepresentation finding can close U.S. doors permanently'], ['uscis.gov — Policy Manual, Vol. 8, Part J']);
cp(5, 'Accept the green card reality', ['For many Indian applicants the queue runs for decades', 'Plan family and long-term career moves with that in mind'], ['travel.state.gov — monthly Visa Bulletin']);
cp(6, 'Verify advice through official sources', ['Trust USCIS, the Department of Labor and qualified immigration lawyers', 'Do not make decisions on the strength of viral reels'], ['uscis.gov · dol.gov · travel.state.gov', 'A licensed immigration attorney or DOJ-accredited representative']);
stock('c7-05', 'S-032', 7, 'A family, prepared');
add('c7-06', 'checkgrid', 6, 'Recap of the six', {
  items: ['Selection is not a promise', 'Check accreditation', 'Verify the employer', 'No false documents', 'Accept the green card reality', 'Verify advice officially'],
});

/* ================================================================== */
/* OUTRO  20:00 – 21:00                                                */
/* ================================================================== */
ch('outro');
stock('o01', 'S-033', 8, 'The broad highway of ten years ago', {sfx: [{sfx: 'amb_road', at: 0, vol: 0.35}]});
add('o02', 'highway', 15, 'The H-1B dream hasn’t stopped; the broad highway has become a very narrow bridge', {
  lineA: 'The H-1B dream has not ended.',
  lineB: 'But the broad highway of ten years ago is now a narrow bridge.',
}, [{sfx: 'whoosh_low', at: 2.3, vol: 0.6}]);
stock('o03', 'S-034', 7, 'The bridge');
add('o04', 'statement', 11, 'Hard work, talent and the ethical path protect us; America isn’t all of life; Plan A, bulletproof Plan B', {
  headline: 'Hard work, talent and an ethical path will always protect you.',
  body: 'America is great — but America is not all of life. Prepare for Plan A. Always build a bulletproof Plan B.',
  size: 70,
});
add('o05', 'statement', 8, 'What do your friends and family in the US feel? What’s your Plan B? Comment', {
  kicker: 'Tell us in the comments',
  headline: 'How are your friends and family in the U.S. feeling? If you are planning a U.S. master’s — what is your Plan B?',
  size: 58,
});
add('o06', 'endcard', 11, 'Subscribe to Info Geeks, share, see you next video', {}, [{sfx: 'click', at: 2.4, vol: 0.5}]);

export const SCENES = S;
