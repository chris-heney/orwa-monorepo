import Cookies from "./Cookies";
import { loadAdminView } from "./adminViewPersistence";
import { detectTestMode } from "./detectTestMode";

/**
 * Step-number navigation is admin-only: JWT session + Enable Admin View.
 * Presence of `?admin` is not enough (that only opens the login modal).
 * Test mode forces public UX, matching User context.
 */
export const canJumpWizardSteps = (
  isLoggedIn: boolean,
  isAdminView: boolean
): boolean => Boolean(isLoggedIn && isAdminView);

/**
 * Sync check for the first paint / URL `?step=` restore, before React auth
 * state hydrates. Same rules as {@link canJumpWizardSteps}.
 */
export const canJumpWizardStepsFromSession = (
  search = typeof window !== "undefined" ? window.location.search : ""
): boolean => {
  if (typeof document === "undefined") return false;
  if (detectTestMode(search)) return false;
  try {
    return Boolean(Cookies.getCookie("token") && loadAdminView());
  } catch {
    return false;
  }
};

/** Prefer URL `?step=` only when the visitor may jump; otherwise use the draft. */
export const resolvePreferredWizardStepKey = (
  urlStep: string | null,
  draftStep: string | null | undefined,
  canHonorUrlStep: boolean
): string | null => {
  if (canHonorUrlStep && urlStep) return urlStep;
  return draftStep ?? null;
};
