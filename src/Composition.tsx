import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SceneLandscapeFrame } from "./scenes/SceneLandscapeFrame";
import { SceneScrollUp } from "./scenes/SceneScrollUp";
import { SceneMobileMorph } from "./scenes/SceneMobileMorph";
import { SceneSpillOut } from "./scenes/SceneSpillOut";

// ─── Frame map (30 fps) ───────────────────────────────────────────────────────
// Scene 1 — Landscape frame + image shrink:   0s–2s    frames   0–59
// Scene 2 — Scroll up inside frame:           2s–3.5s  frames  60–104
// Scene 3 — Morph landscape → phone:          3.5s–4.5s frames 105–134
// Scene 4 — Spill out:                        4.5s–6s  frames 135–179
// ─────────────────────────────────────────────────────────────────────────────

export const CocaColaComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#FFF5E4" }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneLandscapeFrame />
      </Sequence>

      <Sequence from={60} durationInFrames={45}>
        <SceneScrollUp />
      </Sequence>

      <Sequence from={105} durationInFrames={30}>
        <SceneMobileMorph />
      </Sequence>

      <Sequence from={135} durationInFrames={45}>
        <SceneSpillOut />
      </Sequence>
    </AbsoluteFill>
  );
};
