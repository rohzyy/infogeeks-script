import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as I from 'lucide-react';
import {Cutout, Dark, Drift, Label, Mark, Paper, PopWords, Scraps, SourceTag, Stamp, p, pop} from './kit';
import {VoxMap, MapProps} from './Map';
import {vc, vf} from './theme';

const Icon: React.FC<{name: keyof typeof I; size?: number; color?: string; stroke?: number}> = ({name, size = 80, color = vc.ink, stroke = 2}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const C = I[name] as any;
  return <C size={size} color={color} strokeWidth={stroke} />;
};

const Center: React.FC<{children: React.ReactNode; gap?: number; pad?: string}> = ({children, gap = 40, pad = '0 140px'}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap, padding: pad}}>{children}</AbsoluteFill>
);

/* ------------------------------------------------------------ */
export const Chapter: React.FC<{n: string; title: string; sub?: string}> = ({n, title, sub}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, fps, 0, 120);
  return (
    <Dark glow="#4a3410">
      <Drift amount={0.06}>
        <Center gap={10}>
          <div style={{fontFamily: vf.cond, fontWeight: 700, fontSize: 380, lineHeight: 0.9, color: vc.yellow, transform: `scale(${1.4 - 0.4 * s})`, opacity: s}}>{n}</div>
          <PopWords text={title} at={8} size={104} color="#fff" />
          {sub && <div style={{fontFamily: vf.mono, fontSize: 30, color: '#bdb6a6', letterSpacing: 4, marginTop: 24, opacity: p(f, 26, 12)}}>{sub.toUpperCase()}</div>}
        </Center>
      </Drift>
    </Dark>
  );
};

/* ------------------------------------------------------------ */
export const Statement: React.FC<{text: string; kicker?: string; dark?: boolean; size?: number; source?: string; stamp?: string; icon?: keyof typeof I}> = ({text, kicker, dark, size = 92, source, stamp, icon}) => {
  const f = useCurrentFrame();
  const Bg = dark ? Dark : Paper;
  return (
    <Bg>
      {!dark && <Scraps seed={text} />}
      <Drift>
        <Center gap={34}>
          {icon && <div style={{opacity: p(f, 0, 10), transform: `translateY(${(1 - p(f, 0, 14)) * 30}px)`}}><Icon name={icon} size={120} color={dark ? vc.yellow : vc.red} stroke={2.2} /></div>}
          {kicker && <Label color={dark ? vc.yellow : vc.red} size={30}>{kicker}</Label>}
          <PopWords text={text} at={4} size={size} color={dark ? '#fff' : vc.ink} />
          {stamp && <div style={{marginTop: 20}}><Stamp text={stamp} at={22} /></div>}
        </Center>
      </Drift>
      {source && <SourceTag dark={dark}>{source}</SourceTag>}
    </Bg>
  );
};

/* ------------------------------------------------------------ */
export const YearSlam: React.FC<{year: string; line: string; icon?: keyof typeof I; dark?: boolean}> = ({year, line, icon, dark = true}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, fps, 0, 200);
  const Bg = dark ? Dark : Paper;
  return (
    <Bg>
      <Drift amount={0.07}>
        <Center gap={20}>
          <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
            {icon && <div style={{opacity: s}}><Icon name={icon} size={150} color={vc.yellow} /></div>}
            <div style={{fontFamily: vf.cond, fontWeight: 700, fontSize: 300, color: dark ? '#fff' : vc.ink, lineHeight: 0.95, transform: `scale(${1.5 - 0.5 * s})`, opacity: s}}>{year}</div>
          </div>
          <PopWords text={line} at={8} size={64} color={dark ? '#eee6d4' : vc.ink} weight={700} />
        </Center>
      </Drift>
    </Bg>
  );
};

