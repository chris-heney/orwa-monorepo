# Grant Application PDF Regeneration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The stored applicant PDF on a grant application regenerates server-side on every qualifying save, Grant Manager can force it, gapp-form admins can view/download it with the right application number, and a failed attachment upload can no longer produce a 500.

**Architecture:** One pure pdf-lib renderer under `apps/strapi/src/shared/grant-application-pdf/` is consumed by Strapi (service + lifecycle + endpoint) and by gapp-form (vite alias). Strapi overwrites the existing media file with the upload plugin's `replace()` so the URL never changes. gapp-form stops generating/uploading PDFs itself.

**Tech Stack:** Strapi 5.52 (TypeScript), pdf-lib 1.17, React 18 + Vite (gapp-form, member-manager / react-admin), MUI, Tailwind.

Spec: `docs/superpowers/specs/2026-10-28-grant-application-pdf-regeneration-design.md`

## Global Constraints

- Regenerated PDFs print `application_date` for "Date Received" and the signature date, never `new Date()`.
- Lifecycle regeneration only when status name is `New Application` or `Awaiting Committee` and a PDF-relevant field is in `params.data`.
- Never throw from a lifecycle; log `applicant-pdf regenerate failed <documentId>: <message>`.
- Keep the media file id/URL stable (`upload.replace`) when a PDF already exists.
- gapp-form must block submit when any attachment fails to upload; toast text: `Could not upload "<title>". Remove it and choose it again.`
- Ship order Strapi → gapp-form → member-manager per `.cursor/rules/orwa-ship-deploy.mdc`.

---

### Task 1: Shared renderer `apps/strapi/src/shared/grant-application-pdf/`

**Files:**
- Create: `apps/strapi/src/shared/grant-application-pdf/index.ts` (exports)
- Create: `apps/strapi/src/shared/grant-application-pdf/types.ts` (`ApplicantPdfInput`, `ApplicantPdfContact`, `ScoringCriteriaRow`)
- Create: `apps/strapi/src/shared/grant-application-pdf/render.ts` (`renderApplicantPdf`) — moved from `apps/grant-application/src/helpers/generateApplicantPdf.ts`
- Create: `apps/strapi/src/shared/grant-application-pdf/criteria.ts` (`selectScoringCriteria`, `resolveProjectType`) — moved from `apps/grant-application/src/helpers/getCriterias.ts`
- Create: `apps/strapi/src/shared/grant-application-pdf/inputs.ts` (`applicationToPdfInput`, `formPayloadToPdfInput`)
- Create: `apps/strapi/src/shared/grant-application-pdf/render.spec.ts`
- Modify: `apps/strapi/package.json` (+ `pdf-lib`), `apps/strapi/package-lock.json`
- Delete: `apps/member-manager/src/modules/grant-manager/grant-application/helpers/generateApplicantPdf.ts`

**Interfaces produced:**
- `renderApplicantPdf(input: ApplicantPdfInput): Promise<Uint8Array>`
- `selectScoringCriteria(selectedProjectIds: Array<string|number>, scorings: ScoringLike[], drinkingOrWastewater: string): ScoringCriteriaRow[]`
- `applicationToPdfInput(application: PopulatedApplication, scorings: ScoringLike[]): ApplicantPdfInput`
- `formPayloadToPdfInput(payload: FormPayloadLike, criteria: ScoringCriteriaRow[], applicationNumber: string, applicationDate: Date|string|undefined): ApplicantPdfInput`
- `applicantPdfFileName(legalEntityName: string): string` → `<legal_entity_name>-application.pdf`

Steps: write spec test (dates from `applicationDate`, renders without signature, criteria selection matches fixture) → implement → `npx vitest run src/shared` in `apps/strapi` → commit `strapi: shared grant application PDF renderer`.

### Task 2: Strapi service + lifecycle + endpoint

