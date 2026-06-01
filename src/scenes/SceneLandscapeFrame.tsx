import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ColaImage } from "../components/ColaImage";
import { FRAME_BORDER, FRAME_HEIGHT, FRAME_RADIUS, FRAME_WIDTH } from "../components/LandscapeFrame";

const SHRINK_START   = 15;
const SHRINK_END     = 39;
const TARGET_PADDING = 40;

// Side-by-side layout constants (1920 × 1080 canvas)
// [60px left pad] [~300px text] [60px gap] [1400px frame] [~100px right pad]
const TEXT_LEFT   = 60;
const FRAME_LEFT  = 420;   // text (300) + gap (60) + left-pad (60) = 420
const CANVAS_W    = 1920;

export const SceneLandscapeFrame: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Image padding (shrink) ─────────────────────────────────────────────────
  const padding = interpolate(frame, [SHRINK_START, SHRINK_END], [0, TARGET_PADDING], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  // ── Frame: swipes in from the right to its side-by-side position ──────────
  const framePosLeft = interpolate(
    frame,
    [0, 13],
    [CANVAS_W + 100, FRAME_LEFT],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // ── Text: large title card → compact side label, stays visible always ─────
  const textSize = interpolate(frame, [0, 13, 59], [118, 56, 56], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  // Fade in quickly at the very start, then stay at full opacity throughout
  const textOpacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [0, 13], [260, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFF5E4" }}>

      {/* ── "Share the happiness" — left strip, always visible ─────────────── */}
      <div style={{
        position: "absolute",
        left: TEXT_LEFT,
        top: "50%",
        transform: "translateY(-50%)",
        width: 310,
        opacity: textOpacity,
        zIndex: 20,
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: '"Pacifico", cursive',
          fontSize: textSize,
          color: "#F40009",
          lineHeight: 1.2,
          textShadow: "0 4px 18px rgba(244,0,9,0.15)",
          wordBreak: "keep-all",
        }}>
          Share the<br />happiness
        </div>
        <div style={{
          width: lineWidth,
          height: 3,
          background: "linear-gradient(90deg, #F40009, transparent)",
          marginTop: 14,
        }} />
      </div>

      {/* ── Landscape frame — swipes in from right, settles beside the text ── */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: framePosLeft,
        transform: "translateY(-50%)",
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