/* ------------------------------------------------------------ */
export const Doc: React.FC<{
  header: string;
  title: string;
  lines: string[];
  hl?: number[];
  stamp?: string;
  stampColor?: string;
  date?: string;
  source?: string;
  side?: string; // optional big side caption
}> = ({header, title, lines, hl = [], stamp, stampColor, date, source, side}) => {
  const f = useCurrentFrame();
  return (
    <Paper tone={vc.paperDeep}>
      <Drift amount={0.08}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 90, padding: '0 120px'}}>
          <Cutout at={0} rot={-2.2} w={860} torn seed={title}>
            <div style={{padding: '60px 64px 70px', fontFamily: vf.serif, color: vc.ink}}>
              <div style={{fontFamily: vf.mono, fontSize: 20, letterSpacing: 4, color: vc.inkMute, borderBottom: `2px solid ${vc.ink}`, paddingBottom: 14}}>{header}</div>
              {date && <div style={{fontFamily: vf.mono, fontSize: 20, color: vc.inkSoft, marginTop: 16}}>{date}</div>}
              <div style={{fontSize: 46, fontWeight: 700, lineHeight: 1.18, margin: '22px 0 30px'}}>{title}</div>
              {lines.map((l, i) => (
                <div key={i} style={{fontSize: 27, lineHeight: 1.55, marginBottom: 14, opacity: p(f, 10 + i * 6, 10)}}>
                  {hl.includes(i) ? <Mark at={22 + i * 6}>{l}</Mark> : <span style={{color: vc.inkSoft}}>{l}</span>}
                </div>
              ))}
            </div>
            {stamp && (
              <div style={{position: 'absolute', right: 40, bottom: 50}}>
                <Stamp text={stamp} at={30} color={stampColor} />
              </div>
            )}
          </Cutout>
          {side && (
            <div style={{maxWidth: 640}}>
              <PopWords text={side} at={18} size={72} align="left" />
            </div>
          )}
        </AbsoluteFill>
      </Drift>
      {source && <SourceTag>{source}</SourceTag>}
    </Paper>
  );
};

/* ------------------------------------------------------------ */
export const MapBeat: React.FC<MapProps & {caption?: string; kicker?: string; source?: string}> = ({caption, kicker, source, ...m}) => {
  const f = useCurrentFrame();
  return (
    <Paper>
      <VoxMap {...m} />
      {(caption || kicker) && (
        <div style={{position: 'absolute', left: 90, top: 80, maxWidth: 820}}>
          <Cutout at={6} rot={-1.2} bg={vc.ink}>
            <div style={{padding: '26px 34px'}}>
              {kicker && <Label color={vc.yellow} size={22}>{kicker}</Label>}
              {caption && <div style={{fontFamily: vf.head, fontWeight: 800, fontSize: 48, color: '#fff', lineHeight: 1.12, marginTop: kicker ? 10 : 0, opacity: p(f, 10, 10)}}>{caption}</div>}
            </div>
          </Cutout>
        </div>
      )}
      {source && <SourceTag>{source}</SourceTag>}
    </Paper>
  );
};

/* ------------------------------------------------------------ */
export const BigNumber: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  kicker?: string;
  dark?: boolean;
  source?: string;
  stamp?: string;
  icon?: keyof typeof I;
  sub?: string;
}> = ({value, prefix = '', suffix = '', label, kicker, dark, source, stamp, icon, sub}) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [4, 34], [0, value], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)}));
  const Bg = dark ? Dark : Paper;
  return (
    <Bg>
      <Drift amount={0.06}>
        <Center gap={18}>
          {kicker && <Label color={dark ? vc.yellow : vc.red} size={30}>{kicker}</Label>}
          <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
            {icon && <Icon name={icon} size={170} color={dark ? vc.yellow : vc.red} stroke={1.8} />}
            <div style={{fontFamily: vf.cond, fontWeight: 700, fontSize: 290, lineHeight: 1, color: dark ? '#fff' : vc.ink}}>
              {prefix}
              {v.toLocaleString('en-US')}
              {suffix}
            </div>
          </div>
          <div style={{maxWidth: 1400}}>
            <PopWords text={label} at={14} size={54} weight={700} color={dark ? '#eee6d4' : vc.ink} />
          </div>
          {sub && <div style={{fontFamily: vf.mono, fontSize: 26, color: dark ? '#b9b2a3' : vc.inkSoft, opacity: p(f, 30, 12)}}>{sub}</div>}
          {stamp && <Stamp text={stamp} at={36} size={48} />}
        </Center>
      </Drift>
      {source && <SourceTag dark={dark}>{source}</SourceTag>}
    </Bg>
  );
};

