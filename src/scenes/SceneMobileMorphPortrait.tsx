import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ColaImage } from "../components/ColaImage";
import {
  PHONE_BORDER, PHONE_BOTTOM_OFFSET, PHONE_HEIGHT,
  PHONE_RADIUS, PHONE_TOP_OFFSET, PHONE_WIDTH,
} from "../components/PhoneFrame";
import { PFRAME_BORDER, PFRAME_H, PFRAME_RADIUS, PFRAME_W } from "./ScenePortraitFrame";

export const SceneMobileMorphPortrait: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 30,
  });

  const targetW = PHONE_WIDTH  * 1.35;
  const targetH = PHONE_HEIGHT * 1.35;
  const width        = interpolate(progress, [0, 1], [PFRAME_W,      targetW]);
  const height       = interpolate(progress, [0, 1], [PFRAME_H,      targetH]);
  const borderRadius = interpolate(progress, [0, 1], [PFRAME_RADIUS, PHONE_RADIUS]);
  const innerPad     = interpolate(progress, [0, 1], [40, 0]);
  const innerTop     = interpolate(progress, [0, 1], [40, PHONE_TOP_OFFSET]);
  const innerBottom  = interpolate(progress, [0, 1], [40, PHONE_BOTTOM_OFFSET]);
  const uiOpacity    = interpolate(progress, [0.55, 1], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#FFF5E4" }}>
      <div style={{ position:"relative", width, height, flexShrink: 0 }}>

        {/* Hardware buttons fade in with phone chrome */}
        <div style={{ opacity: uiOpacity }}>
          <div style={{ position:"absolute", left:-9, top:102, width:9, height:28, background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px" }} />
          <div style={{ position:"absolute", left:-9, top:152, width:9, height:56, background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px" }} />
          <div style={{ position:"absolute", left:-9, top:222, width:9, height:56, background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px" }} />
          <div style={{ position:"absolute", right:-9, top:172, width:9, height:84, background:"linear-gradient(270deg,#c8000a,#F40009)", borderRadius:"0 4px 4px 0" }} />
        </div>

        {/* Morphing frame/phone body */}
        <div style={{
          position:"absolute", inset:0,
          border:`${PFRAME_BORDER}px solid #F40009`,
          borderRadius,
          backgroundColor:"#FFF5E4",
          overflow:"hidden",
          boxShadow: progress > 0.3 ? `0 40px 100px rgba(0,0,0,0.5)` : "none",
        }}>
          {/* Dynamic Island */}
          <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
            width:126, height:37, backgroundColor:"#0A0A0A",
            borderRadius:"0 0 22px 22px", zIndex:20, opacity:uiOpacity }} />

          {/* Content — already shows first scroll image */}
          <div style={{ position:"absolute", top:innerTop, left:innerPad, right:innerPad, bottom:innerBottom, overflow:"hidden" }}>
            <ColaImage index={3} />
          </div>

          {/* Home indicator */}
          <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)",
            width:134, height:5, backgroundColor:"#F40009", borderRadius:3, zIndex:20, opacity:uiOpacity }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
