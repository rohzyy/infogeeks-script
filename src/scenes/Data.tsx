import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {countUp, easeInOut, progress, reveal} from '../anim';
import {Body, GraphicScene, Headline, Kicker, Rule, SourceNote, Status, StatusBadge} from '../components/ui';
import {color, font} from '../theme';

/* ------------------------------------------------------------------ */
/* One to three headline figures with labels.                          */
/* ------------------------------------------------------------------ */
export const BigNumbers: React.FC<{
  kicker: string;
  headline?: string;
  stats: {value: number; prefix?: string; suffix?: string; label: string; tone?: string}[];
  status?: Status;
  statusLabel?: string;
  source?: string;
}> = ({kicker, headline, stats, status, statusLabel, source}) => {
  const frame = useCurrentFrame();
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 40, paddingBottom: 70}}>
        <Kicker>{kicker}</Kicker>
        {headline && <Headline size={58}>{headline}</Headline>}
        <div style={{display: 'flex', gap: 80, marginTop: 20}}>
          {stats.map((s, i) => {
            const at = 20 + i * 14;
            return (
              <div key={i} style={{flex: 1, borderTop: `2px solid ${s.tone ?? color.blue}`, paddingTop: 30, ...reveal(frame, at)}}>
                <div style={{fontFamily: font.serif, fontSize: stats.length > 2 ? 120 : 150, fontWeight: 600, lineHeight: 1, letterSpacing: -2}}>
                  {s.prefix}
                  {countUp(frame, at, 40, s.value)}
                  {s.suffix}
                </div>
                <div style={{fontSize: 30, color: color.textDim, marginTop: 22, lineHeight: 1.35}}>{s.label}</div>
              </div>
            );
          })}
        </div>
        {status && <StatusBadge status={status} label={statusLabel} at={60} />}
      </div>
      {source && <SourceNote at={50}>{source}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Horizontal share bars (FY2024 H-1B approvals by country of birth).  */
/* ------------------------------------------------------------------ */
export const BarStat: React.FC<{
  kicker: string;
  headline: string;
  bars: {label: string; pct: number; tone?: string; note?: string}[];
  source: string;
}> = ({kicker, headline, bars, source}) => {
  const frame = useCurrentFrame();
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 40}}>
        <Kicker>{kicker}</Kicker>
        <Headline size={62}>{headline}</Headline>
        <div style={{display: 'flex', flexDirection: 'column', gap: 34, marginTop: 40}}>
          {bars.map((b, i) => {
            const at = 24 + i * 12;
            const w = progress(frame, at, 40, easeInOut);
            return (
              <div key={b.label} style={{display: 'flex', alignItems: 'center', gap: 30}}>
                <div style={{width: 260, fontSize: 32, color: color.textDim, textAlign: 'right'}}>{b.label}</div>
                <div style={{flex: 1, height: 64, background: '#ffffff08', position: 'relative'}}>
                  <div style={{position: 'absolute', inset: 0, width: `${b.pct * w}%`, background: b.tone ?? color.blueDeep}} />
                </div>
                <div style={{width: 160, fontFamily: font.serif, fontSize: 54, fontWeight: 600}}>{Math.round(b.pct * w)}%</div>
              </div>
            );
          })}
        </div>
      </div>
      <SourceNote at={60}>{source}</SourceNote>
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* The annual cap: 65,000 + 20,000 = 85,000 blocks.                    */
/* ------------------------------------------------------------------ */
export const CapDiagram: React.FC<{source: string}> = ({source}) => {
  const frame = useCurrentFrame();
  // 85 blocks, each = 1,000 visas: 65 regular (blue), 20 master's (amber).
  const blocks = Array.from({length: 85}, (_, i) => i);
  return (
    <GraphicScene>
      <div style={{display: 'flex', height: '100%', gap: 90, alignItems: 'center', paddingBottom: 40}}>
        <div style={{flex: '0 0 640px', display: 'flex', flexDirection: 'column', gap: 30}}>
          <Kicker>The annual cap</Kicker>
          <Headline size={64}>85,000 new cap-subject H-1B visas a year</Headline>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 10}}>
            <Legend tone={color.blue} at={40} label="65,000 regular cap" />
            <Legend tone={color.amber} at={70} label="20,000 for U.S. master's degree or higher" />
          </div>
          <Body at={110} size={28}>
            FY2027: USCIS announced on July 17, 2026 that both caps had been reached. Applicants number in the hundreds of thousands.
          </Body>
        </div>
        <div style={{flex: 1, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10}}>
          {blocks.map((i) => {
            const at = i < 65 ? 30 + i * 0.6 : 66 + (i - 65) * 1.2;
            const p = progress(frame, at, 12);
            return (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  background: i < 65 ? color.blue : color.amber,
                  opacity: p * (i < 65 ? 0.85 : 0.95),
                  transform: `scale(${0.6 + p * 0.4})`,
                  borderRadius: 3,
                }}
              />
            );
          })}
          <div style={{gridColumn: '1 / -1', fontFamily: font.mono, fontSize: 18, color: color.textMute, marginTop: 8}}>
            Each square = 1,000 visas
          </div>
        </div>
      </div>
      <SourceNote at={60}>{source}</SourceNote>
    </GraphicScene>
  );
};

