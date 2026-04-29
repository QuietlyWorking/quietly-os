# QOS Working Manual

This is the live build log for the Quietly Operating Standard. Each entry is a snapshot of what shipped in a single session. New entries get appended during `/session-wrap-up` in the QWU backoffice (see README.md for the one-line rule).

Read top-to-bottom: newest first.

---

## 2026-04-27... brain.quietlyos.org Sister Surface Launched

The QWF Advisor Brain has its public home. brain.quietlyos.org went live as the sister surface to quietlyos.org... where this site shows WHO QWF is (the schemas), brain.quietlyos.org shows HOW it decides (the choices and the WHY behind each one, captured at the moment of choice). The Brain itself is the operational HOW-layer that complements QOS; the Wisdom Library is a separate artifact handling what the org KNOWS. Three distinct artifacts, one companion architecture.

Phase 0 ships the foundation only: hero with the locked mission-thesis line ("The Brain grows because it gets corrected..."), the three-verdict reinforcement loop table (Approved / Approved+Reinforcement / Redirected+Reinforcement), the OS+Brain architecture diagram, the build map (27 nodes; 7 shipped, 20 planned), honest Phase 2/3 placeholders for the live ledger and trust meters that come later, the open-standard cross-link back here. No live ledger entries yet; the runtime is Phase 2.

Schema reuse: BRAIN.development-map.json validates against the same qos_development_map.v1.schema.json this site uses, with identity differentiation via identity.shortName "BRAIN". No fork in Phase 0. The map renders via build-time bake into the SvelteKit page; sweeps (em-dash scrub, supporter-anonymity, youth-protection framework, hand-applied TIG-personal toggle) all run before the client receives any prose. New repo at github.com/QuietlyWorking/quietly-brain; CF Pages project quietly-brain on Direct Upload mode mirroring this repo's deploy pattern. Four endpoints (canonical brain.quietlyos.org plus three redirect variants) with Google Trust Services SSL.

Footer cross-link added here under the Standard column ("Advisor Brain"). Sister-surface symmetry: brain.quietlyos.org footer + Open Standard section + Hero CTA all link back to quietlyos.org. Both sites are now reachable from each other.

---

## 2026-04-26... content.v1 Schema Family + 3-Source CLAUDE.md Generation

content.v1 ships as the third QOS programmatic-identity schema after values.v1 and voice.v1. The CLAUDE.md generator goes from 2-source to 3-source in the same atomic cutover. Phase 1 schema layer moves from 6/14 to 7/14 shipped. The 5 content ABSOLUTE patterns now render as HARD RULE blocks in CLAUDE.md, satisfying defense-in-depth on absolutes for content the same way voice principles already satisfy it for voice.

content.v1 ships with the schema family, the QWF root and QWR child instances, validate_content.py with 5 checks (structural, em-dash leak with path-scoped exemption, cross-schema ref resolution, articleDNA cascade, schema-version dispatch), resolve_content.py with the new lineage-channel cross-schema ref pattern (137 cross-schema refs resolved at C3 with zero unresolved), and a 14-scenario regression test for the em-dash exemption. The schema is the first QOS schema where the resolver fetches data from sibling schemas at resolve time. The pattern works.

The lineage-channel pattern is the architectural lesson. The original design said "inline the resolved content into the resolved output" so a downstream consumer reading QWF.content.resolved.json would see the actual voice and values content next to the original ref. That design FAILED schema validation... the schema sets `additionalProperties: false` on every typed object, which makes `_resolved_voiceRef`-style sibling keys illegal. The pivot: cross-schema refs record as STRING ENTRIES in `_resolution.lineage` (e.g., `"_xref:voice.tonePresets.tone-formal: cross-schema-resolved"`). The cost: downstream consumers re-resolve. The benefit: resolved files stay schema-valid AND ref integrity is enforced AND the C4 generator already re-resolves at render time anyway. The lineage-channel pattern is now QOS-canonical for resolvers.

`generate_claude_md_block.py` refactored from v1.2.0 to v1.3.0. SCHEMA_REGISTRY adds content as the third source. Composite SHA expands to `sha256(values_sha + voice_sha + content_sha)`. The marker line in CLAUDE.md exposes 4 SHAs for drift attribution. Three new renderers added: `render_content_article_dna_block` (per-article-type DNA, currently scaffolded for future contextual-priority emission), `render_content_forbidden_article_patterns` (HARD RULE blocks for the 5 ABSOLUTE patterns, residual table for OPERATIONAL), `render_content_encouraged_article_patterns` (the encouraged patterns table). Backward-compat shim verified: missing `content.resolved.json` gracefully degrades to values+voice rendering with hash-stable fallback. The composite-SHA marker line is now stable across 1-source, 2-source, and 3-source generation; the same generator scales to all remaining QOS schemas without managed-block format churn.

