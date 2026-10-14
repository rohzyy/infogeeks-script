import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {stockFile} from '../assets';
import {color, font} from '../theme';

export type StockProps = {
  slot: string; // e.g. "S-001" -> public/assets/stock/S-001.mp4
  desc: string; // what the shot must show (from the shot list)
  trim?: number; // seconds into the source clip
  move?: 'in' | 'out' | 'left' | 'right' | 'none';
  grade?: 'neutral' | 'cool' | 'warm' | 'night';
};

const grades: Record<NonNullable<StockProps['grade']>, string> = {
  neutral: 'contrast(1.06) saturate(0.86) brightness(0.97)',
  cool: 'contrast(1.08) saturate(0.78) brightness(0.95) hue-rotate(-6deg)',
  warm: 'contrast(1.05) saturate(0.9) brightness(0.98) sepia(0.08)',
  night: 'contrast(1.12) saturate(0.8) brightness(0.9)',
};

/**
 * Clean stock footage. By rule, NOTHING is drawn over the footage: no text,
 * no labels, no graphics. Only reframing (slow push), grading and a fade from
 * black at the cut are applied. Source audio is always muted.
 */
export const StockShot: React.FC<StockProps> = ({slot, desc, trim = 0, move = 'in', grade = 'neutral'}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const t = frame / durationInFrames;
  const file = stockFile(slot);
  const fade = Math.min(
    interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'}),
  );
  const s = move === 'out' ? 1.08 - 0.06 * t : move === 'none' ? 1.02 : 1.02 + 0.06 * t;
  const x = move === 'left' ? 30 - 60 * t : move === 'right' ? -30 + 60 * t : 0;

  if (!file) return <StockSlot slot={slot} desc={desc} />;

  return (
    <AbsoluteFill style={{background: '#000', opacity: fade}}>
      <AbsoluteFill style={{transform: `scale(${s}) translateX(${x}px)`, filter: grades[grade]}}>
        <OffthreadVideo
          src={staticFile(file)}
          muted
          startFrom={Math.round(trim * fps)}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>
      {/* Grade-only vignette: a tonal falloff, not a graphic element. */}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 240px 40px #00000099'}} />
    </AbsoluteFill>
  );
};

/**
 * Production slate shown ONLY when a stock clip has not been downloaded yet.
 * It is deliberately styled as a placeholder (hatched, monospace) so an
 * assembly cut can never be mistaken for finished footage.
 */
export const StockSlot: React.FC<{slot: string; desc: string}> = ({slot, desc}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const o = Math.min(
    interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'}),
  );
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        background: `repeating-linear-gradient(135deg, #15171b 0 22px, #111316 22px 44px)`,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: font.mono,
        color: color.textMute,
      }}
    >
      <div
        style={{
          border: `2px dashed ${color.line}`,
          padding: '48px 64px',
          maxWidth: 1240,
          textAlign: 'center',
          background: '#0d0e10e6',
        }}
      >
        <div style={{fontSize: 22, letterSpacing: 5, color: color.amber}}>STOCK SLOT {slot} · CLIP NOT YET DOWNLOADED</div>
        <div style={{fontSize: 34, color: color.textDim, marginTop: 26, lineHeight: 1.35, fontFamily: font.sans}}>{desc}</div>
        <div style={{fontSize: 18, marginTop: 26}}>Placeholder · see production/shotlist.csv · scripts/fetch-stock.mjs</div>
      </div>
    </AbsoluteFill>
  );
};
