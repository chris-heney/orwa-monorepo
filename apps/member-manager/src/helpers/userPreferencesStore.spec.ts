import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * react-admin's localStorageStore decides at IMPORT time whether
 * `window.localStorage` exists (else it silently uses an in-memory shim that
 * readRaStoreMap cannot see). Install the storage shim before any import.
 */
vi.hoisted(() => {
  const map = new Map<string, string>();
  // Browser Storage exposes stored keys as own enumerable properties
  // (react-admin's reset() relies on `Object.keys(localStorage)`), so mirror
  // every entry onto the shim object; methods stay non-enumerable.
  const storage: Record<string, unknown> = {};
  const mirror = () => {
    for (const k of Object.keys(storage)) delete storage[k];
    map.forEach((v, k) => {
      Object.defineProperty(storage, k, { value: v, enumerable: true, configurable: true, writable: true });
    });
  };
  const methods = {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => {
      map.set(k, String(v));
      mirror();
    },
    removeItem: (k: string) => {
      map.delete(k);
      mirror();
    },
    clear: () => {
      map.clear();
      mirror();
    },
    key: (i: number) => Array.from(map.keys())[i] ?? null,
  };
  for (const [name, fn] of Object.entries(methods)) {
    Object.defineProperty(storage, name, { value: fn, enumerable: false });
  }
  Object.defineProperty(storage, "length", { get: () => map.size, enumerable: false });
  const g = globalThis as unknown as Record<string, unknown>;
  g.localStorage = storage;
  g.window = {
    localStorage: storage,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  };

});

const cookies: Record<string, string | null> = { token: "test-jwt" };
vi.mock("./ra-strapi-data-provider/src/CookieStore", () => ({
  default: {
    getCookie: vi.fn((name: string) => cookies[name] ?? null),
    setCookie: vi.fn(),
    deleteCookie: vi.fn(),
  },
}));

const impersonating = { value: false };
vi.mock("./impersonation", () => ({
  isImpersonating: () => impersonating.value,
}));

import {
  createUserPreferencesStore,
  isEphemeralKey,
  readRaStoreMap,
  sanitizePreferencesForServer,
} from "./userPreferencesStore";

const installLocalStorageShim = () => {
  localStorage.clear();
};

type FetchCall = { method: string; body: unknown };

/** Fake /api/my-preferences: returns `serverPrefs` on GET, records PUTs. */
const installFetch = (serverPrefs: unknown, opts: { getStatus?: number; delayGetMs?: number } = {}) => {
  const calls: FetchCall[] = [];
  const fetchMock = vi.fn(async (_url: string, init: RequestInit = {}) => {
    const method = init.method ?? "GET";
    const body = init.body ? JSON.parse(init.body as string) : undefined;
    calls.push({ method, body });
    if (method === "GET") {
      if (opts.delayGetMs) await new Promise((r) => setTimeout(r, opts.delayGetMs));
      const status = opts.getStatus ?? 200;
      return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => ({ data: serverPrefs }),
        text: async () => "",
      } as unknown as Response;
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ data: body?.data?.user_preferences }),
      text: async () => "",
    } as unknown as Response;
  });
  vi.stubGlobal("fetch", fetchMock);
  return { calls, fetchMock };
};

const puts = (calls: FetchCall[]) =>
  calls
    .filter((c) => c.method === "PUT")
    .map((c) => (c.body as { data: { user_preferences: unknown } }).data.user_preferences);

