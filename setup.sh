#!/usr/bin/env bash
# Installs the video toolkit: ffmpeg, HyperFrames, GSAP, Remotion, Three.js (npm), yt-dlp, earshot (pip).
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v ffmpeg >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then (sudo -n true 2>/dev/null && SUDO=sudo || SUDO=""; $SUDO apt-get update -qq && $SUDO apt-get install -y -qq ffmpeg)
  elif command -v brew >/dev/null 2>&1; then brew install ffmpeg
  else echo "Install ffmpeg manually: https://ffmpeg.org/download.html"; fi
fi
[ -d node_modules ] && [ node_modules -nt package-lock.json ] || npm ci --no-audit --no-fund
python3 -m pip install -q -r requirements.txt 2>/dev/null || python3 -m pip install -q --user -r requirements.txt
echo "Video toolkit ready: ffmpeg, hyperframes, gsap, remotion, three, yt-dlp, earshot"
