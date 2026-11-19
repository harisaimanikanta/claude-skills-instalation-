---
name: threejs-3d-video
description: Create 3D animated videos with Three.js and render them to MP4 (or a still PNG) using headless Chromium + ffmpeg. Use when the user asks for a 3D animation, 3D video, product spin, logo reveal, motion graphic, camera fly-through, or wants a Three.js scene exported as a video file.
---

# Three.js → MP4

Scenes are plain ES modules. The renderer steps time frame by frame (not real time), so output is
smooth and identical on every run regardless of machine speed.

## Requirements
- Node 18+, `ffmpeg` on PATH, and Playwright with Chromium (`npm i -D playwright && npx playwright install chromium` if missing).
- `three` installed in the project: `npm i three`.

## Workflow
1. **Write the scene.** Copy `templates/scene.js` (next to this file) to `scenes/<name>.js` and edit it.
   Keep the contract:
   - `export const duration = <seconds>;`
   - `export async function setup({ THREE, canvas, width, height })` → returns `{ render(t) }`.
   - Create the renderer on the given `canvas` with `preserveDrawingBuffer: true`.
   - **Everything is a function of `t`** (seconds). No `Date.now`, `performance.now`,
     `requestAnimationFrame`, `OrbitControls`, or unseeded `Math.random` — use a seeded PRNG.
   - Addons import as `import { X } from 'three/addons/...'`. Assets (`.glb`, textures) go next to the scene file and load by relative URL, e.g. `'/scene/model.glb'`.
2. **Check one still before rendering the whole clip** (fast):
   `node .claude/skills/threejs-3d-video/scripts/render.mjs scenes/<name>.js out/<name>.png --still 2`
   Look at the PNG with the Read tool; fix composition, lighting, and exposure before rendering the full video.
3. **Render the video:**
   `node .claude/skills/threejs-3d-video/scripts/render.mjs scenes/<name>.js out/<name>.mp4 --fps 30 --width 1280 --height 720`
   Options: `--fps`, `--width`, `--height`, `--duration` (overrides the scene's value).
4. Spot-check a few frames after rendering:
   `ffmpeg -ss 3 -i out/<name>.mp4 -frames:v 1 out/check.png`. Then hand the MP4 to the user.

## Craft tips
- Ease motion (`p => p * p * (3 - 2 * p)` smoothstep, or `1 - Math.pow(1 - p, 3)`) — linear motion reads as robotic.
- Use `ACESFilmicToneMapping` + `SRGBColorSpace`, a key light with shadows, plus a soft hemisphere fill.
- Move the camera slowly; one clear motion per shot. Loop clips by making `render(0)` equal `render(duration)`.
- Rendering is software WebGL (SwiftShader): stay under ~200k triangles and avoid heavy post-processing for fast renders. 720p at 30 fps takes about 0.1–0.3 s per frame.
- Rendering at 1080p: `--width 1920 --height 1080`.

## Troubleshooting
- `Scene failed to load` → the stack trace follows; usually a bad import path or a syntax error in the scene.
- Black frames → the renderer wasn't created on the given `canvas`, or `preserveDrawingBuffer` is missing.
- `three not found` → run `npm i three` in the project root.