/* ------------------------------------------------------------ */
export const Money: React.FC<{source?: string}> = ({source}) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [6, 40], [0, 100000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)}));
  return (
    <Paper>
      <Drift>
        {/* falling bills */}
        {Array.from({length: 18}, (_, i) => {
          const x = random(`bx${i}`) * 1920;
          const d = random(`bd${i}`) * 30;
          const y = interpolate(f - d, [0, 90], [-200, 1200], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y, transform: `rotate(${random(`br${i}`) * 80 - 40 + f * (random(`bs${i}`) - 0.5) * 4}deg)`, opacity: 0.85}}>
              <div style={{width: 150, height: 66, background: '#9fbf8a', border: '3px solid #5f7f4f', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: vf.cond, fontSize: 34, color: '#2f4f25', boxShadow: '0 6px 10px #00000030'}}>$</div>
            </div>
          );
        })}
        <Center gap={14}>
          <Label color={vc.red} size={30}>New H-1B petitions · Sept 2025</Label>
          <div style={{fontFamily: vf.cond, fontWeight: 700, fontSize: 300, lineHeight: 1, color: vc.ink, background: vc.paper, padding: '0 30px'}}>${v.toLocaleString('en-US')}</div>
          <div style={{fontFamily: vf.head, fontWeight: 800, fontSize: 56, opacity: p(f, 36, 10)}}>
            ≈ <Mark at={42}>₹85–90 lakh</Mark> per petition
          </div>
        </Center>
      </Drift>
      {source && <SourceTag>{source}</SourceTag>}
    </Paper>
  );
};

/* ------------------------------------------------------------ */
export const Fare: React.FC<{source?: string}> = ({source}) => {
  const f = useCurrentFrame();
  const h1 = 180;
  const h2 = interpolate(f, [24, 50], [180, 400], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
  return (
    <Paper>
      <Drift>
        <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 110, padding: '0 140px'}}>
          <div style={{maxWidth: 620}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: p(f, 0, 10)}}>
              <Icon name="Plane" size={70} color={vc.red} />
              <Label size={28} color={vc.red}>Delhi → New York · one way</Label>
            </div>
            <div style={{marginTop: 26}}>
              <PopWords text="Fares nearly *doubled* within hours" at={6} size={84} align="left" />
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 60, height: 520}}>
            {[
              {h: h1, v: '₹37,000', l: 'Before', c: vc.inkMute},
              {h: h2, v: '₹70–80K', l: 'Hours later', c: vc.red},
            ].map((b, i) => (
              <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: p(f, 8 + i * 14, 10)}}>
                <div style={{fontFamily: vf.cond, fontSize: 56, fontWeight: 700, color: b.c}}>{b.v}</div>
                <div style={{width: 220, height: b.h, background: b.c, boxShadow: '0 12px 20px #00000030'}} />
                <Label size={22}>{b.l}</Label>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Drift>
      {source && <SourceTag>{source}</SourceTag>}
    </Paper>
  );
};

/* ------------------------------------------------------------ */
/** Airport: plane on the tarmac, passengers walking off. */
export const Deplane: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Dark glow="#14324a">
      <Drift amount={0.05}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 0, right: 0, top: 640, height: 4, background: '#3a3a3a'}} />
          <div style={{position: 'absolute', left: 300, top: 300, opacity: p(f, 0, 10)}}>
            <Icon name="Plane" size={440} color="#d9d2c2" stroke={1.2} />
          </div>
          {Array.from({length: 6}, (_, i) => {
            const st = 16 + i * 9;
            const x = interpolate(f, [st, st + 70], [820, 1080 + i * 120], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const bob = Math.abs(Math.sin((f - st) / 4)) * 8;
            return (
              <div key={i} style={{position: 'absolute', left: x, top: 470 - bob, opacity: f > st ? 1 : 0}}>
                <Icon name="PersonStanding" size={170} color={vc.yellow} stroke={2.2} />
              </div>
            );
          })}
          <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center'}}>
            <PopWords text="San Francisco airport: Indian passengers *walked off* an Emirates flight" at={4} size={64} color="#fff" maxWidth={1500} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, display: 'flex', justifyContent: 'center'}}>
            <div style={{fontFamily: vf.mono, fontSize: 30, color: '#d9d2c2', opacity: p(f, 40, 12)}}>Afraid they would not be allowed back into the U.S.</div>
          </div>
        </AbsoluteFill>
      </Drift>
      <SourceTag dark>Reported by The Tribune, Reuters, Khaleej Times (Sept 2025). Reuters could not independently verify the video.</SourceTag>
    </Dark>
  );
};

