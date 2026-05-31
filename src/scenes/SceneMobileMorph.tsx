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

  // "Going mobile." text — fades in on the right as phone takes shape
  const textOpacity = interpolate(progress, [0.4, 0.85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textX = interpolate(progress, [0.4, 0.85], [60, 0], {
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
      {/* "Going mobile." — appears on the right as phone forms */}
      <div style={{
        position: "absolute",
        right: 90,
        top: "50%",
        transform: `translateY(-50%) translateX(${textX}px)`,
        opacity: textOpacity,
        textAlign: "right",
        pointerEvents: "none",
        zIndex: 5,
      }}>
        <div style={{
          fontFamily: '"Pacifico", cursive',
          fontSize: 68,
          color: "#F40009",
          lineHeight: 1.2,
          textShadow: "0 4px 20px rgba(244,0,9,0.15)",
        }}>
          Going<br />mobile.
        </div>
        <div style={{
          fontFamily: '"Montserrat", sans-serif',
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(200,118,10,0.8)",
          marginTop: 10,
        }}>
          Since 1886
        </div>
      </div>

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
            backgroundColor: "#0A0A0A",
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
          {/* Show the first mobile-scroll image so there's no cut at scene boundary */}
          <ColaImage index={3} />
        </div>

        {/* Home indicator */}
        <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)",
          width:134, height:5, backgroundColor:"#F40009", borderRadius:3, zIndex:20, opacity:phoneUIOpacity }} />

        {/* Hardware buttons — fade in with phone chrome */}
        <div style={{ opacity: phoneUIOpacity }}>
          <div style={{ position:"absolute", left:-9, top:102, width:9, height:28,
            background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px",
            boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)" }} />
          <div style={{ position:"absolute", left:-9, top:152, width:9, height:56,
            background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px",
            boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)" }} />
          <div style={{ position:"absolute", left:-9, top:222, width:9, height:56,
            background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px",
            boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)" }} />
          <div style={{ position:"absolute", right:-9, top:172, width:9, height:84,
            background:"linear-gradient(270deg,#c8000a,#F40009)", borderRadius:"0 4px 4px 0",
            boxShadow:"1px 1px 3px rgba(0,0,0,0.3)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
