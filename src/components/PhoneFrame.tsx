import React from "react";
import { AbsoluteFill } from "remotion";

export const PHONE_WIDTH        = 390;
export const PHONE_HEIGHT       = 844;
export const PHONE_BORDER       = 12;
export const PHONE_RADIUS       = 44;
export const PHONE_TOP_OFFSET   = 44;   // below notch
export const PHONE_BOTTOM_OFFSET = 34;  // above home indicator

// Derived screen dimensions
export const SCREEN_W = PHONE_WIDTH  - PHONE_BORDER * 2;
export const SCREEN_H = PHONE_HEIGHT - PHONE_BORDER * 2 - PHONE_TOP_OFFSET - PHONE_BOTTOM_OFFSET;

interface PhoneFrameProps {
  children: React.ReactNode;
  allowOverflow?: boolean;
  showButtons?: boolean;
  buttonsOpacity?: number;
  style?: React.CSSProperties;
}

/** Hardware buttons rendered outside the phone body overflow */
const HardwareButtons: React.FC<{ opacity: number }> = ({ opacity }) => (
  <>
    {/* ── LEFT SIDE ── */}
    {/* Silent / mute toggle */}
    <div style={{ position:"absolute", left:-9, top:102, width:9, height:28,
      background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px",
      opacity, boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)" }} />
    {/* Volume up */}
    <div style={{ position:"absolute", left:-9, top:152, width:9, height:56,
      background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px",
      opacity, boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)" }} />
    {/* Volume down */}
    <div style={{ position:"absolute", left:-9, top:222, width:9, height:56,
      background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px",
      opacity, boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)" }} />

    {/* ── RIGHT SIDE ── */}
    {/* Power / sleep */}
    <div style={{ position:"absolute", right:-9, top:172, width:9, height:84,
      background:"linear-gradient(270deg,#c8000a,#F40009)", borderRadius:"0 4px 4px 0",
      opacity, boxShadow:"1px 1px 3px rgba(0,0,0,0.3)" }} />
  </>
);

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  allowOverflow  = false,
  showButtons    = false,
  buttonsOpacity = 1,
  style,
}) => (
  // Outer wrapper — no overflow so hardware buttons extend outside the body
  <div style={{ position:"relative", width:PHONE_WIDTH, height:PHONE_HEIGHT, flexShrink:0 }}>

    {showButtons && <HardwareButtons opacity={buttonsOpacity} />}

    {/* Phone body */}
    <div style={{
      position:"absolute", inset:0,
      border:`${PHONE_BORDER}px solid #F40009`,
      borderRadius:PHONE_RADIUS,
      backgroundColor:"#FFF5E4",
      overflow: allowOverflow ? "visible" : "hidden",
      boxShadow:"0 32px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(244,0,9,0.25)",
      ...style,
    }}>
      {/* Dynamic Island */}
      <div style={{
        position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:126, height:37, backgroundColor:"#0A0A0A",
        borderRadius:"0 0 22px 22px", zIndex:20,
      }} />

      {/* Screen area */}
      <div style={{
        position:"absolute",
        top:PHONE_TOP_OFFSET, left:0, right:0, bottom:PHONE_BOTTOM_OFFSET,
        overflow: allowOverflow ? "visible" : "hidden",
      }}>
        {children}
      </div>

      {/* Home indicator */}
      <div style={{
        position:"absolute", bottom:10, left:"50%",
        transform:"translateX(-50%)",
        width:134, height:5, backgroundColor:"#F40009",
        borderRadius:3, zIndex:20,
      }} />
    </div>
  </div>
);

export const CenteredPhone: React.FC<PhoneFrameProps> = (props) => (
  <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
    <PhoneFrame {...props} />
  </AbsoluteFill>
);
