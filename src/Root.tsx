import React from "react";
import { Composition } from "remotion";
import { CocaColaComposition } from "./Composition";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="CocaColaVideo"
        component={CocaColaComposition}
        durationInFrames={180}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
    </>
  );
};
