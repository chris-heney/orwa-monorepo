# Contestant Soft Cancellation Progress

Plan: `docs/superpowers/plans/2026-09-08-conference-contestant-soft-cancellation.md`
Branch: `conference/contestant-soft-cancellation`
Baseline: 37 relevant tests passed before implementation.

Task 1: complete (commits 4c6f9faf..7ff1aa09, review clean; production deployment must verify/backfill legacy status values before active filters go live).
Task 2: complete (commits 7ff1aa09..ad6c5ec8, review clean after concurrency fix).
Task 3: complete (commits ad6c5ec8..4748af2e, review clean after response-sanitization fix).
Task 4: complete (commits 4748af2e..722a4bbf, review clean; minor untested public query-string note).
Task 5: complete (commits 722a4bbf..e74ed8fc, review clean after cache/read-only/RBAC hardening).
Task 6: complete (commits e74ed8fc..6f373977, review clean after receipt data-shape fixes).
Task 7: complete (commits 6f373977..f7fc2352, review clean after production-safety and all-entry-point hardening).
Task 8: complete (commits f7fc2352..55d37171, report `.superpowers/sdd/task-8-report.md`). Full local verification passed after fixing four defects found during the run: Strapi build typecheck (d8d06e95), missing admin cancel/restore permissions causing 403 (39a5512f), the Cancelled/All contestant views returning nothing because the toggle ANDed its status onto the default active clause (84a7b583), and a successful cancel reporting failure and never repainting because `invalidateResourceCache` returned void through react-admin's dataProvider proxy (55d37171). 83/83 API checks, 166/166 Strapi tests, clean production Vite bundles, browser-verified in light/dark. Deploy note: Strapi schema + backfill migration MUST ship before the frontends — production currently 400s `Invalid key status` on the roster query.

Task 8 addendum: pre-deployment durability fixes complete (commits 7a745d12..3b223ae6, report addendum in `.superpowers/sdd/task-8-report.md`). The contestant view is now an explicit `status` sentinel that survives normalization, tab round trips, and store-key rebuilds, expanded into Strapi constraints only when the list query is built and persisted in RaStore under `conference.contestantStatusView`; the Admin-only cancel/restore grant is exported and asserted; a consumer-level test proves a successful cancel never reports failure when the cache or refresh throws. Three further defects were found and fixed during this pass: the Active clause overwrote an unrelated `$or` (search clauses were silently dropped), nested `$and: [{$or: […]}]` groups serialized as `[object Object]`, and the Active/Cancelled/All toggle rendered ~2600px off screen inside the table's horizontal scroll canvas. One near-miss caught before commit: defaulting an absent status to Active at the provider boundary would have dropped cancelled fees out of the conference metrics revenue breakdown, which fetches every contestant and partitions client-side — only an explicit sentinel is expanded. 171/171 Strapi tests, 132/132 conference + provider tests, browser-verified in light/dark with local data left byte-identical. Pre-existing and unfixed: member-manager `eslint` is broken repo-wide (eslint 8 locally vs eslint 9 + @typescript-eslint 8.65 from the root), and `apps/conference-hub/deploy.sh` does not flush the WP Engine page cache.
# Extras Skip Confirmation — SDD Progress

Branch: feat/extras-skip-confirmation
Plan: docs/superpowers/plans/2026-07-27-extras-skip-confirmation.md
Spec: docs/superpowers/specs/2026-07-27-extras-skip-confirmation-design.md
Started-from: 1b8ea7dbf77c84bddaea7f05504c2ada8b9a2949


Task 1: complete (commits 1b8ea7db..a4dbd71e, review clean; minors: redundant filter, missing all-included test)
Task 2: complete (commits a4dbd71e..a6b6ff3d, review clean; minor: data-validation-field on all AddExtras contexts)
Task 3: complete (commits a6b6ff3d..3416d092, review clean; minors: indent, unscoped querySelector, Vendor e2e by symmetry)
Final review fixes: complete (commits 3416d092..8e9bb96b + plan 4b4ba1fd; Escape/focus/order/aria)
