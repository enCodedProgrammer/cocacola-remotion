import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ColaImage } from "../components/ColaImage";
import {
  FRAME_BORDER,
  FRAME_HEIGHT,
  FRAME_WIDTH,
} from "../components/LandscapeFrame";
import {
  PHONE_BOTTOM_OFFSET,
  PHONE_HEIGHT,
  PHONE_RADIUS,
  PHONE_TOP_OFFSET,
  PHONE_WIDTH,
} from "../components/PhoneFrame";

export const SceneMobileMorph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring drives the entire morph (0 → 1)
  const progress = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 30,
  });

  // Morphing dimensions
  const width = interpolate(progress, [0, 1], [FRAME_WIDTH, PHONE_WIDTH]);
  const height = interpolate(progress, [0, 1], [FRAME_HEIGHT, PHONE_HEIGHT]);
  const borderRadius = interpolate(progress, [0, 1], [4, PHONE_RADIUS]);

  // Padding: landscape has 40px inner padding, phone has 0 (notch offset handled separately)
  const innerTop = interpolate(progress, [0, 1], [40, PHONE_TOP_OFFSET]);
  const innerSide = interpolate(progress, [0, 1], [40, 0]);
  const innerBottom = interpolate(progress, [0, 1], [40, PHONE_BOTTOM_OFFSET]);

  // Phone-specific elements fade in late in the morph
  const phoneUIOpacity = interpolate(progress, [0.55, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF5E4",
      }}
    >
      <div
        style={{
          width,
          height,
          border: `${FRAME_BORDER}px solid #F40009`,
          borderRadius,
          backgroundColor: "#FFF5E4",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          boxShadow:
            progress > 0.3
              ? `0 ${interpolate(progress, [0.3, 1], [0, 40])}px ${interpolate(
                  progress,
                  [0.3, 1],
                  [0, 100]
                )}px rgba(0,0,0,0.6)`
              : "none",
        }}
      >
        {/* Dynamic Island — appears as phone shape emerges */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 126,
            height: 37,
            backgroundColor: "#FFF5E4",
            borderRadius: "0 0 22px 22px",
            zIndex: 20,
            opacity: phoneUIOpacity,
          }}
        />

        {/* Inner content — shows the last scrolled image (image index 2) */}
        <div
          style={{
            position: "absolute",
            top: innerTop,
            left: innerSide,
            right: innerSide,
            bottom: innerBottom,
            overflow: "hidden",
          }}
        >
          <ColaImage index={2} />
        </div>

        {/* Home indicator — appears with the phone UI */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 134,
            height: 5,
            backgroundColor: "#F40009",
            borderRadius: 3,
            zIndex: 20,
            opacity: phoneUIOpacity,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
