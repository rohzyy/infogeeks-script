import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {screenshotFile} from '../assets';
import {easeInOut, progress, reveal} from '../anim';
import {GraphicScene, Kicker, Status, StatusBadge} from '../components/ui';
import {color, font} from '../theme';

export type EvidenceProps = {
  shot: string; // screenshot id, e.g. "E-01"
  publisher: string;
  title: string;
  date: string;
  domain: string;
  supports: string; // editorial English summary of what the source supports
  status: Status;
  note?: string; // context / limitation shown under the claim
  // Controlled crop: image-space focus point (0..1) and zoom at start/end.
  focus?: {x: number; y: number; z0: number; z1: number};
};

/**
 * Dedicated source-evidence scene. A genuine website capture sits inside an
 * editorial frame on a purpose-built background, with attribution and the
 * specific claim it supports. Never used over stock footage.
 */
export const Evidence: React.FC<EvidenceProps> = ({
  shot,
  publisher,
  title,
  date,
  domain,
  supports,
  status,
  note,
  focus = {x: 0.5, y: 0.2, z0: 1.0, z1: 1.08},
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const file = screenshotFile(shot);
  const frameIn = progress(frame, 0, 26);
  const z = interpolate(frame, [0, durationInFrames], [focus.z0, focus.z1], {easing: easeInOut});

  return (
    <GraphicScene accent={color.blueDeep}>
      <div style={{display: 'flex', gap: 70, height: '100%', alignItems: 'center'}}>
        {/* Framed capture */}
        <div
          style={{
            flex: '0 0 1000px',
            height: 720,
            borderRadius: 10,
            overflow: 'hidden',
            background: '#f4f3ef',
            boxShadow: '0 40px 120px #000000c0, 0 0 0 1px #ffffff14',
            opacity: frameIn,
            transform: `translateY(${(1 - frameIn) * 30}px) scale(${0.97 + frameIn * 0.03})`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: 46,
              background: '#202329',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 18px',
              flex: '0 0 auto',
            }}
          >
            {['#5a5f68', '#5a5f68', '#5a5f68'].map((c, i) => (
              <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: c}} />
            ))}
            <div
              style={{
                marginLeft: 16,
                flex: 1,
                height: 28,
                borderRadius: 6,
                background: '#2c3037',
                color: color.textDim,
                fontFamily: font.mono,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
              }}
            >
              {domain}
            </div>
          </div>
          <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>
            {file ? (
              <Img
                src={staticFile(file)}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: `${focus.x * 100}% ${focus.y * 100}%`,
                  transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
                  transform: `scale(${z})`,
                }}
              />
            ) : (
              <AbsoluteFill
                style={{
                  background: 'repeating-linear-gradient(135deg, #e9e7e1 0 18px, #e2e0d9 18px 36px)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: font.mono,
                  color: '#6b6f76',
                  textAlign: 'center',
                  padding: 60,
                }}
              >
                <div style={{fontSize: 20, letterSpacing: 4, color: '#a0612a'}}>SCREENSHOT {shot} · PENDING CAPTURE</div>
                <div style={{fontSize: 18, marginTop: 18, lineHeight: 1.5}}>
                  Capture blocked by this environment&apos;s network policy.
                  <br />
                  Run scripts/capture-screenshots.mjs to fill this frame.
                </div>
              </AbsoluteFill>
            )}
          </div>
        </div>

        {/* Attribution and claim */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 26}}>
          <Kicker at={6}>Source evidence</Kicker>
          <div style={{...reveal(frame, 12), fontFamily: font.sans, fontWeight: 600, fontSize: 30, color: color.text}}>
            {publisher}
          </div>
          <div
            style={{
              ...reveal(frame, 16),
              fontFamily: font.serif,
              fontSize: 40,
              lineHeight: 1.18,
              color: color.text,
              textWrap: 'balance',
            }}
          >
            {title}
          </div>
          <div style={{...reveal(frame, 20), fontFamily: font.mono, fontSize: 20, color: color.textMute}}>{date}</div>
          <div style={{height: 1, background: color.line, margin: '6px 0'}} />
          <div style={{...reveal(frame, 28), fontSize: 27, lineHeight: 1.4, color: color.textDim}}>{supports}</div>
          {note && <div style={{...reveal(frame, 34), fontSize: 21, lineHeight: 1.45, color: color.textMute}}>{note}</div>}
          <div>
            <StatusBadge status={status} at={38} />
          </div>
        </div>
      </div>
    </GraphicScene>
  );
};
