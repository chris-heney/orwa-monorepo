import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ADMIN_VIEW_STORAGE_KEY } from "./adminViewPersistence";
import {
  canJumpWizardSteps,
  canJumpWizardStepsFromSession,
  resolvePreferredWizardStepKey,
} from "./canJumpWizardSteps";

const createMemoryStorage = (): Storage => {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => [...map.keys()][index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
};

describe("canJumpWizardSteps", () => {
  it("requires both a JWT session and Admin View", () => {
    expect(canJumpWizardSteps(false, false)).toBe(false);
    expect(canJumpWizardSteps(true, false)).toBe(false);
    expect(canJumpWizardSteps(false, true)).toBe(false);
    expect(canJumpWizardSteps(true, true)).toBe(true);
  });
});

describe("resolvePreferredWizardStepKey", () => {
  it("honors URL step only when jumping is allowed", () => {
    expect(
      resolvePreferredWizardStepKey("billing_step", "attendee_registration", true)
    ).toBe("billing_step");
    expect(
      resolvePreferredWizardStepKey(
        "billing_step",
        "attendee_registration",
        false
      )
    ).toBe("attendee_registration");
  });

  it("falls back to draft, then null, and ignores a bare URL for guests", () => {
    expect(resolvePreferredWizardStepKey("billing_step", null, false)).toBeNull();
    expect(resolvePreferredWizardStepKey(null, "booth_registration", false)).toBe(
      "booth_registration"
    );
    expect(resolvePreferredWizardStepKey(null, null, true)).toBeNull();
  });
});

describe("canJumpWizardStepsFromSession", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: createMemoryStorage(),
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: { cookie: "" },
      writable: true,
    });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("is false without a token or Admin View", () => {
    expect(canJumpWizardStepsFromSession("?admin=&step=billing_step")).toBe(
      false
    );
    document.cookie = "token=jwt";
    expect(canJumpWizardStepsFromSession("?admin=")).toBe(false);
  });

  it("is true only with token + persisted Admin View, and never in test mode", () => {
    document.cookie = "token=jwt";
    sessionStorage.setItem(ADMIN_VIEW_STORAGE_KEY, "1");
    expect(canJumpWizardStepsFromSession("?admin=")).toBe(true);
    expect(canJumpWizardStepsFromSession("?admin=&test=")).toBe(false);
  });
});
