// Scoring-criteria selection lives in the shared PDF renderer so the form
// preview and the server-rendered applicant PDF can never disagree.
export {
  resolveProjectType,
  selectScoringCriteria as getSelectedCriterias,
} from "@orwa/grant-application-pdf";
