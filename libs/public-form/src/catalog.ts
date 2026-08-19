/**
 * Inventory of reusable ORWA UI / helpers that public apps and
 * member-manager already share — or should share next.
 *
 * Implemented in this library:
 * - createWizardPersistence — sessionStorage draft + ?step= URL sync
 *
 * Already shared elsewhere:
 * - @orwa/terms-gate — locking overlay for public forms
 * - member-manager PageHeadingBar — black Media Library-style list/edit bars
 * - grant-manager useSummaryTokens() — light/dark summary palette
 * - orwef-scholarships CountCard / MediaLink — reused by ORWA Awards
 * - customDatagridStyle — theme-aware zebra rows
 *
 * Next extractions (do not copy-paste again):
 * - validationHighlight + HighlightByName (copied in scholarship, awards,
 *   conference-registration, grant-application, membership-application)
 * - Public form inputs: TextInput, SelectInput, FileInput, CheckboxInput,
 *   NumberInput, TextAreaInput, MaskedPhoneInput, WatersystemAutocomplete
 * - uploadService + processAndUploadFiles (single-media unwrap)
 * - WizardStateSync wrapper around createWizardPersistence
 * - member-manager summary shell (sticky header + flush ink canvas + glossary)
 */
export const PUBLIC_FORM_CATALOG = {
  implemented: [
    "createWizardPersistence",
    "@orwa/terms-gate",
    "PageHeadingBar",
    "useSummaryTokens",
    "CountCard",
    "MediaLink",
    "customDatagridStyle",
  ],
  next: [
    "validationHighlight",
    "public form inputs",
    "uploadService",
    "WizardStateSync",
    "summary dashboard shell",
  ],
} as const;