const Legend: React.FC<{tone: string; label: string; at: number}> = ({tone, label, at}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, ...reveal(frame, at)}}>
      <div style={{width: 22, height: 22, background: tone, borderRadius: 3}} />
      {label}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Registration pool -> selection funnel.                              */
/* ------------------------------------------------------------------ */
export const LotteryPool: React.FC<{source: string}> = ({source}) => {
  const frame = useCurrentFrame();
  const dots = Array.from({length: 340}, (_, i) => i);
  const sel = progress(frame, 70, 50, easeInOut);
  return (
    <GraphicScene>
      <div style={{display: 'flex', height: '100%', gap: 80, alignItems: 'center', paddingBottom: 40}}>
        <div style={{flex: '0 0 620px', display: 'flex', flexDirection: 'column', gap: 28}}>
          <Kicker>Selection</Kicker>
          <Headline size={60}>Talent alone does not guarantee a visa</Headline>
          <Body at={30} size={29}>
            FY2026: 343,981 eligible registrations competed for the 85,000 cap. FY2027: about 211,600 registrations.
          </Body>
          <Body at={60} size={29} style={{color: color.text}}>
            From FY2027 the draw is wage-weighted: higher wage levels get more entries. It is still a chance-based selection, not a merit ranking.
          </Body>
        </div>
        <div style={{flex: 1, position: 'relative', height: 640}}>
          {dots.map((i) => {
            const x = random(`x${i}`) * 100;
            const y = random(`y${i}`) * 100;
            const chosen = random(`c${i}`) < 0.25;
            const appear = progress(frame, 8 + random(`a${i}`) * 40, 12);
            const fadeLoser = chosen ? 1 : 1 - sel * 0.82;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: chosen ? interpolateColor(sel) : color.textMute,
                  opacity: appear * fadeLoser,
                  transform: `scale(${chosen ? 1 + sel * 0.25 : 1})`,
                }}
              />
            );
          })}
          <div
            style={{
              position: 'absolute',
              bottom: -50,
              left: 0,
              fontFamily: font.mono,
              fontSize: 18,
              color: color.textMute,
              opacity: progress(frame, 100, 20),
            }}
          >
            Illustrative: roughly one in four FY2026 eligible registrations would fit under the cap
          </div>
        </div>
      </div>
      <SourceNote at={60}>{source}</SourceNote>
    </GraphicScene>
  );
};

const interpolateColor = (p: number) => (p > 0.5 ? color.blue : color.textMute);

