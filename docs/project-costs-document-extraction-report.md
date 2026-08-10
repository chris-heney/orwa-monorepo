# Project Costs Document-Intelligence Pass — Committee Review Report

**Date:** 2026-08-06  
**Scope:** Multi-project grant applications that received tier-2 `source=even-split` backfill  
**Action taken:** Where itemization was unambiguous and reconciled with `combined_cost_of_projects`, amounts were updated via the production Strapi API (`PUT /grant-application-finals/:documentId?populate[project_costs]=true`) with `source=document`. No form UI changes; no redeploy.

## Summary counts

| Metric | Count |
| --- | ---: |
| Even-split apps before this pass | 204 |
| Updated to `source=document` | **17** |
| Left as `source=even-split` | **187** |
| Still `source=applicant` (tier-1 single-project; untouched) | 486 |

**Hit rate among the 204 even-split apps:** 17 / 204 ≈ **8.3%** upgraded in this pass.

Provenance of the 17 updates:

| Evidence source | Apps updated |
| --- | ---: |
| `description_justification_estimated_cost` text | 12 |
| Proposal / cost-estimate PDF (text layer) | 5 |

## PDF extraction hit rate (sampled)

About **111** of the 204 even-split apps have at least one PDF attachment. This pass mined a prioritized set of high-dollar / cost-estimate style PDFs (not all 111).

| Outcome (sampled PDFs) | Count | Notes |
| --- | ---: | --- |
| Text layer OK → used for update | 5 | Dewey, Okmulgee #20, Lone Chimney, Alva, Pawnee |
| Text layer OK but ambiguous vs selected types / combined | 5 | e.g. Washington $4M tank estimate, Mill Creek narrative, Cherokee #16 partial, Creek #5 SCADA-only, Carney single-project dual types |
| Scanned / image-only (empty selectable text) | 7+ | Delaware #12 letter, Hydro bids, Okmulgee #7 eng report, Major eLynx/Viking, McIntosh quotes, Harper tech memo, etc. |
| Encrypted PDF | 1 | Roff cost estimate |
| Extract error | 1 | Cherokee #11 Clear Creek (invalid horizontal advance) |
| OCR | unavailable | `pdf_evidence` OCR provider not configured in this environment |

**Practical PDF text-extract success among attempted cost docs:** roughly **10/20 (~50%)** yielded usable text; only **5/20 (~25%)** produced an unambiguous per-type split matching selected project types and combined cost. Scanned bids remain the main blocker.

---

## Updated applications (`source=document`)

All rows below were verified after PUT: every `project_costs` component has `source=document`, and `combined_cost_of_projects` still equals Σ amounts.

### High confidence (description)

| App ID | Entity | County | Combined | Derived split | Evidence |
| --- | --- | ---: | --- | --- | --- |
| 20043 | South Delaware County Regional Water Authority | Delaware | $12,321,522 | Storage $6,471,000; Other $5,850,522 | Description itemizes tower + transmission/pump/raw/treatment/line-ext; non-storage lines rolled into Other ($10k desc/combined reconcile on Other) |
| 20067 | Washington, City of | McClain | $195,747 | Billing Software/IT $25,823; Customer Meters $169,924 | Explicit Jayhawk + meter totals |
| 20248 | Jet | Alfalfa | $177,943 | SCADA $89,711; Customer Meters $88,232 | Explicit two-project costs in description |
| 20057 | Muskogee County Rural Water District 2 | Muskogee | $175,000 | Storage $43,000; Meters $11,340; Other $120,660 | Tower paint + meters; excavator + dump truck (+$2,660 reconcile) → Other |
| 20309 | Town of Kenefic | Bryan | $135,000 | Engineering $60,000; Other $75,000 | Line-item eng fees vs property acquisition |
| 10786 | Woods County Rural Water District #3 | Woods | $95,295 | Backup Generator $75,000; Other $20,295 | 4 generators; propane + leak drone → Other |
| 10349 | Stonewall Public Works Authority | Pontotoc | $77,330 | Treatment $66,630; Other $10,700 | Lagoon A–C vs irrigation D–E |
| 20189 | Lenapah Public Works | Nowata | $65,600 | Customer Meters $59,400; Line Extension $6,200 | Explicit estimates per work item |
| 11136 | Town of Okarche | Canadian | $56,500 | Backup Generator $28,000; Other $28,500 | Generator + 6″ pump |
| 20466 | Ripley Public Works Authority | Payne | $13,500 | Master/Inline Meters $8,500; Other $5,000 | Meter quote vs well-house doors |

### Medium confidence (description — committee should spot-check)

| App ID | Entity | County | Combined | Derived split | Why medium |
| --- | --- | ---: | --- | --- | --- |
| 14017 | Adair County rural water district 5 | Adair | $205,107 | Financial Auditing $26,000; Master/Inline Meters $152,318; Distribution Valves $26,789 | Install labor $60,900 allocated proportionally across meters/valves quotes |
| 11845 | Loyal PWA | Kingfisher | $23,657 | Treatment $21,917; Existing Source $1,740 | Projects 1–4 & 6 tagged Treatment; 5 & 7 tagged Existing Source — judgment call |

### High / medium confidence (PDF)

