# QOS Working Manual

This is the live build log for the Quietly Operating Standard. Each entry is a snapshot of what shipped in a single session. New entries get appended during `/session-wrap-up` in the QWU backoffice (see README.md for the one-line rule).

Read top-to-bottom: newest first.

---

## 2026-04-23... QOS Development Map Shipped

The map that describes the QOS build journey is itself live on quietlyos.org. QOS under QOS... schema + instance + tooling + session-wrap-up integration + public render, all load-bearing together. The artifact is itself a reference implementation... JSON source of truth, deterministic renderer, drift validator, auto-update through session-wrap-up. 49 nodes across 6 phases trace the journey from VOSPA origin (the 30-year consulting methodology) through schema layer, consumption layer, QOP edit UI, A/B testing, and open-standard publication.

Four checkpoints landed in one session. Checkpoint 1 drafted the schema with 8 `$defs`, a 6-state status vocabulary, enforced legal transitions, self-identifying QOS meta, and phase-prefixed kebab-case node ids with a 2+ segment minimum. Self-valid under Draft 2020-12. Checkpoint 2 authored the instance; Phase 0 nodes declare real vault artifacts (VOSPA methodology, the 5-line compass, personal dreams, the Duct Tape series, the QOS reference-implementation convention, the three-plane architecture) so the drift validator applies uniformly from day one. Every shipped node's files[] was verified against the filesystem before the initial commit.

Checkpoint 3 shipped three tooling scripts together as the p2 consumption layer for the map... `validate_qos_development_map.py` runs the 8 checks, `toggle_development_map_node.py` enforces the legal state graph and calls validate internally before any write (drift cannot bypass the toggle entry point), `render_qos_development_map.py` emits ASCII for the vault and HTML for quietlyos.org with supporter-anonymity sweep and em-dash scrub. The same checkpoint consolidated four dev-map-specific nodes into a single in-flight `p1.qos.development-map` so the node cannot claim shipped until every piece is load-bearing... eat-your-own-dog-food applied to the tracking artifact itself.

Checkpoint 4 integrated. An additive step in the session-wrap-up skill asks which nodes each session touched and calls the toggle for each; the step supports `none` as a valid answer, loops over multiple transitions, logs every transition to the session summary, and surfaces failures loudly without aborting the wrap-up. On quietlyos.org, `DevelopmentMap.svelte` imports the instance JSON at build time, re-runs the supporter-anonymity sweep and em-dash scrub in TypeScript as a build-time guarantee, and renders between the Working Manual and Reference Implementation sections. End-to-end verification used `p1.wisdom.v1` (not `p1.voice.v1`, which enters real work soon) as a test node, transitioning planned to in-flight, confirming the update on live quietlyos.org, then reverting so no test state persists on the public site.

The final verification is the map validating itself by its own completion. This entry is the `working_manual_entry` referenced by `p1.qos.development-map` in the shipped instance. When the CF Pages deploy reflecting this commit lands, the node transitions in-flight to shipped in the same render that reports it shipped. The map tells the truth about itself because the code forces it to. Milestone A sits 10 p1 nodes away; Milestone B adds the Values Editor behind that; Milestone C is 34 nodes beyond. Distances computed deterministically at render time... they cannot drift.

Phase 0's root is VOSPA itself. The methodology predates the map by 30 years. The map is a legacy artifact tracing VOSPA's democratization from consulting engagement to JSON contract to open standard.

---

## 2026-04-23... Resolver Handles Roots + Generator Simplified

The known limitation flagged in the CLAUDE.md Generator entry is closed. `resolve_values.py` ships as v1.1.0 with a public `resolve_root(values)` function and auto-detect on `inheritance.parent === null`. Root files now produce canonical `<shortName>.values.resolved.json` artifacts on disk just like children do... `QWF.values.resolved.json` now exists next to `QWR.values.resolved.json`, closing the asymmetry that consumers had to work around.

Auto-detect is the default path. A `--root` flag is available as a defensive override for corrupted files where `inheritance.parent` might be misleading. Zero friction for all future callers... voice.v1, content.v1, universe.v1, and the remaining nine schemas in the 13-schema family now inherit the clean root-handling pattern from day one instead of duplicating the wrapper workaround in each generator.

