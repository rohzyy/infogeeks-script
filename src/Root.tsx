import React from 'react';
import {Composition} from 'remotion';
import {Documentary, placeScenes} from './Documentary';
import {SCENES} from './timeline';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './theme';

// Stage C prototype: one of each required ingredient — clean stock footage,
// standalone typography, a data visualisation, a source-screenshot scene and
// a transition with sound effects.
export const PROTOTYPE_IDS = ['i14', 'c1-03', 'c1-04', 'c2-14', 'c2-15', 'c3-07', 'c3-08', 'c4-12'];

const protoFrames = placeScenes(SCENES.filter((s) => PROTOTYPE_IDS.includes(s.id))).reduce((a, s) => a + s.frames, 0);

export const Root: React.FC = () => (
  <>
    {/* Authored at 1920x1080; render with --scale=2 for 3840x2160. */}
    <Composition id="H1BDocumentary" component={Documentary} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition
      id="Prototype"
      component={Documentary}
      durationInFrames={protoFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{only: PROTOTYPE_IDS}}
    />
  </>
);
