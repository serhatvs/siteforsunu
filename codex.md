# Codex Project Guide

## Purpose
- This file is the project-local working guide for Codex.
- Read this file before writing or editing code in this repository.
- Keep it updated with durable project decisions, constraints, and discovered context.

## User Rule
- The user requested a persistent `codex.md` file for this project.
- Before any coding task, review this file first.
- Record important project knowledge here so future changes stay consistent.

## Current Repository State
- Repository root inspected on 2026-03-07.
- Repository now hosts a Vite + vanilla JavaScript presentation site.
- Main source files live under `src/`.
- Animations use GSAP with ScrollTrigger.

## Working Principles
- Prefer understanding the current repository state before making assumptions.
- Record architecture decisions, conventions, and recurring commands here when they become relevant.
- Do not overwrite user changes without explicit instruction.
- When new files, frameworks, or tooling appear, add a short note here.
- Keep Turkish UI copy in centralized data objects where practical.
- Preserve the Platinum Mist palette for this project unless the user changes direction.
- Treat the scroll-driven product story as the primary presentation feature.
- Keep the hero as a separate opening section above the sticky storyboard scene.
- Normalize Turkish UI source text as UTF-8 to avoid mojibake in the rendered site.

## Project Structure
- `index.html`: Vite entry document, font loading, and first-frame image preload.
- `src/main.js`: semantic page rendering and app bootstrap.
- `src/content.js`: centralized Turkish content, frame metadata, concept copy, and budget data.
- `src/animations.js`: GSAP timelines, sticky frame-sequence logic, reveals, and budget count-up logic.
- `src/styles.css`: layout, theme, cinematic stage styling, and responsive behavior.
- `public/images/storyboard/`: 7 storyboard frame assets loaded directly by filename.
- `scripts/generate-storyboard-frames.mjs`: local storyboard generator for presentation-ready fallback assets.
- `vite.config.mjs`: relative base-path config for generic static deployment.

## Stack And Commands
- Stack: Vite, vanilla JavaScript, GSAP, ScrollTrigger.
- Install: `npm.cmd install`
- Dev server: `npm.cmd run dev`
- Production build: `npm.cmd run build`
- Preview build: `npm.cmd run preview`
- Regenerate local storyboard assets: `npm.cmd run generate:storyboard`
- Deploy artifact: upload `dist/`

## Visual Rules
- Palette: Platinum White `#F5F6F7`, Mist Silver `#C1C4C8`, Steel Mist `#7B7F85`, Graphite Mist `#2B2E33`.
- No purple, violet, magenta, pink, or gold accents.
- Use premium cold-tech gradients, metallic borders, and restrained glassmorphism.

## Storyboard Rules
- Sticky story sequence is image-driven, not CSS-built.
- Use 7 pre-generated frames in this semantic order:
  - `frame-01-pov.png`
  - `frame-02-zoomout.png`
  - `frame-03-reveal.png`
  - `frame-04-rotate.png`
  - `frame-05-separate.png`
  - `frame-06-exploded.png`
- Load storyboard assets from `public/images/storyboard/` via `import.meta.env.BASE_URL`.
- The scroll centerpiece is a single pinned 16:9 stage with frame crossfades, scale, blur, and subtle translation.
- Exploded-view narrative is optical-only in the site structure: frame, outer protective lens, optical lens, reflective layer, inner protective layer.
- Reduced-motion mode falls back to a static frame list instead of the scrubbed sticky sequence.
- Implementation detail: the current site loads 7 Gemini storyboard kareleri as `frame-01.png`-`frame-07.png` from `public/images/storyboard/`.
- Deployment detail: built assets use relative URLs so the site can run from root or a subfolder.

## Update Checklist
- Project structure and entry points
- Build, test, and run commands
- Framework and library choices
- Styling, naming, and folder conventions
- Known constraints, risks, and pending decisions

## Change Log
- 2026-03-07: Created initial project guide based on user instruction.
- 2026-03-07: Added project stack, structure, commands, and visual rules for the ski goggle presentation site.
- 2026-03-07: Updated the storyboard to start with a phone Bluetooth intro and simplified the exploded view to 5 physical layers.
- 2026-03-07: Refactored the presentation into an image-driven 6-frame cinematic scroll sequence with centralized frame metadata and `public/images/storyboard/` asset mapping.
- 2026-03-07: Added a local storyboard PNG generator and generated presentation-ready fallback frame assets so the site runs without missing visuals.
- 2026-03-08: Expanded the storyboard to a 7-frame cinematic scroll sequence using Gemini görselleri ve `frame-01.png`–`frame-07.png` dosya adları.
- 2026-03-08: Switched storyboard asset loading to `BASE_URL`, added relative-base Vite config, and documented static deployment via `dist/`.
