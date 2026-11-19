#!/usr/bin/env bash
# Auto-install the toolkit when a Claude Code session starts in this repo.
cd "$CLAUDE_PROJECT_DIR" && ./setup.sh >&2 || echo "setup.sh failed; run it manually" >&2
exit 0
