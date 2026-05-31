import React from "react";
import {
  AbsoluteFill, Easing, interpolate, spring,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import { ColaImage } from "../components/ColaImage";
import {
  PHONE_BORDER, PHONE_BOTTOM_OFFSET, PHONE_HEIGHT,
  PHONE_RADIUS, PHONE_TOP_OFFSET, PHONE_WIDTH,
  SCREEN_H, SCREEN_W,
} from "../components/PhoneFrame";

// 5 cards spill out. The centre one (index 2) stays inside the phone.
const SPILL_IMAGES = [
  { colaIndex: 3, xOffset: -820, rotation: -3 },
  { colaIndex: 4, xOffset: -420, rotation:  0 },
  { colaIndex: 5, xOffset:    0, rotation:  3 }, // inside phone
  { colaIndex: 6, xOffset:  420, rotation:  0 },
  { colaIndex: 7, xOffset:  820, rotation: -3 },
];
const CENTER_IDX = 2;

// Card dimensions — landscape aspect for visual consistency with previous scene
const CARD_W = SCREEN_W + 30;
const CARD_H = Math.round(CARD_W * 9 / 16);

const SPILL_START  = 6;   // spill begins
const TOTAL_FRAMES = 60;  // 2 s

export const SceneSpillOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spillProgress = spring({
    fps,
    frame: Math.max(0, frame - SPILL_START),
    config: { damping: 160, stiffness: 90 },
    durationInFrames: 50,
  });

  // Cards fade + drift out
  const cardOpacity = interpolate(frame, [0, SPILL_START], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#FFF5E4" }}>

      {/* Centred anchor — everything positioned relative to phone centre */}
      <div style={{ position:"relative", width:PHONE_WIDTH, height:PHONE_HEIGHT }}>

        {/* ── Spilled cards (behind phone) ───────────────────────────────── */}
        {SPILL_IMAGES.map((img, i) => {
          if (i === CENTER_IDX) return null;

          const currentX = interpolate(spillProgress, [0, 1], [0, img.xOffset], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const opacity = interpolate(spillProgress, [0, 0.2], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });

          // Vertical centre of card within screen area
          const cardTop = PHONE_BORDER + PHONE_TOP_OFFSET + (SCREEN_H - CARD_H) / 2;

          return (
            <div key={i} style={{
              position:"absolute",
              top: cardTop,
              left: (PHONE_WIDTH - CARD_W) / 2,
              width: CARD_W,
              height: CARD_H,
              transform: `translateX(${currentX}px) rotate(${img.rotation}deg)`,
              opacity: opacity * cardOpacity,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              zIndex: i < CENTER_IDX ? 1 : 9,
            }}>
              <ColaImage index={img.colaIndex} />
              {/* Red tint overlay */}
              <div style={{ position:"absolute", inset:0, backgroundColor:"#F40009", opacity:0.12, pointerEvents:"none" }} />
            </div>
          );
        })}

        {/* ── Phone (z-index 10, sits above spilled cards) ────────────────── */}
        <div style={{
          position:"absolute", inset:0,
          border:`${PHONE_BORDER}px solid #F40009`,
          borderRadius:PHONE_RADIUS,
          backgroundColor:"#FFF5E4",
          overflow:"hidden",
          zIndex:10,
          boxShadow:"0 30px 80px rgba(0,0,0,0.55)",
        }}>
          {/* Dynamic Island */}
          <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
            width:126, height:37, backgroundColor:"#0A0A0A", borderRadius:"0 0 22px 22px", zIndex:20 }} />

          {/* Hardware buttons */}
          <div style={{ position:"absolute", left:-9, top:102, width:9, height:28,
            background:"linear-gradient(90deg,#b0b0b0,#d8d8d8)", borderRadius:"4px 0 0 4px",
            boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)", zIndex:30 }} />
          <div style={{ position:"absolute", left:-9, top:152, width:9, height:56,
            background:"linear-gradient(90deg,#b0b0b0,#d8d8d8)", borderRadius:"4px 0 0 4px",
            boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)", zIndex:30 }} />
          <div style={{ position:"absolute", left:-9, top:222, width:9, height:56,
            background:"linear-gradient(90deg,#b0b0b0,#d8d8d8)", borderRadius:"4px 0 0 4px",
            boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)", zIndex:30 }} />
          <div style={{ position:"absolute", right:-9, top:172, width:9, height:84,
            background:"linear-gradient(270deg,#b0b0b0,#d8d8d8)", borderRadius:"0 4px 4px 0",
            boxShadow:"1px 1px 3px rgba(0,0,0,0.3)", zIndex:30 }} />

          {/* Centre image (landscape) inside phone screen */}
          <div style={{ position:"absolute", top:PHONE_TOP_OFFSET, left:0, right:0, bottom:PHONE_BOTTOM_OFFSET, overflow:"hidden", display:"flex", alignItems:"center" }}>
            <div style={{ width:"100%", height:CARD_H, overflow:"hidden" }}>
              <ColaImage index={SPILL_IMAGES[CENTER_IDX].colaIndex} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          </div>

          {/* Home indicator */}
          <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)",
            width:134, height:5, backgroundColor:"#F40009", borderRadius:3, zIndex:20 }} />
        </div>

      </div>
    </AbsoluteFill>
  );
};
