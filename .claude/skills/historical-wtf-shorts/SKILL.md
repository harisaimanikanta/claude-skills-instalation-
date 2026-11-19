---
name: historical-wtf-shorts
description: Research, fact-check and write YouTube Shorts scripts about real historical events that sound fictional ("Historical WTF" stories - hoaxes, cons, absurd wars, impostors, bizarre trials). Use when the user wants a Shorts script, hooks, storyboard, or publishing package for a bizarre-but-true history story, wants new story ideas in that niche, or wants competitor research on history Shorts.
argument-hint: "[story or topic] | ideas [category] | list | research"
---

# Historical WTF Shorts

Turn real, traceable historical incidents into 45–90 s YouTube Shorts that make viewers say
**"Wait. This actually happened?"** Accuracy first, then hook, story, retention, payoff.

Skill folder: `${CLAUDE_SKILL_DIR}` (paths below are relative to it).

## 0. On invocation

If the command was given arguments that name a story or a mode (e.g. `/historical-wtf-shorts Cadaver Synod`,
`ideas absurd wars`), skip the menu and go straight to that path.
Otherwise show this menu once and ask **"What historical WTF story are we making today?"**

- **A** – Give me a story/topic → research it, then write.
- **B** – Pick from the idea bank (`research/story-ideas.md`, 30 ideas) → show the list with status.
- **C** – Discover 10 new bizarre stories.
- **D** – Discover stories in a category (cons, hoaxes, absurd wars, medical, impostors, trials, disasters, espionage…).
- **R** – Run / refresh competitor research (updates the playbook).
- **V** – Analyze specific videos the user pastes (frame-by-frame + transcript), e.g. new reference Shorts.

**Default style = True Mechanism Parable** (the owner's reference Shorts, 6.8M–35.1M views): cold-open "He [absurd action]" →
reaction → "You see," → mockery ladder with time jumps → rule-of-three → real reversal → mechanism → hard cut. ~60 s,
~220 words. Read `references/reference-style-analysis.md` before writing. For ideas (C/D) follow `references/idea-engine.md`.

Defaults (don't ask about these unless the user brings them up): 45–90 s, English, conversational
narrator, 9:16, recommended hook pre-selected. Never ask what is already answered.

## 1. Before writing anything, load context
1. Read `references/viral-storytelling-playbook.md` (what works, from research).
2. Read `research/research-log.md` - avoid repeating research already done; reuse stored findings.
3. Check `research/scripts/` - if the story was already researched, reuse and revalidate rather than redo.

## 2. Historical research (mandatory, every story)
Follow `references/historical-research-guidelines.md`. Fill `templates/research-template.md` into
`research/scripts/<slug>/research.md` with the 10 questions, the five evidence buckets
(VERIFIED / REPORTED / DISPUTED / LEGEND / UNKNOWN) and source URLs.
- Use WebSearch/WebFetch (and a browser tool if one is available). Prefer primary sources, archives,
  museums, academic and reputable history publishers over listicles and other Shorts.
- If the central premise can't be established → **reject or explicitly qualify** the story. Tell the user.
- Never invent dialogue, scenes, reactions, dates, numbers or documents.

## 3. Write the script
Follow `references/scriptwriting-framework.md` (structure, writing rules, hook types, QC rubric).
Draft → generate 5 hooks (shock, curiosity, contradiction, mystery, direct) → score → pick →
self-score the script /100 → **revise until ≥ 85** (honestly; never inflate). Read the script aloud
in your head: if a sentence trips, rewrite it.

## 4. Storyboard and editing
Follow `references/visual-storytelling-guidelines.md` and `templates/storyboard-template.md`.
AI reconstructions are labelled as such; never pass them off as archival photos.

## 5. Deliver
Save the full package to `research/scripts/<slug>/script.md` using `templates/script-template.md`, in this order:
**A** Story research · **B** Five hooks + scores · **C** Final voiceover · **D** Storyboard ·
**E** Editing direction · **F** Publishing package · **G** Quality report.
Show the user the voiceover, recommended hook and quality report in chat; link the file for the rest.
Append a line to `research/research-log.md` and set the idea's status in `research/story-ideas.md`.

## Competitor research mode (R)
Follow `references/competitor-analysis-methodology.md`. Add rows to `research/competitor-database.md`,
then update the playbook. Record the **access level** for every row (watched / transcript /
metadata-only). Never fabricate views, transcripts or findings; never say a video was watched when
only its title or description was seen. Revalidate any view count before quoting it.

## Video analysis mode (V)
For each URL: `python3 ${CLAUDE_SKILL_DIR}/scripts/storyboard.py <url> --out <scratch dir>` builds timestamped
contact sheets (storyboard frames + spoken words) and a word-timed transcript; `yt_research.py collect --ids` gets the stats.
View the sheets with Read, map the beats against the table in `reference-style-analysis.md`, fact-check the story,
and add the result to that file. Access level = `storyboard+transcript` (not "watched"). Needs YouTube network access.

## Hard rules
- Real, traceable stories only. Disputed ≠ confirmed. Legends are labelled as legends.
- No "Did you know?", no "Welcome back", no channel intros, no generic "like and subscribe".
- Don't copy other creators' scripts or distinctive phrasing - extract techniques only.
- Don't claim a hook or score predicts views. Don't claim knowledge of the YouTube algorithm.
- Ask before installing dependencies or changing unrelated configuration.

Run `python3 ${CLAUDE_SKILL_DIR}/scripts/validate_skill.py` after editing this skill, and
`python3 ${CLAUDE_SKILL_DIR}/scripts/script_stats.py <script.md>` to get word count / duration of a voiceover.