/* ------------------------------------------------------------ */
export const Timeline26: React.FC<{source?: string}> = ({source}) => {
  const f = useCurrentFrame();
  const items = [
    {d: 'MAY 12', t: 'Cloudera', s: 'PERM paused 180 days'},
    {d: 'SEPT 8', t: 'Cognizant', s: 'PERM filings suspended'},
    {d: 'OCT 8', t: 'The Big 8', s: 'Suspended from PERM'},
  ];
  return (
    <Paper>
      <Drift>
        <AbsoluteFill style={{padding: '130px 140px'}}>
          <PopWords text="2026: the *green card step* itself becomes the target" size={70} align="left" maxWidth={1500} />
          <div style={{position: 'relative', marginTop: 120}}>
            <div style={{position: 'absolute', top: 40, left: 0, height: 6, background: vc.ink, width: `${p(f, 10, 50) * 100}%`}} />
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              {items.map((it, i) => (
                <div key={i} style={{width: 460, opacity: p(f, 18 + i * 16, 10), transform: `translateY(${(1 - p(f, 18 + i * 16, 14)) * 30}px)`}}>
                  <div style={{width: 46, height: 46, borderRadius: 23, background: i === 2 ? vc.red : vc.ink, marginTop: 20}} />
                  <div style={{fontFamily: vf.mono, fontSize: 28, color: vc.red, marginTop: 26}}>{it.d}</div>
                  <div style={{fontFamily: vf.head, fontWeight: 900, fontSize: 70, lineHeight: 1}}>{it.t}</div>
                  <div style={{fontFamily: vf.head, fontSize: 34, color: vc.inkSoft, marginTop: 10}}>{it.s}</div>
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </Drift>
      {source && <SourceTag>{source}</SourceTag>}
    </Paper>
  );
};

/* ------------------------------------------------------------ */
export const Bars: React.FC<{kicker: string; title: string; bars: {l: string; v: number; c?: string; t?: string}[]; source?: string}> = ({kicker, title, bars, source}) => {
  const f = useCurrentFrame();
  const max = Math.max(...bars.map((b) => b.v));
  return (
    <Paper>
      <Drift>
        <AbsoluteFill style={{padding: '120px 160px', gap: 40}}>
          <Label color={vc.red} size={28}>{kicker}</Label>
          <PopWords text={title} at={2} size={70} align="left" maxWidth={1500} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 34, marginTop: 30}}>
            {bars.map((b, i) => {
              const w = p(f, 14 + i * 8, 30);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30}}>
                  <div style={{width: 300, fontFamily: vf.head, fontWeight: 700, fontSize: 36, textAlign: 'right'}}>{b.l}</div>
                  <div style={{height: 84, width: `${(b.v / max) * 62 * w}%`, background: b.c ?? vc.ink, boxShadow: '0 8px 14px #00000025'}} />
                  <div style={{fontFamily: vf.cond, fontWeight: 700, fontSize: 64, opacity: w}}>{b.t ?? b.v}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Drift>
      {source && <SourceTag>{source}</SourceTag>}
    </Paper>
  );
};

/* ------------------------------------------------------------ */
/** Icon array: `total` icons, the first `hi` highlighted. */
export const IconArray: React.FC<{total: number; hi: number; per?: number; icon?: keyof typeof I; title: string; legend: string; legend2?: string; source?: string; dark?: boolean}> = ({
  total,
  hi,
  per = 1,
  icon = 'User',
  title,
  legend,
  legend2,
  source,
  dark,
}) => {
  const f = useCurrentFrame();
  const n = Math.round(total / per);
  const h = Math.round(hi / per);
  const cols = n <= 100 ? 20 : 24;
  const Bg = dark ? Dark : Paper;
  return (
    <Bg>
      <Drift>
        <AbsoluteFill style={{padding: '90px 180px', gap: 34, justifyContent: 'center'}}>
          <PopWords text={title} size={70} align="left" color={dark ? '#fff' : vc.ink} maxWidth={1600} />
          <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4, marginTop: 10}}>
            {Array.from({length: n}, (_, i) => {
              const on = i < h && f > 30 + i * 0.6;
              const s = p(f, 6 + i * 0.25, 6);
              return (
                <div key={i} style={{opacity: s, transform: `scale(${0.5 + 0.5 * s})`}}>
                  <Icon name={icon} size={n <= 100 ? 66 : 54} color={on ? vc.red : dark ? '#6f6a60' : '#a39a86'} stroke={2.4} />
                </div>
              );
            })}
          </div>
          <div style={{display: 'flex', gap: 60, fontFamily: vf.head, fontSize: 32, fontWeight: 700, color: dark ? '#fff' : vc.ink, opacity: p(f, 40, 12)}}>
            <span><span style={{color: vc.red}}>■</span> {legend}</span>
            {legend2 && <span style={{color: dark ? '#b9b2a3' : vc.inkSoft}}>{legend2}</span>}
          </div>
        </AbsoluteFill>
      </Drift>
      {source && <SourceTag dark={dark}>{source}</SourceTag>}
    </Bg>
  );
};

