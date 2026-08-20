import { localStorageStore, type Store } from "react-admin";
import CookieStore from "./ra-strapi-data-provider/src/CookieStore";
import { isImpersonating } from "./impersonation";

const DEBOUNCE_MS = 1000;

type StoreWithList = Store & {
  listItems?: (keyPrefix?: string) => Record<string, unknown>;
};

/** Keys that must never round-trip to the server. */
const isEphemeralKey = (key: string): boolean =>
  key === "version" || key.endsWith(".selectedIds") || key.endsWith("selectedIds");

const RA_STORE_PREFIX = "RaStore.";

const prefsUrl = () =>
  `${import.meta.env.VITE_API_ENDPOINT}/api/my-preferences`;

const authHeaders = (): HeadersInit => {
  const token = CookieStore.getCookie("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const isEmptyPrefs = (prefs: unknown): boolean => {
  if (prefs == null) return true;
  if (typeof prefs !== "object" || Array.isArray(prefs)) return true;
  return Object.keys(prefs as object).length === 0;
};

const tryParse = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/**
 * Read RaStore keys via localStorage.index API (reliable; Object.keys on
 * Storage shims is not).
 */
export const readRaStoreMap = (): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  if (typeof localStorage === "undefined") return out;
  for (let i = 0; i < localStorage.length; i++) {
    const fullKey = localStorage.key(i);
    if (!fullKey || !fullKey.startsWith(RA_STORE_PREFIX)) continue;
    const key = fullKey.slice(RA_STORE_PREFIX.length);
    if (isEphemeralKey(key)) continue;
    const raw = localStorage.getItem(fullKey);
    if (raw == null) continue;
    out[key] = tryParse(raw);
  }
  return out;
};

/** Strip ephemeral / internal keys before PUT. */
export const sanitizePreferencesForServer = (
  items: Record<string, unknown>
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(items)) {
    if (isEphemeralKey(key)) continue;
    out[key] = value;
  }
  return out;
};

export type UserPreferencesStore = StoreWithList & {
  hydrate: (prefs: Record<string, unknown>) => void;
  flush: () => Promise<void>;
  fetchAndSync: () => Promise<void>;
  /** Pause remote pushes (e.g. during hydrate). */
  setSyncEnabled: (enabled: boolean) => void;
  /**
   * Recovery path: wipe saved view settings on the server AND locally.
   * Leaves sync disabled — callers are expected to reload the page, which
   * re-initializes the store from a clean slate.
   */
  resetAllPreferences: () => Promise<void>;
};

/**
 * localStorageStore wrapper: server `user_preferences` is source of truth.
 * - Debounced full-map PUT on writes
 * - hydrate() replaces local from server
 * - flush() before logout / unload
 */
