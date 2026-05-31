import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ColaImage } from "../components/ColaImage";
import { FRAME_BORDER, FRAME_HEIGHT, FRAME_RADIUS, FRAME_WIDTH } from "../components/LandscapeFrame";

const SHRINK_START   = 15;
const SHRINK_END     = 39;
const TARGET_PADDING = 40;

export const SceneLandscapeFrame: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Image padding (existing shrink) ──────────────────────────────────────
  const padding = interpolate(frame, [SHRINK_START, SHRINK_END], [0, TARGET_PADDING], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  // ── Frame swipes in from the right ───────────────────────────────────────
  const frameX = interpolate(frame, [0, 13], [FRAME_WIDTH + 260, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── "Share the happiness" — title card that compresses as frame enters ────
  // Large at first, shrinks to a caption once the frame occupies the canvas
  const textSize = interpolate(frame, [0, 13, 59], [168, 86, 70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const textTop = interpolate(frame, [0, 13], [380, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [0, 3, 52, 59], [0, 1, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Decorative line under text shrinks with text
  const lineWidth = interpolate(frame, [0, 13], [340, 175], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFF5E4" }}>

      {/* ── "Share the happiness" — starts as dramatic title, becomes caption ── */}
      <div style={{
        position: "absolute",
        left: 80,
        top: textTop,
        opacity: textOpacity,
        zIndex: 5,
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: '"Pacifico", cursive',
          fontSize: textSize,
          color: "#F40009",
          lineHeight: 1.15,
          textShadow: "0 6px 24px rgba(244,0,9,0.18)",
        }}>
          Share the<br />happiness
        </div>
        <div style={{
          width: lineWidth,
          height: 3,
          background: "linear-gradient(90deg, #F40009, transparent)",
          marginTop: 14,
          transition: "none",
        }} />
      </div>

      {/* ── Landscape frame — swipes in from the right ── */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(calc(-50% + ${frameX}px), -50%)`,
        zIndex: 10,
      }}>
        <div style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          border: `${FRAME_BORDER}px solid #F40009`,
          borderRadius: FRAME_RADIUS,
          backgroundColor: "#FFF5E4",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute",
            top: padding, left: padding, right: padding, bottom: padding,
            overflow: "hidden",
          }}>
            <ColaImage index={0} />
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
