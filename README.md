# claude-skills-instalation-

Claude Code skills, installed at the project level in `.claude/skills/`. Claude loads them automatically in any session that opens this repo.

## Skills

| Skill | What it does |
|---|---|
| [`threejs-3d-video`](.claude/skills/threejs-3d-video/SKILL.md) | Builds 3D animated scenes with Three.js and renders them to MP4 or PNG, frame by frame, using headless Chromium + ffmpeg. |

## Quick start

```bash
npm install            # installs three
# needs ffmpeg and Playwright Chromium on the machine
node .claude/skills/threejs-3d-video/scripts/render.mjs scenes/demo.js out/demo.mp4
```

Or just ask Claude: *"make a 5-second 3D video of a spinning golden logo"*. The skill tells it how.

Example output: [`examples/demo.mp4`](examples/demo.mp4), rendered from [`scenes/demo.js`](scenes/demo.js).

## Using these skills in another project

Copy a skill folder into that project's `.claude/skills/`, or into `~/.claude/skills/` to have it in every project.

## Video toolkit

`./setup.sh` installs everything. It also runs automatically, through a SessionStart hook in `.claude/settings.json`, whenever a Claude Code session opens this repo.

| Tool | Use |
|---|---|
| ffmpeg | Encode, cut, mix audio, convert |
| [HyperFrames](https://www.npmjs.com/package/hyperframes) | HTML → MP4 video (`npx hyperframes`) |
| [GSAP](https://gsap.com) | Timeline animation for HTML/SVG/Three.js scenes |
| [Remotion](https://www.remotion.dev) | React → video (`npx remotion`) |
| Three.js | 3D scenes (see the `threejs-3d-video` skill) |
| yt-dlp | Download reference video/audio (needs network access to the site) |
| earshot | Voice-activity detection, e.g. to find and cut silences |
