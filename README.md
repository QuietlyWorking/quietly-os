# Quietly Operating Standard (QOS)

The machine-readable operating layer for organizational identity.

A reference implementation of programmatic brand, voice, values, and operations maintained by [Quietly Working Foundation](https://www.quietlyworking.org) (501(c)(3)). Public at [quietlyos.org](https://quietlyos.org).

---

## What this repo is

The `quietlyos.org` landing page. A SvelteKit site deployed to Cloudflare Pages. Its single job in v1 is to share the vision, show the live build progress via the Working Manual, and collect "keep me in the loop" signups.

The schemas themselves (`values.v1.schema.json`, and forthcoming `voice.v1`, `universe.v1`, `interconnect.v1`, `content.v1`, `brand.v2.3`, `site.v1`...) live in the QWU backoffice vault and will be published here as each phase stabilizes.

## Stack

- SvelteKit (Svelte 5 runes) + TypeScript
- `@sveltejs/adapter-cloudflare` → Cloudflare Pages
- Tailwind CSS with CSS-custom-property theme tokens (dark default)
- mdsvex for Markdown integration
- Supabase (project `bgwjuajxdkdnvmljqkqk`, region `us-west-1`) for signups

## Local development

```bash
nvm use              # reads .nvmrc → Node 22.16.0
npm install
npm run dev          # http://localhost:5173
npm run build
npm run check        # svelte-check
npm run em-dash-scrub   # must pass before commit
```

Copy `.env.example` to `.env` and paste in the Supabase anon key (see `QOS_SUPABASE_ANON_KEY` in the QWU backoffice `.env`).

---

## The Working Manual

`WORKING_MANUAL.md` is the live build log that renders in the Working Manual section of the site. Each entry is one session's work. The page parses the file at build time and renders newest-first.

### How to add an entry (session wrap-up rule)

During `/session-wrap-up` in the QWU backoffice, if the session shipped QOS-relevant work, append a new entry at the **top** of `WORKING_MANUAL.md`, below the intro and the `---` separator, using this format:

```markdown
## YYYY-MM-DD... Session Title

One-line summary of what shipped or changed.

- Optional bullets for receipts (file names, line counts, artifacts).
- Keep it tight. The archive is the changelog; this is the story.
```

Rules:
- Use ellipsis (`...`), never em dashes. The em-dash scrub will block your push.
- Date in Pacific time (see QWU backoffice `timezone_standard.md`).
- Newest entries go **on top**. The parser sorts chronologically, but appending at the top keeps git diffs clean.
- Use TIG's voice: active verbs, show the receipts, no corporate polish.

After appending, commit and push. The CF Pages build triggers and the site updates within ~60 seconds. Transparency in practice.

### The `/session-wrap-up` obligation

The QWU backoffice's `/session-wrap-up` skill registers QOS in its Product Documentation Registry. When a session ships values/voice/brand/site/universe/interconnect/content schema work, wrap-up surfaces the obligation to add a Working Manual entry. Don't skip it... readers find the site through one article or one post, and the Working Manual is how they see what's real.

---

## Voice rules (non-negotiable)

This site is the public face of a standard that forbids em dashes. Eat your own dog food.

- Ellipsis (`...`) only. No em dashes. No en dashes as sentence punctuation.
- "Supporters" not "customers." "Donation" not "purchase."
- No "business," "commercial," "profit," "revenue," "employee."
- No tax-deductible-as-incentive language (ever).
- Hemingway discipline: short paragraphs, active verbs, cut 30%, show receipts.

Full voice profile: `003 Entities/Voice Profiles/Chaplain TIG/Brand Voice.md` in the backoffice vault.

---

## Deployment

Every push to `main` triggers a GitHub Actions workflow that builds the site and deploys to Cloudflare Pages project `quietly-os`. Custom domain `quietlyos.org` is the canonical host; `quietlyos.com` and any `www.` subdomain 301-redirect via `functions/_middleware.js`.

See `.github/workflows/deploy.yml` for the exact pipeline.

---

A reference implementation of QOS maintained by Quietly Working Foundation (501(c)(3)).
