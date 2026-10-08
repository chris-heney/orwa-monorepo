const EDIT_TOKEN_STORAGE_KEY = "grant_application_edit_token";

export const getStoredEditToken = (): string | null => {
  try {
    return localStorage.getItem(EDIT_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const storeEditToken = (token: string): void => {
  try {
    localStorage.setItem(EDIT_TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.warn("Failed to store edit token:", error);
  }
};

export const clearStoredEditToken = (): void => {
  try {
    localStorage.removeItem(EDIT_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear edit token:", error);
  }
};

/** Token from the email link, if present (?edit_token=...). */
export const getEditTokenFromUrl = (): string | null => {
  try {
    return new URLSearchParams(window.location.search).get("edit_token");
  } catch {
    return null;
  }
};

/** Keep the address bar on the token the session is actually editing. */
export const replaceEditTokenInUrl = (token: string): void => {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("edit_token") === token) return;
    url.searchParams.set("edit_token", token);
    window.history.replaceState({}, "", url);
  } catch (error) {
    console.warn("Failed to update edit token in the URL:", error);
  }
};