/* ------------------------------------------------------------------ */
/* Per-country limit: same 7% ceiling regardless of demand.            */
/* ------------------------------------------------------------------ */
export const CountryCap: React.FC<{source: string}> = ({source}) => {
  const frame = useCurrentFrame();
  const rows = [
    {c: 'India', demand: 100, tone: color.amber},
    {c: 'China', demand: 26, tone: color.blue},
    {c: 'Philippines', demand: 8, tone: color.blue},
    {c: 'A smaller country', demand: 3, tone: color.blue},
  ];
  const capX = 22; // where the 7% ceiling sits on the demand scale (illustrative)
  const line = progress(frame, 60, 26);
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 30}}>
        <Kicker>The per-country limit</Kicker>
        <Headline size={58}>No country may receive more than 7% of employment-based green cards in a year</Headline>
        <div style={{position: 'relative', marginTop: 80, display: 'flex', flexDirection: 'column', gap: 26}}>
          {rows.map((r, i) => {
            const w = progress(frame, 20 + i * 8, 36, easeInOut);
            return (
              <div key={r.c} style={{display: 'flex', alignItems: 'center', gap: 28}}>
                <div style={{width: 280, textAlign: 'right', fontSize: 30, color: color.textDim}}>{r.c}</div>
                <div style={{flex: 1, height: 54, position: 'relative'}}>
                  <div style={{position: 'absolute', inset: 0, width: `${r.demand * w}%`, background: r.tone, opacity: 0.22}} />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: `${Math.min(r.demand, capX) * w}%`,
                      background: r.tone,
                      opacity: 0.9,
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: `calc(308px + (100% - 308px) * ${capX / 100})`,
              top: -20,
              bottom: -20,
              width: 3,
              background: color.red,
              transformOrigin: 'top',
              transform: `scaleY(${line})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `calc(324px + (100% - 308px) * ${capX / 100})`,
              top: -56,
              fontFamily: font.mono,
              fontSize: 20,
              color: color.red,
              opacity: line,
            }}
          >
            7% PER-COUNTRY CEILING
          </div>
        </div>
        <div style={{display: 'flex', gap: 50, marginTop: 30, ...reveal(frame, 90)}}>
          <div style={{fontSize: 26, color: color.textDim}}>
            <span style={{display: 'inline-block', width: 18, height: 18, background: color.amber, marginRight: 12}} />
            Green cards available under the limit
          </div>
          <div style={{fontSize: 26, color: color.textDim}}>
            <span style={{display: 'inline-block', width: 18, height: 18, background: color.amber, opacity: 0.22, marginRight: 12}} />
            Demand that waits in the backlog
          </div>
        </div>
      </div>
      <SourceNote at={70}>{source}</SourceNote>
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Backlog composition: 1.1M of 1.8M cases from India.                 */
/* ------------------------------------------------------------------ */
export const BacklogQueue: React.FC<{source: string}> = ({source}) => {
  const frame = useCurrentFrame();
  const people = Array.from({length: 180}, (_, i) => i); // 1 figure = 10,000 cases
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, paddingTop: 30}}>
        <Kicker>The employment-based backlog</Kicker>
        <Headline size={58}>About 1.1 million of 1.8 million backlogged cases were from India</Headline>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: 9, marginTop: 40}}>
          {people.map((i) => {
            const p = progress(frame, 20 + i * 0.35, 10);
            const india = i < 110;
            return (
              <svg key={i} viewBox="0 0 20 30" style={{width: '100%', opacity: p}}>
                <circle cx="10" cy="6" r="5" fill={india ? color.amber : color.textMute} />
                <rect x="3" y="13" width="14" height="16" rx="5" fill={india ? color.amber : color.textMute} />
              </svg>
            );
          })}
        </div>
        <div style={{display: 'flex', gap: 60, ...reveal(frame, 90)}}>
          <div style={{fontSize: 28}}>
            <span style={{color: color.amber, fontFamily: font.serif, fontSize: 48, fontWeight: 600}}>63%</span>
            <span style={{color: color.textDim, marginLeft: 14}}>India</span>
          </div>
          <div style={{fontSize: 24, color: color.textMute, alignSelf: 'center'}}>One figure ≈ 10,000 cases · backlog counts from early 2023</div>
        </div>
      </div>
      <SourceNote at={60}>{source}</SourceNote>
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Projection vs individual wait.                                       */
/* ------------------------------------------------------------------ */
export const Projection: React.FC<{source: string}> = ({source}) => {
  const frame = useCurrentFrame();
  const w = progress(frame, 30, 60, easeInOut);
  const years = Math.round(interpolate(w, [0, 1], [0, 134]));
  return (
    <GraphicScene accent="#5a3a12">
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 30}}>
        <Kicker tone={color.amber}>A projection, not a measured wait</Kicker>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 30, ...reveal(frame, 14)}}>
          <div style={{fontFamily: font.serif, fontSize: 210, fontWeight: 600, lineHeight: 1, color: color.amber}}>{years}</div>
          <div style={{fontSize: 48, fontFamily: font.serif}}>years</div>
        </div>
        <Body at={30} size={32} style={{maxWidth: 1400, color: color.text}}>
          Cato Institute&apos;s 2023 estimate of how long the EB-2/EB-3 backlog would take to clear for a new Indian applicant at current annual limits.
        </Body>
        <div style={{position: 'relative', height: 40, marginTop: 20}}>
          <div style={{position: 'absolute', inset: '18px 0', background: color.line}} />
          <div style={{position: 'absolute', left: 0, top: 14, height: 12, width: `${w * 100}%`, background: color.amber}} />
          {[0, 25, 50, 75, 100, 134].map((y) => (
            <div key={y} style={{position: 'absolute', left: `${(y / 134) * 100}%`, top: 40, fontFamily: font.mono, fontSize: 18, color: color.textMute, transform: 'translateX(-50%)'}}>
              {y}
            </div>
          ))}
        </div>
        <div style={{display: 'flex', gap: 40, marginTop: 50}}>
          <div style={{flex: 1, borderLeft: `3px solid ${color.amber}`, paddingLeft: 24, ...reveal(frame, 80)}}>
            <div style={{fontSize: 22, fontFamily: font.mono, color: color.amber}}>WHAT IT IS</div>
            <div style={{fontSize: 28, color: color.textDim, marginTop: 10}}>A modelled clearance time for the queue as a whole</div>
          </div>
          <div style={{flex: 1, borderLeft: `3px solid ${color.red}`, paddingLeft: 24, ...reveal(frame, 96)}}>
            <div style={{fontSize: 22, fontFamily: font.mono, color: color.red}}>WHAT IT IS NOT</div>
            <div style={{fontSize: 28, color: color.textDim, marginTop: 10}}>Any one person&apos;s actual wait, which depends on category, priority date and policy changes</div>
          </div>
        </div>
      </div>
      <SourceNote at={70}>{source}</SourceNote>
    </GraphicScene>
  );
};

export {Rule};
