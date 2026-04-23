# QOS Working Manual

This is the live build log for the Quietly Operating Standard. Each entry is a snapshot of what shipped in a single session. New entries get appended during `/session-wrap-up` in the QWU backoffice (see README.md for the one-line rule).

Read top-to-bottom: newest first.

---

## 2026-04-23... CLAUDE.md Generator Shipped

`generate_claude_md_block.py` now reads a resolved values.json and writes a marker-block section into CLAUDE.md. Every Claude Code session opens with TIG's compass, hard rules, forbidden vocab, encouraged vocab, decision filters, and ethical boundaries injected structurally, not remembered.

Values.v1 is load-bearing. The schema stopped being a spec and started being infrastructure.

The generator is a standalone Python CLI plus importable module. No Jinja2, no template engine... f-strings only. Flags: `--org`, `--target`, `--dry-run`, `--force`, `--rollback`. Anchor: the block inserts immediately before `## Directive Structure` and owns its own H2 heading inside the marker span so rename protection works. Every write atomically backs up the prior CLAUDE.md to `.tmp/claude_md_backups/`. Hash in the BEGIN/END markers matches the source values.json payload with `_resolution` stripped, so drift detectors can pair begin/end and lineage churn doesn't bust the hash.

Eats its own dog food. Every prose string the generator emits into CLAUDE.md or stdout uses ellipsis, never em dashes. When a source field leaks an em dash, the generator substitutes to ellipsis at render time AND logs a warning to stderr with the exact field path... so drift surfaces noisily rather than hiding forever. The one permitted em dash lives inside the forbidden-table Pattern column for the `punctuation-em-dash` rule, where the character is the specimen being documented (labeled test-fixture pattern).

Four tests green: insert, idempotent re-run (in-sync, no write), `--force` regeneration, and `--rollback` restoration. On the first write, QWF.values.json got mutated externally between runs (`quietlyos.com` → `quietlyos.org` in two places), and the idempotency test initially failed... turned out to be correct behavior. Source changed, generator regenerated. The retest with stable source passed cleanly.

One known limitation to close in a follow-up session: `resolve_values.py` cannot self-resolve a root file (no parent to cascade from). The generator currently side-steps this by wrapping unresolved roots with a trivial `_resolution` block at read time. Fix: add `--root` flag or auto-detect no-parent case in `resolve_values.py`. Scope for another session.

---

## 2026-04-23... Three Planes: Standard, Not Product

Landing page copy update to reframe the three planes as the standard, not the QWF app family.

The EXECUTION card now names the real reference implementation: QWB for sites, QWR for articles, QNT for chapters, plus sibling apps for quoting, tracking, and outreach. Pattern stated plainly: LLMs decide, code executes.

Added a paragraph below the three cards: QOS is a standard. The QWF app family is one reference implementation... the one that eats its own dog food. Fork the schemas. Build your own control/execution/observation layers. The contracts in the JSON are what matter, not the specific apps around them.

Why the change: visitors were reading the three cards as "you need QOP + QWB + QSP to do this." That's backward. You need JSON schemas that separate control from execution from observation. The QWF apps are one way to implement that split, not the only way.

---

## 2026-04-22... quietlyos.org Shipped

The public home for QOS is live. v1 is a scroll-driven landing page... road sign plus coming soon... sharing the vision, showing the live build via this Working Manual, and collecting "keep me in the loop" signups.

Built on SvelteKit (Svelte 5 runes), deployed to Cloudflare Pages, signups stored in a dedicated Supabase project. Canonical `quietlyos.org`; `.com` and `www.*` hosts 301 to canonical.

Five bugs caught during the ship. All five became durable wisdom in the QWU Cloudflare Pages tool wisdom library:

- CI build missing `PUBLIC_*` env vars... they bake into the client bundle at build time and need to be GitHub Actions secrets, not just CF runtime secrets.
- Fire-and-forget promises get cancelled on CF Workers when the Response returns. The `.catch()` never fires because the promise is cancelled, not rejected. Silent email drop. Fixed by awaiting the Graph API call synchronously.
- "E2E" means the far end actually received what they should receive. Shipping a 200 response with a DB row written is not end-to-end if the email never arrived.
- `functions/_middleware.js` is silently ignored when SvelteKit's `_worker.js` runs. Middleware belongs in `src/hooks.server.ts`.
- Prerendered pages bypass `hooks.server.ts`. CF's edge serves the static HTML directly without invoking the worker, so canonical-host redirects never fire for prerendered routes. Fixed by removing `export const prerender = true` and reading repo files via Vite's `?raw` import.

Signup form works. Notification lands in TIG's inbox with a link straight to the Supabase row.

This Working Manual updates itself during every `/session-wrap-up` that ships QOS-relevant work. No roadmap theater. Just what shipped, when, and what was real.

---

## 2026-04-22... Phase 1: Values Layer Shipped

First QOS schema complete. `values.v1.schema.json` plus a reference implementation (`QWF.values.json` + `QWR.values.json`), a cascade-enforcing resolver, and a Values Editor build spec. 4,635 lines across 7 files. Phase 2 is `voice.json` plus the `brand.v2.3` refactor.

The values layer encodes TIG's 5-line compass structurally: people first, wisdom as fuel, values as compass, curiosity plus focus for balance, love for legacy. Cascade policy enforces ABSOLUTE rules across children. The resolver catches 6 classes of cascade violation at resolve time... not at review time.

- `values.v1.schema.json` (15 `$defs`, 519 lines)
- `QWF.values.json` (33 embedded tests, 1,201 lines)
- `QWR.values.json` (override-only child, 207 lines)
- `QWR.values.resolved.json` (auto-generated with full lineage, 1,369 lines)
- `validate_values.py` + `resolve_values.py` (production CLIs)
- `Values-Editor-Spec-v1.md` (buildable spec for first QOP page)
