import {Easing, interpolate, spring} from 'remotion';

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 -> 1 over `dur` frames starting at `start`, eased. */
export const progress = (frame: number, start: number, dur: number, ease = easeOut) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

/** Standard reveal: fade + small upward drift. */
export const reveal = (frame: number, start: number, dur = 18, dist = 24) => {
  const p = progress(frame, start, dur);
  return {opacity: p, transform: `translateY(${(1 - p) * dist}px)`};
};

/** Scene envelope used by every graphic scene: fade in, hold, fade out. */
export const envelope = (frame: number, total: number, inF = 12, outF = 10) =>
  Math.min(
    interpolate(frame, [0, inF], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [total - outF, total], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );

export const springIn = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.8}});

/** Animated counter value with thousands separators. */
export const countUp = (frame: number, start: number, dur: number, to: number) =>
  Math.round(progress(frame, start, dur, easeInOut) * to).toLocaleString('en-US');
