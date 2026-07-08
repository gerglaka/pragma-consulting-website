# Pragma — website

Trilingual (HU / SK / EN) marketing site for Pragma, built with Next.js 16, Tailwind CSS v4, shadcn/ui, Motion, next-intl and Resend. No database, no CMS — all content lives in this repository.

## Run locally

Requirements: Node 20+ and npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

The contact form works without any configuration: if `RESEND_API_KEY` is not set, submissions are logged to the server console instead of being emailed (see Environment variables below).

## Editing copy

Every visible string lives in one of three message files:

| File | Language |
|---|---|
| `messages/hu.json` | Hungarian (default locale) |
| `messages/sk.json` | Slovak — **still needs native review** (see the `_note` key) |
| `messages/en.json` | English |

Edit the JSON values, keep the keys identical across all three files. Nothing is hardcoded in components.

Other content locations:

- **Localized URL slugs** — `src/i18n/routing.ts` (`pathnames`). Change a slug in one place and navigation, hreflang, sitemap and OG URLs all follow.
- **Reference projects** (order, gradient colors) — `src/content/projects.ts`; their text is under the `projects.*` keys in the message files. Set the optional `url` on a project to show a "view live site" link on the references page (public websites only — leave it off for private/internal systems). The homepage strip shows the first three projects; the references page shows all of them.
- **Metadata / SEO text** — `meta.*` and each page's `metaTitle` / `metaDescription` keys in the message files.

## Swapping in real portfolio screenshots

The references currently use `src/components/device-frame.tsx` — a CSS-only browser mockup with a brand gradient (intentionally not fake screenshots). To use real images:

1. Put the screenshots in `public/references/` (e.g. `restaurant.webp`), ideally 1600×1000 or similar 16:10.
2. In `src/app/[locale]/references/page.tsx` and `src/app/[locale]/page.tsx`, replace the `<DeviceFrame …>` usage with `next/image`:

   ```tsx
   import Image from "next/image";

   <Image
     src="/references/restaurant.webp"
     alt="…" // add a localized alt key to the message files
     width={1600}
     height={1000}
     className="rounded-xl border border-border/70"
   />
   ```

3. Add localized `alt` texts to the message files (e.g. `projects.restaurant.imageAlt`).

## Partners and team (placeholders)

Both sections currently show clearly-marked placeholders.

**Partner logos** (homepage strip) — `src/content/partners.ts`:

1. Put the logo in `public/partners/` (SVG preferred, or a ~320×128 PNG/WebP).
2. Set the entry's `name` (used as alt text), `logo: "/partners/<file>"` and optional `url`.
3. Add more entries to the array anytime — the strip wraps automatically.

Entries without a `logo` render as a dashed text box (placeholder look).

**Team members** (About page) — `src/content/team.ts` + message files:

1. Names and roles live under `aboutPage.team.<id>` in `messages/{hu,sk,en}.json` (names are usually identical in all three; roles are translated).
2. Photos: put a portrait (~4:5, e.g. 800×1000) in `public/team/` and set `photo: "/team/<file>"` on the member entry. Without a photo, a neutral avatar placeholder is shown.
3. To add a member: new entry in `team.ts` (e.g. `{ id: "m4", photo: … }`) + `aboutPage.team.m4` keys in all three message files.

## Environment variables

Copy-paste template:

```bash
# Email delivery (contact form). Without this, submissions are logged to console.
RESEND_API_KEY=

# Where contact form submissions are sent. Falls back to Resend's test inbox.
CONTACT_TO_EMAIL=

# Verified sender. Falls back to "Pragma <onboarding@resend.dev>" (Resend's
# onboarding sender — replace after verifying your domain in Resend).
CONTACT_FROM_EMAIL=

# Canonical origin used for hreflang, sitemap, OG URLs and JSON-LD.
# Set this to the production domain, no trailing slash.
NEXT_PUBLIC_SITE_URL=
```

Before go-live: verify the sending domain in Resend and set a real `CONTACT_TO_EMAIL`.

## Deploying to Vercel

1. Push the repository to GitHub (or GitLab/Bitbucket).
2. In Vercel: **Add New → Project**, import the repo. Framework preset "Next.js" is detected automatically — no build settings to change.
3. Add the four environment variables above (Production scope). `NEXT_PUBLIC_SITE_URL` must be the final domain, e.g. `https://example.com`.
4. Deploy, then add the custom domain under **Settings → Domains**.

The site is fully static except the `/api/contact` route, so any Node 20 host works too (`npm run build && npm run start`).

## Verification

- `npm run build` — must pass with zero errors.
- `node scripts/check-pages.mjs [baseUrl]` — loads every page × locale × viewport (375 / 768 / 1440 px) in headless Chromium and fails on horizontal overflow or any browser console error. Set `CHROME_PATH` if Chromium is not at `/usr/bin/chromium-browser`.
- Lighthouse (mobile) against a production build, e.g. `npx lighthouse http://localhost:3199/hu`.

## Project structure

```
messages/            hu.json, sk.json, en.json — all copy
src/app/[locale]/    pages (home, services, references, about, contact)
src/app/api/contact/ Resend email endpoint (honeypot + validation)
src/components/      UI components (header, footer, forms, reveals, …)
src/content/         reference project definitions
src/i18n/            locales, localized slugs, navigation helpers
src/lib/seo.ts       canonical/hreflang/OG metadata helper
scripts/             check-pages.mjs verification script
MEMORY.md            decision log
ERRORS.md            hard-won lessons (read before debugging)
```
