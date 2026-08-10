import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./ra-strapi-data-provider/src/CookieStore", () => ({
  default: {
    getCookie: vi.fn(() => "test-jwt"),
    setCookie: vi.fn(),
    deleteCookie: vi.fn(),
  },
}));

import {
  readRaStoreMap,
  sanitizePreferencesForServer,
} from "./userPreferencesStore";

const installLocalStorageShim = () => {
  const map = new Map<string, string>();
  const storage = {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => {
      map.set(k, String(v));
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
    clear: () => map.clear(),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    get length() {
      return map.size;
    },
  };
  vi.stubGlobal("localStorage", storage);
};

describe("sanitizePreferencesForServer", () => {
  it("drops version and selectedIds keys", () => {
    const out = sanitizePreferencesForServer({
      version: "1",
      conferenceTabFilters: { year: 2026 },
      "watersystems.selectedIds": [1, 2],
      "associates.selectedIds": [3],
      "preferences.watersystems.datagrid.columns": ["id", "name"],
    });
    expect(out).toEqual({
      conferenceTabFilters: { year: 2026 },
      "preferences.watersystems.datagrid.columns": ["id", "name"],
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