`generate_claude_md_block.py` shipped as v1.1.0 alongside. The in-memory `ensure_resolved()` self-wrap (55 lines) is gone. The reader is strict now: requires `<org>.values.resolved.json` on disk, sanity-checks the `_resolution` block on load, refuses unresolved source files with a clear error that points to the fix command. No more silent fallback paths. Drift cannot hide.

Verification was rigorous. QWF payload SHA256 matched prediction exactly (`40953847...`), confirming the refactor is semantically pure... moving content from "root read and wrap in-memory" to "root write to disk then read" changed zero payload bytes. CLAUDE.md managed-body diff was exactly 2 lines, both markers flipping `source: QWF.values.json` to `source: QWF.values.resolved.json`. The 119 rendered lines of compass, hard rules, forbidden table, encouraged table, decision filters, and ethical boundaries preserved byte-for-byte. Zero em-dash substitutions at render time.

One serialization artifact surfaced: `QWR.values.resolved.json` regeneration reshuffled key ordering in `meta` and `coreValues.craftsmanship` without changing semantic content. Sort-keyed canonical payload stayed stable. All 41 cascade lineage entries reproduced identically... craftsmanship still severity-raised, voice-fidelity and the four other QWR additions still from-child-added. File-level sha256 drifts were serialization noise, not cascade-behavior changes. Worth a one-time resolve of every child file whenever sources change, to keep committed artifacts in lockstep with fresh resolver output.

Phase 1 of QOS is fully load-bearing now. Next session opens directly to `voice.v1.schema.json` design... the resolver unblock paid once saves every downstream schema.

---

## 2026-04-23... brand.v2.3 Refactor Shipped

Brand schema v2.3 ships. Eight sections now migrated out of brand into values.v1: `identity.values[]`, `content.youthProtection`, `content.unifiedIdentity`, `voice.punctuation.forbidden`, `voice.vocabulary.{forbidden,encouraged,use}`, `inheritance.absoluteRules`. The drift window where youth-protection and unified-identity rules lived in two schemas at once is closed. Single source of truth on each concern is back. QWR's production `brand_resolved` Supabase view now returns v2.3 data end-to-end.

- QOS reference-implementation meta (`standard`, `canonical_home`, `license`, `description`) landed at both schema-level and on every instance. Every brand file now self-identifies as a QOS artifact with a link home. Convention documented in `memory/feedback_qos_schemas_are_reference_implementations.md`.
- `SchemaVersion` is now a `oneOf` union: semver string (`"2.3.0"`) preferred, legacy integer accepted. Backward-compatible. Latent bug surfaced immediately: the Supabase `schema_version` INT column rejected `"2.3.0"` on upsert. Fixed by projecting major version into the column while keeping full semver in `brand_json.meta`. Two commits: the v2.3 refactor + the sync-script projection fix.
- `QWR.resolved.json` renamed to `QWR.brand.resolved.json`. Pattern is now `{shortName}.{schema}.resolved.json` across the 13-schema family. The file is a generated artifact for debugging and fixtures only... the live `brand_resolved` Supabase view is populated by in-memory resolution during sync, not by reading filesystem files.
- Three supporter brands retain their own `identity.values[]` and `voice.vocabulary.*` locally under `additionalProperties: true`. They are not QWF-values-derived and await their own `<ShortName>.values.json` and `voice.v1` migrations. Catalogued in the directive's new `Remaining Migrations (Post v2.3)` table (17 rows, 4 columns).
- Values.v1 drift fix folded into the same commit: `QWF.values.json` + `QWR.values.json` `canonical_home` corrected from `.com` to `.org`. `values.v1.schema.json` itself still has `.com` at schema-level... one-line edit deferred to next session (logged in Open Questions).
- Em-dash discipline: zero new em dashes introduced in any authored content (schema + 5 brand files + 2 values fixes + directive additions + WORKING_MANUAL entry). Pre-existing em-dash prose in supporter-brand narrative, directive boilerplate, and resolver docstring flagged for a separate voice-scrub pass.

Phase 1.5 of the Programmatic Identity System. Phase 2 is `voice.v1.schema.json` (extract from `brand.voice`) and the first supporter-brand values.json. Brand is no longer the single god-object for identity. It's one schema among 13, each owning its own concern.

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
