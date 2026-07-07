# ERRORS.md — Pragma website

Log of approaches that took more than 2 attempts: what failed, what worked.

## 2026-07-07 — shadcn init CLI flags

- **Failed:** `npx shadcn@latest init -y -b neutral` — in the current shadcn CLI, `-b` means component base (`radix`/`base`), not base color. Then plain `init -y -b radix` stalled on an interactive preset prompt.
- **Worked:** `npx shadcn@latest init -y -d` (defaults: next template + base-nova preset). Brand colors are applied afterwards by overwriting the CSS variables in `globals.css` anyway.
- Also: a combined `shadcn add button input textarea select label sheet` call only installed `button`; re-running `add` with the remaining components worked.
