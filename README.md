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
