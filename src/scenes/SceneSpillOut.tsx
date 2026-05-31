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
  PHONE_BORDER,
  PHONE_BOTTOM_OFFSET,
  PHONE_HEIGHT,
  PHONE_RADIUS,
  PHONE_TOP_OFFSET,
  PHONE_WIDTH,
} from "../components/PhoneFrame";

// Phase timing (local frames)
const VERTICAL_SCROLL_END = 15;  // 0–14: vertical scroll inside phone
const SPILL_START = 15;          // 15–44: horizontal spill begins

// Spill image configuration
// index = ColaImage slot (3-7 maps to new-1.webp … new-5.webp in ColaImage)
const SPILL_IMAGES = [
  { colaIndex: 3, xOffset: -780, rotation: -3 },
  { colaIndex: 4, xOffset: -400, rotation:  0 },
  { colaIndex: 5, xOffset:    0, rotation:  3 }, // centre — stays inside phone
  { colaIndex: 6, xOffset:  400, rotation:  0 },
  { colaIndex: 7, xOffset:  780, rotation: -3 },
];

const CENTER_IMAGE_IDX = 2; // index into SPILL_IMAGES that sits inside the phone

// Phone screen inner size
const SCREEN_WIDTH = PHONE_WIDTH - PHONE_BORDER * 2;
const SCREEN_HEIGHT =
  PHONE_HEIGHT - PHONE_BORDER * 2 - PHONE_TOP_OFFSET - PHONE_BOTTOM_OFFSET;

// Spill image card dimensions (slightly smaller than phone screen for visual layering)
const SPILL_CARD_WIDTH = SCREEN_WIDTH + 40;
const SPILL_CARD_HEIGHT = SCREEN_HEIGHT - 20;

export const SceneSpillOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase A: vertical scroll inside phone (frames 0–14) ──────────────────
  const verticalScroll = interpolate(
    frame,
    [0, VERTICAL_SCROLL_END],
    [0, -180],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Phase B: horizontal spill (frames 15–44) ─────────────────────────────
  const spillFrame = Math.max(0, frame - SPILL_START);

  const spillProgress = spring({
    fps,
    frame: spillFrame,
    config: { damping: 180, stiffness: 100 },
    durationInFrames: 30,
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
      {/*
       * Single positioned container centred on screen.
       * Everything — phone + spilled images — is positioned relative to it.
       */}
      <div
        style={{
          position: "relative",
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          flexShrink: 0,
        }}
      >
        {/* ── Spilled images (behind phone) ── */}
        {SPILL_IMAGES.map((img, i) => {
          if (i === CENTER_IMAGE_IDX) return null; // centre card rendered inside phone

          const currentX = interpolate(spillProgress, [0, 1], [0, img.xOffset], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const opacity = interpolate(spillProgress, [0, 0.25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Spill cards are vertically centred on the phone's screen area
          const cardTop =
            PHONE_BORDER +
            PHONE_TOP_OFFSET +
            (SCREEN_HEIGHT - SPILL_CARD_HEIGHT) / 2;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: cardTop,
                left: (PHONE_WIDTH - SPILL_CARD_WIDTH) / 2,
                width: SPILL_CARD_WIDTH,
                height: SPILL_CARD_HEIGHT,
                transform: `translateX(${currentX}px) rotate(${img.rotation}deg)`,
                opacity,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
                zIndex: i < CENTER_IMAGE_IDX ? 1 : 9, // behind / in-front of phone
              }}
            >
              <ColaImage index={img.colaIndex} />

              {/* Coca-Cola red tint overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#F40009",
                  opacity: 0.15,
                  pointerEvents: "none",
                }}
              />
            </div>
          );
        })}

        {/* ── Phone frame (z-index 10, sits on top of spill) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: PHONE_WIDTH,
            height: PHONE_HEIGHT,
            border: `${PHONE_BORDER}px solid #F40009`,
            borderRadius: PHONE_RADIUS,
            backgroundColor: "#FFF5E4",
            overflow: "hidden",
            zIndex: 10,
            boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
          }}
        >
          {/* Dynamic Island */}
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
            }}
          />

          {/* Screen — vertical scroll then holds */}
          <div
            style={{
              position: "absolute",
              top: PHONE_TOP_OFFSET,
              left: 0,
              right: 0,
              bottom: PHONE_BOTTOM_OFFSET,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                transform: `translateY(${verticalScroll}px)`,
                height: "100%",
              }}
            >
              <ColaImage
                index={SPILL_IMAGES[CENTER_IMAGE_IDX].colaIndex}
                style={{ height: SCREEN_HEIGHT }}
              />
            </div>
          </div>

          {/* Home indicator */}
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
      </div>
    </AbsoluteFill>
  );
};
