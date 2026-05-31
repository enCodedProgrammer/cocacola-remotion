import React, { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { CocaColaComposition } from "../../src/Composition";

const TOTAL_FRAMES = 179;
const SECTION_VH   = 600;   // how many vh of scroll space the video gets
const LERP         = 0.10;  // smoothness (lower = heavier lag)

export const RemotionSection: React.FC = () => {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const playerRef     = useRef<PlayerRef>(null);
  const hasSnappedRef = useRef(false);

  useEffect(() => {
    let current = 0;
    let target  = 0;

    // Pause player immediately on mount
    const pauseTimer = setTimeout(() => playerRef.current?.pause(), 200);

    // ── Map scroll within this section → frame 0-179 ──────────────────────
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollable = section.offsetHeight - window.innerHeight;
      const scrolled   = Math.max(0, window.scrollY - sectionTop);
      const progress   = scrollable > 0 ? Math.min(scrolled, scrollable) / scrollable : 0;

      target = progress * TOTAL_FRAMES;

      // ── Snap to next section the moment the video finishes ──────────────
      if (progress >= 1 && !hasSnappedRef.current) {
        hasSnappedRef.current = true;
        const next = section.nextElementSibling as HTMLElement | null;
        if (next) {
          // Instant jump — no smooth scroll — feels like a hard cut
          window.scrollTo(0, next.getBoundingClientRect().top + window.scrollY);
        }
      } else if (progress < 0.95) {
        // Reset guard so snapping re-triggers if user scrolls back
        hasSnappedRef.current = false;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // ── LERP loop using the CDN GSAP already loaded by the Coca-Cola page ──
    // window.gsap is the CDN version (loads before React mounts).
    // We reuse it to avoid two GSAP instances competing on the ticker.
    const g = (window as any).gsap;
    let tickerId: any;
    if (g) {
      tickerId = g.ticker.add(() => {
        current += (target - current) * LERP;
        const frame = Math.max(0, Math.min(Math.round(current), TOTAL_FRAMES));
        playerRef.current?.seekTo(frame);
      });
    }

    return () => {
      clearTimeout(pauseTimer);
      window.removeEventListener("scroll", onScroll);
      if (g && tickerId !== undefined) g.ticker.remove(tickerId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        height          : `${SECTION_VH}vh`,
        position        : "relative",
        backgroundColor : "#FFF5E4",   // cream — matches the landscape frame background in the composition
        zIndex          : 1,
      }}
    >
      {/* Section eyebrow label */}
      <div
        style={{
          position     : "absolute",
          top          : "2.5rem",
          left         : 0,
          right        : 0,
          textAlign    : "center",
          zIndex       : 10,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily   : "'Montserrat', sans-serif",
            fontSize     : "0.7rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color        : "rgba(244,0,9,0.75)",
            fontWeight   : 700,
          }}
        >
          The Film
        </p>
        <p
          style={{
            fontFamily   : "'Playfair Display', serif",
            fontSize     : "clamp(1.2rem, 2.5vw, 2rem)",
            fontStyle    : "italic",
            color        : "rgba(255,245,228,0.5)",
            marginTop    : "0.4rem",
          }}
        >
          Scroll to play
        </p>
      </div>

      {/* Sticky player — stays pinned while section scrolls */}
      <div
        style={{
          position        : "sticky",
          top             : 0,
          width           : "100%",
          height          : "100vh",
          display         : "flex",
          alignItems      : "center",
          justifyContent  : "center",
          backgroundColor : "#FFF5E4",
          overflow        : "hidden",
        }}
      >
        <Player
          ref={playerRef}
          component={CocaColaComposition}
          durationInFrames={TOTAL_FRAMES + 1}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          autoPlay={false}
          loop={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          initialFrame={0}
        />
      </div>
    </section>
  );
};
