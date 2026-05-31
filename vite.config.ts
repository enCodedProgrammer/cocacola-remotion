import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// publicDir defaults to scroll-player/public/ (the Vite root's public folder).
// Images are synced there by the "prescroll" npm script before Vite starts.
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "remotion", "@remotion/player"],
  },
  optimizeDeps: {
    include: ["remotion", "@remotion/player"],
  },
});
