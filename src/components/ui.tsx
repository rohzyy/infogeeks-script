import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, font, SAFE} from '../theme';
import {envelope, progress, reveal} from '../anim';

/**
 * Purpose-built background for every graphic scene: charcoal gradient, faint
 * editorial grid and film grain. Graphic scenes never sit on stock footage.
 */
export const Backdrop: React.FC<{accent?: string; grid?: boolean}> = ({accent = color.blueDeep, grid = true}) => {
  const frame = useCurrentFrame();
  // Grain jitters every 2 frames so it reads as texture rather than a static mask.
  const j = Math.floor(frame / 2) % 8;
  return (
    <AbsoluteFill style={{background: color.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 70% at 70% 20%, ${accent}33 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 10% 100%, #ffffff08 0%, transparent 70%)`,
        }}
      />
      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${color.lineSoft} 1px, transparent 1px), linear-gradient(90deg, ${color.lineSoft} 1px, transparent 1px)`,
            backgroundSize: '120px 120px',
            backgroundPosition: '20px 20px',
            opacity: 0.35,
            maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 90%)',
          }}
        />
      )}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('assets/textures/grain.png')})`,
          backgroundPosition: `${j * 61}px ${j * 37}px`,
          opacity: 0.06,
          mixBlendMode: 'overlay',
        }}
      />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px 60px #000000cc'}} />
    </AbsoluteFill>
  );
};

/** Wraps a graphic scene with backdrop and the standard fade envelope. */
export const GraphicScene: React.FC<{
  children: React.ReactNode;
  accent?: string;
  grid?: boolean;
}> = ({children, accent, grid}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const o = envelope(frame, durationInFrames);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: o}}>
        <Backdrop accent={accent} grid={grid} />
        <AbsoluteFill style={{padding: `${SAFE.y}px ${SAFE.x}px`, color: color.text, fontFamily: font.sans}}>
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{children: React.ReactNode; at?: number; tone?: string}> = ({
  children,
  at = 4,
  tone = color.blue,
}) => {
  const frame = useCurrentFrame();
  const w = progress(frame, at, 20) * 56;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, ...reveal(frame, at)}}>
      <div style={{width: w, height: 2, background: tone}} />
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 22,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: tone,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Headline: React.FC<{
  children: React.ReactNode;
  at?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, at = 10, size = 78, style}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: font.serif,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: -0.5,
        color: color.text,
        textWrap: 'balance',
        ...reveal(frame, at, 22, 30),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Body: React.FC<{children: React.ReactNode; at?: number; size?: number; style?: React.CSSProperties}> = ({
  children,
  at = 20,
  size = 34,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontSize: size,
        lineHeight: 1.4,
        color: color.textDim,
        fontWeight: 400,
        textWrap: 'pretty',
        ...reveal(frame, at),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Attribution line pinned to the bottom of a graphic scene. */
export const SourceNote: React.FC<{children: React.ReactNode; at?: number}> = ({children, at = 30}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        right: SAFE.x,
        bottom: 64,
        fontFamily: font.mono,
        fontSize: 19,
        lineHeight: 1.5,
        color: color.textMute,
        borderTop: `1px solid ${color.line}`,
        paddingTop: 16,
        opacity: progress(frame, at, 20),
      }}
    >
      {children}
    </div>
  );
};

export type Status = 'verified' | 'reported' | 'claim' | 'unverified' | 'disputed' | 'projection' | 'opinion' | 'official';

const statusStyle: Record<Status, {label: string; c: string}> = {
  official: {label: 'Official source', c: color.green},
  verified: {label: 'Verified', c: color.green},
  reported: {label: 'Reported', c: color.blue},
  claim: {label: 'Official claim · not independently verified', c: color.amber},
  projection: {label: 'Projection · not a measured wait', c: color.amber},
  opinion: {label: 'Opinion', c: color.amber},
  disputed: {label: 'Disputed', c: color.red},
  unverified: {label: 'Unverified', c: color.red},
};

export const StatusBadge: React.FC<{status: Status; at?: number; label?: string}> = ({status, at = 24, label}) => {
  const frame = useCurrentFrame();
  const s = statusStyle[status];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 12,
        padding: '10px 18px',
        border: `1.5px solid ${s.c}`,
        borderRadius: 4,
        fontFamily: font.mono,
        fontSize: 20,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: s.c,
        ...reveal(frame, at, 16, 10),
      }}
    >
      <div style={{width: 10, height: 10, borderRadius: 5, background: s.c}} />
      {label ?? s.label}
    </div>
  );
};

export const Rule: React.FC<{at?: number; width?: number | string; tone?: string}> = ({
  at = 8,
  width = '100%',
  tone = color.line,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{width, height: 1, background: tone, transformOrigin: 'left', transform: `scaleX(${progress(frame, at, 30)})`}} />
  );
};

export const MaybeImg: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => (
  <Img src={staticFile(src)} style={style} />
);
