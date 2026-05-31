import React from "react";
import { AbsoluteFill } from "remotion";

export const PHONE_WIDTH = 390;
export const PHONE_HEIGHT = 844;
export const PHONE_BORDER = 12;
export const PHONE_RADIUS = 44;

// Pixel offsets that define the screen area inside the phone shell
export const PHONE_TOP_OFFSET = 44;    // below notch
export const PHONE_BOTTOM_OFFSET = 34; // above home indicator

interface PhoneFrameProps {
  children: React.ReactNode;
  /** When true, children can overflow phone boundaries (Scene 4 spill) */
  allowOverflow?: boolean;
  style?: React.CSSProperties;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  allowOverflow = false,
  style,
}) => {
  return (
    <div
      style={{
        width: PHONE_WIDTH,
        height: PHONE_HEIGHT,
        border: `${PHONE_BORDER}px solid #F40009`,
        borderRadius: PHONE_RADIUS,
        backgroundColor: "#FFF5E4",
        overflow: allowOverflow ? "visible" : "hidden",
        position: "relative",
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Dynamic Island / Notch */}
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
        }}
      />

      {/* Screen content area */}
      <div
        style={{
          position: "absolute",
          top: PHONE_TOP_OFFSET,
          left: 0,
          right: 0,
          bottom: PHONE_BOTTOM_OFFSET,
          overflow: allowOverflow ? "visible" : "hidden",
        }}
      >
        {children}
      </div>

      {/* Home indicator pill */}
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
        }}
      />
    </div>
  );
};

/** Convenience wrapper that centers the PhoneFrame on screen */
export const CenteredPhone: React.FC<PhoneFrameProps> = (props) => (
  <AbsoluteFill
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <PhoneFrame {...props} />
  </AbsoluteFill>
);
