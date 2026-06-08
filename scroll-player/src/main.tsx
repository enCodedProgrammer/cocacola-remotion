import React from "react";
import { createRoot } from "react-dom/client";
import { RemotionSection } from "./RemotionSection";
import { LuxurySection }   from "./LuxurySection";

const el = document.getElementById("remotion-section");
if (!el) throw new Error("No #remotion-section element found");

createRoot(el).render(
  <React.StrictMode>
    <RemotionSection />
  </React.StrictMode>
);

const luxuryEl = document.getElementById("luxury-section");
if (luxuryEl) {
  createRoot(luxuryEl).render(
    <React.StrictMode>
      <LuxurySection />
    </React.StrictMode>
  );
}