| App ID | Entity | County | Combined | Derived split | PDF | Confidence |
| --- | --- | ---: | --- | --- | --- | --- |
| 20257 | Okmulgee County Rural Water District #20 | Okmulgee | $310,800 | Engineering $40,000; Leak Repair $261,800; Distribution Valves $9,000 | `cost_est_7_21_25_*.pdf` | high |
| 20365 | Dewey County RWS & SWMD #3 | Woodward | $291,317 | New Source $270,817; Engineering $20,500 | `Cost_Estimate_7d7e81fc5c.pdf` (eng $20k + legal $500) | high |
| 20146 | Lone Chimney Water Association | Payne | $150,000 | Master/Inline Meters $130,000; Billing Software/IT $20,000 | `Cost_Estimate_4dcb33fc62.pdf` (soft costs folded into meters bucket) | high |
| 20168 | Alva Utility Authority | Woods | $698,238 | Line Repair $581,865; Engineering $116,373 | Hunt Street tech memo budget (construction vs contingencies/fees) | medium |
| 20148 | Pawnee County Rural Water District No. 3 | Pawnee | $180,375 | Master/Inline Meters $162,275; Billing Software/IT $18,100 | Bid tab Neptune/Core&Main — drive-by system → Billing | medium |

---

## Left as even-split (187) — why

| Reason bucket | Apps | Guidance for committee |
| --- | ---: | --- |
| Dollars in description but ambiguous vs selected types (has PDF) | 66 | Often miscategorized types, grant-ask language, or PDFs that don’t map 1:1; needs human read |
| Dollars in description but ambiguous (no PDF) | 51 | Same; no attachment to disambiguate |
| No dollars in description, has PDF | 30 | Many are scanned/image bids — text extract failed; OCR or manual review needed |
| No dollars in description, no PDF | 32 | Nothing to mine beyond even split |
| Sum mismatch / partial itemization | 3 | Item lines present but don’t reconcile cleanly |
| Corrupt / nonsensical `combined_cost_of_projects` | 1 | App **10483** Cherokee RWD9 — combined stored as `$90,000,110,000` (likely concatenated values). Do not trust even-split dollars until combined cost is corrected |
| Other | 4 | Edge cases |

### Notable high-dollar apps still even-split

| App ID | Entity | Combined | Why not updated |
| --- | --- | ---: | --- |
| 10483 | Cherokee RWD9 | $90,000,110,000 | Corrupt combined cost |
| 20163 | Delaware Co RWD #12 | $5,079,751 | Description has no dollars; project letter is scanned (EPSON) — empty text layer |
| 20153 | Washington, City of | $4,000,000 | Cost estimate is a multi-alternative capital plan; grant narrative is eng + audit for a loan — selected types don’t match estimate lines 1:1 |
| 13420 / 13426 | Chouteau PWA | ~$3.6–3.9M | Points to engineer report; no usable files linked in morph table for these rows |
| 10810 | Bernice PWA (2 apps) | $3.5M / $2.61M | Single lump-sum interconnection; types are components of one project |
| 20133 | Mill Creek | $1,267,000 | Proposal narrative lists Kubota / lagoon / generators / meters without per-type dollars in text; exhibits are image-heavy |
| 20247 | Okmulgee Co RWD #7 | $1,187,100 | Engineer report is image-only (no text layer) |
| 20420 | Salina PWA | $1,154,250 | Scanned SKM uploads |
| 13246 | Garfield Co RWD #6 | $1,047,025 | Only project total stated; booster vs line vs eng not itemized |
| 20072 | Town of Roff | $705,000 | Cost-estimate PDF encrypted |
| 20292 | Hydro Development Authority | $364,790 | Bids/eng report are Xerox scans (empty text) |
| 20377 | Atoka Municipal Authority | $224,388 | Single roll-off truck cost tagged across 4 project types — category abuse; left even-split rather than invent $0 rows |

---

## Method notes

1. Queried production MySQL (`strapi_prod_v5` / `nextcloud-mysql`) for published apps with `components_grant_project_costs.source='even-split'`.
2. Parsed `description_justification_estimated_cost` (plus `other_describe` / `additional_information`) for dollar amounts mapped to selected project-type names.
3. For high-dollar remainders, used `user-pdf-reader` MCP against `https://admin.orwa.org/uploads/...` (proposals, engineering reports, cost estimates).
4. Required: unambiguous mapping to **all** selected types (or clear remainder inference) **and** Σ amounts = `combined_cost_of_projects` within rounding (≤ $50 or 2%, with drift adjusted onto the largest line).
5. Updates went through Strapi so `enrich-project-costs` middleware re-snapshotted names/classifications and re-verified combined cost.

## Recommended next steps for committee

1. Spot-check the **5 medium-confidence** rows above (Adair labor split, Loyal tagging, Alva contingencies→Engineering, Pawnee drive-by→Billing, South Delaware Other bucket).
2. Fix **Cherokee RWD9 (10483)** combined cost before relying on any attribution.
3. For scanned high-dollar apps (Delaware #12, Okmulgee #7, Hydro, Salina, Roff), run a manual / OCR pass — those alone cover several million in even-split dollars.
4. Consider a follow-up pass after OCR is configured on the PDF MCP (`MCP_PDF_OCR_PRESET=tesseract` or equivalent).

## Artifacts

Working extracts (local, not committed): `/tmp/grant-doc-extraction/` (`pass1_results.json`, `final_candidates.json`, `applied.json`, exports).
