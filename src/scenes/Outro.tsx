import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, envelope, progress, reveal} from '../anim';
import {Backdrop, GraphicScene, Kicker} from '../components/ui';
import {color, font} from '../theme';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The closing metaphor: a broad six-lane highway whose edges pull in until
 * only a narrow two-lane bridge remains. Fully drawn in SVG.
 */
export const HighwayBridge: React.FC<{lineA: string; lineB: string}> = ({lineA, lineB}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const o = envelope(frame, durationInFrames, 14, 12);
  const n = progress(frame, 70, 150, easeInOut); // narrowing
  const H = 470; // horizon
  const deckY = 640; // where the bridge begins
  const bottomL = 120;
  const bottomR = 1800;
  // Without narrowing, the road keeps perspective to the vanishing point.
  const vp = 960;
  const persp = (x: number, y: number) => vp + (x - vp) * ((y - H) / (1080 - H));
  const deckL = lerp(persp(bottomL, deckY), 900, n);
  const deckR = lerp(persp(bottomR, deckY), 1020, n);
  const farL = lerp(persp(bottomL, H + 4), 948, n);
  const farR = lerp(persp(bottomR, H + 4), 972, n);
  const dash = (frame * 9) % 80;
  const lanes = [1, 2, 3, 4, 5].map((k) => k / 6);
  const towers = progress(frame, 150, 40);

  return (
    <AbsoluteFill style={{background: '#000', opacity: o}}>
      <Backdrop grid={false} accent="#1d3550" />
      <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d0e10" />
            <stop offset="1" stopColor="#1b2a3c" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#16263a" />
            <stop offset="1" stopColor="#090b0e" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1920" height={H} fill="url(#sky)" />
        <rect x="0" y={H} width="1920" height={1080 - H} fill="#0b0c0e" />
        {/* water appears on both sides as the road narrows */}
        <polygon
          points={`0,${H} 1920,${H} 1920,${deckY + 80} ${deckR},${deckY} ${farR},${H} ${farL},${H} ${deckL},${deckY} 0,${deckY + 80}`}
          fill="url(#water)"
          opacity={n}
        />
        {/* road surface */}
        <polygon points={`${bottomL},1080 ${bottomR},1080 ${deckR},${deckY} ${farR},${H} ${farL},${H} ${deckL},${deckY}`} fill="#1a1d22" />
        {/* edges */}
        <polyline points={`${bottomL},1080 ${deckL},${deckY} ${farL},${H}`} fill="none" stroke={color.textDim} strokeWidth="4" />
        <polyline points={`${bottomR},1080 ${deckR},${deckY} ${farR},${H}`} fill="none" stroke={color.textDim} strokeWidth="4" />
        {/* lane markings: outer lanes merge into the centre line on the bridge */}
        {lanes.map((f, i) => {
          const xb = lerp(bottomL, bottomR, f);
          const xd = lerp(deckL, deckR, f);
          const xf = lerp(farL, farR, f);
          const centre = i === 2;
          return (
            <g key={f}>
              <line x1={xb} y1={1080} x2={xd} y2={deckY} stroke={centre ? color.amber : color.textMute} strokeWidth="5" strokeDasharray="40 40" strokeDashoffset={-dash} opacity={centre ? 1 : 1 - n * 0.7} />
              {(centre || n < 0.95) && (
                <line x1={xd} y1={deckY} x2={xf} y2={H} stroke={centre ? color.amber : color.textMute} strokeWidth="3" strokeDasharray="14 14" opacity={centre ? 1 : 1 - n} />
              )}
            </g>
          );
        })}
        {/* bridge towers and cables */}
        <g opacity={towers}>
          {[deckL - 18, deckR + 6].map((x, i) => (
            <rect key={i} x={x} y={deckY - 260 * towers} width="12" height={260 * towers} fill={color.textDim} />
          ))}
          {[deckL - 12, deckR + 12].map((x, i) => (
            <path key={i} d={`M ${x} ${deckY - 250} Q ${(x + (i ? farR : farL)) / 2} ${deckY - 60} ${i ? farR : farL} ${H - 30}`} fill="none" stroke={color.textMute} strokeWidth="2" />
          ))}
        </g>
        <text x="200" y="1030" fill={color.textMute} fontFamily="JetBrains Mono" fontSize="26" letterSpacing="4" opacity={1 - n}>
          TEN YEARS AGO
        </text>
        <text x={deckR + 40} y={deckY - 20} fill={color.amber} fontFamily="JetBrains Mono" fontSize="26" letterSpacing="4" opacity={n}>
          TODAY
        </text>
      </svg>
      <AbsoluteFill style={{padding: '110px 140px', color: color.text}}>
        <div style={{fontFamily: font.serif, fontSize: 64, fontWeight: 600, maxWidth: 1300, lineHeight: 1.12, ...reveal(frame, 14, 24, 30)}}>{lineA}</div>
        <div style={{fontFamily: font.serif, fontSize: 64, fontWeight: 600, maxWidth: 1300, lineHeight: 1.12, color: color.amber, marginTop: 14, ...reveal(frame, 200, 24, 30)}}>
          {lineB}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [70, 76, 84], [1, 0.94, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subscribed = frame > 76;
  return (
    <GraphicScene grid={false}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50}}>
        <div style={{fontFamily: font.mono, fontSize: 30, letterSpacing: 14, color: color.blue, ...reveal(frame, 4)}}>INFO GEEKS</div>
        <div style={{fontFamily: font.serif, fontSize: 92, fontWeight: 600, textAlign: 'center', lineHeight: 1.08, ...reveal(frame, 14, 24, 30)}}>
          Subscribe, and share this
          <br />
          with your friends
        </div>
        <div style={{display: 'flex', gap: 30, ...reveal(frame, 34)}}>
          <div
            style={{
              padding: '22px 54px',
              background: subscribed ? color.panel : color.red,
              border: `2px solid ${subscribed ? color.line : color.red}`,
              borderRadius: 6,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 2,
              transform: `scale(${press})`,
              color: subscribed ? color.textDim : '#fff',
            }}
          >
            {subscribed ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}
          </div>
          <div style={{padding: '22px 54px', border: `2px solid ${color.line}`, borderRadius: 6, fontSize: 34, fontWeight: 600, letterSpacing: 2}}>
            SHARE ↗
          </div>
        </div>
        <div style={{fontSize: 34, color: color.textDim, marginTop: 20, ...reveal(frame, 100)}}>See you in the next video.</div>
        <div style={{position: 'absolute', bottom: 70, fontFamily: font.mono, fontSize: 20, color: color.textMute, ...reveal(frame, 120)}}>
          Sources and fact-check notes: see the video description
        </div>
      </AbsoluteFill>
    </GraphicScene>
  );
};

export {Kicker};
