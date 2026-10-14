import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {geoAlbersUsa, geoEqualEarth, geoPath, geoInterpolate, GeoProjection} from 'd3-geo';
import {feature} from 'topojson-client';
import world from 'world-atlas/countries-50m.json';
import us from 'us-atlas/states-10m.json';
import {p, ease} from './kit';
import {vc, vf} from './theme';

type LonLat = [number, number];
export type MapProps = {
  kind: 'world' | 'us';
  highlight?: string[];
  dim?: string[];
  arcs?: {from: LonLat; to: LonLat; at?: number; color?: string}[];
  pins?: {at: LonLat; label: string; delay?: number; color?: string; side?: 'left' | 'right'}[];
  zoom?: {from: [LonLat, number]; to: [LonLat, number]}; // centre + scale multiplier
  focusX?: number; // where the zoom centre sits horizontally (0..1)
  highlightColor?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const worldFC = feature(world as any, (world as any).objects.countries) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usFC = feature(us as any, (us as any).objects.states) as any;

export const VoxMap: React.FC<MapProps> = ({kind, highlight = [], dim = [], arcs = [], pins = [], zoom, highlightColor = vc.yellow, focusX = 0.5}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const W = 1920;
  const H = 1080;
  const t = interpolate(f, [0, durationInFrames], [0, 1], {easing: ease});

  const proj: GeoProjection = useMemo(() => (kind === 'us' ? geoAlbersUsa() : geoEqualEarth()), [kind]);
  if (kind === 'us') {
    const k = zoom ? interpolate(t, [0, 1], [zoom.from[1], zoom.to[1]]) : 1;
    proj.scale(1900 * k).translate([W / 2, H / 2 + 20]);
    if (zoom) {
      const c: LonLat = [interpolate(t, [0, 1], [zoom.from[0][0], zoom.to[0][0]]), interpolate(t, [0, 1], [zoom.from[0][1], zoom.to[0][1]])];
      const pt = proj(c);
      if (pt) proj.translate([W / 2 - (pt[0] - W * focusX), H / 2 + 20 - (pt[1] - H / 2)]);
    }
  } else {
    const k = zoom ? interpolate(t, [0, 1], [zoom.from[1], zoom.to[1]]) : 1;
    const c: LonLat = zoom ? [interpolate(t, [0, 1], [zoom.from[0][0], zoom.to[0][0]]), interpolate(t, [0, 1], [zoom.from[0][1], zoom.to[0][1]])] : [10, 20];
    (proj as GeoProjection).rotate([-c[0], 0]).scale(330 * k).translate([W / 2, H / 2]);
    // vertical centring on latitude
    const pt = proj(c);
    if (pt) proj.translate([W / 2 - (pt[0] - W * focusX), H / 2 - (pt[1] - H / 2)]);
  }
  const path = geoPath(proj);
  const fc = kind === 'us' ? usFC : worldFC;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      <defs>
        <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.25" />
        </filter>
      </defs>
      <g filter="url(#mapShadow)">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {fc.features.map((ft: any, i: number) => {
          const name = ft.properties.name as string;
          const hl = highlight.includes(name);
          const dm = dim.includes(name);
          const hp = hl ? p(f, 8 + highlight.indexOf(name) * 5, 14) : 0;
          const d = path(ft);
          if (!d) return null;
          return (
            <path
              key={i}
              d={d}
              fill={hl ? mix('#d9cfb9', highlightColor, hp) : dm ? '#cfc5b0' : '#d9cfb9'}
              stroke="#b8ab90"
              strokeWidth={kind === 'us' ? 1.2 : 0.6}
            />
          );
        })}
      </g>
      {arcs.map((a, i) => {
        const interp = geoInterpolate(a.from, a.to);
        const prog = p(f, a.at ?? 14, 40);
        const pts: string[] = [];
        const N = 60;
        for (let k = 0; k <= N * prog; k++) {
          const q = proj(interp(k / N));
          if (q) pts.push(`${q[0]},${q[1] - Math.sin((k / N) * Math.PI) * 120}`);
        }
        const head = pts[pts.length - 1]?.split(',').map(Number);
        return (
          <g key={i}>
            <polyline points={pts.join(' ')} fill="none" stroke={a.color ?? vc.red} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" />
            {head && prog > 0 && prog < 1 && <circle cx={head[0]} cy={head[1]} r={11} fill={a.color ?? vc.red} />}
          </g>
        );
      })}
      {pins.map((pn, i) => {
        const q = proj(pn.at);
        if (!q) return null;
        const s = p(f, pn.delay ?? 20, 10);
        const right = pn.side !== 'left';
        return (
          <g key={i} transform={`translate(${q[0]} ${q[1]})`} opacity={s}>
            <circle r={16 * s} fill={pn.color ?? vc.red} stroke="#fff" strokeWidth={4} />
            <circle r={16 + ((f - (pn.delay ?? 20)) % 30) * 1.4} fill="none" stroke={pn.color ?? vc.red} strokeWidth={2} opacity={1 - ((f - (pn.delay ?? 20)) % 30) / 30} />
            <g transform={`translate(${right ? 28 : -28} -8)`}>
              <rect x={right ? 0 : -(pn.label.length * 19 + 28)} y={-28} width={pn.label.length * 19 + 28} height={48} fill={vc.ink} rx={4} />
              <text x={right ? 14 : -14} y={6} textAnchor={right ? 'start' : 'end'} fill="#fff" fontFamily={vf.head} fontWeight={800} fontSize={30}>
                {pn.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};

const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
};
