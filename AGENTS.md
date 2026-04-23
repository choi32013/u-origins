# u-origins Agent Guidelines

## Project Context
- History visualization web app (globe + timeline) → converting to Next.js 15 App Router
- Target repo: `choi32013/u-origins` (upstream, NOT the fork `ndr28s/u-origins`)
- Branch strategy: `feat/BYG-{N}-{slug}` → PR → main (never commit directly to main)

## Git Workflow
- Remote origin must point to `https://github.com/choi32013/u-origins.git`
- Always create a feature branch: `git checkout -b feat/BYG-{N}-{description}`
- git credential.helper is set to `store`; push without GUI required
- Verify: `git remote get-url origin` before any push

## Background Process Rules
- **Never start long-running processes (>30s) without scheduling a check-in**
- Use `ScheduleWakeup` immediately after launching any background job, with delay = expected completion time
- On check-in: verify process completed → comment on issue → mark `done`
- `sleep >30s` in Bash is prohibited; use `ScheduleWakeup` instead

## Next.js / Frontend
- Pages live under `app/` (App Router) or `pages/` (legacy); prefer App Router for new work
- globe.gl and Leaflet must load via sequential CDN script injection (not webpack bundled)
- `'use client'` required for components using browser APIs
- Run `npm run dev` to test locally before marking UI tasks done

## Issue Completion
- When work is complete: post Korean comment on the issue, then PATCH status to `done`
- If work blocks another issue: comment with blocker details + set status `blocked`
- Never leave issue `in_progress` without a scheduled check-in
