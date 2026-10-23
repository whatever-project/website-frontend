#!/usr/bin/env node
/**
 * Branch-name guard, run by the Husky pre-commit and pre-push hooks.
 *
 *   node scripts/check-branch-name.mjs [branch]   branch defaults to the current one
 *
 * Allowed: dev/<anything>, design/<anything>   e.g. dev/sho/landing-page, design/landing-page
 * Exempt:  main, and a detached HEAD (rebase, checkout of a commit)
 *
 * Git has no hook for creating a branch, so this checks the branch you are committing or pushing from.
 */
import { execFileSync } from "node:child_process"

const EXEMPT = new Set(["main"])
const PATTERN = /^(dev|design)\/[\w.-]+(\/[\w.-]+)*$/

const branch = process.argv[2] ?? execFileSync("git", ["branch", "--show-current"], { encoding: "utf8" }).trim()

if (!branch || EXEMPT.has(branch) || PATTERN.test(branch)) process.exit(0)

console.error(`
Invalid branch name: "${branch}"

Branch names must start with "dev/" or "design/", followed by a name and (optionally) the page, e.g.
  dev/sho/landing-page
  design/landing-page

Rename the current branch with:
  git branch -m dev/<name>/<page>
`)
process.exit(1)
