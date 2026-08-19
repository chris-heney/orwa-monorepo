/** Session-scoped Admin View flag (same lifetime as conference-registration). */
export const ADMIN_VIEW_STORAGE_KEY = "orwa-awards-admin-view";

export const loadAdminView = (): boolean => {
  if (typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(ADMIN_VIEW_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

export const saveAdminView = (enabled: boolean): void => {
  if (typeof sessionStorage === "undefined") return;
  try {
    if (enabled) {
      sessionStorage.setItem(ADMIN_VIEW_STORAGE_KEY, "1");
    } else {
      sessionStorage.removeItem(ADMIN_VIEW_STORAGE_KEY);
    }
  } catch {
    // Quota / private mode — ignore
  }
};

export const clearAdminView = (): void => {
  saveAdminView(false);
};
