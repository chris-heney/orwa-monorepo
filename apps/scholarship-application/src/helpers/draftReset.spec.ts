import { describe, expect, it } from "vitest";
import {
  clearScholarshipDraftStorage,
  scholarshipDraftStorageKeys,
} from "./draftReset";
import { SAVED_FORM_STORAGE_KEY } from "./formPersistence";

const memoryStorage = (seed: Record<string, string>) => {
  const map = new Map(Object.entries(seed));
  return {
    map,
    removeItem: (key: string) => {
      map.delete(key);
    },
  };
};

describe("scholarshipDraftStorageKeys", () => {
  it("covers the WizardStateSync session draft and the auto-save snapshot", () => {
    expect(scholarshipDraftStorageKeys()).toEqual([
      {
        storage: "sessionStorage",
        key: "orwa-scholarship-draft:v1:orwef-scholarship:online",
      },
      { storage: "localStorage", key: SAVED_FORM_STORAGE_KEY },
    ]);
  });
});

describe("clearScholarshipDraftStorage", () => {
  it("removes every draft key and leaves unrelated keys alone", () => {
    const session = memoryStorage({
      "orwa-scholarship-draft:v1:orwef-scholarship:online": "{}",
      "orwa-awards-draft:v1:orwa-awards:online": "{}",
    });
    const local = memoryStorage({
      [SAVED_FORM_STORAGE_KEY]: "{}",
      "RaStore.theme": "dark",
    });

    clearScholarshipDraftStorage({
      sessionStorage: session,
      localStorage: local,
    });

    expect([...session.map.keys()]).toEqual([
      "orwa-awards-draft:v1:orwa-awards:online",
    ]);
    expect([...local.map.keys()]).toEqual(["RaStore.theme"]);
  });

  it("tolerates missing or throwing storage areas", () => {
    const throwing = {
      removeItem: () => {
        throw new Error("SecurityError");
      },
    };
    expect(() =>
      clearScholarshipDraftStorage({
        sessionStorage: throwing,
        localStorage: null,
      })
    ).not.toThrow();
    expect(() => clearScholarshipDraftStorage({})).not.toThrow();
  });
});
