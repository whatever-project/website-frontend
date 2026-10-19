#!/usr/bin/env node
/**
 * Draft-only guard for the design stage (Kimi).
 *
 *   npm run check:draft -- --snapshot   record a baseline of every file OUTSIDE src/app/draft/
 *   npm run check:draft                 fail if any file outside src/app/draft/ changed since the baseline
 *
 * Why a snapshot instead of `git status`: the working tree often has unrelated uncommitted work,
 * which would be reported as a violation. The snapshot only catches what changed during the round.
 * Without a baseline, falls back to listing uncommitted changes outside the draft folder (warning only).
 *
 * Also checks the files inside src/app/draft/ and live code for rule violations (see docs/ai/DESIGN-RULES.md).
 */
import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, unlinkSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..")
const DRAFT_DIR = join("src", "app", "draft")
const BASELINE = join(ROOT, ".draft-baseline.json")

// Never part of the comparison: build output, deps, VCS, the baseline itself, files tools rewrite on their own.
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", ".turbo", "coverage"])
const SKIP_FILES = new Set([".draft-baseline.json", "next-env.d.ts", "tsconfig.tsbuildinfo"])

const toPosix = (p) => p.split(sep).join("/")

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name)
    const rel = relative(ROOT, abs)
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      if (rel === DRAFT_DIR) continue // the one place Kimi may write
      walk(abs, out)
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name)) continue
      out.push(abs)
    }
  }
  return out
}

function hashFile(abs) {
  return createHash("sha1").update(readFileSync(abs)).digest("hex")
}

function snapshot() {
  const files = {}
  for (const abs of walk(ROOT)) files[toPosix(relative(ROOT, abs))] = hashFile(abs)
  return files
}

function walkAll(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) walkAll(abs, out)
    else out.push(abs)
  }
  return out
}

const args = new Set(process.argv.slice(2))

// ── --snapshot ───────────────────────────────────────────────────────────────
if (args.has("--snapshot")) {
  const files = snapshot()
  writeFileSync(BASELINE, JSON.stringify({ takenAt: new Date().toISOString(), files }, null, 2))
  console.log(`Baseline saved (${Object.keys(files).length} files outside ${toPosix(DRAFT_DIR)}/).`)
  process.exit(0)
}

// ── --clear ──────────────────────────────────────────────────────────────────
if (args.has("--clear")) {
  if (existsSync(BASELINE)) unlinkSync(BASELINE)
  console.log("Baseline removed.")
  process.exit(0)
}

const errors = []
const warnings = []

// 1. Changes outside the draft folder
if (existsSync(BASELINE)) {
  const base = JSON.parse(readFileSync(BASELINE, "utf8")).files
  const now = snapshot()
  for (const f of Object.keys(now)) {
    if (!(f in base)) errors.push(`ADDED outside draft:    ${f}`)
    else if (base[f] !== now[f]) errors.push(`MODIFIED outside draft: ${f}`)
  }
  for (const f of Object.keys(base)) {
    if (!(f in now)) errors.push(`DELETED outside draft:  ${f}`)
  }
} else {
  warnings.push("No baseline found. Run `npm run check:draft -- --snapshot` at the start of a round for a precise check.")
  try {
    const out = execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], { cwd: ROOT, encoding: "utf8" })
    const outside = out
      .split("\n")
      .filter(Boolean)
      .map((l) => l.slice(3).replace(/^"|"$/g, ""))
      .filter((p) => !toPosix(p).startsWith(toPosix(DRAFT_DIR) + "/"))
    if (outside.length) {
      warnings.push(
        `Uncommitted changes outside ${toPosix(DRAFT_DIR)}/ (may be unrelated to this round):\n    ` + outside.join("\n    "),
      )
    }
  } catch {
    warnings.push("git not available; skipped uncommitted-changes check.")
  }
}

// 2. Rule checks inside the draft folder
const draftFiles = walkAll(join(ROOT, DRAFT_DIR)).filter((f) => /\.(tsx?|jsx?|css)$/.test(f))
for (const abs of draftFiles) {
  const rel = toPosix(relative(ROOT, abs))
  const isHub = rel.startsWith("src/app/draft/dev-tools/") || rel === "src/app/draft/layout.tsx"
  const src = readFileSync(abs, "utf8")
  if (isHub) continue
  if (/from\s+["']@\/api[/"']/.test(src)) errors.push(`${rel}: imports @/api (drafts use mock data only)`)
  if (/\bfetch\s*\(/.test(src)) errors.push(`${rel}: calls fetch() (drafts use mock data only)`)
  if (/from\s+["']@\/i18n\/navigation["']/.test(src)) errors.push(`${rel}: imports @/i18n/navigation (drafts use next/link)`)
  if (/process\.env\./.test(src)) errors.push(`${rel}: reads process.env (drafts must not depend on env)`)
  if (/from\s+["']@\/config\/env["']/.test(src)) errors.push(`${rel}: imports @/config/env (drafts must not depend on env)`)
}

// 3. Live code must never import from the draft folder
for (const abs of walkAll(join(ROOT, "src")).filter((f) => /\.(tsx?|jsx?)$/.test(f))) {
  const rel = toPosix(relative(ROOT, abs))
  if (rel.startsWith(toPosix(DRAFT_DIR) + "/")) continue
  if (/from\s+["'][^"']*app\/draft/.test(readFileSync(abs, "utf8"))) errors.push(`${rel}: imports from app/draft (live code must not)`)
}

// 4. Each draft page should carry its handoff files (warning only; older drafts predate the workflow)
const draftRoot = join(ROOT, DRAFT_DIR)
// Drafts can be nested (a draft of /admin/logs lives at draft/admin/logs), so walk every folder that has a page.tsx.
function checkDraftDir(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "dev-tools" || entry.name.startsWith("_")) continue
    const sub = join(dir, entry.name)
    if (existsSync(join(sub, "page.tsx"))) {
      for (const f of ["DESIGN-REQUEST.md", "SUMMARY.th.md", "CONTEXT.md"]) {
        if (!existsSync(join(sub, f))) warnings.push(`${toPosix(relative(ROOT, sub))}: missing ${f}`)
      }
    }
    checkDraftDir(sub)
  }
}
if (existsSync(draftRoot)) checkDraftDir(draftRoot)

for (const w of warnings) console.warn(`warning: ${w}`)
if (errors.length) {
  console.error("\ncheck:draft FAILED. Rules: docs/ai/DESIGN-RULES.md\n")
  for (const e of errors) console.error(`  x ${e}`)
  console.error("\nUndo the changes outside src/app/draft/ (or tell the dev they are needed), then run again.")
  process.exit(1)
}
console.log("check:draft passed.")