export const createUserPreferencesStore = (): UserPreferencesStore => {
  const inner: StoreWithList = localStorageStore();
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let syncEnabled = true;
  let inFlight: Promise<void> | null = null;

  const schedulePush = () => {
    if (!syncEnabled) return;
    if (!CookieStore.getCookie("token")) return;
    // While an Admin is impersonating another user, never write back: browsing
    // as them (columns, filters, tab changes) must not overwrite that user's
    // real saved view settings on the server.
    if (isImpersonating()) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void pushNow();
    }, DEBOUNCE_MS);
  };

  const collectPayload = (): Record<string, unknown> =>
    sanitizePreferencesForServer(readRaStoreMap());

  const pushNow = async (): Promise<void> => {
    if (!CookieStore.getCookie("token")) return;
    // Belt-and-suspenders with schedulePush: no implicit write while
    // impersonating (fetchAndSync's seed path also routes through here).
    if (isImpersonating()) return;
    const payload = collectPayload();

    const run = async () => {
      try {
        const res = await fetch(prefsUrl(), {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ data: { user_preferences: payload } }),
        });
        if (!res.ok) {
          console.warn(
            "[userPreferencesStore] PUT failed",
            res.status,
            await res.text().catch(() => "")
          );
        }
      } catch (err) {
        console.warn("[userPreferencesStore] PUT error", err);
      }
    };

    inFlight = (inFlight ?? Promise.resolve()).then(run, run);
    await inFlight;
  };

  const store: UserPreferencesStore = {
    setup: () => inner.setup(),
    teardown: () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      inner.teardown();
    },
    getItem: (key, defaultValue) => inner.getItem(key, defaultValue),
    setItem: (key, value) => {
      inner.setItem(key, value);
      if (!isEphemeralKey(key)) schedulePush();
    },
    removeItem: (key) => {
      inner.removeItem(key);
      if (!isEphemeralKey(key)) schedulePush();
    },
    removeItems: (keyPrefix) => {
      inner.removeItems(keyPrefix);
      schedulePush();
    },
    subscribe: (key, callback) => inner.subscribe(key, callback),
    listItems: (keyPrefix?: string) =>
      typeof inner.listItems === "function"
        ? inner.listItems(keyPrefix)
        : {},

    setSyncEnabled: (enabled: boolean) => {
      syncEnabled = enabled;
    },

    hydrate: (prefs: Record<string, unknown>) => {
      syncEnabled = false;
      try {
        // Clear RaStore.* via index API (more reliable than Store.reset on shims)
        if (typeof localStorage !== "undefined") {
          const toRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const fullKey = localStorage.key(i);
            if (fullKey?.startsWith(RA_STORE_PREFIX)) toRemove.push(fullKey);
          }
          toRemove.forEach((k) => localStorage.removeItem(k));
        } else {
          inner.reset();
        }
        for (const [key, value] of Object.entries(prefs)) {
          if (isEphemeralKey(key)) continue;
          if (value === undefined) continue;
          try {
            inner.setItem(key, value);
          } catch (err) {
            // One malformed stored value (stale schema, quota, bad JSON shape)
            // must never take down boot — drop the key and keep hydrating.
            console.warn(
              `[userPreferencesStore] skipped bad preference "${key}"`,
              err
            );
          }
        }
      } finally {
        syncEnabled = true;
      }
    },

    resetAllPreferences: async () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      // Keep sync disabled: subscribers writing defaults after the local wipe
      // must not re-upload them before the caller reloads.
      syncEnabled = false;

      if (CookieStore.getCookie("token")) {
        try {
          const res = await fetch(prefsUrl(), {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({ data: { user_preferences: {} } }),
          });
          if (!res.ok) {
            console.warn(
              "[userPreferencesStore] reset PUT failed",
              res.status,
              await res.text().catch(() => "")
            );
          }
        } catch (err) {
          console.warn("[userPreferencesStore] reset PUT error", err);
        }
      }

      if (typeof localStorage !== "undefined") {
        const toRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const fullKey = localStorage.key(i);
          if (fullKey?.startsWith(RA_STORE_PREFIX)) toRemove.push(fullKey);
        }
        toRemove.forEach((k) => localStorage.removeItem(k));
      } else {
        inner.reset();
      }
    },

    flush: async () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      await pushNow();
    },

    reset: () => {
      // useLogout calls authProvider.logout (which should flush) then resetStore.
      // Only clear local here — server already has the latest via flush().
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      inner.reset();
    },

    /**
     * Boot sync: if server empty and local has data → seed server;
     * if server has data → replace local.
     */
    fetchAndSync: async () => {
      const token = CookieStore.getCookie("token");
      if (!token) return;

      try {
        const res = await fetch(prefsUrl(), {
          method: "GET",
          headers: authHeaders(),
        });
        if (!res.ok) {
          console.warn(
            "[userPreferencesStore] GET failed",
            res.status,
            await res.text().catch(() => "")
          );
          return;
        }
        const json = await res.json();
        const serverPrefs = json?.data as Record<string, unknown> | null;

        const localSanitized = collectPayload();

        if (isEmptyPrefs(serverPrefs)) {
          if (!isEmptyPrefs(localSanitized)) {
            await pushNow();
          }
          return;
        }

        store.hydrate(serverPrefs as Record<string, unknown>);
      } catch (err) {
        console.warn("[userPreferencesStore] fetchAndSync error", err);
      }
    },
  };

  return store;
};

/** Singleton used by Admin + AuthProvider logout flush. */
export const userPreferencesStore = createUserPreferencesStore();

export default userPreferencesStore;