/* ------------------------------------------------------------ */
export const Profiles: React.FC<{cards: {icon: keyof typeof I; who: string; story: string; flag?: string}[]; source?: string; focus?: number}> = ({cards, source, focus = -1}) => {
  const f = useCurrentFrame();
  return (
    <Paper>
      <Drift>
        <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 44, padding: '0 110px'}}>
          {cards.map((c, i) => {
            const dim = focus >= 0 && i !== focus;
            return (
              <Cutout key={i} at={focus >= 0 ? 0 : i * 10} rot={[-2, 1.5, -1][i]} w={520} style={{opacity: dim ? 0.35 : 1}}>
                <div style={{padding: 44, minHeight: 600, display: 'flex', flexDirection: 'column', gap: 22}}>
                  <div style={{width: 120, height: 120, borderRadius: 60, background: i === focus || focus < 0 ? vc.yellow : '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name={c.icon} size={70} />
                  </div>
                  <div style={{fontFamily: vf.head, fontWeight: 900, fontSize: 44, lineHeight: 1.08}}>{c.who}</div>
                  <div style={{fontFamily: vf.serif, fontSize: 27, lineHeight: 1.5, color: vc.inkSoft}}>{c.story}</div>
                  {c.flag && (
                    <div style={{fontFamily: vf.mono, fontSize: 20, color: vc.red, borderTop: `2px dashed ${vc.red}`, paddingTop: 12, opacity: p(f, 20, 10)}}>{c.flag}</div>
                  )}
                </div>
              </Cutout>
            );
          })}
        </AbsoluteFill>
      </Drift>
      {source && <SourceTag>{source}</SourceTag>}
    </Paper>
  );
};

