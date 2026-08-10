import { useEffect, useRef } from "react";
import { userPreferencesStore } from "../helpers/userPreferencesStore";
import CookieStore from "../helpers/ra-strapi-data-provider/src/CookieStore";

/**
 * Hydrates RaStore from server user_preferences on authenticated boot,
 * and flushes pending writes on page unload.
 */
const UserPreferencesSync = () => {
  const ranForToken = useRef<string | null>(null);

  useEffect(() => {
    const token = CookieStore.getCookie("token");
    if (!token || ranForToken.current === token) return;
    ranForToken.current = token;
    void userPreferencesStore.fetchAndSync();
  }, []);

  useEffect(() => {
    const onUnload = () => {
      void userPreferencesStore.flush();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  return null;
};

export default UserPreferencesSync;
