import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { ColaImage } from "../components/ColaImage";
import { LandscapeFrame } from "../components/LandscapeFrame";

// Animation timing (local frame, sequence starts at 0)
const HOLD_FRAMES = 15;          // 0.5s — image stays full before shrink starts
const SHRINK_DURATION = 24;      // 0.8s — shrink animation
const SHRINK_START = HOLD_FRAMES;
const SHRINK_END = HOLD_FRAMES + SHRINK_DURATION; // frame 39

const TARGET_PADDING = 40;

export const SceneLandscapeFrame: React.FC = () => {
  const frame = useCurrentFrame();

  const padding = interpolate(frame, [SHRINK_START, SHRINK_END], [0, TARGET_PADDING], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <LandscapeFrame innerPadding={padding}>
      <ColaImage index={0} />
    </LandscapeFrame>
  );
};
