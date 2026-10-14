import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {sfxFile} from './assets';
import {Cue, Scene, SCENES} from './timeline';
import {FPS} from './theme';
import {StockShot} from './scenes/Stock';
import {Evidence} from './scenes/Evidence';
import {ChapterOpener, ChatPanic, CompanyGrid, DateCard, QuoteCard, SplitHeadline, Statement} from './scenes/Typography';
import {BacklogQueue, BarStat, BigNumbers, CapDiagram, CountryCap, LotteryPool, Projection} from './scenes/Data';
import {
  CheckpointGrid,
  Checkpoint,
  Comparison,
  GateDiagram,
  Ladder,
  MapArc,
  Perspectives,
  ProcessFlow,
  ProfileCards,
  RiskCards,
  TimelineScene,
  VerdictCard,
} from './scenes/Diagrams';
import {EndCard, HighwayBridge} from './scenes/Outro';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REGISTRY: Record<Scene['type'], React.FC<any>> = {
  stock: StockShot,
  evidence: Evidence,
  chapter: ChapterOpener,
  date: DateCard,
  statement: Statement,
  quote: QuoteCard,
  split: SplitHeadline,
  chat: ChatPanic,
  companies: CompanyGrid,
  numbers: BigNumbers,
  bars: BarStat,
  cap: CapDiagram,
  lottery: LotteryPool,
  countrycap: CountryCap,
  backlog: BacklogQueue,
  projection: Projection,
  comparison: Comparison,
  flow: ProcessFlow,
  gate: GateDiagram,
  map: MapArc,
  ladder: Ladder,
  timeline: TimelineScene,
  profiles: ProfileCards,
  verdict: VerdictCard,
  risks: RiskCards,
  perspectives: Perspectives,
  checkpoint: Checkpoint,
  checkgrid: CheckpointGrid,
  highway: HighwayBridge,
  endcard: EndCard,
};

export type Placed = Scene & {from: number; frames: number; cues: Cue[]};

/** Lay scenes end to end and resolve their sound cues (explicit + defaults). */
export const placeScenes = (scenes: Scene[] = SCENES): Placed[] => {
  let from = 0;
  return scenes.map((s, i) => {
    const frames = Math.round(s.sec * FPS);
    const prev = scenes[i - 1];
    const cues: Cue[] = [...(s.sfx ?? [])];
    if (s.type === 'chapter') cues.push({sfx: 'impact_soft', at: 0.1, vol: 0.55}, {sfx: 'whoosh_low', at: 0.35, vol: 0.4});
    if (s.type === 'evidence') cues.push({sfx: 'paper', at: 0.1, vol: 0.55}, {sfx: 'click', at: 0.85, vol: 0.25});
    // Restrained transition accent: only on a cut from footage into graphics,
    // and only when the scene has no whoosh of its own.
    const hasWhoosh = cues.some((c) => c.sfx.startsWith('whoosh'));
    if (prev?.type === 'stock' && s.type !== 'stock' && s.type !== 'chapter' && s.type !== 'evidence' && !hasWhoosh) {
      cues.push({sfx: 'whoosh_soft', at: 0, vol: 0.3});
    }
    const placed = {...s, from, frames, cues: cues.filter((c) => c.at * FPS < frames - 3)};
    from += frames;
    return placed;
  });
};

// Global effects gain (+3.5 dB): brings the SFX-only mix to a comfortable
// level while keeping true peaks well below 0 dBFS (measured in QA).
const MASTER_GAIN = 1.5;

const SceneAudio: React.FC<{cues: Cue[]}> = ({cues}) => (
  <>
    {cues.map((c, i) => {
      const f = sfxFile(c.sfx);
      if (!f) return null;
      return (
        <Sequence key={i} from={Math.round(c.at * FPS)} layout="none">
          <Audio src={staticFile(f)} volume={Math.min(1, (c.vol ?? 0.7) * MASTER_GAIN)} />
        </Sequence>
      );
    })}
  </>
);

export const Documentary: React.FC<{only?: string[]}> = ({only}) => {
  const placed = placeScenes(only ? SCENES.filter((s) => only.includes(s.id)) : SCENES);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {placed.map((s) => {
        const C = REGISTRY[s.type];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={`${s.id} · ${s.type}`}>
            <C {...s.props} />
            <SceneAudio cues={s.cues} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
