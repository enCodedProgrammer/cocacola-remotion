import React from "react";
import { AbsoluteFill } from "remotion";

export const FRAME_WIDTH = 1400;
export const FRAME_HEIGHT = 800;
export const FRAME_BORDER = 12;
export const FRAME_RADIUS = 4;

interface LandscapeFrameProps {
  /** Padding (px) between frame border and inner content */
  innerPadding?: number;
  children: React.ReactNode;
}

export const LandscapeFrame: React.FC<LandscapeFrameProps> = ({
  innerPadding = 0,
  children,
}) => {
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
        <div
          style={{
            position: "absolute",
            top: innerPadding,
            left: innerPadding,
            right: innerPadding,
            bottom: innerPadding,
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
