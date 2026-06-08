import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion";

// ─── Assets ───────────────────────────────────────────────────────────────────
const IMG = {
  c1: staticFile("coca-cola-1.jpg"),
  c2: staticFile("coca-cola-2.jpg"),
  c3: staticFile("coca-cola-3.jpg"),
  n1: staticFile("new-1.webp"),
  n2: staticFile("new-2.webp"),
  n3: staticFile("new-3.webp"),
  n4: staticFile("new-4.webp"),
  n5: staticFile("new-5.webp"),
};

// ─── Frame map (30 fps) ───────────────────────────────────────────────────────
// Scene 1 — Cold Open            0  –  59  (60f  / 2s)
// Scene 2 — Ken Burns           60  – 179  (120f / 4s)
// Scene 3 — Zoom Punches       180  – 269  (90f  / 3s)
// Scene 4 — Parallax Gallery   270  – 359  (90f  / 3s)
// Scene 5 — Product Throne     360  – 449  (90f  / 3s)
// Scene 6 — Glitch Finale      450  – 469  (20f)
// Scene 7 — Closing Card       470  – 477  (8f)
// Total: 478 frames

// ─── Shared primitives ────────────────────────────────────────────────────────
const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse at 50% 50%, transparent 28%, rgba(0,0,0,${strength}) 100%)`,
      zIndex: 20,
    }}
  />
);

const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const freq = 0.62 + (frame % 9) * 0.009;
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.055,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <filter id={`grain-${frame % 9}`}>
        <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${frame % 9})`} />
    </svg>
  );
};

const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 90, background: "#000", zIndex: 200 }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "#000", zIndex: 200 }} />
  </>
);

