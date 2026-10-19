<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Design → dev → backend workflow

Pages go through three stages. Each stage has its own agent/skills; shared rules are in `docs/ai/`.

| Stage | Who / tool | Entry point | Works in |
|---|---|---|---|
| Design | Design team, Kimi (`npm run design`) | `/design-request` | `src/app/draft/<page>/` only |
| Dev | Frontend devs, Claude Code | `/draft-to-live <page>` | `src/views`, `src/app/[locale]`, `src/messages`, … |
| Backend | Backend devs, Claude Code (in `../website-backend`) | `/implement-from-handoff <page>` | `website-backend` |

- Before creating any UI, read `docs/ai/COMPONENTS.md` (reuse first). Draft rules: `docs/ai/DESIGN-RULES.md`.
- **If you are the Kimi design agent:** write only inside `src/app/draft/`, follow `.agents/agents/kimi-designer.md` and the skills in `.agents/skills/`.
- **If you are working on a live page:** drafts live in `src/app/draft/<page>/` with `DESIGN-REQUEST.md`, `SUMMARY.th.md` and `CONTEXT.md`. Read `CONTEXT.md` first. Use `/draft-to-live`; the handoff then goes to `docs/handoffs/<page>/`.
- Structure and conventions: `docs/STRUCTURE.md`.
