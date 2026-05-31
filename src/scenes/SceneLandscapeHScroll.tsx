import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ColaImage } from "../components/ColaImage";
import {
  PHONE_BORDER, PHONE_BOTTOM_OFFSET, PHONE_HEIGHT,
  PHONE_RADIUS, PHONE_TOP_OFFSET, PHONE_WIDTH,
  SCREEN_H, SCREEN_W,
} from "../components/PhoneFrame";

// Landscape images (16:9 height relative to phone screen width)
const LANDSCAPE_H  = Math.round(SCREEN_W * 9 / 16);  // ≈ 206 px
const IMAGES        = [3, 4, 5, 6];                   // 4 images (new-1 … new-4)
const TOTAL_FRAMES  = 90;

// Portrait → landscape morph duration
const MORPH_END    = 18;
// Horizontal scroll window
const SCROLL_START = 14;
const SCROLL_END   = 85;

export const SceneLandscapeHScroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: cw, height: ch } = useVideoConfig();
  const phoneScale = ch > cw ? 1.35 : 1;

  // ── Portrait → landscape: compress image height ───────────────────────────
  const imageH = interpolate(frame, [0, MORPH_END], [SCREEN_H, LANDSCAPE_H], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  // Vertical centering of images within screen area
  const imageTopOffset = (SCREEN_H - imageH) / 2;

  // ── Horizontal scroll: right → left ───────────────────────────────────────
  // Start: first image entering from the right (+SCREEN_W * 0.6)
  // End:   last image centred (-(IMAGES.length - 1) * SCREEN_W)
  const translateX = interpolate(
    frame,
    [SCROLL_START, SCROLL_END],
    [SCREEN_W * 0.5, -(IMAGES.length - 1) * SCREEN_W],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // "Taste the feeling" — drifts opposite to the scroll direction
  const textSlide = interpolate(translateX, [SCREEN_W * 0.5, -(IMAGES.length - 1) * SCREEN_W], [-40, 120], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [SCROLL_START, SCROLL_START + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#FFF5E4" }}>

      {/* "Taste the feeling" — bottom label that drifts with scroll */}
      <div style={{
        position:"absolute", bottom:55, left:0, right:0,
        textAlign:"center",
        transform:`translateX(${textSlide}px)`,
        opacity:textOpacity,
        pointerEvents:"none", zIndex:20,
      }}>
        <div style={{ fontFamily:'"Playfair Display", serif', fontSize:28, fontStyle:"italic", color:"rgba(200,118,10,0.9)", letterSpacing:"0.12em" }}>
          — Taste the feeling —
        </div>
      </div>

      <div style={{ transform:`scale(${phoneScale})`, transformOrigin:"center center" }}>
      {/* Outer wrapper */}
      <div style={{ position:"relative", width:PHONE_WIDTH, height:PHONE_HEIGHT }}>

        {/* Hardware buttons */}
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

        {/* Phone body */}
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

          {/* Screen — landscape horizontal scroll */}
          <div style={{ position:"absolute", top:PHONE_TOP_OFFSET, left:0, right:0, bottom:PHONE_BOTTOM_OFFSET, overflow:"hidden", backgroundColor:"#FFF5E4" }}>

            {/* Vertical centering wrapper */}
            <div style={{ position:"absolute", top:imageTopOffset, left:0, right:0, height:imageH, overflow:"hidden" }}>
              {/* Horizontal strip of landscape images */}
              <div style={{ display:"flex", transform:`translateX(${translateX}px)`, willChange:"transform", height:"100%" }}>
                {IMAGES.map((colaIdx, i) => (
                  <div key={i} style={{ width:SCREEN_W, height:"100%", flexShrink:0, overflow:"hidden" }}>
                    <ColaImage
                      index={colaIdx}
                      style={{ width:"100%", height:"100%", objectFit:"cover" }}
                    />
                  </div>
                ))}
              </div>
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
