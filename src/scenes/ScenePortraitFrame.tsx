import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ColaImage } from "../components/ColaImage";

// Portrait frame — 750×1000 centred in 1080×1920
export const PFRAME_W      = 750;
export const PFRAME_H      = 1000;
export const PFRAME_BORDER = 12;
export const PFRAME_RADIUS = 8;

const SHRINK_START     = 15;
const SHRINK_END       = 39;
const TARGET_PADDING   = 40;

export const ScenePortraitFrame: React.FC = () => {
  const frame = useCurrentFrame();

  const padding = interpolate(frame, [SHRINK_START, SHRINK_END], [0, TARGET_PADDING], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#FFF5E4" }}>
      <div style={{
        width: PFRAME_W, height: PFRAME_H,
        border: `${PFRAME_BORDER}px solid #F40009`,
        borderRadius: PFRAME_RADIUS,
        backgroundColor: "#FFF5E4",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}>
        <div style={{ position:"absolute", top:padding, left:padding, right:padding, bottom:padding, overflow:"hidden" }}>
          <ColaImage index={0} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
