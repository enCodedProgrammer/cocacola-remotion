const { cpSync, existsSync } = require("fs");
const path = require("path");

// 1. Sync product images from cocacola-video/public/ → scroll-player/public/
cpSync("public", "scroll-player/public", { recursive: true, force: true });
console.log("✓ Product images synced");

// 2. Copy cinematic frames (once only — 381 frames ~30MB)
const framesSource = path.resolve(__dirname, "../../cocacola/cinematic-frames");
const framesDest   = "scroll-player/public/cinematic-frames";

if (!existsSync(framesDest) && existsSync(framesSource)) {
  console.log("Copying cinematic frames (one-time, ~30MB)…");
  cpSync(framesSource, framesDest, { recursive: true });
  console.log("✓ Cinematic frames copied");
} else if (existsSync(framesDest)) {
  console.log("✓ Cinematic frames already present, skipping");
} else {
  console.warn("⚠ cinematic-frames source not found at", framesSource);
}
