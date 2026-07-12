# Go-live TODO

Owner: Gergő. Tick items as they're done. The technical steps (push, deploy,
env vars) happen after these — see README.md "Deploying to Vercel".

## Content

- [ ] **Domain** — buy it; needed for `NEXT_PUBLIC_SITE_URL` and Resend
- [ ] **Team photos** — 3 portraits, ~4:5 ratio (~800×1000px) → `public/team/`
- [ ] **Team names + roles** — in HU, SK and EN → `aboutPage.team.*` in `messages/*.json`
- [x] **Partner logos** — Palace Café & Bar, World Experience, Šimab, Virtuálne sídlo Komárno (processed → `public/partners/`; originals in `partner_logos/`)
- [x] **Partner names + optional links** — palacebar.sk, mastersoffice.sk, sidlokomarno.sk; Šimab unlinked
- [ ] **Reference visuals** (replace the gradient mockups where possible):
  - [ ] Business websites — screenshots of the live sites (with client OK)
  - [ ] Restaurant ordering system — interface screenshot with demo data only
  - [ ] Time-tracking software — screenshot with dummy data, or keep the mockup
  - [ ] Pool plant — anonymized process-map excerpt, or a plant photo (with permission)
  - Rule: ~1600×1000 landscape, no real personal/client data visible.
    Keeping the branded mockup is a legitimate choice where no image works.
- [ ] **Website URLs for linkable references** + client permission → `url` in `src/content/projects.ts`
- [ ] **SK native review** — full read-through of `messages/sk.json` by a native speaker

## Accounts (free)

- [ ] **Vercel** — sign up, then tell Claude to push the repo to GitHub and import it
- [ ] **Resend** (resend.com) — sign up, verify the domain (DNS records), copy the API key

## Env vars to collect for Vercel

- [ ] `NEXT_PUBLIC_SITE_URL` — the production domain, no trailing slash
- [ ] `RESEND_API_KEY` — from the Resend dashboard
- [ ] `CONTACT_TO_EMAIL` — the inbox where contact-form messages should arrive
- [ ] `CONTACT_FROM_EMAIL` — e.g. `Pragma <info@yourdomain.com>` (domain must be verified in Resend)
