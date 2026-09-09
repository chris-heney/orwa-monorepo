const REIMBURSE_TOKEN_STORAGE_KEY = "grant_reimbursement_token";
const URL_PARAM = "reimburse_token";

export const getStoredReimbursementToken = (): string | null => {
  try {
    return localStorage.getItem(REIMBURSE_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const storeReimbursementToken = (token: string): void => {
  try {
    localStorage.setItem(REIMBURSE_TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.warn("Failed to store reimbursement token:", error);
  }
};

export const clearStoredReimbursementToken = (): void => {
  try {
    localStorage.removeItem(REIMBURSE_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear reimbursement token:", error);
  }
};

/** Token from the email link, if present (?reimburse_token=...). */
export const getReimbursementTokenFromUrl = (): string | null => {
  try {
    return new URLSearchParams(window.location.search).get(URL_PARAM);
  } catch {
    return null;
  }
};

/** Drop the token from the address bar so refresh/back does not re-trigger it. */
export const stripReimbursementTokenFromUrl = (): void => {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(URL_PARAM)) return;
    url.searchParams.delete(URL_PARAM);
    window.history.replaceState(window.history.state, "", url.toString());
  } catch {
    /* ignore */
  }
};
