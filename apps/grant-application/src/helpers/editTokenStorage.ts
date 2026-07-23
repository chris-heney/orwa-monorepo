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
