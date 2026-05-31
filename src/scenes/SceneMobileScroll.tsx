import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ColaImage } from "../components/ColaImage";
import {
  PHONE_BORDER, PHONE_BOTTOM_OFFSET, PHONE_HEIGHT,
  PHONE_RADIUS, PHONE_TOP_OFFSET, PHONE_WIDTH,
  SCREEN_H, SCREEN_W,
} from "../components/PhoneFrame";

const IMAGES       = [3, 4, 5];   // ColaImage slots (new-1 … new-3)

export const SceneMobileScroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: cw, height: ch } = useVideoConfig();
  // Portrait canvas = mobile composition → scale phone up slightly
  const phoneScale = ch > cw ? 1.35 : 1;

  // ── Portrait scroll: 3 images, scroll UP through 2 full image heights ──────
  // Start scrolling at frame 8, finish by frame 82 (leave 8 frames of hold)
  // "Open Happiness" — position above the (possibly scaled) phone
  // Phone is centered: top edge = (canvasHeight - phoneHeight*scale) / 2
  const phoneTopEdge = (ch - PHONE_HEIGHT * phoneScale) / 2;
  const textBottom   = phoneTopEdge - 40;   // 40px gap between text and phone top

  const headerOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, 10], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const scrollY = interpolate(
    frame,
    [8, 78],
    [0, -(SCREEN_H * (IMAGES.length - 1))],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#FFF5E4" }}>

      {/* "Open Happiness" — sits above the phone with a precise gap */}
      <div style={{
        position:"absolute",
        bottom: ch - textBottom,   /* distance from bottom = canvas height minus textBottom */
        left:0, right:0,
        textAlign:"center",
        opacity:headerOpacity,
        transform:`translateY(${headerY}px)`,
        pointerEvents:"none", zIndex:20,
      }}>
        <div style={{ fontFamily:'"Pacifico", cursive', fontSize:62, color:"#F40009", textShadow:"0 4px 24px rgba(244,0,9,0.2)" }}>
          Open Happiness
        </div>
      </div>

      {/* Scale wrapper — 1.35× on mobile composition (portrait canvas) */}
      <div style={{ transform:`scale(${phoneScale})`, transformOrigin:"center center" }}>
      <div style={{ position:"relative", width:PHONE_WIDTH, height:PHONE_HEIGHT }}>

        {/* ── Hardware buttons — always visible (phone already established) ── */}
        <div>
          {/* Silent */}
          <div style={{ position:"absolute", left:-9, top:102, width:9, height:28,
            background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px",
            boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)" }} />
          {/* Vol up */}
          <div style={{ position:"absolute", left:-9, top:152, width:9, height:56,
            background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px",
            boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)" }} />
          {/* Vol down */}
          <div style={{ position:"absolute", left:-9, top:222, width:9, height:56,
            background:"linear-gradient(90deg,#c8000a,#F40009)", borderRadius:"4px 0 0 4px",
            boxShadow:"-1px 1px 3px rgba(0,0,0,0.3)" }} />
          {/* Power */}
          <div style={{ position:"absolute", right:-9, top:172, width:9, height:84,
            background:"linear-gradient(270deg,#c8000a,#F40009)", borderRadius:"0 4px 4px 0",
            boxShadow:"1px 1px 3px rgba(0,0,0,0.3)" }} />
        </div>

        {/* ── Phone body ── */}
        <div style={{
          position:"absolute", inset:0,
          border:`${PHONE_BORDER}px solid #F40009`,
          borderRadius:PHONE_RADIUS,
          backgroundColor:"#FFF5E4",
          overflow:"hidden",
          boxShadow:"0 32px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(244,0,9,0.2)",
        }}>
          {/* Dynamic Island */}
          <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
            width:126, height:37, backgroundColor:"#0A0A0A", borderRadius:"0 0 22px 22px", zIndex:20 }} />

          {/* Screen — portrait scroll */}
          <div style={{ position:"absolute", top:PHONE_TOP_OFFSET, left:0, right:0, bottom:PHONE_BOTTOM_OFFSET, overflow:"hidden" }}>
            <div style={{ transform:`translateY(${scrollY}px)`, willChange:"transform" }}>
              {IMAGES.map((colaIdx, i) => (
                <div key={i} style={{ width:SCREEN_W, height:SCREEN_H, overflow:"hidden", flexShrink:0 }}>
                  <ColaImage index={colaIdx} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Home indicator */}
          <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)",
            width:134, height:5, backgroundColor:"#F40009", borderRadius:3, zIndex:20 }} />
        </div>
      </div>
      </div>{/* /scale wrapper */}
    </AbsoluteFill>
  );
};
