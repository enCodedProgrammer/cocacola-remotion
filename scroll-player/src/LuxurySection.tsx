import React, { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { LuxuryComposition } from "../../src/LuxuryComposition";

const TOTAL_FRAMES = 477;
const SECTION_VH   = 1100;
const LERP         = 0.10;

export const LuxurySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const playerRef  = useRef<PlayerRef>(null);
  const hasSnappedRef = useRef(false);

  useEffect(() => {
    let current = 0;
    let target  = 0;

    const pauseTimer = setTimeout(() => playerRef.current?.pause(), 200);

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollable = section.offsetHeight - window.innerHeight;
      const scrolled   = Math.max(0, window.scrollY - sectionTop);
      const progress   = scrollable > 0 ? Math.min(scrolled, scrollable) / scrollable : 0;

      target = progress * TOTAL_FRAMES;

      if (progress >= 1 && !hasSnappedRef.current) {
        hasSnappedRef.current = true;
        const next = section.nextElementSibling as HTMLElement | null;
        if (next) {
          window.scrollTo(0, next.getBoundingClientRect().top + window.scrollY);
        }
      } else if (progress < 0.95) {
        hasSnappedRef.current = false;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

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
        height         : `${SECTION_VH}vh`,
        position       : "relative",
        backgroundColor: "#000",
        zIndex         : 1,
      }}
    >
      {/* Eyebrow label */}
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
            color        : "rgba(244,0,9,0.85)",
            fontWeight   : 700,
          }}
        >
          The Luxury Cut
        </p>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize  : "clamp(1.2rem, 2.5vw, 2rem)",
            fontStyle : "italic",
            color     : "rgba(255,255,255,0.35)",
            marginTop : "0.4rem",
          }}
        >
          Scroll to play
        </p>
      </div>

      {/* Sticky player */}
      <div
        style={{
          position       : "sticky",
          top            : 0,
          width          : "100%",
          height         : "100vh",
          display        : "flex",
          alignItems     : "center",
          justifyContent : "center",
          backgroundColor: "#000",
          overflow       : "hidden",
        }}
      >
        <Player
          ref={playerRef}
          component={LuxuryComposition}
          durationInFrames={450}
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
