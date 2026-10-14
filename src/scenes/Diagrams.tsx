import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, progress, reveal} from '../anim';
import {Body, GraphicScene, Headline, Kicker, Rule, SourceNote, Status, StatusBadge} from '../components/ui';
import {color, font} from '../theme';

/* ------------------------------------------------------------------ */
/* Two-column comparison (H-1B vs PERM).                                */
/* ------------------------------------------------------------------ */
export const Comparison: React.FC<{
  kicker: string;
  cols: {title: string; tag: string; tone: string; rows: string[]}[];
  source?: string;
}> = ({kicker, cols, source}) => {
  const frame = useCurrentFrame();
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', gap: 34, paddingTop: 20}}>
        <Kicker>{kicker}</Kicker>
        <div style={{display: 'flex', gap: 60, marginTop: 10}}>
          {cols.map((c, ci) => (
            <div key={c.title} style={{flex: 1, ...reveal(frame, 8 + ci * 40, 22, 30)}}>
              <div style={{fontFamily: font.mono, fontSize: 22, letterSpacing: 4, color: c.tone}}>{c.tag}</div>
              <div style={{fontFamily: font.serif, fontSize: 96, fontWeight: 600, margin: '12px 0 22px'}}>{c.title}</div>
              <div style={{height: 3, background: c.tone, width: `${progress(frame, 14 + ci * 40, 30) * 100}%`}} />
              <div style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
                {c.rows.map((r, ri) => (
                  <div
                    key={ri}
                    style={{
                      fontSize: 31,
                      lineHeight: 1.35,
                      color: color.textDim,
                      padding: '22px 0',
                      borderBottom: `1px solid ${color.line}`,
                      ...reveal(frame, 26 + ci * 40 + ri * 9),
                    }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {source && <SourceNote at={110}>{source}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Linear process flow with nodes and connecting line.                 */
/* ------------------------------------------------------------------ */
export const ProcessFlow: React.FC<{
  kicker: string;
  headline: string;
  steps: {t: string; d: string; hl?: boolean}[];
  source?: string;
}> = ({kicker, headline, steps, source}) => {
  const frame = useCurrentFrame();
  const per = 22;
  const line = progress(frame, 24, per * steps.length, (x) => x);
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 30}}>
        <Kicker>{kicker}</Kicker>
        <Headline size={58}>{headline}</Headline>
        <div style={{position: 'relative', marginTop: 70}}>
          <div style={{position: 'absolute', top: 23, left: 24, right: 24, height: 2, background: color.line}} />
          <div
            style={{position: 'absolute', top: 23, left: 24, height: 2, width: `calc((100% - 48px) * ${line})`, background: color.blue}}
          />
          <div style={{display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 30}}>
            {steps.map((s, i) => {
              const at = 24 + i * per;
              const p = progress(frame, at, 14);
              const tone = s.hl ? color.amber : color.blue;
              return (
                <div key={i} style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      border: `2px solid ${tone}`,
                      background: p > 0.5 ? tone : color.bg,
                      transform: `scale(${0.6 + p * 0.4})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: font.mono,
                      fontSize: 18,
                      color: p > 0.5 ? color.bg : tone,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{opacity: p}}>
                    <div style={{fontSize: 32, fontWeight: 600, lineHeight: 1.2, color: s.hl ? color.amber : color.text}}>{s.t}</div>
                    <div style={{fontSize: 24, lineHeight: 1.4, color: color.textDim, marginTop: 10}}>{s.d}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {source && <SourceNote at={40}>{source}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Gate metaphor: H-1B work continues; PERM gate closed for 8 firms.   */
/* ------------------------------------------------------------------ */
export const GateDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const walk = progress(frame, 20, 70, easeInOut);
  const gate = progress(frame, 80, 14);
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, paddingTop: 20}}>
        <Kicker>What changes for a worker at one of the eight companies</Kicker>
        <svg viewBox="0 0 1640 420" style={{width: '100%', marginTop: 30}}>
          <line x1="40" y1="210" x2="1600" y2="210" stroke={color.line} strokeWidth="3" />
          <line x1="40" y1="210" x2={40 + 1000 * walk} y2="210" stroke={color.blue} strokeWidth="5" />
          {/* H-1B zone */}
          <rect x="40" y="120" width="760" height="180" fill={color.blue} opacity="0.08" />
          <text x="60" y="100" fill={color.blue} fontFamily="JetBrains Mono" fontSize="22" letterSpacing="3">
            H-1B STATUS · CONTINUES
          </text>
          {/* Gate */}
          <g transform="translate(1060 0)">
            <rect x="0" y="80" width="14" height="260" fill={color.textDim} />
            <rect x="0" y="80" width={260 * gate} height="22" fill={color.red} />
            <rect x={0} y="190" width={260 * gate} height="40" rx="4" fill={color.red} opacity={gate} />
            <text x="130" y="218" textAnchor="middle" fill={color.bg} fontFamily="Inter" fontWeight="700" fontSize="26" opacity={gate}>
              STOP
            </text>
            <text x="20" y="380" fill={color.red} fontFamily="JetBrains Mono" fontSize="22" letterSpacing="3" opacity={gate}>
              PERM · SUSPENDED FOR 8 EMPLOYERS
            </text>
          </g>
          <text x="1600" y="180" textAnchor="end" fill={color.textMute} fontFamily="Inter" fontSize="28">
            Green card
          </text>
          {/* Worker dot */}
          <circle cx={40 + 1000 * walk} cy="210" r="18" fill={color.text} />
        </svg>
        <div style={{display: 'flex', gap: 60, marginTop: 10}}>
          <div style={{flex: 1, ...reveal(frame, 40)}}>
            <div style={{fontSize: 34, fontWeight: 600, color: color.green}}>✓ Can keep working on H-1B</div>
            <div style={{fontSize: 26, color: color.textDim, marginTop: 10}}>Existing H-1B status is not cancelled by this action.</div>
          </div>
          <div style={{flex: 1, ...reveal(frame, 96)}}>
            <div style={{fontSize: 34, fontWeight: 600, color: color.red}}>✕ Cannot start or advance PERM with these employers</div>
            <div style={{fontSize: 26, color: color.textDim, marginTop: 10}}>New filings not accepted; pending cases not processed, per the Oct 8 briefing.</div>
          </div>
        </div>
      </div>
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Washington -> Hyderabad arc.                                         */
/* ------------------------------------------------------------------ */
export const MapArc: React.FC<{headline: string; sub: string}> = ({headline, sub}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, 16, 60, easeInOut);
  const A = {x: 300, y: 330};
  const B = {x: 1340, y: 420};
  const C = {x: 820, y: 40};
  const len = 1300;
  const ripple = (frame - 76) / 30;
  return (
    <GraphicScene grid={false}>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <svg viewBox="0 0 1640 560" style={{width: '100%', marginTop: 10}}>
          {/* dotted latitude lines to suggest a map without drawing borders */}
          {Array.from({length: 9}, (_, i) => (
            <line key={i} x1="0" x2="1640" y1={60 + i * 60} y2={60 + i * 60} stroke={color.lineSoft} strokeDasharray="2 10" />
          ))}
          <path
            d={`M ${A.x} ${A.y} Q ${C.x} ${C.y} ${B.x} ${B.y}`}
            fill="none"
            stroke={color.amber}
            strokeWidth="3"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - p)}
          />
          <circle cx={A.x} cy={A.y} r="10" fill={color.blue} />
          <text x={A.x} y={A.y + 50} textAnchor="middle" fill={color.text} fontFamily="Inter" fontSize="30" fontWeight="600">
            Washington, D.C.
          </text>
          <circle cx={B.x} cy={B.y} r="10" fill={color.amber} opacity={p > 0.98 ? 1 : 0} />
          {ripple > 0 &&
            [0, 0.33, 0.66].map((o) => {
              const r = ((ripple + o) % 1) * 90;
              return <circle key={o} cx={B.x} cy={B.y} r={r} fill="none" stroke={color.amber} opacity={1 - r / 90} strokeWidth="2" />;
            })}
          <text x={B.x} y={B.y + 50} textAnchor="middle" fill={color.text} fontFamily="Inter" fontSize="30" fontWeight="600" opacity={p > 0.98 ? 1 : 0}>
            Hyderabad
          </text>
          <text x={C.x} y={C.y + 150} textAnchor="middle" fill={color.amber} fontFamily="JetBrains Mono" fontSize="26" opacity={progress(frame, 50, 20)}>
            ≈ 13,000 KM
          </text>
        </svg>
        <Headline at={60} size={60} style={{marginTop: 10}}>
          {headline}
        </Headline>
        <Body at={74}>{sub}</Body>
      </div>
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* The four-rung ladder. `active` highlights a rung; 0 = build all.    */
/* ------------------------------------------------------------------ */
const RUNGS = [
  {t: 'Engineering degree in India', d: 'B.Tech in Hyderabad, Vijayawada or a smaller town'},
  {t: 'U.S. master’s, often loan-funded', d: 'Land sold or an education loan taken'},
  {t: 'OPT work and the H-1B draw', d: 'Work on OPT while trying for H-1B selection'},
  {t: 'Green card and a settled life', d: 'File for permanent residency, buy a home, settle the children'},
];

export const Ladder: React.FC<{
  active: number;
  headline?: string;
  detail?: string;
  facts?: string[];
  status?: Status;
  statusLabel?: string;
  source?: string;
}> = ({active, headline, detail, facts, status, statusLabel, source}) => {
  const frame = useCurrentFrame();
  const build = active === 0;
  return (
    <GraphicScene>
      <div style={{display: 'flex', height: '100%', gap: 90, alignItems: 'center', paddingBottom: source ? 50 : 0}}>
        {/* Ladder graphic */}
        <svg viewBox="0 0 520 820" style={{height: 800, flex: '0 0 auto'}}>
          {[110, 410].map((x, i) => (
            <line
              key={i}
              x1={x}
              x2={x}
              y1={800}
              y2={800 - 780 * (build ? progress(frame, 4, 30, easeInOut) : 1)}
              stroke={color.textDim}
              strokeWidth="6"
            />
          ))}
          {RUNGS.map((r, i) => {
            const y = 690 - i * 190;
            const on = build ? progress(frame, 24 + i * 16, 14) : 1;
            const isActive = i + 1 === active;
            const done = active > 0 && i + 1 < active;
            const tone = isActive ? color.amber : done ? color.blue : color.line;
            return (
              <g key={i} opacity={on}>
                <rect x="110" y={y - 8} width="300" height="16" fill={tone} />
                <circle cx="260" cy={y - 56} r="26" fill={isActive ? color.amber : color.bg} stroke={tone} strokeWidth="3" />
                <text x="260" y={y - 47} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="24" fill={isActive ? color.bg : tone}>
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
        {/* Copy */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 28}}>
          {build ? (
            <>
              <Kicker>The four-rung ladder</Kicker>
              <Headline size={64}>{headline}</Headline>
              <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 10}}>
                {RUNGS.map((r, i) => (
                  <div key={i} style={{fontSize: 30, color: color.textDim, ...reveal(frame, 30 + i * 16)}}>
                    <span style={{fontFamily: font.mono, color: color.blue, marginRight: 18}}>{i + 1}</span>
                    {r.t}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <Kicker tone={color.amber}>Rung {active} of 4</Kicker>
              <Headline size={70}>{headline ?? RUNGS[active - 1].t}</Headline>
              <Body>{detail ?? RUNGS[active - 1].d}</Body>
              {facts && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6}}>
                  {facts.map((f, i) => (
                    <div key={i} style={{fontSize: 27, color: color.text, borderLeft: `3px solid ${color.blue}`, paddingLeft: 20, ...reveal(frame, 34 + i * 10)}}>
                      {f}
                    </div>
                  ))}
                </div>
              )}
              {status && (
                <div>
                  <StatusBadge status={status} label={statusLabel} at={50} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {source && <SourceNote at={50}>{source}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Policy timeline 2017-2026. `focus` = index of event in detail.      */
/* ------------------------------------------------------------------ */
export const TIMELINE = [
  {y: '2017', t: 'Buy American, Hire American'},
  {y: '2020', t: 'Pandemic entry ban'},
  {y: '2025', t: '$100,000 fee proclamation'},
  {y: '2026', t: 'Fee ruled unlawful; PERM actions'},
];

export const TimelineScene: React.FC<{
  focus: number; // -1 = overview
  date?: string;
  title?: string;
  points?: string[];
  status?: Status;
  statusLabel?: string;
  source?: string;
}> = ({focus, date, title, points, status, statusLabel, source}) => {
  const frame = useCurrentFrame();
  const overview = focus < 0;
  const draw = overview ? progress(frame, 6, 50, easeInOut) : 1;
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: source ? 60 : 0}}>
        {/* axis */}
        <div style={{position: 'relative', height: 150, marginTop: overview ? 260 : 30}}>
          <div style={{position: 'absolute', top: 66, left: 0, height: 2, width: `${draw * 100}%`, background: color.line}} />
          {TIMELINE.map((e, i) => {
            const x = (i / (TIMELINE.length - 1)) * 100;
            const on = overview ? progress(frame, 10 + i * 12, 14) : 1;
            const isF = i === focus;
            const tone = isF ? color.amber : overview ? color.blue : i < focus ? color.blue : color.textMute;
            const edge = i === 0 ? 'flex-start' : i === TIMELINE.length - 1 ? 'flex-end' : 'center';
            const shift = i === 0 ? 0 : i === TIMELINE.length - 1 ? -100 : -50;
            const dot = isF ? 22 : 14;
            return (
              <div key={e.y} style={{position: 'absolute', left: `${x}%`, top: 0, transform: `translateX(${shift}%)`, opacity: on, display: 'flex', flexDirection: 'column', alignItems: edge, width: 320}}>
                <div style={{fontFamily: font.mono, fontSize: isF ? 34 : 26, color: tone, height: 44}}>{e.y}</div>
                <div style={{width: dot, height: dot, borderRadius: dot / 2, background: tone, marginTop: 16 - dot / 2 + 7}} />
                {overview && <div style={{fontSize: 26, color: color.textDim, marginTop: 22, textAlign: i === 0 ? 'left' : i === TIMELINE.length - 1 ? 'right' : 'center'}}>{e.t}</div>}
              </div>
            );
          })}
        </div>
        {!overview && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 26, marginTop: 70}}>
            <Kicker tone={color.amber} at={6}>
              {date}
            </Kicker>
            <Headline size={66}>{title}</Headline>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              {points?.map((p, i) => (
                <div key={i} style={{fontSize: 30, lineHeight: 1.4, color: color.textDim, borderLeft: `3px solid ${color.line}`, paddingLeft: 22, ...reveal(frame, 24 + i * 12)}}>
                  {p}
                </div>
              ))}
            </div>
            {status && (
              <div>
                <StatusBadge status={status} label={statusLabel} at={30 + (points?.length ?? 0) * 12} />
              </div>
            )}
          </div>
        )}
        {overview && (
          <Headline at={40} size={56} style={{marginTop: 120}}>
            A decade of tightening, in order
          </Headline>
        )}
      </div>
      {source && <SourceNote at={40}>{source}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Profile cards (returnee examples).                                   */
/* ------------------------------------------------------------------ */
export const ProfileCards: React.FC<{
  kicker: string;
  cards: {who: string; story: string; src: string; flag?: string}[];
}> = ({kicker, cards}) => {
  const frame = useCurrentFrame();
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', gap: 40, paddingTop: 40}}>
        <Kicker>{kicker}</Kicker>
        <div style={{display: 'flex', gap: 36}}>
          {cards.map((c, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                minHeight: 600,
                border: `1px solid ${color.line}`,
                background: '#14171bd9',
                padding: 40,
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                ...reveal(frame, 10 + i * 40, 22, 30),
              }}
            >
              <div style={{fontFamily: font.mono, fontSize: 20, color: color.blue}}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{fontFamily: font.serif, fontSize: 44, fontWeight: 600, lineHeight: 1.12}}>{c.who}</div>
              <div style={{fontSize: 28, lineHeight: 1.45, color: color.textDim, flex: 1}}>{c.story}</div>
              {c.flag && <div style={{fontSize: 22, lineHeight: 1.4, color: color.amber}}>{c.flag}</div>}
              <div style={{fontFamily: font.mono, fontSize: 18, color: color.textMute, borderTop: `1px solid ${color.line}`, paddingTop: 16}}>{c.src}</div>
            </div>
          ))}
        </div>
      </div>
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Viral-claim verdict card.                                            */
/* ------------------------------------------------------------------ */
export const VerdictCard: React.FC<{
  claim: string;
  origin: string;
  checks: {k: string; v: string; tone: string}[];
  verdict: string;
  source?: string;
}> = ({claim, origin, checks, verdict, source}) => {
  const frame = useCurrentFrame();
  const stamp = progress(frame, 120, 12);
  return (
    <GraphicScene accent="#5a1f12">
      <div style={{display: 'flex', gap: 70, height: '100%', alignItems: 'center', paddingBottom: 50}}>
        <div style={{flex: '0 0 760px', position: 'relative'}}>
          <Kicker tone={color.red}>Viral claim</Kicker>
          <div style={{fontFamily: font.serif, fontSize: 54, lineHeight: 1.18, fontStyle: 'italic', marginTop: 30, color: color.textDim, ...reveal(frame, 10)}}>
            “{claim}”
          </div>
          <div style={{fontSize: 24, color: color.textMute, marginTop: 26, ...reveal(frame, 20)}}>{origin}</div>
          <div
            style={{
              position: 'absolute',
              right: 10,
              bottom: -110,
              border: `5px solid ${color.red}`,
              color: color.red,
              fontFamily: font.mono,
              fontWeight: 700,
              fontSize: 48,
              letterSpacing: 6,
              padding: '10px 26px',
              transform: `rotate(-8deg) scale(${1.6 - stamp * 0.6})`,
              opacity: stamp,
            }}
          >
            {verdict}
          </div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 22}}>
          {checks.map((c, i) => (
            <div key={i} style={{borderLeft: `3px solid ${c.tone}`, paddingLeft: 24, ...reveal(frame, 40 + i * 22)}}>
              <div style={{fontFamily: font.mono, fontSize: 20, color: c.tone, letterSpacing: 2}}>{c.k}</div>
              <div style={{fontSize: 28, lineHeight: 1.4, color: color.text, marginTop: 8}}>{c.v}</div>
            </div>
          ))}
        </div>
      </div>
      {source && <SourceNote at={60}>{source}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Three risk categories. `active` 0 = overview of all three.          */
/* ------------------------------------------------------------------ */
const RISKS = [
  {n: 'Employer fraud', who: 'Fraudulent sponsors', icon: 'M10 30 h40 v24 h-40z M18 30 v-8 h24 v8'},
  {n: 'Applicant misrepresentation', who: 'False documents', icon: 'M16 8 h22 l10 10 v38 h-32z M38 8 v10 h10'},
  {n: 'Fake consultancies', who: 'Victims of scams', icon: 'M30 8 a22 22 0 1 0 0.1 0 M30 18 v14 M30 40 v4'},
];

export const RiskCards: React.FC<{
  active: number;
  headline?: string;
  points?: string[];
  status?: Status;
  statusLabel?: string;
  source?: string;
}> = ({active, headline, points, status, statusLabel, source}) => {
  const frame = useCurrentFrame();
  return (
    <GraphicScene accent="#4a2414">
      <div style={{display: 'flex', flexDirection: 'column', gap: 34, height: '100%', paddingBottom: source ? 60 : 0}}>
        <Kicker tone={color.amber}>Three kinds of risk</Kicker>
        <div style={{display: 'flex', gap: 30}}>
          {RISKS.map((r, i) => {
            const isA = active === i + 1;
            const dim = active > 0 && !isA;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: active === 0 ? 420 : 170,
                  border: `1px solid ${isA ? color.amber : color.line}`,
                  background: isA ? '#2a1d10' : '#14171bd9',
                  padding: 30,
                  display: 'flex',
                  flexDirection: active === 0 ? 'column' : 'row',
                  alignItems: active === 0 ? 'flex-start' : 'center',
                  gap: 24,
                  opacity: (dim ? 0.4 : 1) * progress(frame, 6 + (active === 0 ? i * 16 : 0), 16),
                }}
              >
                <svg viewBox="0 0 60 60" style={{width: active === 0 ? 90 : 60, flex: '0 0 auto'}}>
                  <path d={r.icon} fill="none" stroke={isA || active === 0 ? color.amber : color.textMute} strokeWidth="3" />
                </svg>
                <div>
                  <div style={{fontFamily: font.mono, fontSize: 20, color: color.textMute}}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{fontFamily: font.serif, fontSize: active === 0 ? 50 : 36, fontWeight: 600, lineHeight: 1.1, marginTop: 6}}>{r.n}</div>
                  {active === 0 && <div style={{fontSize: 28, color: color.textDim, marginTop: 14}}>{r.who}</div>}
                </div>
              </div>
            );
          })}
        </div>
        {active > 0 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 10}}>
            <Headline size={56}>{headline}</Headline>
            {points?.map((p, i) => (
              <div key={i} style={{fontSize: 30, lineHeight: 1.4, color: color.textDim, borderLeft: `3px solid ${color.amber}`, paddingLeft: 22, ...reveal(frame, 26 + i * 12)}}>
                {p}
              </div>
            ))}
            {status && (
              <div>
                <StatusBadge status={status} label={statusLabel} at={36 + (points?.length ?? 0) * 12} />
              </div>
            )}
          </div>
        )}
        {active === 0 && <Headline at={60} size={52}>{headline}</Headline>}
      </div>
      {source && <SourceNote at={50}>{source}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Two perspectives, side by side.                                      */
/* ------------------------------------------------------------------ */
export const Perspectives: React.FC<{sides: {k: string; tone: string; points: string[]}[]; source?: string}> = ({sides, source}) => {
  const frame = useCurrentFrame();
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 20}}>
        <Kicker>Two viewpoints</Kicker>
        <div style={{display: 'flex', gap: 0, marginTop: 20}}>
          {sides.map((s, si) => (
            <div key={si} style={{flex: 1, padding: si ? '0 0 0 60px' : '0 60px 0 0', borderLeft: si ? `1px solid ${color.line}` : 'none'}}>
              <div style={{fontFamily: font.serif, fontSize: 64, fontWeight: 600, color: s.tone, ...reveal(frame, 8 + si * 90)}}>{s.k}</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 26, marginTop: 36}}>
                {s.points.map((p, i) => (
                  <div key={i} style={{fontSize: 31, lineHeight: 1.4, color: color.textDim, ...reveal(frame, 24 + si * 90 + i * 16)}}>
                    <span style={{color: s.tone, marginRight: 14}}>—</span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {source && <SourceNote at={200}>{source}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Checkpoint card (six-step survival guide).                           */
/* ------------------------------------------------------------------ */
export const Checkpoint: React.FC<{n: number; title: string; points: string[]; official: string[]}> = ({
  n,
  title,
  points,
  official,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const tick = progress(frame, 18, 16);
  return (
    <GraphicScene>
      <div style={{display: 'flex', height: '100%', gap: 90}}>
        <div style={{flex: '0 0 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{fontFamily: font.mono, fontSize: 24, color: color.blue, letterSpacing: 4, ...reveal(frame, 2)}}>CHECKPOINT</div>
          <div style={{fontFamily: font.serif, fontSize: 280, fontWeight: 600, lineHeight: 1, color: color.text, ...reveal(frame, 4, 22, 40)}}>{n}</div>
          <div style={{display: 'flex', gap: 10, marginTop: 20}}>
            {Array.from({length: 6}, (_, i) => (
              <div key={i} style={{width: 34, height: 6, background: i < n ? color.blue : color.line, opacity: i === n - 1 ? tick : 1}} />
            ))}
          </div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30}}>
          <Headline size={72} at={10}>
            {title}
          </Headline>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
            {points.map((p, i) => (
              <div key={i} style={{fontSize: 32, lineHeight: 1.4, color: color.textDim, display: 'flex', gap: 20, ...reveal(frame, 26 + i * 14)}}>
                <span style={{color: color.blue}}>→</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              padding: '22px 28px',
              border: `1px solid ${color.line}`,
              background: '#12151a',
              opacity: progress(frame, 26 + points.length * 14 + 10, 18),
            }}
          >
            <div style={{fontFamily: font.mono, fontSize: 19, color: color.green, letterSpacing: 3}}>CHECK WITH OFFICIAL SOURCES</div>
            {official.map((o, i) => (
              <div key={i} style={{fontFamily: font.mono, fontSize: 22, color: color.text, marginTop: 10}}>
                {o}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 4,
          background: color.blue,
          width: `${interpolate(frame, [0, durationInFrames], [0, 100])}%`,
          opacity: 0.5,
        }}
      />
    </GraphicScene>
  );
};

export const CheckpointGrid: React.FC<{items: string[]}> = ({items}) => {
  const frame = useCurrentFrame();
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', gap: 40, paddingTop: 30}}>
        <Kicker>The six checkpoints</Kicker>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26}}>
          {items.map((t, i) => (
            <div key={i} style={{border: `1px solid ${color.line}`, background: '#14171bd9', padding: 34, height: 290, ...reveal(frame, 8 + i * 8)}}>
              <div style={{fontFamily: font.serif, fontSize: 80, fontWeight: 600, color: color.blue, lineHeight: 1}}>{i + 1}</div>
              <div style={{fontSize: 34, fontWeight: 600, marginTop: 24, lineHeight: 1.25}}>{t}</div>
            </div>
          ))}
        </div>
      </div>
    </GraphicScene>
  );
};

export {Rule};
