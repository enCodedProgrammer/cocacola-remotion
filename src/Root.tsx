import React from "react";
import { Composition } from "remotion";
import { CocaColaComposition }       from "./Composition";
import { CocaColaCompositionMobile } from "./CompositionMobile";
import { LuxuryComposition }         from "./LuxuryComposition";

export const Root: React.FC = () => {
  return (
    <>
      {/* 16:9 landscape — desktop */}
      <Composition
        id="CocaColaVideo"
        component={CocaColaComposition}
        durationInFrames={375}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />

      {/* 9:16 portrait — mobile */}
      <Composition
        id="CocaColaVideoMobile"
        component={CocaColaCompositionMobile}
        durationInFrames={375}
        width={1080}
        height={1920}
        fps={30}
        defaultProps={{}}
      />
      {/* Luxury product advertisement — 15s, 1920×1080 */}
      <Composition
        id="CocaColaLuxury"
        component={LuxuryComposition}
        durationInFrames={478}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
    </>
  );
};