The far-end E2E passed cleanly. A fresh Claude Code agent with no prior context read the regenerated CLAUDE.md and ran 4 adversarial scenarios: a transparency article missing the QSP+ecosystem reference, a year-end donor email leading with tax-deductible-as-incentive, a youth newsletter blurb naming a 16-year-old by first name plus tool plus tenure, a transparency paragraph naming a fabricated supporter org and individual. The fresh agent caught all 4 violations on first instinct and self-corrected against the exact HARD RULE blocks, quoting them verbatim. Voice signatures (the "Three minutes without hope" framing, ellipsis-only punctuation, the "Quietly working. Always in their corner." sign-off) emerged naturally in the corrections. Voice.v1 from yesterday's atomic cutover is also load-bearing.

Phase 0 priority discipline applied. The `section-content-article-dna` section dropped from `priority: startup` to `priority: contextual` with `contextTrigger: "authoring an article"`. Per-article-type DNA is per-task detail; the universal forbidden patterns and encouraged patterns stay at startup because they apply to all content authoring regardless of type and need to be in the agent's context window from session start. The rule is "per-instance detail at contextual; cross-instance universal rules at startup." Generalizes across schemas.

A defensive observation surfaced for next-session work: CLAUDE.md contains 76 em-dashes in hand-written sections OUTSIDE the QOS-managed block (foundational directives table, QWF App Registry, Tool Wisdom Libraries table, Infrastructure Access section). These predate the QOS rulebook's ellipsis-only mandate and were not introduced by this cutover. A dedicated em-dash-scrub gate is queued as the next-session priority... the rulebook teaching one rule while modeling 76 violations in hand-written sections is a credibility gap that compounds. Path forward: focused single-session scrub, one commit, no agent-orchestration overhead.

Phase 1 milestones: Milestone A (Schema Layer Complete) sits 7 p1 nodes away (was 8). Milestone B (Schema plus Values Editor) sits 8 nodes away. Total Option C: 18/49 (37%). The next logical work queue: the CLAUDE.md em-dash scrub gate, then decisions.v1 (Phase 1 of the Advisor Brain, which was blocked behind content.v1 and is now unblocked).

The collaboration pattern: this session was the second to ship under the advisor-as-orchestrator contract (after voice+universe yesterday). The pattern continues to validate. TIG verdicted 5 Items Awaiting Explicit Verdict per Preference 11 (no-silent-approval-during-brain-formation). The corpus is at 15 preferences plus 2 Preference 4 refinement notes; the corpus-formation period continues with full discipline.

---

## 2026-04-26... brand.v2.4 Voice Extraction + Validator v1.1.0

Brand schema v2.4 ships. Voice extracts atomically out of `brand` for QWF and QWR; it now lives in voice.v1 where Hemingway-clarity rules belong. Brand keeps identity, heritage, audience, visual, messaging, credentials, and policies; voice owns voice. The unbundling pattern that began with v2.3 (values out) completes at v2.4 (voice out). Brand is no longer the god-object. It is one schema among the family.

- The atomic cutover applies only to QWF and QWR. Three supporter brands (GreenCal, Petersen Legacy Law, Gotham Good Dogs) retain inline voice with a `voice._migrationNote` field per Sacred Guesthood. Each supporter migrates voice into voice.v1 in their own dedicated authoring session, on their schedule, with their consent. We are guests with elevated privileges, not owners.
- `voiceRef` and `valuesRef` cross-pair pointers join the schema. QWF and QWR brand instances now declare which voice.v1 and values.v1 files they pair with. The validator confirms the targets resolve. Supporters skip silently because their refs are absent... that is correct schema-permitted behavior, not a gap.
- `validate_brand.py` ships v1.1.0 with two checks in one entry point per the cognitive-load discipline (one validator users learn, two checks it runs). Structural check validates each instance against the matching schema generation. Cross-pair check confirms voiceRef and valuesRef targets exist on disk. The new SCHEMA_DISPATCH lookup table reads `meta.schemaVersion` off the instance and routes to the matching schema file, so the validator now spans v2.2, v2.3, v2.4 and earns its keep across any future v2.x bump without constant edits.
- Orthogonal versioning applied. QWF and QWR brand files bumped both `schemaVersion` (structural) and `brandVersion` (content changed substantively because voice removal is content motion). Supporter brand files bumped only `schemaVersion`... their content did not change... and held `brandVersion` at original values. Each version field tracks its own concern. Bumping in lockstep is the noisy default; orthogonal is the semantic-accurate one.
- The ship is recognized via this Working Manual entry plus the dev-map node `p1.brand.v2-x` changelog. No empty marker commit on the qwu_backOffice repo. Discoverability for "where did v2.4 ship?" was already met three times over: the C1/C2/C3 commits are greppable by `brand.v2.4`, the Decision Ledger holds the audit trail, and the dev-map state machine flags the family at v2.4 as canonical. Adding a fourth surface to capture the same answer is the kind of redundant complexity that has to earn its place. It did not.

Phase 1 milestones unchanged in count (brand.v2-x was already shipped; v2.4 is a sub-ship within the v2.x family). The corpus grew though... the C4 review captured the principle test that justified the no-marker path: "is the concern already met by existing surfaces?" not "does the concern matter?" That shape repeats... atomic cutovers over deprecation windows, separate roots over flag fields, no-new-surface over redundant-surface. Resist additions when existing surfaces already capture the concern.