/* ------------------------------------------------------------ */
export const ViralPost: React.FC<{text: string; stamp?: string; side?: string; source?: string}> = ({text, stamp, side, source}) => {
  const f = useCurrentFrame();
  const likes = Math.round(interpolate(f, [0, 80], [1200, 48000], {extrapolateRight: 'clamp'}));
  return (
    <Dark glow="#4a1810">
      <Drift amount={0.06}>
        <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 100}}>
          <Cutout at={0} rot={2} w={640} bg="#fff">
            <div style={{padding: 34, fontFamily: vf.head}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <div style={{width: 64, height: 64, borderRadius: 32, background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="User" size={40} color="#777" /></div>
                <div>
                  <div style={{fontWeight: 800, fontSize: 26}}>Viral post</div>
                  <div style={{fontSize: 20, color: '#777'}}>Shared widely · Sept 2026</div>
                </div>
              </div>
              <div style={{fontSize: 34, lineHeight: 1.35, margin: '24px 0', fontWeight: 600}}>{text}</div>
              <div style={{display: 'flex', gap: 30, fontSize: 22, color: '#666'}}>
                <span>♥ {likes.toLocaleString('en-US')}</span>
                <span>↻ {Math.round(likes / 6).toLocaleString('en-US')}</span>
              </div>
            </div>
            {stamp && (
              <div style={{position: 'absolute', left: 120, top: 200}}>
                <Stamp text={stamp} at={34} size={78} rot={-14} />
              </div>
            )}
          </Cutout>
          {side && (
            <div style={{maxWidth: 680}}>
              <PopWords text={side} at={20} size={66} color="#fff" align="left" />
            </div>
          )}
        </AbsoluteFill>
      </Drift>
      {source && <SourceTag dark>{source}</SourceTag>}
    </Dark>
  );
};

/* ------------------------------------------------------------ */
export const Folders: React.FC<{active: number; title?: string; points?: string[]; source?: string}> = ({active, title, points, source}) => {
  const f = useCurrentFrame();
  const items: {n: string; icon: keyof typeof I}[] = [
    {n: 'Employer fraud', icon: 'Building2'},
    {n: 'Applicant mistakes', icon: 'FileWarning'},
    {n: 'Innocent victims', icon: 'ShieldAlert'},
  ];
  return (
    <Paper>
      <Drift>
        <AbsoluteFill style={{padding: '110px 140px', gap: 40}}>
          <div style={{display: 'flex', gap: 34}}>
            {items.map((it, i) => {
              const on = active === 0 || active === i + 1;
              return (
                <Cutout key={i} at={active === 0 ? i * 8 : 0} rot={[-1.5, 1, -0.5][i]} w={520} bg={active === i + 1 ? vc.yellow : vc.card} style={{opacity: on ? 1 : 0.35}}>
                  <div style={{padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 22}}>
                    <Icon name={it.icon} size={64} />
                    <div>
                      <div style={{fontFamily: vf.mono, fontSize: 20, color: vc.inkSoft}}>TYPE {i + 1}</div>
                      <div style={{fontFamily: vf.head, fontWeight: 900, fontSize: 40}}>{it.n}</div>
                    </div>
                  </div>
                </Cutout>
              );
            })}
          </div>
          {title && (
            <div style={{marginTop: 50}}>
              <PopWords text={title} at={8} size={72} align="left" maxWidth={1600} />
            </div>
          )}
          {points && (
            <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 10}}>
              {points.map((pt, i) => (
                <div key={i} style={{fontFamily: vf.serif, fontSize: 34, lineHeight: 1.4, color: vc.inkSoft, opacity: p(f, 20 + i * 10, 10), borderLeft: `6px solid ${vc.red}`, paddingLeft: 24}}>{pt}</div>
              ))}
            </div>
          )}
        </AbsoluteFill>
      </Drift>
      {source && <SourceTag>{source}</SourceTag>}
    </Paper>
  );
};