describe("key rule: deny-list of transient keys", () => {
  it("syncs every RaStore key family except the ephemeral ones", () => {
    // Everything a module might persist must pass through untouched.
    for (const key of [
      "assets.listParams",
      "preferences.assets.datagrid.columns",
      "preferences.assets.datagrid.availableColumns",
      "preferences.assets.datagrid.omit",
      "agGrid.award-nominations",
      "membership-management.tab",
      "orwa-awards-filter-sidebar-open",
      "theme",
      "conferenceTabFilters",
    ]) {
      expect(isEphemeralKey(key), key).toBe(false);
    }
    for (const key of [
      "version",
      "watersystems.selectedIds",
      "associates.selectedIds",
      "assets.datagrid.expanded",
    ]) {
      expect(isEphemeralKey(key), key).toBe(true);
    }
  });

  it("sanitizePreferencesForServer drops only ephemeral keys", () => {
    const out = sanitizePreferencesForServer({
      version: "1",
      conferenceTabFilters: { year: 2026 },
      "watersystems.selectedIds": [1, 2],
      "associates.selectedIds": [3],
      "assets.datagrid.expanded": [7],
      "preferences.watersystems.datagrid.columns": ["id", "name"],
      "assets.listParams": { sort: "name", order: "ASC", page: 2, perPage: 25 },
    });
    expect(out).toEqual({
      conferenceTabFilters: { year: 2026 },
      "preferences.watersystems.datagrid.columns": ["id", "name"],
      "assets.listParams": { sort: "name", order: "ASC", page: 2, perPage: 25 },
    });
  });
});

describe("readRaStoreMap", () => {
  beforeEach(() => {
    installLocalStorageShim();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads RaStore keys and skips ephemeral ones", () => {
    localStorage.setItem(
      "RaStore.conferenceTabFilters",
      JSON.stringify({ year: 2026 })
    );
    localStorage.setItem("RaStore.version", JSON.stringify("1"));
    localStorage.setItem(
      "RaStore.watersystems.selectedIds",
      JSON.stringify([1])
    );
    localStorage.setItem("other.thing", "nope");

    expect(readRaStoreMap()).toEqual({
      conferenceTabFilters: { year: 2026 },
    });
  });
});