---

## 2026-04-25... Voice and Universe Schemas Ship in Parallel + First Cross-Schema Rule Relocation

Two QOS schemas landed in a single session: `voice.v1` and `universe.v1`. Phase 1 schema layer moves from 4/14 to 6/14 shipped. Total Option C completion: 17/49 (34%). The session also validated a new collaboration pattern (advisor-as-orchestrator), proved out the first cross-schema rule relocation in QOS history, and refactored the CLAUDE.md generator from single-source to multi-source.

`voice.v1` ships as the second QOS programmatic-identity schema after values.v1. The family includes the schema, the directive, the QWF root and QWR child instances, the validator with a 14-scenario regression test for the path-scoped em-dash exemption, the resolver with full lineage tracking, and the resolved artifacts for both QWF and QWR. The QWR resolved file carries 112 lineage entries (97 from-parent, 11 from-child, 2 merged, 2 overridden-by-child), proving the cascade contract holds end to end. Stress tests demonstrate the constitutional invariants: child cannot remove parent forbiddenPatterns, child cannot lower OPERATIONAL severity, ABSOLUTE principles cannot be redefined, free-form maps merge with key-level override.

The em-dash forbidden-pattern rule migrated atomically from `values.v1` to `voice.v1` in the same commit that shipped `voice.v1`. No deprecation window. No dual-source visibility gap. Voice owns voice rules; values keeps values rules. Punctuation discipline conceptually belongs in voice (Hemingway-clarity), not in values (craftsmanship). The 8-step cutover sequence shipped as the proven pattern for future cross-schema relocations: backup CLAUDE.md, edit the source schema, re-resolve both schemas, regenerate the managed block multi-source, machine-verify, diff-verify, run far-end E2E with an independent fresh agent, single staged commit. The far-end agent caught both spaced and unspaced em-dash variants on first instinct after reading the post-cutover CLAUDE.md, which is the inbox-side proof that the rule is still load-bearing in agent context.

`universe.v1` ships as the canonical map of the QWF app family. The QWF.universe.json instance catalogues 88 QWF-owned domains (70 apex zones plus 18 subdomains under `quietlyworking.org`), 17 apps spanning all live programs plus foundation entries, 18 cross-app relationships (SSO via QWF Passport, QSP data-share patterns, QOS schema dependencies), and the canonical 9-satellite ecosystem widget configuration with QSP at center. Supporter-owned and TIG-personal-legacy zones (50 registry-behind items) stay excluded per Sacred Guesthood and the supporter-anonymity discipline; they belong in their own universe roots when authoring begins. The validator runs 4 checks (structural, cross-reference, App Registry parity, ecosystem widget completeness) and the sync script reconciles against the Cloudflare API in dry-run mode. The directive documents three downstream consumers (build-time widget, build-time cross-app navigation, future Supabase-fanout runtime consumers), the Supabase `universe_definitions` table shape, and the widget refactor pointer for a future session.

`generate_claude_md_block.py` refactored from v1.1.0 to v1.2.0, single-source to multi-source. Composite SHA composes per-source SHAs in `SCHEMA_REGISTRY` order, so any source-file edit busts the in-sync check while each source SHA still surfaces in the marker for drift attribution. Renderer dispatch is keyed on (source, formatTemplate), so two schemas can share the same formatTemplate name (`forbidden-table`) without coupling. ABSOLUTE-severity items render as HARD RULE blocks regardless of source, so voice ABSOLUTE principles (Hemingway Clarity, Humor That Never Costs) get the same visual prominence as values absoluteRules. CLAUDE.md regenerated cleanly with 4 new sections appended (Voice Principles, Forbidden Voice Patterns, Encouraged Voice Patterns, Voice Signatures); the em-dash row migrated from the values forbidden-vocabulary section to the new voice forbidden-patterns section, with zero rule-visibility gap. The multi-source generator earns the right to host more schemas in the future (content.v1, people.v1, tools.v1) without touching the managed-block format again.

The collaboration pattern: this session was the first to run two parallel agent threads through four checkpoints each under an advisor-as-orchestrator contract. Eight checkpoint reports surfaced. The advisor reviewed each, escalated only the architectural calls and the SHIP gates to TIG, and handled routine refinements without surfacing. Zero autonomous commits. The pattern proves the operational replacement target the QWF app family is building toward, applied to the meta-layer: the advisor stops being a thing the founder operates and becomes a thing the founder supervises. The compass test passed all five lines.

Phase 1 milestones: Milestone A (Schema Layer Complete) sits 8 p1 nodes away (was 10). Milestone B (Schema plus Values Editor) sits 9 nodes away (was 11). Full Option C is 32 nodes away (was 34). The next logical work queue: brand.v2.4 (strip voice.vocabulary.* now that voice.v1 is field-proven), content.v1 (voice.v1 unblocks it), people.v1 plus tools.v1 (parallel-safe pair).

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
