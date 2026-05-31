import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ScenePortraitFrame }       from "./scenes/ScenePortraitFrame";
import { SceneScrollUpPortrait }    from "./scenes/SceneScrollUpPortrait";
import { SceneMobileMorphPortrait } from "./scenes/SceneMobileMorphPortrait";
import { SceneMobileScroll }        from "./scenes/SceneMobileScroll";
import { SceneLandscapeHScroll }    from "./scenes/SceneLandscapeHScroll";
import { SceneSpillOut }            from "./scenes/SceneSpillOut";

// ─── 9:16 Portrait composition (1080 × 1920) ─────────────────────────────────
// Same timing as desktop — only scenes 1-3 are portrait-adapted.
// Scenes 4-6 (phone-based) are reused as-is.
//
// Scene 1 — Portrait frame + shrink          0s – 2s     frames   0 –  59
// Scene 2 — Scroll up in portrait frame      2s – 3.5s   frames  60 – 104
// Scene 3 — Morph portrait frame → phone     3.5s – 4.5s frames 105 – 134
// Scene 4 – 6 same as CocaColaComposition    4.5s – 12.5s frames 135 – 374
// ─────────────────────────────────────────────────────────────────────────────

export const CocaColaCompositionMobile: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#FFF5E4" }}>
    <Sequence from={0}   durationInFrames={60}><ScenePortraitFrame /></Sequence>
    <Sequence from={60}  durationInFrames={45}><SceneScrollUpPortrait /></Sequence>
    <Sequence from={105} durationInFrames={30}><SceneMobileMorphPortrait /></Sequence>
    <Sequence from={135} durationInFrames={90}><SceneMobileScroll /></Sequence>
    <Sequence from={225} durationInFrames={90}><SceneLandscapeHScroll /></Sequence>
    <Sequence from={315} durationInFrames={60}><SceneSpillOut /></Sequence>
  </AbsoluteFill>
);