describe("createUserPreferencesStore: hydrate / push gate / flush", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installLocalStorageShim();
    cookies.token = "test-jwt";
    impersonating.value = false;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("ensureHydrated replaces local RaStore with the server copy", async () => {
    const { calls } = installFetch({
      "assets.listParams": { sort: "name", order: "ASC", page: 2, perPage: 25 },
      "preferences.assets.datagrid.columns": ["0", "1", "3"],
      "watersystems.selectedIds": [9], // ephemeral on the server → ignored
    });
    localStorage.setItem("RaStore.stale", JSON.stringify("from-other-user"));
    const store = createUserPreferencesStore();

    expect(store.isHydrated()).toBe(false);
    await store.ensureHydrated();

    expect(store.isHydrated()).toBe(true);
    expect(calls.map((c) => c.method)).toEqual(["GET"]);
    expect(store.getItem("assets.listParams")).toEqual({
      sort: "name",
      order: "ASC",
      page: 2,
      perPage: 25,
    });
    expect(store.getItem("preferences.assets.datagrid.columns")).toEqual(["0", "1", "3"]);
    expect(store.getItem("stale")).toBeUndefined();
    expect(store.getItem("watersystems.selectedIds")).toBeUndefined();
  });

  it("a write BEFORE hydration never overwrites the server copy (the re-login clobber)", async () => {
    const server = {
      "assets.listParams": { sort: "name", order: "ASC", page: 1, perPage: 25 },
      "preferences.assets.datagrid.columns": ["0", "1", "3"],
    };
    const { calls } = installFetch(server, { delayGetMs: 50 });
    const store = createUserPreferencesStore();

    // A list mounting with defaults writes to the store while the GET is in
    // flight (or before it was even started).
    store.setItem("preferences.assets.datagrid.availableColumns", [{ index: "0" }]);
    const gate = store.ensureHydrated();
    await vi.advanceTimersByTimeAsync(1100); // past the push debounce
    await gate;

    const sent = puts(calls);
    // Whatever was sent must contain the server values — never a bare map of
    // the pre-hydration defaults.
    for (const payload of sent) {
      expect(payload).toMatchObject(server);
    }
    expect(store.getItem("assets.listParams")).toEqual(server["assets.listParams"]);
    // The pre-hydration write was superseded by the server copy (source of truth).
    expect(store.getItem("preferences.assets.datagrid.availableColumns")).toBeUndefined();
  });

  it("after hydration, writes debounce into a single full-map PUT", async () => {
    const { calls } = installFetch({ theme: "dark" });
    const store = createUserPreferencesStore();
    await store.ensureHydrated();

    store.setItem("assets.listParams", { sort: "id", order: "DESC", page: 3, perPage: 50 });
    store.setItem("preferences.assets.datagrid.columns", ["1", "0"]);
    store.setItem("assets.selectedIds", [1, 2]); // ephemeral: no push, not sent
    expect(puts(calls)).toHaveLength(0);

    await vi.advanceTimersByTimeAsync(1100);
    expect(puts(calls)).toEqual([
      {
        theme: "dark",
        "assets.listParams": { sort: "id", order: "DESC", page: 3, perPage: 50 },
        "preferences.assets.datagrid.columns": ["1", "0"],
      },
    ]);
  });

  it("flush() pushes pending changes immediately and is a no-op when clean", async () => {
    const { calls } = installFetch({});
    const store = createUserPreferencesStore();
    await store.ensureHydrated();

    store.setItem("membership-management.tab", "roster");
    await store.flush(); // logout path: must not wait for the debounce
    expect(puts(calls)).toEqual([{ "membership-management.tab": "roster" }]);

    await store.flush();
    await vi.advanceTimersByTimeAsync(2000);
    expect(puts(calls)).toHaveLength(1); // nothing new → no second PUT
  });

  it("flush({ keepalive }) marks the unload request keepalive", async () => {
    const { calls, fetchMock } = installFetch({});
    const store = createUserPreferencesStore();
    await store.ensureHydrated();
    store.setItem("theme", "light");
    await store.flush({ keepalive: true });
    expect(puts(calls)).toHaveLength(1);
    const putInit = fetchMock.mock.calls.find((c) => c[1]?.method === "PUT")?.[1];
    expect(putInit?.keepalive).toBe(true);
  });

  it("seeds an empty server from pre-existing local state", async () => {
    const { calls } = installFetch(null);
    localStorage.setItem("RaStore.theme", JSON.stringify("dark"));
    localStorage.setItem("RaStore.version", JSON.stringify("1"));
    const store = createUserPreferencesStore();
    await store.ensureHydrated();
    expect(puts(calls)).toEqual([{ theme: "dark" }]);
    expect(store.isHydrated()).toBe(true);
  });

  it("reset() (react-admin logout) clears local state and forgets the hydration memo", async () => {
    const { calls } = installFetch({ theme: "dark" });
    const store = createUserPreferencesStore();
    await store.ensureHydrated();
    expect(store.isHydrated()).toBe(true);

    store.reset();
    expect(store.getItem("theme")).toBeUndefined();
    expect(store.isHydrated()).toBe(false);

    // Next login (new token) hydrates again from the server.
    cookies.token = "second-jwt";
    await store.ensureHydrated();
    expect(calls.filter((c) => c.method === "GET")).toHaveLength(2);
    expect(store.getItem("theme")).toBe("dark");
  });

  it("a failed GET never blocks the gate and never lets defaults be pushed", async () => {
    const { calls } = installFetch(null, { getStatus: 500 });
    const store = createUserPreferencesStore();
    await store.ensureHydrated(); // resolves despite the 500
    expect(store.isHydrated()).toBe(false);

    store.setItem("assets.listParams", { page: 1 });
    await vi.advanceTimersByTimeAsync(1100);
    expect(puts(calls)).toHaveLength(0);
  });

  it("the gate honours its timeout while a slow GET keeps hydrating in the background", async () => {
    const { calls } = installFetch({ theme: "dark" }, { delayGetMs: 10_000 });
    const store = createUserPreferencesStore();
    const gate = store.ensureHydrated(500);
    await vi.advanceTimersByTimeAsync(600);
    await gate; // resolved by the timeout, app may render
    expect(store.isHydrated()).toBe(false);

    await vi.advanceTimersByTimeAsync(10_000);
    expect(store.isHydrated()).toBe(true);
    expect(store.getItem("theme")).toBe("dark");
    expect(puts(calls)).toHaveLength(0);
  });

  it("does not write back while impersonating", async () => {
    const { calls } = installFetch({ theme: "dark" });
    const store = createUserPreferencesStore();
    await store.ensureHydrated();
    impersonating.value = true;
    store.setItem("theme", "light");
    await vi.advanceTimersByTimeAsync(1100);
    await store.flush();
    expect(puts(calls)).toHaveLength(0);
  });
});
