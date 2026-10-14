import React from 'react';
import {AbsoluteFill, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {vc, vf} from './theme';

export const ease = Easing.bezier(0.2, 0.9, 0.25, 1);
export const p = (f: number, s: number, d: number, e = ease) =>
  interpolate(f, [s, s + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const pop = (f: number, fps: number, delay = 0, stiff = 180) =>
  spring({frame: f - delay, fps, config: {damping: 13, stiffness: stiff, mass: 0.7}});

/* ---------- Backgrounds ---------- */

/** Warm paper with fibre grain and a soft vignette. */
export const Paper: React.FC<{tone?: string; children?: React.ReactNode}> = ({tone = vc.paper, children}) => {
  const f = useCurrentFrame();
  const j = Math.floor(f / 3) % 6;
  return (
    <AbsoluteFill style={{background: tone}}>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('assets/vox/paper_fibre.png')})`,
          backgroundPosition: `${j * 97}px ${j * 53}px`,
          mixBlendMode: 'multiply',
          opacity: 0.9,
        }}
      />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 320px 30px #9a845a2e'}} />
      {children}
    </AbsoluteFill>
  );
};

export const Dark: React.FC<{children?: React.ReactNode; glow?: string}> = ({children, glow = '#3a2a10'}) => {
  const f = useCurrentFrame();
  const j = Math.floor(f / 2) % 6;
  return (
    <AbsoluteFill style={{background: vc.dark}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${glow}aa 0%, transparent 70%)`}} />
      <AbsoluteFill
        style={{backgroundImage: `url(${staticFile('assets/vox/paper_grain.png')})`, backgroundPosition: `${j * 97}px ${j * 53}px`, mixBlendMode: 'overlay', opacity: 0.35}}
      />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 280px 80px #000000d0'}} />
      {children}
    </AbsoluteFill>
  );
};

/** Slow continuous camera drift so no frame is ever static (2.5D feel). */
export const Drift: React.FC<{children: React.ReactNode; amount?: number; dir?: number}> = ({children, amount = 0.05, dir = 1}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = f / Math.max(1, durationInFrames);
  const s = 1 + amount * t;
  return <AbsoluteFill style={{transform: `scale(${s}) translate(${dir * -12 * t}px, ${-6 * t}px)`}}>{children}</AbsoluteFill>;
};

/** Torn paper scraps with masking tape at the frame edges: Vox-style collage texture. */
export const Scraps: React.FC<{seed?: string}> = ({seed = 's'}) => {
  const f = useCurrentFrame();
  const items = [0, 1].map((i) => {
    const r = (k: string) => random(seed + i + k);
    const left = i === 0;
    return {
      x: left ? -120 + r('x') * 60 : 1920 - 380 + r('x') * 60,
      y: left ? 620 + r('y') * 220 : 150 + r('y') * 140,
      w: 380 + r('w') * 120,
      h: 300 + r('h') * 120,
      rot: (r('r') - 0.5) * 24,
      tone: [vc.card, '#d9cdb2', '#c9d6dd', '#ead8b4'][Math.floor(r('t') * 4)],
      lines: r('l') > 0.4,
    };
  });
  return (
    <>
      {items.map((it, i) => {
        const s = p(f, 2 + i * 4, 14);
        return (
          <div key={i} style={{position: 'absolute', left: it.x, top: it.y, transform: `rotate(${it.rot}deg) translateY(${(1 - s) * 40}px)`, opacity: s, filter: 'drop-shadow(0 10px 12px #00000026)'}}>
            <div style={{width: it.w, height: it.h, background: it.tone, clipPath: tornPath(seed + i, 18),
              backgroundImage: it.lines ? 'repeating-linear-gradient(0deg, transparent 0 34px, #8b867b33 34px 36px)' : undefined}} />
            <div style={{position: 'absolute', left: it.w / 2 - 70, top: -18, width: 140, height: 40, background: '#f2e6b8cc', transform: 'rotate(-4deg)'}} />
          </div>
        );
      })}
    </>
  );
};

/* ---------- Type ---------- */

/** Yellow highlighter swipe behind text. */
export const Mark: React.FC<{children: React.ReactNode; at?: number; dur?: number; color?: string}> = ({children, at = 10, dur = 12, color = vc.yellow}) => {
  const f = useCurrentFrame();
  const w = p(f, at, dur);
  return (
    <span style={{position: 'relative', whiteSpace: 'nowrap', display: 'inline-block'}}>
      <span
        style={{
          position: 'absolute',
          left: -8,
          right: -8,
          top: '14%',
          bottom: '6%',
          background: color,
          transformOrigin: 'left',
          transform: `scaleX(${w}) skewX(-6deg)`,
          borderRadius: 3,
          zIndex: 0,
        }}
      />
      <span style={{position: 'relative', zIndex: 1, color: vc.ink}}>{children}</span>
    </span>
  );
};

