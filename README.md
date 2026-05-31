# Coca-Cola Remotion Video

6-second · 1920×1080 · 30fps · TypeScript

## Quick Start

```bash
cd cocacola-video
npm install
npm start          # opens Remotion Studio at localhost:3000
```

## Render to MP4

```bash
npm run render
# output → out/video.mp4
```

## Swap in Real Images

1. Copy your Coca-Cola product photos into `public/`  
   (see `public/PUT_IMAGES_HERE.txt` for expected filenames)
2. Open `src/components/ColaImage.tsx`
3. Set `USE_REAL_IMAGES = true`
4. Reload Studio — done

## Scene Structure

| Time | Frames | File |
|------|--------|------|
| 0s – 2s | 0–59 | `scenes/SceneLandscapeFrame.tsx` |
| 2s – 3.5s | 60–104 | `scenes/SceneScrollUp.tsx` |
| 3.5s – 4.5s | 105–134 | `scenes/SceneMobileMorph.tsx` |
| 4.5s – 6s | 135–179 | `scenes/SceneSpillOut.tsx` |
