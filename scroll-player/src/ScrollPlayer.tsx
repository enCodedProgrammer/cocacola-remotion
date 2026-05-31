import React, { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import gsap from "gsap";
import Lenis from "lenis";
import { CocaColaComposition } from "../../src/Composition";

const TOTAL_FRAMES = 179;
const FPS          = 30;
const COMP_W       = 1920;
const COMP_H       = 1080;
const SCROLL_VH    = 500;   // scroll runway
const LERP         = 0.10;  // 0.06 = dreamier  /  0.18 = snappier

export const ScrollPlayer: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    // ── mutable lerp state (no re-renders needed) ──────────────────────────
    let current = 0;
    let target  = 0;

    // ── 1. Lenis — adds inertia/weight to the wheel delta ─────────────────
    //    We only use it for the "feel"; actual frame calculation uses
    //    window.scrollY which Lenis keeps in sync.
    const lenis = new Lenis({
      duration     : 1.4,
      easing       : (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel  : true,
      smoothTouch  : false,
    });

    // Drive Lenis with GSAP's ticker (one shared RAF loop)
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // ── 2. Native scroll → target frame ───────────────────────────────────
    //    window.scrollY is updated by Lenis in real time so this works
    //    whether Lenis or native scroll is active.
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      target = (window.scrollY / maxScroll) * TOTAL_FRAMES;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── 3. GSAP ticker: lerp + seekTo ──────────────────────────────────────
    const tickerId = gsap.ticker.add(() => {
      current += (target - current) * LERP;
      const frame = Math.max(0, Math.min(Math.round(current), TOTAL_FRAMES));
      playerRef.current?.seekTo(frame);
    });

    // ── 4. Pause player on mount ───────────────────────────────────────────
    const t = setTimeout(() => {
      playerRef.current?.pause();
    }, 200);

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tickerId);
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ height: `${SCROLL_VH}vh`, backgroundColor: "#0A0A0A" }}>
      {/* Fixed player — stays locked to viewport regardless of scroll quirks */}
      <div
        style={{
          position      : "fixed",
          top           : 0,
          left          : 0,
          width         : "100vw",
          height        : "100vh",
          display       : "flex",
          alignItems    : "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          overflow      : "hidden",
        }}
      >
        <Player
          ref={playerRef}
          component={CocaColaComposition}
          durationInFrames={TOTAL_FRAMES + 1}
          fps={FPS}
          compositionWidth={COMP_W}
          compositionHeight={COMP_H}
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
    </div>
  );
};