/** Words pop in one by one with overshoot. Wrap a word in *asterisks* to highlight it. */
export const PopWords: React.FC<{
  text: string;
  at?: number;
  size?: number;
  color?: string;
  font?: string;
  weight?: number;
  stagger?: number;
  align?: 'left' | 'center';
  maxWidth?: number;
  lh?: number;
}> = ({text, at = 0, size = 96, color = vc.ink, font = vf.head, weight = 900, stagger = 3, align = 'center', maxWidth = 1600, lh = 1.05}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  let hl = false;
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: lh,
        color,
        maxWidth,
        textAlign: align,
        letterSpacing: -1,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.26,
        rowGap: size * 0.08,
      }}
    >
      {words.map((w, i) => {
        const start = w.startsWith('*');
        const end = w.endsWith('*');
        const clean = w.replace(/\*/g, '');
        if (start) hl = true;
        const isHl = hl;
        if (end) hl = false;
        const s = pop(f, fps, at + i * stagger);
        const node = (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${(1 - s) * 40}px) scale(${0.7 + 0.3 * s})`,
              opacity: Math.min(1, s * 1.4),
            }}
          >
            {isHl ? <Mark at={at + i * stagger + 6}>{clean}</Mark> : clean}
          </span>
        );
        return node;
      })}
    </div>
  );
};

export const Label: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({children, color = vc.inkSoft, size = 26, style}) => (
  <div style={{fontFamily: vf.mono, fontSize: size, letterSpacing: 3, textTransform: 'uppercase', color, ...style}}>{children}</div>
);

/* ---------- Paper objects ---------- */

const tornPath = (seed: string, n = 28) => {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${random(seed + i) * 2.2}%`);
  pts.push('100% 100%');
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${97.8 + random(seed + 'b' + i) * 2.2}%`);
  return `polygon(${pts.join(',')})`;
};

/** A paper cut-out card that drops in with a slight rotation and real shadow. */
export const Cutout: React.FC<{
  children: React.ReactNode;
  at?: number;
  rot?: number;
  w?: number | string;
  h?: number | string;
  bg?: string;
  torn?: boolean;
  seed?: string;
  style?: React.CSSProperties;
  from?: 'up' | 'down' | 'left' | 'right' | 'scale';
}> = ({children, at = 0, rot = -1.5, w, h, bg = vc.card, torn = false, seed = 'c', style, from = 'down'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, fps, at, 150);
  const off = (1 - s) * 140;
  const tr =
    from === 'up' ? `translateY(${-off}px)` : from === 'left' ? `translateX(${-off * 2}px)` : from === 'right' ? `translateX(${off * 2}px)` : from === 'scale' ? `scale(${0.6 + 0.4 * s})` : `translateY(${off}px)`;
  return (
    <div style={{filter: 'drop-shadow(0 18px 22px #00000038) drop-shadow(0 3px 4px #00000030)', opacity: Math.min(1, s * 2), transform: `${tr} rotate(${rot * s}deg)`, ...style}}>
      <div style={{width: w, height: h, background: bg, clipPath: torn ? tornPath(seed) : undefined, position: 'relative'}}>{children}</div>
    </div>
  );
};

/** Rubber stamp that slams down. */
export const Stamp: React.FC<{text: string; at?: number; color?: string; rot?: number; size?: number}> = ({text, at = 20, color = vc.red, rot = -10, size = 64}) => {
  const f = useCurrentFrame();
  const s = p(f, at, 7, Easing.in(Easing.cubic));
  if (f < at) return null;
  return (
    <div
      style={{
        border: `${size / 9}px solid ${color}`,
        color,
        fontFamily: vf.cond,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 6,
        padding: `${size * 0.08}px ${size * 0.35}px`,
        borderRadius: 8,
        transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * s})`,
        opacity: s,
        mixBlendMode: 'multiply',
        maskImage: `url(${staticFile('assets/vox/paper_grain.png')})`,
        WebkitMaskSize: '420px',
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

/** Sticky-note style small source line. */
export const SourceTag: React.FC<{children: React.ReactNode; at?: number; dark?: boolean}> = ({children, at = 25, dark}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        bottom: 52,
        fontFamily: vf.mono,
        fontSize: 19,
        color: dark ? '#b9b2a3' : vc.inkSoft,
        background: dark ? '#00000080' : '#fbf8f1d9',
        padding: '8px 14px',
        opacity: p(f, at, 12),
        maxWidth: 1500,
        lineHeight: 1.35,
      }}
    >
      {children}
    </div>
  );
};
