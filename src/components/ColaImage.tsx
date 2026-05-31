import React from "react";
import { Img, staticFile } from "remotion";

/**
 * ColaImage — swap point for real product photos.
 *
 * HOW TO USE REAL IMAGES:
 * 1. Copy your images into the `public/` folder of this project.
 *    e.g.  public/coca-cola-1.jpg
 *          public/coca-cola-2.jpg
 *          public/coca-cola-3.jpg
 *          public/new-1.webp … public/new-5.webp
 *
 * 2. In the REAL_IMAGES array below, uncomment the relevant path.
 *
 * 3. Set USE_REAL_IMAGES = true.
 */

const USE_REAL_IMAGES = true;

// Paths relative to the public/ folder
const REAL_IMAGES: Record<number, string> = {
  0: "coca-cola-1.jpg",   // Scene 1 & scroll main image (was ezgif-frame-110.jpg)
  1: "coca-cola-2.jpg",
  2: "coca-cola-3.jpg",
  3: "new-1.webp",        // Spill images (Scene 4)
  4: "new-2.webp",
  5: "new-3.webp",
  6: "new-4.webp",
  7: "new-5.webp",
};

// Placeholder colour palette
const PLACEHOLDER_COLORS = [
  "#F40009",
  "#CC0007",
  "#E8000A",
  "#B80007",
  "#FF1A1A",
  "#D40008",
  "#F72020",
  "#A50006",
];

interface ColaImageProps {
  /** Which image slot to use (0-indexed) */
  index: number;
  style?: React.CSSProperties;
}

export const ColaImage: React.FC<ColaImageProps> = ({ index, style }) => {
  const baseStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    ...style,
  };

  if (USE_REAL_IMAGES && REAL_IMAGES[index]) {
    return <Img src={staticFile(REAL_IMAGES[index])} style={baseStyle} />;
  }

  // Placeholder: coloured rectangle with COCA-COLA label
  const bg = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 64,
          fontWeight: "bold",
          color: "#FFF5E4",
          letterSpacing: "0.08em",
          userSelect: "none",
          textShadow: "0 2px 12px rgba(0,0,0,0.4)",
        }}
      >
        COCA-COLA
      </span>
    </div>
  );
};