/* ------------------------------------------------------------ */
export const Split: React.FC<{left: {k: string; pts: string[]}; right: {k: string; pts: string[]}; focus?: 'left' | 'right'}> = ({left, right, focus}) => {
  const f = useCurrentFrame();
  const cols = [
    {...left, c: vc.blue, map: 'United States of America'},
    {...right, c: '#d9822b', map: 'India'},
  ];
  return (
    <Paper>
      <AbsoluteFill style={{flexDirection: 'row'}}>
        {cols.map((c, i) => {
          const dim = focus && ((focus === 'left' && i === 1) || (focus === 'right' && i === 0));
          return (
            <div key={i} style={{flex: 1, padding: '110px 80px', background: i ? '#f3e2c8' : '#dfe6ec', opacity: dim ? 0.4 : 1, transform: `translateY(${(1 - p(f, i * 6, 16)) * (i ? 80 : -80)}px)`}}>
              <div style={{fontFamily: vf.head, fontWeight: 900, fontSize: 84, color: c.c}}>{c.k}</div>
              <div style={{height: 8, width: 160, background: c.c, margin: '20px 0 40px'}} />
              {c.pts.map((pt, j) => (
                <div key={j} style={{fontFamily: vf.serif, fontSize: 42, lineHeight: 1.4, marginBottom: 30, opacity: p(f, 14 + j * 10 + i * 6, 10)}}>
                  {pt}
                </div>
              ))}
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 130, height: 130, borderRadius: 65, background: vc.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: vf.cond, fontSize: 56, fontWeight: 700}}>VS</div>
    </Paper>
  );
};

/* ------------------------------------------------------------ */
export const Checkpoint: React.FC<{n: number; title: string; points: string[]; check: string}> = ({n, title, points, check}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const s = pop(f, fps, 0, 160);
  const step = Math.max(10, Math.floor((durationInFrames * 0.5) / points.length));
  return (
    <Paper>
      <Drift>
        <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', padding: '0 140px', gap: 90}}>
          <div style={{width: 360, height: 360, background: vc.yellow, transform: `rotate(${-4 * s}deg) scale(${0.6 + 0.4 * s})`, boxShadow: '0 20px 30px #00000030', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: vf.mono, fontSize: 26, letterSpacing: 4}}>CHECKPOINT</div>
            <div style={{fontFamily: vf.cond, fontWeight: 700, fontSize: 230, lineHeight: 0.95}}>{n}</div>
            <div style={{fontFamily: vf.mono, fontSize: 22}}>OF 6</div>
          </div>
          <div style={{flex: 1}}>
            <PopWords text={title} at={6} size={86} align="left" maxWidth={1100} />
            <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 34}}>
              {points.map((pt, i) => (
                <div key={i} style={{display: 'flex', gap: 18, alignItems: 'flex-start', fontFamily: vf.serif, fontSize: 38, lineHeight: 1.4, opacity: p(f, 18 + i * step, 10), transform: `translateX(${(1 - p(f, 18 + i * step, 12)) * 40}px)`}}>
                  <Icon name="Check" size={40} color={vc.teal} stroke={3} />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop: 30, fontFamily: vf.mono, fontSize: 26, color: vc.teal, opacity: p(f, 18 + points.length * step, 10)}}>✓ Verify: {check}</div>
          </div>
        </AbsoluteFill>
      </Drift>
    </Paper>
  );
};

/* ------------------------------------------------------------ */
export const Bridge: React.FC<{line: string; line2?: string}> = ({line, line2}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const n = p(f, 10, Math.min(120, durationInFrames - 20));
  const H = 520;
  const vp = 960;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const L = lerp(200, 840, n);
  const R = lerp(1720, 1080, n);
  const farL = lerp(820, 930, n);
  const farR = lerp(1100, 990, n);
  return (
    <Paper tone="#e9e1cf">
      <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <rect x={0} y={H} width={1920} height={560} fill={n > 0.05 ? '#9cb7c4' : '#cbbf9f'} opacity={0.9} />
        <polygon points={`0,1080 1920,1080 ${R},760 ${farR},${H} ${farL},${H} ${L},760`} fill="#3a3632" />
        <polygon points={`${L},760 ${R},760 ${farR},${H} ${farL},${H}`} fill="#3a3632" />
        {[0.2, 0.4, 0.6, 0.8].map((k, i) => (
          <line key={i} x1={lerp(0, 1920, k)} y1={1080} x2={lerp(L, R, k)} y2={760} stroke="#efe9dc" strokeWidth={8} strokeDasharray="50 40" strokeDashoffset={-f * 6} opacity={i === 1 || i === 2 ? 1 - n * 0.6 : 1 - n} />
        ))}
        <line x1={vp} y1={1080} x2={vp} y2={H} stroke={vc.yellow} strokeWidth={10} strokeDasharray="50 40" strokeDashoffset={-f * 6} />
        {n > 0.6 &&
          [L - 10, R + 4].map((x, i) => <rect key={i} x={x} y={760 - 300 * p(f, 90, 30)} width={14} height={300 * p(f, 90, 30)} fill={vc.ink} />)}
      </svg>
      <AbsoluteFill style={{padding: '100px 140px'}}>
        <PopWords text={line} at={4} size={72} align="left" maxWidth={1300} />
        {line2 && (
          <div style={{marginTop: 20}}>
            <PopWords text={line2} at={60} size={72} align="left" maxWidth={1300} color={vc.red} />
          </div>
        )}
      </AbsoluteFill>
    </Paper>
  );
};

/* ------------------------------------------------------------ */
export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const press = f > 46;
  return (
    <Dark glow="#4a3410">
      <Center gap={36}>
        <div style={{fontFamily: vf.mono, fontSize: 34, letterSpacing: 14, color: vc.yellow, opacity: p(f, 0, 10)}}>INFO GEEKS</div>
        <PopWords text="Tell us your Plan B in the comments" at={4} size={92} color="#fff" />
        <div style={{display: 'flex', gap: 30, opacity: p(f, 24, 10)}}>
          <div style={{padding: '22px 56px', background: press ? '#333' : vc.red, color: '#fff', fontFamily: vf.head, fontWeight: 900, fontSize: 38, borderRadius: 6, transform: `scale(${f > 44 && f < 50 ? 0.94 : 1})`}}>{press ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}</div>
          <div style={{padding: '22px 56px', border: '3px solid #fff', color: '#fff', fontFamily: vf.head, fontWeight: 800, fontSize: 38, borderRadius: 6}}>SHARE ↗</div>
        </div>
      </Center>
    </Dark>
  );
};

export {Icon};
