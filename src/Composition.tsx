import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SceneLandscapeFrame }  from "./scenes/SceneLandscapeFrame";
import { SceneScrollUp }        from "./scenes/SceneScrollUp";
import { SceneMobileMorph }     from "./scenes/SceneMobileMorph";
import { SceneMobileScroll }    from "./scenes/SceneMobileScroll";
import { SceneLandscapeHScroll } from "./scenes/SceneLandscapeHScroll";
import { SceneSpillOut }        from "./scenes/SceneSpillOut";

// ─── Frame map (30 fps) ───────────────────────────────────────────────────────
// Scene 1 — Landscape frame + shrink          0s – 2s     frames   0 –  59  (60f)
// Scene 2 — Scroll up in landscape frame      2s – 3.5s   frames  60 – 104  (45f)
// Scene 3 — Morph landscape → phone           3.5s – 4.5s frames 105 – 134  (30f)
// Scene 4 — Mobile: 3 portrait images scroll UP  4.5s–7.5s frames 135–224  (90f)
// Scene 5 — Mobile: portrait→landscape, scroll R→L 7.5–10.5s frames 225–314 (90f)
// Scene 6 — Spill out                         10.5s–12.5s frames 315–374  (60f)
// Total: 375 frames  =  12.5 s
// ─────────────────────────────────────────────────────────────────────────────

export const CocaColaComposition: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#FFF5E4" }}>
    <Sequence from={0}   durationInFrames={60}><SceneLandscapeFrame /></Sequence>
    <Sequence from={60}  durationInFrames={45}><SceneScrollUp /></Sequence>
    <Sequence from={105} durationInFrames={30}><SceneMobileMorph /></Sequence>
    <Sequence from={135} durationInFrames={90}><SceneMobileScroll /></Sequence>
    <Sequence from={225} durationInFrames={90}><SceneLandscapeHScroll /></Sequence>
    <Sequence from={315} durationInFrames={60}><SceneSpillOut /></Sequence>
  </AbsoluteFill>
);
