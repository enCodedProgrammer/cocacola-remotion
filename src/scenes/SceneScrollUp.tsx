import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ColaImage } from "../components/ColaImage";
import {
  FRAME_BORDER, FRAME_HEIGHT, FRAME_RADIUS, FRAME_WIDTH,
} from "../components/LandscapeFrame";

const PADDING      = 40;
const INNER_HEIGHT = FRAME_HEIGHT - PADDING * 2;
const IMAGE_COUNT  = 3;
const TOTAL_FRAMES = 45;

export const SceneScrollUp: React.FC = () => {
  const frame = useCurrentFrame();

  const maxScroll  = INNER_HEIGHT * (IMAGE_COUNT - 1);
  const translateY = interpolate(frame, [0, TOTAL_FRAMES], [0, -maxScroll], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── "Taste every drop" — subtle caption, bottom-left ──────────────────────
  const captionOpacity = interpolate(frame, [4, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Image counter synced with scroll (which image is prominent)
  const imageIdx = Math.min(
    IMAGE_COUNT - 1,
    Math.floor((frame / TOTAL_FRAMES) * IMAGE_COUNT)
  );

  return (
    <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#FFF5E4" }}>

      {/* Frame */}
      <div style={{
        width: FRAME_WIDTH, height: FRAME_HEIGHT,
        border: `${FRAME_BORDER}px solid #F40009`,
        borderRadius: FRAME_RADIUS,
        backgroundColor: "#FFF5E4",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}>
        {/* Scrolling images */}
        <div style={{ position:"absolute", top:PADDING, left:PADDING, right:PADDING, bottom:PADDING, overflow:"hidden" }}>
          <div style={{ display:"flex", flexDirection:"column", transform:`translateY(${translateY}px)`, willChange:"transform" }}>
            {Array.from({ length: IMAGE_COUNT }).map((_, i) => (
              <div key={i} style={{ width:"100%", height:INNER_HEIGHT, flexShrink:0 }}>
                <ColaImage index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* "Taste every drop" caption — bottom-left inside frame */}
        <div style={{
          position: "absolute",
          bottom: 52, left: 52,
          opacity: captionOpacity,
          zIndex: 20,
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 38,
            fontStyle: "italic",
            color: "#FFF5E4",
            letterSpacing: "0.04em",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}>
            Taste every drop
          </div>
          {/* Image counter */}
          <div style={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: 18,
            fontWeight: 700,
            color: "rgba(244,0,9,0.85)",
            letterSpacing: "0.25em",
            marginTop: 8,
          }}>
            {String(imageIdx + 1).padStart(2,"0")} — {String(IMAGE_COUNT).padStart(2,"0")}
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};
