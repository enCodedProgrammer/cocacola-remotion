import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ColaImage } from "../components/ColaImage";
import { PFRAME_BORDER, PFRAME_H, PFRAME_RADIUS, PFRAME_W } from "./ScenePortraitFrame";

const PADDING     = 40;
const INNER_H     = PFRAME_H - PADDING * 2;
const IMAGE_COUNT = 3;
const TOTAL_FRAMES = 45;

export const SceneScrollUpPortrait: React.FC = () => {
  const frame = useCurrentFrame();

  const translateY = interpolate(frame, [0, TOTAL_FRAMES], [0, -(INNER_H * (IMAGE_COUNT - 1))], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        <div style={{ position:"absolute", top:PADDING, left:PADDING, right:PADDING, bottom:PADDING, overflow:"hidden" }}>
          <div style={{ display:"flex", flexDirection:"column", transform:`translateY(${translateY}px)`, willChange:"transform" }}>
            {Array.from({ length: IMAGE_COUNT }).map((_, i) => (
              <div key={i} style={{ width: PFRAME_W - PADDING * 2, height: INNER_H, flexShrink: 0 }}>
                <ColaImage index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
