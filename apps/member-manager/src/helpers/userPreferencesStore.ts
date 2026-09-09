import { localStorageStore, type Store } from "react-admin";
import CookieStore from "./ra-strapi-data-provider/src/CookieStore";
import { isImpersonating } from "./impersonation";

const DEBOUNCE_MS = 1000;
/** `fetch({ keepalive })` rejects bodies over ~64KB; leave headroom. */
const KEEPALIVE_MAX_BYTES = 60_000;
/** How long an auth gate will wait on the boot hydrate before giving up. */
export const HYDRATE_GATE_TIMEOUT_MS = 8000;
/** Hard cap on any single prefs request so logout/unload can never hang. */
const REQUEST_TIMEOUT_MS = 15_000;
/** After a failed hydrate, do not hammer the API from every checkAuth call. */
const HYDRATE_RETRY_BACKOFF_MS = 5000;

const requestSignal = (): AbortSignal | undefined =>
  typeof AbortSignal !== "undefined" &&
  typeof (AbortSignal as { timeout?: unknown }).timeout === "function"
    ? AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    : undefined;

type StoreWithList = Store & {
  listItems?: (keyPrefix?: string) => Record<string, unknown>;
};

/**
 * WHICH RaStore KEYS SYNC — the rule is a DENY-LIST, not an allow-list.
 *
 * Every `RaStore.*` key round-trips to the server `user_preferences` bag
 * unless it is listed here as transient. That means new keys added by any
 * module (`${resource}.listParams`, `preferences.${resource}.datagrid.*`,
 * `agGrid.${resource}`, `${page.id}.tab`, `*-filter-sidebar-open`, `theme`,
 * ...) sync automatically without touching this file.
 *
 * Deny only per-session UI state that is meaningless (or harmful) to restore
 * on another day / device:
 * - `version`                — react-admin's own store schema marker
 * - `*.selectedIds`          — bulk-action row selection
 * - `*.datagrid.expanded`    — expanded datagrid rows (record ids)
 */
export const isEphemeralKey = (key: string): boolean =>
  key === "version" ||
  key.endsWith(".selectedIds") ||
  key.endsWith("selectedIds") ||
  key.endsWith(".datagrid.expanded");

const RA_STORE_PREFIX = "RaStore.";

const prefsUrl = () =>
  `${import.meta.env.VITE_API_ENDPOINT}/api/my-preferences`;

const authHeaders = (token: string): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

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

const clearLocalRaStore = (
  inner: Store,
  { keepVersion = false }: { keepVersion?: boolean } = {}
) => {
  if (typeof localStorage !== "undefined") {
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (!fullKey?.startsWith(RA_STORE_PREFIX)) continue;
      if (keepVersion && fullKey === `${RA_STORE_PREFIX}version`) continue;
      toRemove.push(fullKey);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  } else {
    inner.reset();
  }
};

export type FlushOptions = {
  /**
   * Use `fetch({ keepalive: true })` so the request survives page unload.
   * Only honoured for payloads under the browser's keepalive quota.
   */
  keepalive?: boolean;
};

