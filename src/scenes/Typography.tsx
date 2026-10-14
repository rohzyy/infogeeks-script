import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, progress, reveal} from '../anim';
import {Backdrop, Body, GraphicScene, Headline, Kicker, Rule, SourceNote, Status, StatusBadge} from '../components/ui';
import {color, font} from '../theme';

/* ------------------------------------------------------------------ */
/* Chapter opener: numeral, rule draws across, title rises.            */
/* ------------------------------------------------------------------ */
export const ChapterOpener: React.FC<{num: string; title: string; sub?: string; range: string}> = ({
  num,
  title,
  sub,
  range,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const numP = progress(frame, 0, 34, easeInOut);
  const line = progress(frame, 8, 40, easeInOut);
  return (
    <AbsoluteFill style={{background: '#000', opacity: out}}>
      <Backdrop grid={false} accent={color.blueDeep} />
      <AbsoluteFill style={{padding: '0 160px', justifyContent: 'center', color: color.text, fontFamily: font.sans}}>
        <div
          style={{
            fontFamily: font.serif,
            fontSize: 360,
            fontWeight: 300,
            lineHeight: 0.8,
            color: 'transparent',
            WebkitTextStroke: `1.5px ${color.blue}`,
            opacity: numP * 0.7,
            position: 'absolute',
            right: 150,
            top: 170,
            transform: `translateY(${(1 - numP) * 40}px)`,
          }}
        >
          {num}
        </div>
        <div style={{fontFamily: font.mono, fontSize: 24, letterSpacing: 6, color: color.blue, ...reveal(frame, 6)}}>
          {num === '00' ? 'INTRODUCTION' : `CHAPTER ${parseInt(num, 10)}`} · {range}
        </div>
        <div style={{height: 2, background: color.blue, width: 1600 * line, margin: '34px 0 40px'}} />
        <div
          style={{
            fontFamily: font.serif,
            fontSize: 112,
            fontWeight: 600,
            lineHeight: 1.02,
            maxWidth: 1400,
            letterSpacing: -1,
            ...reveal(frame, 14, 26, 40),
          }}
        >
          {title}
        </div>
        {sub && (
          <div style={{fontSize: 36, color: color.textDim, marginTop: 30, maxWidth: 1300, ...reveal(frame, 26)}}>{sub}</div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Cold-open date card with typewriter.                                */
/* ------------------------------------------------------------------ */
export const DateCard: React.FC<{date: string; line: string}> = ({date, line}) => {
  const frame = useCurrentFrame();
  const chars = Math.floor(interpolate(frame, [8, 8 + date.length * 3], [0, date.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const caret = Math.floor(frame / 15) % 2 === 0;
  return (
    <GraphicScene grid={false}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{fontFamily: font.mono, fontSize: 120, letterSpacing: 4, color: color.text}}>
          {date.slice(0, chars)}
          <span style={{color: color.amber, opacity: caret ? 1 : 0}}>▍</span>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: color.textDim, ...reveal(frame, 8 + date.length * 3 + 6)}}>{line}</div>
      </AbsoluteFill>
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Generic editorial statement: kicker, headline, body, badge, source. */
/* ------------------------------------------------------------------ */
export const Statement: React.FC<{
  kicker?: string;
  headline: string;
  body?: string;
  bullets?: string[];
  status?: Status;
  statusLabel?: string;
  source?: string;
  align?: 'left' | 'center';
  size?: number;
  tone?: string;
}> = ({kicker, headline, body, bullets, status, statusLabel, source, align = 'left', size = 78, tone}) => {
  const frame = useCurrentFrame();
  const center = align === 'center';
  return (
    <GraphicScene>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: center ? 'center' : 'flex-start',
          textAlign: center ? 'center' : 'left',
          height: '100%',
          gap: 34,
          maxWidth: center ? undefined : 1450,
          paddingBottom: source ? 60 : 0,
        }}
      >
        {kicker && <Kicker tone={tone}>{kicker}</Kicker>}
        <Headline size={size}>{headline}</Headline>
        {body && <Body style={{maxWidth: 1350}}>{body}</Body>}
        {bullets && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 6}}>
            {bullets.map((b, i) => (
              <div key={i} style={{display: 'flex', gap: 22, alignItems: 'baseline', fontSize: 34, color: color.textDim, ...reveal(frame, 24 + i * 10)}}>
                <span style={{fontFamily: font.mono, fontSize: 22, color: tone ?? color.blue}}>{String(i + 1).padStart(2, '0')}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
        {status && <StatusBadge status={status} label={statusLabel} at={30 + (bullets?.length ?? 0) * 10} />}
      </div>
      {source && <SourceNote at={36}>{source}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Quote card with speaker attribution.                                */
/* ------------------------------------------------------------------ */
export const QuoteCard: React.FC<{
  speaker: string;
  role: string;
  quote: string;
  context?: string;
  status?: Status;
  source?: string;
  tone?: string;
}> = ({speaker, role, quote, context, status, source, tone = color.amber}) => {
  const frame = useCurrentFrame();
  return (
    <GraphicScene accent="#5a3a12">
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 36, maxWidth: 1500, paddingBottom: 50}}>
        <div style={{fontFamily: font.serif, fontSize: 200, lineHeight: 0.6, color: tone, height: 90, ...reveal(frame, 2)}}>“</div>
        <div style={{fontFamily: font.serif, fontSize: 64, lineHeight: 1.18, fontStyle: 'italic', textWrap: 'balance', ...reveal(frame, 8, 24, 30)}}>
          {quote}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, ...reveal(frame, 22)}}>
          <div style={{width: 48, height: 2, background: tone}} />
          <div style={{fontSize: 30, fontWeight: 600}}>{speaker}</div>
          <div style={{fontSize: 28, color: color.textMute}}>{role}</div>
        </div>
        {context && <Body at={30} size={28} style={{maxWidth: 1350}}>{context}</Body>}
        {status && <StatusBadge status={status} at={38} />}
      </div>
      {source && <SourceNote at={40}>{source}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Headline vs reality split.                                           */
/* ------------------------------------------------------------------ */
export const SplitHeadline: React.FC<{left: {k: string; v: string}; right: {k: string; v: string}; foot?: string}> = ({
  left,
  right,
  foot,
}) => {
  const frame = useCurrentFrame();
  const strike = progress(frame, 40, 20);
  return (
    <GraphicScene>
      <div style={{display: 'flex', height: '100%', alignItems: 'center', gap: 0}}>
        {[left, right].map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: '0 60px',
              borderLeft: i ? `1px solid ${color.line}` : 'none',
              ...reveal(frame, 6 + i * 26),
            }}
          >
            <div style={{fontFamily: font.mono, fontSize: 22, letterSpacing: 4, color: i ? color.blue : color.red}}>{s.k}</div>
            <div style={{position: 'relative', marginTop: 30, display: 'inline-block'}}>
              <div style={{fontFamily: font.serif, fontSize: 84, fontWeight: 600, lineHeight: 1.05, color: i ? color.text : color.textDim}}>
                {s.v}
              </div>
              {i === 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '52%',
                    height: 5,
                    width: `${strike * 100}%`,
                    background: color.red,
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {foot && <SourceNote at={50}>{foot}</SourceNote>}
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Stylised family-group chat (English translation of script lines).   */
/* ------------------------------------------------------------------ */
export const ChatPanic: React.FC<{group: string; messages: {from: string; text: string}[]; caption: string}> = ({
  group,
  messages,
  caption,
}) => {
  const frame = useCurrentFrame();
  return (
    <GraphicScene grid={false}>
      <div style={{display: 'flex', height: '100%', alignItems: 'center', gap: 110}}>
        <div
          style={{
            width: 640,
            height: 660,
            borderRadius: 40,
            background: '#111317',
            border: `1px solid ${color.line}`,
            boxShadow: '0 40px 120px #000',
            padding: 34,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            ...reveal(frame, 0, 20, 40),
          }}
        >
          <div style={{borderBottom: `1px solid ${color.line}`, paddingBottom: 18}}>
            <div style={{fontSize: 26, fontWeight: 600}}>{group}</div>
            <div style={{fontSize: 18, color: color.textMute, marginTop: 4}}>Family group · translated from Telugu</div>
          </div>
          {messages.map((m, i) => {
            const at = 18 + i * 34;
            const p = progress(frame, at, 14);
            const typing = frame >= at - 16 && frame < at;
            return (
              <div key={i} style={{alignSelf: i % 2 ? 'flex-end' : 'flex-start', maxWidth: '86%'}}>
                {typing && (
                  <div style={{fontSize: 18, color: color.textMute, fontFamily: font.mono}}>{m.from} is typing…</div>
                )}
                <div
                  style={{
                    opacity: p,
                    transform: `translateY(${(1 - p) * 16}px) scale(${0.96 + p * 0.04})`,
                    background: i % 2 ? '#22344a' : '#1d2026',
                    borderRadius: 18,
                    padding: '16px 20px',
                  }}
                >
                  <div style={{fontSize: 17, color: color.blue, marginBottom: 6}}>{m.from}</div>
                  <div style={{fontSize: 27, lineHeight: 1.35}}>{m.text}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{flex: 1}}>
          <Kicker at={20}>October 8–9, 2026</Kicker>
          <Headline at={30} size={70} style={{marginTop: 30}}>
            {caption}
          </Headline>
        </div>
      </div>
    </GraphicScene>
  );
};

/* ------------------------------------------------------------------ */
/* Named-companies grid.                                                */
/* ------------------------------------------------------------------ */
export const CompanyGrid: React.FC<{kicker: string; headline: string; names: string[]; source?: string}> = ({
  kicker,
  headline,
  names,
  source,
}) => {
  const frame = useCurrentFrame();
  return (
    <GraphicScene>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 40}}>
        <Kicker>{kicker}</Kicker>
        <Headline size={64}>{headline}</Headline>
        <Rule at={18} />
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 20}}>
          {names.map((n, i) => {
            const at = 28 + i * 7;
            const p = progress(frame, at, 16);
            return (
              <div
                key={n}
                style={{
                  height: 150,
                  border: `1px solid ${color.line}`,
                  background: '#14171bcc',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '22px 26px',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 20}px)`,
                }}
              >
                <div style={{fontFamily: font.mono, fontSize: 18, color: color.textMute}}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{fontSize: 40, fontWeight: 600, letterSpacing: -0.5}}>{n}</div>
              </div>
            );
          })}
        </div>
      </div>
      {source && <SourceNote at={90}>{source}</SourceNote>}
    </GraphicScene>
  );
};
