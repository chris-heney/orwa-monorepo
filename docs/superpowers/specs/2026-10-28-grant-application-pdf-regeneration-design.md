# Grant application PDF regeneration — design

Date: 2026-10-28
Apps: `apps/strapi`, `apps/grant-application` (gapp-form), `apps/member-manager`, new `libs/grant-application-pdf`

## Problem

The applicant PDF (`grant-application-final.applicant_pdf`) is rendered in the
browser by gapp-form at submit time and uploaded as a media file. Strapi only
stores the file id. When the grant manager edits an application in Member
Manager, the stored PDF is never touched and goes stale (example: TAFT PWA
#20404). The only tool to refresh it is a developer test panel in gapp-form's
admin view ("Manual PDF Generation") that stamps the wrong application number
(`last id + 1`), forcing a download → Member Manager → re-upload → fix-ID loop.

A second defect surfaced the same day: when a newly attached proposal file
fails to upload (Chrome aborts the request; nginx logs 499), gapp-form keeps
going, sends the raw `{src, rawFile}` object to Strapi, and the save fails with
a 500 (`Invalid relations`). ~30 orphaned applicant PDFs were created by the
retries.

## Decisions (user-approved)

- Approach C: automatic server-side regeneration via Strapi lifecycle while
  status is `New Application` or `Awaiting Committee`, plus a manual
  "Regenerate PDF" override button in Grant Manager (any status).
- Regenerated PDFs stamp the original `application_date`, not today.
- Applicant edit-link access stays limited to `New Application`.
- gapp-form admin sidebar gets **View PDF** / **Download PDF** that render on
  demand with the real application number; the Manual PDF Generation panel
  (Generate / Download / View / Upload Generated File) is removed.

## Components

### 1. `libs/grant-application-pdf` (`@orwa/grant-application-pdf`)

Pure, environment-agnostic renderer (pdf-lib, no React, no DOM, no fetch).

```ts
export type ApplicantPdfContact = { first?; last?; email?; phone?; title? };
export type ApplicantPdfInput = {
  applicationNumber: string;        // printed as "Application # …"
  applicationDate: Date | string;   // "Date Received" + signature date
  legalEntityName: string;
  facilityId?: string; county?: string; populationServed?: number | string;
  physicalAddress: { street; city; state; zip };
  pointOfContact: ApplicantPdfContact;
  chairman?: ApplicantPdfContact;
  additionalContacts?: ApplicantPdfContact[];
  hasEngineer: boolean;
  changeOrderRequest?: string;
  drinkingOrWastewater: "Drinking Water" | "Wastewater" | string;
  scoringCriteria: Array<[order: string, label: string, checked: boolean]>;
  projectStatus: { engineeringReport; reportApprovedByDeq; resolvesViolation;
                   satisfyDeqIssuedOrder; moneySetAside; appliedToOtherLoans };
  projectCosts: Array<{ project_type_id; name?; amount }>;
  combinedCostOfProjects: number;
  descriptionJustification: string;
  signatoryName: string; signatoryTitle: string;
  signaturePngDataUrl?: string;     // optional; signature block drawn without image if absent
};
export function renderApplicantPdf(input: ApplicantPdfInput): Promise<Uint8Array>;
export function selectScoringCriteria(selectedProjectIds, scorings, drinkingOrWastewater): Array<[string,string,boolean]>;
export function applicationToPdfInput(application, scorings): ApplicantPdfInput; // from a populated Strapi record
export function formPayloadToPdfInput(payload, scoringCriteria, applicationNumber, applicationDate): ApplicantPdfInput; // from gapp-form values
```

Layout is the existing gapp-form generator moved verbatim, with the two date
stamps and the application number coming from the input. The unused
member-manager fork `grant-application/helpers/generateApplicantPdf.ts` is
deleted. `selectScoringCriteria` is the current `getSelectedCriterias`
(filter scorings by `project_type.classification === drinkingOrWastewater`,
checked = project id in selected set) so client and server agree.

Package shape mirrors `@orwa/terms-gate` (`package.json` with `main:
./src/index.ts`, `project.json`, `tsconfig.json`). Strapi consumes it through
a path alias / workspace dependency so `strapi build` compiles it.

### 2. Strapi service `api::grant-application.applicant-pdf`

`regenerate(documentId, { reason }): Promise<{ ok: true; file } | { ok: false; error }>`

1. Load the application with `EDIT_SESSION_POPULATE` + `applicant_pdf`,
   `status`, `selected_projects`, `project_costs`.
2. Load `api::grant-application-scoring` (populate `project_type`).
3. `applicationToPdfInput` → `renderApplicantPdf` → write bytes to a tmp file.
4. If `applicant_pdf` exists: `strapi.plugin("upload").service("upload").replace(fileId, { data: { fileInfo: { name } }, file })`
   — Strapi 5.52 keeps `hash` + `ext`, so the URL is unchanged.
   Else: `upload({ data: { refId: application.id, ref: UID, field: "applicant_pdf", fileInfo: { name } }, files: file })`
   which links through the morph table without updating the application row.
   Neither path re-fires the application lifecycle.
5. Filename `<legal_entity_name>-application.pdf`. Tmp file removed in `finally`.
6. Errors are caught, logged as `applicant-pdf regenerate failed <documentId>: <message>`, and
   returned; lifecycle callers never throw.

### 3. Lifecycle (in `plugins/grant-management/server/bootstrap.ts`)

- `afterCreate`: call `regenerate` **before** building the "Application
  Receipt" email so the attachment is the server-rendered file.
- `afterUpdate`: load the current status name from the DB (not
  `params.data`). Run only when status ∈ {`New Application`, `Awaiting
  Committee`} **and** `event.params.data` contains at least one key from
  `PDF_RELEVANT_FIELDS`:
  `legal_entity_name, facility_id, county, population_served, physical_address_*,
  point_of_contact, chairman, engineer, has_engineer, additional_contacts,
  drinking_or_wastewater, selected_projects, project_costs,
  combined_cost_of_projects, description_justification_estimated_cost,
  engineering_report, report_approved_by_deq, resolves_violation,
  satisfy_deq_issued_order, money_set_aside, applied_to_other_loans,
  change_order_request, signatory_name, signatory_title, signature,
  application_date, application_id`.
  Status-only / payout-only saves do not touch the file.

### 4. Manual override endpoint + Grant Manager button

- `POST /api/grant-application/:documentId/regenerate-pdf` — requires an
  authenticated user (JWT, same as Member Manager's other calls); returns
  `{ file }` or `4xx { error }`.
- Member Manager `GrantApplicationDetails`: "Regenerate PDF" button next to
  "View Applicant PDF", any status. Success toast + `refetch`; failure uses the
  shared red toast with the server message. "View Applicant PDF" opens
  `${url}?v=${file.updatedAt}` to defeat browser caching of the unchanged URL.

### 5. gapp-form changes

- Remove `helpers/uploadApplicantPdfTest.tsx` (`ManualUploadTest`),
  `helpers/uploadApplicantPdf.ts`, `helpers/generateApplicantPdf.ts`, and the
  client-side PDF upload in `StepNavigation` and `EntryListSidebar`;
  `applicant_pdf` is no longer sent.
- `EntryListSidebar` (admin view) gains an "Application PDF" block with
  **View PDF** and **Download PDF**. Both call `formPayloadToPdfInput` on the
  current form values, using `application_id` from the loaded entry / edit
  session when present (new applications fall back to the next id), and
  `application_date` when present (else today). View opens a blob URL in a
  new tab; Download saves `<legal_entity_name>-application.pdf`.
- The same two buttons render for the applicant in edit-link mode (small
  block above the step navigation).
- `processAndUploadFiles` returns `{ payload, failures: string[] }`: a
  failed upload records the file title and the field, never leaves raw
  objects in the payload. Upload prefers the IndexedDB cached Blob
  (`fileCache.getFile(cacheId)`), falling back to `rawFile`. `StepNavigation`
  and `EntryListSidebar` abort the submit when `failures.length > 0` and show
  one red toast: `Could not upload "<title>". Remove it and choose it again.`

### 6. Strapi input hardening

`createGrantApplication` and `updateEditSession` validate media fields
(`proposals`, `uploaded_engineering_report`, `uploaded_notice_of_violation`,
`uploaded_additional_files`, `consent_order`, `applicant_pdf`): every entry must
be a positive integer id (or `{ id }`). Otherwise respond `400 { code:
"invalid_request", field, message }` instead of letting the validator 500.

## Out of scope (flagged)

- `ReviseApplication` (Reprocessed) copies the source `applicant_pdf`; the
  manual button covers it.
- gapp-form admin "Resubmit" calls the create path and duplicates the
  application rather than updating it.
- Cleanup of today's ~30 orphaned applicant PDFs (media ids 6080–6108).

## Verification

- Lib unit tests: dates come from `applicationDate`; `selectScoringCriteria`
  matches the old helper on a fixture; renders with and without signature.
- Strapi: lifecycle + endpoint tested locally against the production-copy DB
  on #20404:
  - Member Manager edit of a PDF field → same file id/URL, new bytes, new
    `updatedAt`, PDF shows edited value and original date.
  - Status-only save → file untouched.
  - Same edit on a `Committee Approved` application → untouched; button
    regenerates it.
  - Applicant edit-link save → regenerated.
  - New submission → receipt email attachment is the server PDF.
  - Media entry without id → 400 with field name.
- gapp-form headless: View/Download produce a PDF with the real application
  number; a failed attachment blocks submit with the named toast.
- Member Manager headless (light + dark): button renders, regenerates, view
  link busts cache.
- Ship order: Strapi → gapp-form → member-manager, each per
  `.cursor/rules/orwa-ship-deploy.mdc`.