const ChromaticImg: React.FC<{ src: string; glitch: number }> = ({ src, glitch }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(4) hue-rotate(0deg)", transform: `translateX(${glitch}px)`, opacity: 0.45, mixBlendMode: "screen" }} />
    <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(4) hue-rotate(220deg)", transform: `translateX(${-glitch}px)`, opacity: 0.45, mixBlendMode: "screen" }} />
    <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

// ─── Preload all images so Remotion never hits a blank frame ──────────────────
const PreloadAll: React.FC = () => (
  <div style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none", overflow: "hidden" }}>
    {Object.values(IMG).map((src) => (
      <Img key={src} src={src} style={{ width: 1, height: 1 }} />
    ))}
  </div>
);

// ─── Scene 1: Cold Open (local frames 0–59) ───────────────────────────────────
// useCurrentFrame() is already local (0-based) inside each <Sequence>
const Scene1ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();

  const lightLeakX = interpolate(frame, [0, 59], [-200, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lightLeakOpacity = interpolate(frame, [0, 15, 40, 59], [0, 0.38, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const LETTERS = "COCA-COLA".split("");

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,160,60,0.9) 0%, rgba(255,100,20,0.4) 40%, transparent 70%)", top: -250, left: lightLeakX, opacity: lightLeakOpacity, zIndex: 5, pointerEvents: "none" }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
        <div style={{ display: "flex", gap: 0 }}>
          {LETTERS.map((char, i) => {
            const charOpacity = interpolate(frame, [10 + i * 2, 10 + i * 2 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const charY = interpolate(frame, [10 + i * 2, 10 + i * 2 + 14], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <span key={i} style={{ fontFamily: "'Pacifico', cursive", fontSize: 130, color: "#fff", opacity: charOpacity, transform: `translateY(${charY}px)`, display: "inline-block", lineHeight: 1, whiteSpace: "pre", textShadow: "0 0 60px rgba(255,255,255,0.25)" }}>
                {char}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 24, fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 300, color: "#fff", letterSpacing: "0.55em", opacity: interpolate(frame, [28, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textTransform: "uppercase" }}>
          OPEN HAPPINESS
        </div>
      </AbsoluteFill>

      <FilmGrain />
      <Letterbox />
    </AbsoluteFill>
  );
};

// ─── Scene 2: Ken Burns (local frames 0–119) ──────────────────────────────────
const Scene2KenBurns: React.FC = () => {
  const frame = useCurrentFrame(); // 0–119

  const kenScale = interpolate(frame, [0, 119], [1.0, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const kenX     = interpolate(frame, [0, 119], [0, -50],   { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kenY     = interpolate(frame, [0, 119], [0, -22],   { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const textParallaxX = interpolate(frame, [0, 119], [0, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Opacity  = interpolate(frame, [0, 18],  [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Opacity  = interpolate(frame, [12, 32], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y        = interpolate(frame, [0, 20],  [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y        = interpolate(frame, [12, 34], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneOpacity  = interpolate(frame, [0, 8],   [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000", opacity: sceneOpacity }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={IMG.c1} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kenScale}) translateX(${kenX}px) translateY(${kenY}px)`, transformOrigin: "center center" }} />
      </AbsoluteFill>

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(20,10,0,0.42) 0%, rgba(0,0,0,0) 55%)", mixBlendMode: "multiply", zIndex: 10, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(0,18,38,0.52) 100%)", zIndex: 11, pointerEvents: "none" }} />

      <div style={{ position: "absolute", left: 120 + textParallaxX, top: 220, zIndex: 30 }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 72, fontWeight: 400, color: "#fff", opacity: line1Opacity, transform: `translateY(${line1Y}px)`, textShadow: "0 2px 30px rgba(0,0,0,0.6)", lineHeight: 1.1 }}>
          Taste the
        </div>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 96, fontWeight: 800, color: "#fff", opacity: line2Opacity, transform: `translateY(${line2Y}px)`, textShadow: "0 2px 40px rgba(0,0,0,0.5)", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1 }}>
          Extraordinary
        </div>
      </div>

      <Vignette strength={0.6} />
      <FilmGrain />
      <Letterbox />
    </AbsoluteFill>
  );
};

// ─── Scene 3: Zoom Punch Rapid Cuts (local frames 0–89) ──────────────────────
// Each beat uses LOCAL offsets (0, 30, 60) — not global frame numbers
const ZoomBeat: React.FC<{ src: string; localStart: number; duration: number }> = ({ src, localStart, duration }) => {
  const frame = useCurrentFrame(); // local to Scene 3's Sequence
  const t = frame - localStart;
  if (t < 0 || t >= duration) return null;

  const scale        = interpolate(t, [0, 4, duration], [1.0, 1.2, 1.07], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const glitchAmt    = interpolate(t, [0, 1, 6, 8],    [0, 6, 5, 0],     { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashOpacity = interpolate(t, [0, 1, 5],        [0, 0.72, 0],     { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wipeProgress = interpolate(t, [duration - 5, duration - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <ChromaticImg src={src} glitch={glitchAmt} />
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flashOpacity, zIndex: 30 }} />
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${wipeProgress * 100}%`, background: "#F40009", zIndex: 40 }} />
    </AbsoluteFill>
  );
};

const Scene3ZoomPunches: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000", opacity: sceneOpacity }}>
      <ZoomBeat src={IMG.n1} localStart={0}  duration={30} />
      <ZoomBeat src={IMG.n2} localStart={30} duration={30} />
      <ZoomBeat src={IMG.n3} localStart={60} duration={30} />
      <FilmGrain />
      <Letterbox />
    </AbsoluteFill>
  );
};

// ─── Scene 4: Deep Parallax Gallery (local frames 0–89) ──────────────────────
const Scene4Parallax: React.FC = () => {
  const frame = useCurrentFrame(); // 0–89

  const drift        = interpolate(frame, [0, 89], [0, 80],   { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const sceneOpacity = interpolate(frame, [0, 12], [0, 1],    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wipe         = interpolate(frame, [35, 55], [0, 1],   { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const wipeX        = wipe * 1920;
  const textOpacity  = interpolate(frame, [8, 28],  [0, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textDrift    = interpolate(frame, [0, 89],  [0, -30],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0a0500", opacity: sceneOpacity }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={IMG.c2} style={{ width: "110%", height: "110%", objectFit: "cover", transform: `translateX(${-drift * 0.5}px)` }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={IMG.n4} style={{ position: "absolute", inset: 0, width: "110%", height: "110%", objectFit: "cover", transform: `translateX(${-drift * 1.0}px)`, opacity: 0.82, clipPath: `polygon(${wipeX}px 0, 100% 0, 100% 100%, ${wipeX - 200}px 100%)` }} />
      </AbsoluteFill>

      <div style={{ position: "absolute", inset: 0, background: "rgba(255,155,35,0.13)", mixBlendMode: "soft-light", zIndex: 15, pointerEvents: "none" }} />

      <div style={{ position: "absolute", right: 140 + textDrift, bottom: 180, zIndex: 30, opacity: textOpacity, pointerEvents: "none" }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 200, fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>1886</div>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 300, color: "#fff", letterSpacing: "0.6em", textTransform: "uppercase", textAlign: "right", marginTop: -10, opacity: 0.7 }}>Since</div>
      </div>

      <Vignette strength={0.65} />
      <FilmGrain />
      <Letterbox />
    </AbsoluteFill>
  );
};

// ─── Scene 5: Product Throne (local frames 0–89) ──────────────────────────────
const Scene5Throne: React.FC = () => {
  const frame = useCurrentFrame(); // 0–89
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowOpacity  = interpolate(frame, [0, 20, 40, 60, 80, 89], [0, 0.32, 0.10, 0.30, 0.10, 0.20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const textY       = spring({ fps, frame, config: { damping: 160, stiffness: 90 }, from: 130, to: 0 });
  const textOpacity = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const particles = Array.from({ length: 12 }, (_, i) => ({
    px: random(`px-${i}`) * 1920,
    py: 150 + random(`py-${i}`) * 780,
    size: 4 + random(`ps-${i}`) * 8,
    delay: random(`pd-${i}`) * 30,
  }));

  return (
    <AbsoluteFill style={{ background: "#000", opacity: sceneOpacity }}>
      <AbsoluteFill>
        <Img src={IMG.c3} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.05)" }} />
      </AbsoluteFill>

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,220,160,0.3) 35%, transparent 65%)", opacity: glowOpacity, zIndex: 12, pointerEvents: "none", mixBlendMode: "screen" }} />

      {particles.map(({ px, py, size, delay }, i) => {
        const pOpacity = interpolate(frame, [delay, delay + 10, delay + 40, delay + 80], [0, 0.7, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", left: px, top: py, width: size, height: size, borderRadius: "50%", background: "#F40009", opacity: pOpacity, filter: "blur(2px)", zIndex: 25 }} />;
      })}

      <AbsoluteFill style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 160, zIndex: 35 }}>
        <div style={{ transform: `translateY(${textY}px)`, opacity: textOpacity, textAlign: "center" }}>
          <div style={{ fontFamily: "'Pacifico', cursive", fontSize: 140, color: "#fff", textShadow: "0 4px 60px rgba(0,0,0,0.8), 0 0 120px rgba(244,0,9,0.3)", lineHeight: 1 }}>Coca-Cola</div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 300, color: "#fff", letterSpacing: "0.6em", opacity: 0.8, marginTop: 14, textTransform: "uppercase" }}>The Real Thing</div>
        </div>
      </AbsoluteFill>

      <Vignette strength={0.8} />
      <FilmGrain />
      <Letterbox />
    </AbsoluteFill>
  );
};

// ─── Scene 6: Glitch Finale (local frames 0–19) ───────────────────────────────
const Scene6GlitchFinale: React.FC = () => {
  const frame = useCurrentFrame(); // 0–19
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sliceOffsets = Array.from({ length: 8 }, (_, i) => {
    const sign = i % 2 === 0 ? 1 : -1;
    return spring({ fps, frame, config: { damping: 85, stiffness: 200 }, from: sign * (20 + random(`slice-${i}`) * 70), to: 0 });
  });
  const chromaAmt    = interpolate(frame, [0, 14],  [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashOpacity = interpolate(frame, [15, 19], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sliceH       = 1080 / 8;

  return (
    <AbsoluteFill style={{ background: "#000", opacity: sceneOpacity }}>
      {sliceOffsets.map((offset, i) => (
        <AbsoluteFill key={i} style={{ clipPath: `inset(${i * sliceH}px 0 ${1080 - (i + 1) * sliceH}px 0)`, transform: `translateX(${offset}px)` }}>
          <Img src={IMG.n3} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      ))}

      <AbsoluteFill style={{ opacity: 0.5, mixBlendMode: "screen" }}>
        <Img src={IMG.n3} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(5) hue-rotate(0deg)", transform: `translateX(${-chromaAmt}px)` }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ background: "#fff", opacity: flashOpacity, zIndex: 90 }} />
      <FilmGrain />
      <Letterbox />
    </AbsoluteFill>
  );
};

// ─── Scene 7: Closing Card (local frames 0–7) ─────────────────────────────────
const Scene7ClosingCard: React.FC = () => {
  const frame = useCurrentFrame(); // 0–7

  return (
    <AbsoluteFill style={{ background: "#0a0000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'Pacifico', cursive", fontSize: 120, color: "#F40009", opacity: interpolate(frame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 0 80px rgba(244,0,9,0.35)", lineHeight: 1 }}>
        Coca-Cola
      </div>
      <div style={{ width: interpolate(frame, [2, 7], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), height: 1.5, background: "#F40009", marginTop: 16, marginBottom: 16, opacity: interpolate(frame, [2, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 300, color: "#fff", letterSpacing: "0.6em", textTransform: "uppercase", opacity: interpolate(frame, [3, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Open Happiness
      </div>
      <FilmGrain />
      <Letterbox />
    </AbsoluteFill>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export const LuxuryComposition: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <PreloadAll />
    <Sequence from={0}   durationInFrames={60}><Scene1ColdOpen /></Sequence>
    <Sequence from={60}  durationInFrames={120}><Scene2KenBurns /></Sequence>
    <Sequence from={180} durationInFrames={90}><Scene3ZoomPunches /></Sequence>
    <Sequence from={270} durationInFrames={90}><Scene4Parallax /></Sequence>
    <Sequence from={360} durationInFrames={90}><Scene5Throne /></Sequence>
    <Sequence from={450} durationInFrames={20}><Scene6GlitchFinale /></Sequence>
    <Sequence from={470} durationInFrames={8}><Scene7ClosingCard /></Sequence>
  </AbsoluteFill>
);
