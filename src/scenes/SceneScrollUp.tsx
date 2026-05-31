import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ColaImage } from "../components/ColaImage";
import {
  FRAME_HEIGHT,
  FRAME_BORDER,
  FRAME_RADIUS,
  FRAME_WIDTH,
} from "../components/LandscapeFrame";
import { AbsoluteFill } from "remotion";

const PADDING = 40; // matches end-state of Scene 1
const INNER_HEIGHT = FRAME_HEIGHT - PADDING * 2; // 720px — height of one image slot
const IMAGE_COUNT = 3;
const TOTAL_FRAMES = 45; // full 1.5s

export const SceneScrollUp: React.FC = () => {
  const frame = useCurrentFrame();

  // Scroll through (IMAGE_COUNT - 1) image heights to land on the last image
  const maxScroll = INNER_HEIGHT * (IMAGE_COUNT - 1);

  const translateY = interpolate(frame, [0, TOTAL_FRAMES], [0, -maxScroll], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    // Linear — mimics a real browser scroll
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
      {/* Outer frame shell */}
      <div
        style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          border: `${FRAME_BORDER}px solid #F40009`,
          borderRadius: FRAME_RADIUS,
          backgroundColor: "#FFF5E4",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Padded inner viewport — clips the scroll */}
        <div
          style={{
            position: "absolute",
            top: PADDING,
            left: PADDING,
            right: PADDING,
            bottom: PADDING,
            overflow: "hidden",
          }}
        >
          {/* Scrolling image stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              transform: `translateY(${translateY}px)`,
              willChange: "transform",
            }}
          >
            {Array.from({ length: IMAGE_COUNT }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "100%",
                  height: INNER_HEIGHT,
                  flexShrink: 0,
                }}
              >
                <ColaImage index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