**Files:**
- Create: `apps/strapi/src/api/grant-application/services/applicant-pdf.ts`
- Create: `apps/strapi/src/api/grant-application-final/content-types/grant-application-final/lifecycles.ts`
- Modify: `apps/strapi/src/api/grant-application/controllers/grant-application.ts` (+ `regeneratePdf`, media-id validation → 400)
- Modify: `apps/strapi/src/api/grant-application/routes/grant-application.ts` (+ `POST /grant-application/:documentId/regenerate-pdf`)
- Modify: `apps/strapi/src/index.ts` (grant `api::grant-application.grant-application.regeneratePdf` to Admin role and any role whose `modules` includes `grants`)
- Modify: `apps/strapi/src/plugins/grant-management/server/bootstrap.ts` (no change needed if lifecycles.ts runs first; verify attachment present)
- Create: `apps/strapi/src/api/grant-application/helpers/pdf-relevant-fields.ts` + spec (`shouldRegenerateFor(statusName, dataKeys)`)
- Create: `apps/strapi/src/api/grant-application/helpers/media-ids.ts` + spec (`invalidMediaField(data) → { field, title } | null`)

**Interfaces produced:**
- `strapi.service("api::grant-application.applicant-pdf").regenerate(documentId, { reason }) → { ok: true, file } | { ok: false, error }`
- `POST /api/grant-application/:documentId/regenerate-pdf → 200 { file } | 404 | 422 { error }`

Verify locally (Strapi on 13370, DB copy): edit #20404 fields via PUT → same file id/url, new `updated_at`; status-only PUT → untouched; `Committee Approved` app → untouched; endpoint regenerates; invalid media entry → 400. Commit `strapi: regenerate applicant PDF on save + manual endpoint`.

### Task 3: gapp-form — alias, sidebar View/Download, remove panel, block on failed uploads

**Files:**
- Modify: `apps/grant-application/vite.config.ts`, `apps/grant-application/tsconfig*.json` (alias `@orwa/grant-application-pdf`)
- Create: `apps/grant-application/src/helpers/applicantPdfPreview.ts` (`buildPreviewPdf(formValues, scorings, { applicationNumber, applicationDate }) → Blob`)
- Create: `apps/grant-application/src/components/_components/ApplicationPdfActions.tsx` (View / Download buttons)
- Modify: `apps/grant-application/src/entries/EntryListSidebar.tsx` (add block; drop client PDF upload)
- Modify: `apps/grant-application/src/components/StepNavigation.tsx` (drop client PDF upload; block on failures)
- Modify: `apps/grant-application/src/components/GrantApplicationForm.tsx` (remove `ManualUploadTest`; add `ApplicationPdfActions` in edit mode)
- Modify: `apps/grant-application/src/helpers/processAndUploadFiles.ts` (return `{ payload, failures }`, upload from `fileCache` first)
- Modify: `apps/grant-application/src/helpers/getCriterias.ts` (re-export from shared)
- Delete: `apps/grant-application/src/helpers/uploadApplicantPdfTest.tsx`, `uploadApplicantPdf.ts`, `generateApplicantPdf.ts`

Verify headless: admin view of an entry → View PDF opens blob with `Application # <application_id>`; forced upload failure → one red toast, no PUT. Commit `grant-application: server-generated applicant PDF; View/Download in sidebar; block submit on failed uploads`.

### Task 4: member-manager — Regenerate PDF button + cache-busted view

**Files:**
- Create: `apps/member-manager/src/modules/grant-manager/grant-application/components/RegenerateApplicantPdfButton.tsx`
- Modify: `apps/member-manager/src/modules/grant-manager/grant-application/components/GrantApplicationDetails.tsx` (button + `?v=` on view link)

Verify headless light + dark. Commit `member-manager: Regenerate PDF button on grant application`.

### Task 5: Ship

Strapi docker-push + pull/restart + smoke; gapp-form build/rsync/flush/verify hash; member-manager build/rsync/flush/verify hash. Regenerate #20404 in production via the new button and confirm the PDF shows the edited data.
