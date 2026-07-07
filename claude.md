## Who I am

Gergő Lakatos, founder of Pragma — a boutique consultancy in the Hungary-Slovakia border region.

Business Informatics student, strong in Excel/data/systems thinking, working in Hungarian, Slovak and English.

I am technical enough to read code and review diffs, but I am not a professional frontend developer — explain non-obvious decisions in one line, don't over-explain basics.

## What this project is

The official Pragma website. Trilingual (Hungarian, Slovak, English). Mobile-first. Deployed on Vercel.

**Business positioning (critical — get this right):**

- PRIMARY offer (now): Websites and custom-built systems ("személyre szabott rendszerek" / "systémy na mieru" / "custom systems") for small businesses.

- SECONDARY offer (kept visible, framed as a growing pillar): Process improvement — Lean Six Sigma, process mapping, Power BI dashboards, SOP creation, bottleneck analysis.

- The site must NOT read like a process consultancy that also does websites. It reads like a practical digital partner for SMEs: "We build your website and custom tools today, and help you streamline operations as you grow."

- Target audience: Hungarian and Slovak SMEs and family businesses, 5–200 employees, relationship-first culture. Tone: professional, direct, warm, zero corporate buzzwords. No fake team members — Pragma is honestly a boutique/solo consultancy. Never invent testimonials, client names, or metrics.

## Brand (never deviate)

- Colors: Deep Blue #1A3A7A (primary dark), Pragma Blue #3B5BAD (primary), Gold #E8A020 (accent, CTAs and highlights only — use sparingly)

- Neutrals: warm off-white background (not pure #FFF), near-black text. Dark mode uses Deep Blue-tinted darks, not pure black.

- Tagline: HU "Praktikus. Precíz. Pragma." / EN "Practical. Precise. Pragma." / SK "Praktické. Presné. Pragma."

- Aesthetic direction: clean, confident, editorial. Bold typography-led hero, generous whitespace, subtle scroll-reveal motion, restrained bento-style grids for services/portfolio. Trust through polish — NO brutalism, no neon, no gimmicks, no stock-photo hero.

## Tech stack — locked. Never suggest alternatives unless I ask.

- Framework: Next.js 16 (App Router, Turbopack, React 19, TypeScript strict)

- Styling: Tailwind CSS v4

- Components: shadcn/ui (only what's needed)

- Animation: Motion (framer-motion) — subtle only: fade/slide reveals, micro-interactions. Respect prefers-reduced-motion.

- i18n: next-intl with locale-prefixed routes: /hu (default), /sk, /en. All UI strings in per-locale JSON message files — never hardcode copy in components.

- Forms: API route + Resend for the contact form (env var RESEND_API_KEY; build a graceful fallback that logs to console if the key is missing so dev/build never breaks).

- Fonts: next/font, self-hosted variable font(s). Must fully support Hungarian and Slovak diacritics (ő ű á é í ó ö ü / č ď ľ ň š ť ž ô ä ý). Verify before choosing.

- Deployment: Vercel. No databases, no CMS in v1 — content lives in typed content files + message JSONs.

- Package manager: npm. Node 20+.

## Behavior rules

1. Ask, don't assume. If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.

2. Simplest solution first. Do not add abstractions, options, or flexibility that weren't explicitly requested.

3. Don't touch unrelated code. If a file or function is not part of the current task, don't modify it — mention improvement ideas in a note at the end instead.

4. Flag uncertainty explicitly before proceeding. Confidence without certainty causes more damage than admitting a gap.

5. Stay in scope: never refactor, rename, reorganize or "improve" anything I didn't ask you to change.

6. Confirm before anything destructive (deleting files, overwriting content, removing dependencies): list what's affected, wait for my explicit yes in the current message.

7. After every task, end with: **Files changed** (one line each) / **Not touched** / **Follow-up needed**.

8. Never deploy, push, or send anything external without my explicit confirmation in the current message.

## Language rules for site copy

- I will review all copy. Draft Hungarian first (my strongest), then English, then Slovak.

- Slovak copy: mark it clearly with a `<!-- SK: needs native review -->` comment in the message files — I will have it checked.

- Hungarian business tone: formal "Ön" address for client-facing copy. Slovak: formal "Vy". English: plain professional.

- Never machine-translate idioms literally. If unsure of natural phrasing, flag it.

## Memory

- Maintain MEMORY.md in the repo root. After any significant decision, log: What was decided / Why / What was rejected. Read it at session start. Never contradict a logged decision without flagging it.

- Maintain ERRORS.md: when an approach takes more than 2 attempts, log what failed and what worked.

- When I say "session end": write a summary to MEMORY.md (Worked on / Completed / In progress / Decisions / Next priorities).

## Verification — never report a UI change as done based on a successful edit alone

1. `npm run build` must pass with zero errors and zero type errors.

2. Start the dev server and check the changed page in the browser at 375px (mobile), 768px, and 1440px widths.

3. Check all three locales (/hu, /sk, /en) render the change — no missing translation keys, no layout breaks from longer Hungarian/Slovak strings.

4. Browser console: zero new errors or warnings.

5. Keyboard-navigate any new interactive element; check focus states exist.

If any step fails, fix and rerun from step 1 — do not hand back partially verified work.

## Permanent facts

- Portfolio references are REAL past projects: (1) online food ordering system for a restaurant, (2) multiple business websites, (3) worker time-tracking software for a company. Described honestly, anonymized ("egy étterem", "a manufacturing company") until I provide names/permissions.

- Invoicing runs through a family company — the site never claims Pragma is a registered company; use "Pragma" as a brand name only. No legal-entity claims.

- Contact: email + contact form. No phone number on the site until I add one.

- Domain will be pragma-based .sk or .hu — build domain-agnostic, configure later.