export type UserPreferencesStore = StoreWithList & {
  hydrate: (prefs: Record<string, unknown>) => void;
  /** Push pending local changes now (no-op when nothing changed). */
  flush: (options?: FlushOptions) => Promise<void>;
  /** One-shot GET → hydrate (or seed the server from local). */
  fetchAndSync: () => Promise<void>;
  /**
   * Boot gate: resolves once the server preferences for the CURRENT token
   * have been applied locally (memoised per token, retried after failure).
   * Never rejects and never blocks longer than `timeoutMs` — a slow or
   * failing prefs API must not keep a user out of the app.
   */
  ensureHydrated: (timeoutMs?: number) => Promise<void>;
  /** True once `ensureHydrated` has succeeded for the current token. */
  isHydrated: () => boolean;
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
 *
 * Lifecycle
 * - `ensureHydrated()` (called from authProvider.checkAuth/login, i.e. BEFORE
 *   any list mounts) GETs the server bag and replaces local RaStore with it.
 * - Store writes mark the map dirty and schedule a debounced full-map PUT.
 *   Pushes are GATED on hydration: until the server copy has been applied
 *   for this token nothing is uploaded, so a list mounting with defaults can
 *   never overwrite the user's saved settings (that clobber is exactly what
 *   lost column/sort/perPage prefs on every re-login).
 * - `flush()` before logout / impersonation / page unload (keepalive).
 * - `reset()` (react-admin's logout `resetStore`) only clears local state and
 *   forgets the hydration memo so the next login hydrates afresh.
 */
export const createUserPreferencesStore = (): UserPreferencesStore => {
  const inner: StoreWithList = localStorageStore();
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let syncEnabled = true;
  let dirty = false;
  let inFlight: Promise<void> | null = null;
  let hydration: {
    token: string;
    promise: Promise<void>;
    done: boolean;
  } | null = null;
  let lastHydrateFailureAt = 0;

  const currentToken = () => CookieStore.getCookie("token");

  const clearTimer = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  };

  const isHydrated = () => {
    const token = currentToken();
    return !!token && hydration?.token === token && hydration.done;
  };

  const collectPayload = (): Record<string, unknown> =>
    sanitizePreferencesForServer(readRaStoreMap());

  /** Raw PUT of a payload. Returns true on 2xx. Never throws. */
  const putPrefs = async (
    token: string,
    payload: Record<string, unknown>,
    options: FlushOptions = {}
  ): Promise<boolean> => {
    const body = JSON.stringify({ data: { user_preferences: payload } });
    const keepalive = !!options.keepalive && body.length < KEEPALIVE_MAX_BYTES;
    try {
      const res = await fetch(prefsUrl(), {
        method: "PUT",
        headers: authHeaders(token),
        body,
        keepalive,
        signal: requestSignal(),
      });
      if (!res.ok) {
        console.warn(
          "[userPreferencesStore] PUT failed",
          res.status,
          await res.text().catch(() => "")
        );
        return false;
      }
      return true;
    } catch (err) {
      console.warn("[userPreferencesStore] PUT error", err);
      return false;
    }
  };

  const schedulePush = () => {
    dirty = true;
    if (!syncEnabled) return;
    if (!currentToken()) return;
    // While an Admin is impersonating another user, never write back: browsing
    // as them (columns, filters, tab changes) must not overwrite that user's
    // real saved view settings on the server.
    if (isImpersonating()) return;
    clearTimer();
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void pushNow();
    }, DEBOUNCE_MS);
  };

  const pushNow = async (options: FlushOptions = {}): Promise<void> => {
    const token = currentToken();
    if (!token) return;
    // Belt-and-suspenders with schedulePush: no implicit write while
    // impersonating.
    if (isImpersonating()) return;

    if (!isHydrated()) {
      // Never upload before the server copy has been applied — local state
      // at this point is defaults/stale and would clobber the saved prefs.
      await ensureHydrated(HYDRATE_GATE_TIMEOUT_MS);
      if (!isHydrated()) {
        console.warn(
          "[userPreferencesStore] skipping push: preferences not hydrated yet"
        );
        return; // stays dirty → retried on the next write / flush
      }
      if (!dirty) return; // hydrate applied server state; nothing to send
    }

    dirty = false;
    const payload = collectPayload();
    const run = async () => {
      const ok = await putPrefs(token, payload, options);
      if (!ok) dirty = true;
    };
    inFlight = (inFlight ?? Promise.resolve()).then(run, run);
    await inFlight;
  };

  /** GET server bag; hydrate local from it, or seed the server from local. */
  const fetchAndSyncForToken = async (token: string): Promise<boolean> => {
    let res: Response;
    try {
      res = await fetch(prefsUrl(), {
        method: "GET",
        headers: authHeaders(token),
        signal: requestSignal(),
      });
    } catch (err) {
      console.warn("[userPreferencesStore] GET error", err);
      return false;
    }
    if (!res.ok) {
      console.warn(
        "[userPreferencesStore] GET failed",
        res.status,
        await res.text().catch(() => "")
      );
      return false;
    }
    let serverPrefs: unknown;
    try {
      serverPrefs = (await res.json())?.data;
    } catch (err) {
      console.warn("[userPreferencesStore] GET returned invalid JSON", err);
      return false;
    }

    if (isEmptyPrefs(serverPrefs)) {
      // First login on this browser with pre-existing local state: seed the
      // server from it. An empty server + empty local is simply hydrated.
      const local = collectPayload();
      if (!isEmptyPrefs(local) && !isImpersonating()) {
        const ok = await putPrefs(token, local);
        if (ok) dirty = false;
      }
      return true;
    }

    store.hydrate(serverPrefs as Record<string, unknown>);
    return true;
  };

  const ensureHydrated = (timeoutMs?: number): Promise<void> => {
    const token = currentToken();
    if (!token) return Promise.resolve();
    if (!hydration || hydration.token !== token) {
      if (Date.now() - lastHydrateFailureAt < HYDRATE_RETRY_BACKOFF_MS) {
        return Promise.resolve();
      }
      const entry = {
        token,
        done: false,
        promise: Promise.resolve(),
      };
      entry.promise = fetchAndSyncForToken(token)
        .catch((err) => {
          console.warn("[userPreferencesStore] hydrate error", err);
          return false;
        })
        .then((ok) => {
          if (ok) {
            entry.done = true;
          } else {
            lastHydrateFailureAt = Date.now();
            // Forget the failed attempt so a later gate/push retries.
            if (hydration === entry) hydration = null;
          }
        });
      hydration = entry;
    }
    const pending = hydration.promise;
    if (timeoutMs == null) return pending;
    return new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, timeoutMs);
      pending.then(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  };

  const flush = async (options: FlushOptions = {}): Promise<void> => {
    clearTimer();
    if (!dirty) {
      // Nothing new — but let an in-progress PUT finish (logout ordering).
      if (inFlight) await inFlight.catch(() => undefined);
      return;
    }
    await pushNow(options);
  };

  const onUnload = () => {
    void flush({ keepalive: true });
  };

  const store: UserPreferencesStore = {
    setup: () => {
      inner.setup();
      if (typeof window !== "undefined") {
        // `pagehide` is the reliable unload signal (also fires for bfcache);
        // `beforeunload` is kept for older engines. The dirty flag dedupes.
        window.addEventListener("pagehide", onUnload);
        window.addEventListener("beforeunload", onUnload);
      }
    },
    teardown: () => {
      clearTimer();
      if (typeof window !== "undefined") {
        window.removeEventListener("pagehide", onUnload);
        window.removeEventListener("beforeunload", onUnload);
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
      clearTimer();
      try {
        // Clear RaStore.* via index API (more reliable than Store.reset on
        // shims). Keep react-admin's own `version` marker — it is not a pref.
        clearLocalRaStore(inner, { keepVersion: true });
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
        // Local now mirrors the server.
        dirty = false;
      } finally {
        syncEnabled = true;
      }
    },

    resetAllPreferences: async () => {
      clearTimer();
      // Keep sync disabled: subscribers writing defaults after the local wipe
      // must not re-upload them before the caller reloads.
      syncEnabled = false;
      dirty = false;
      hydration = null;

      const token = currentToken();
      if (token) {
        await putPrefs(token, {});
      }
      clearLocalRaStore(inner);
    },

    flush,
    ensureHydrated,
    isHydrated,

    reset: () => {
      // useLogout calls authProvider.logout (which flushes) then resetStore.
      // Only clear local here — server already has the latest via flush().
      clearTimer();
      dirty = false;
      hydration = null;
      inner.reset();
    },

    fetchAndSync: async () => {
      const token = currentToken();
      if (!token) return;
      hydration = null;
      lastHydrateFailureAt = 0;
      await ensureHydrated();
    },
  };

  return store;
};

/** Singleton used by Admin + AuthProvider gates/flush. */
export const userPreferencesStore = createUserPreferencesStore();

export default userPreferencesStore;
