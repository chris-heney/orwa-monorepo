import { describe, expect, it, beforeEach } from "vitest";
import {
  ADMIN_VIEW_STORAGE_KEY,
  clearAdminView,
  loadAdminView,
  saveAdminView,
} from "./adminViewPersistence";

const memoryStore = new Map<string, string>();

describe("adminViewPersistence", () => {
  beforeEach(() => {
    memoryStore.clear();
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => memoryStore.get(key) ?? null,
        setItem: (key: string, value: string) => {
          memoryStore.set(key, value);
        },
        removeItem: (key: string) => {
          memoryStore.delete(key);
        },
      },
    });
  });

  it("round-trips the admin view flag in sessionStorage", () => {
    expect(loadAdminView()).toBe(false);
    saveAdminView(true);
    expect(memoryStore.get(ADMIN_VIEW_STORAGE_KEY)).toBe("1");
    expect(loadAdminView()).toBe(true);
    clearAdminView();
    expect(loadAdminView()).toBe(false);
  });
});

