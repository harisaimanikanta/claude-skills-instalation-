#!/usr/bin/env node
// Render a Three.js scene module to an MP4, frame by frame (deterministic, not real-time).
// Usage: node render.mjs <scene.js> [out.mp4] [--fps 30] [--width 1280] [--height 720] [--duration N] [--still t]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf('--' + name);
  if (i === -1) return def;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const fps = +opt('fps', 30);
const width = +opt('width', 1280);
const height = +opt('height', 720);
const durationArg = opt('duration', null);
const still = opt('still', null);
const [sceneArg, outArg] = args;
if (!sceneArg) {
  console.error('Usage: node render.mjs <scene.js> [out.mp4] [--fps 30] [--width 1280] [--height 720] [--duration N] [--still t]');
  process.exit(1);
}
const scenePath = path.resolve(sceneArg);
const sceneDir = path.dirname(scenePath);
const base = path.basename(scenePath, '.js');
const out = path.resolve(outArg || path.join('out', base + (still !== null ? '.png' : '.mp4')));
fs.mkdirSync(path.dirname(out), { recursive: true });

// Find three.js: from the scene's project first, then from this skill's location.
let threeDir;
for (const from of [scenePath, path.join(process.cwd(), 'x.js'), path.join(here, 'x.js')]) {
  try { threeDir = path.dirname(path.dirname(createRequire(from).resolve('three'))); break; } catch {}
}
if (!threeDir) { console.error('three not found: run `npm i three` in your project.'); process.exit(1); }

const types = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.glb': 'model/gltf-binary', '.hdr': 'application/octet-stream' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file;
  if (url === '/' ) file = path.join(here, 'harness.html');
  else if (url.startsWith('/three/')) file = path.join(threeDir, url.slice(7));
  else if (url.startsWith('/scene/')) file = path.join(sceneDir, url.slice(7));
  const root = url.startsWith('/three/') ? threeDir : sceneDir;
  if (!file || (url !== '/' && !path.resolve(file).startsWith(root))) { res.writeHead(404); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
page.on('pageerror', e => console.error('[page]', e.message));
await page.goto(`http://127.0.0.1:${port}/?scene=${encodeURIComponent(path.basename(scenePath))}&w=${width}&h=${height}`);
await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
const err = await page.evaluate(() => window.__error);
if (err) { console.error('Scene failed to load:\n' + err); await browser.close(); server.close(); process.exit(1); }

const grab = async (t) => {
  await page.evaluate(t => window.renderFrame(t), t);
  return page.locator('canvas').screenshot({ type: 'png' });
};

if (still !== null) {
  fs.writeFileSync(out, await grab(+still));
  console.log('Wrote', out);
} else {
  const duration = durationArg !== null ? +durationArg : await page.evaluate(() => window.__duration);
  const frames = Math.round(duration * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exited ' + c))));
  for (let i = 0; i < frames; i++) {
    const buf = await grab(i / fps);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % fps === 0) process.stdout.write(`\rframe ${i + 1}/${frames}`);
  }
  ff.stdin.end();
  await done;
  console.log(`\rWrote ${out} (${frames} frames, ${duration}s @ ${fps}fps, ${width}x${height})`);
}
await browser.close();
server.close();
