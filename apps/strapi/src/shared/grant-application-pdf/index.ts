/**
 * Shared DEQ/ORWA RIG application PDF renderer.
 *
 * Lives under apps/strapi so the self-contained Strapi Docker build can
 * compile it; gapp-form imports it through the `@orwa/grant-application-pdf`
 * vite/tsconfig alias. Keep this directory free of Strapi, React and DOM
 * dependencies.
 */
export * from "./types";
export { renderApplicantPdf, applicantPdfFileName } from "./render";
export { selectScoringCriteria, resolveProjectType } from "./criteria";
export {
  applicationToPdfInput,
  formPayloadToPdfInput,
  toPdfInput,
} from "./inputs";
export type { ApplicationLike } from "./inputs";
