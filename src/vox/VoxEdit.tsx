import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {BEATS} from './beats';
import {VFPS, VOX_FRAMES, vc, vf} from './theme';
import * as S from './scenes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REG: Record<string, React.FC<any>> = {
  statement: S.Statement,
  doc: S.Doc,
  year: S.YearSlam,
  money: S.Money,
  map: S.MapBeat,
  deplane: S.Deplane,
  fare: S.Fare,
  timeline26: S.Timeline26,
  number: S.BigNumber,
  chapter: S.Chapter,
  iconarray: S.IconArray,
  profiles: S.Profiles,
  viral: S.ViralPost,
  folders: S.Folders,
  split: S.Split,
  checkpoint: S.Checkpoint,
  bridge: S.Bridge,
  end: S.EndCard,
};

const SFX: Record<string, {f: string; v: number; at: number}[]> = {
  default: [{f: 'whoosh_soft', v: 0.16, at: 0}],
  impact: [{f: 'impact_soft', v: 0.32, at: 0}, {f: 'whoosh_low', v: 0.18, at: 0}],
  stamp: [{f: 'whoosh_soft', v: 0.14, at: 0}, {f: 'stamp', v: 0.38, at: 22 / VFPS}],
};

/** Quick directional push-in so every cut feels like motion, not a slide change. */
const Enter: React.FC<{children: React.ReactNode; i: number}> = ({children, i}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 7], [0, 1], {extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
  const dir = i % 2 ? 1 : -1;
  return (
    <AbsoluteFill style={{transform: `translateX(${(1 - t) * dir * 90}px) scale(${1.04 - 0.04 * t})`, filter: t < 1 ? `blur(${(1 - t) * 8}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

/** Persistent chapter tag and progress line. */
const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / VFPS;
  const cur = [...BEATS].reverse().find((b) => b.t <= t) ?? BEATS[0];
  const dark = ['chapter', 'year', 'deplane', 'viral', 'end'].includes(cur.kind) || (cur.props as {dark?: boolean}).dark;
  if (cur.kind === 'chapter' || cur.kind === 'end') return null;
  return (
    <>
      <div style={{position: 'absolute', right: 56, top: 44, fontFamily: vf.mono, fontSize: 20, letterSpacing: 3, color: dark ? '#cfc6b3' : vc.inkSoft, display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{width: 12, height: 12, background: vc.red, borderRadius: 6}} />
        {cur.ch}
      </div>
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 6, width: `${(f / VOX_FRAMES) * 100}%`, background: vc.yellow}} />
    </>
  );
};

export const VoxEdit: React.FC = () => (
  <AbsoluteFill style={{background: vc.paper}}>
    {BEATS.map((b, i) => {
      const from = Math.round(b.t * VFPS);
      const to = i + 1 < BEATS.length ? Math.round(BEATS[i + 1].t * VFPS) : VOX_FRAMES;
      const C = REG[b.kind];
      return (
        <Sequence key={i} from={from} durationInFrames={to - from} name={`${b.t.toFixed(1)}s ${b.kind}`}>
          <Enter i={i}>
            <C {...b.props} />
          </Enter>
          {(SFX[b.sfx ?? 'default'] ?? []).map((s, k) => (
            <Sequence key={k} from={Math.round(s.at * VFPS)} layout="none">
              <Audio src={staticFile(`assets/sound_effects/${s.f}.wav`)} volume={s.v} />
            </Sequence>
          ))}
        </Sequence>
      );
    })}
    <Hud />
    <Audio src={staticFile('assets/vox/voice.m4a')} volume={1} />
  </AbsoluteFill>
);
