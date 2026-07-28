import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  clearWizardDraft,
  getStepKeyFromUrl,
  loadWizardDraft,
  resolveActiveStepIndex,
  sanitizeDraftValues,
  saveWizardDraft,
  setStepKeyInUrl,
  WIZARD_STEP_PARAM,
} from "./wizardPersistence";

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

describe("wizardPersistence", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: createMemoryStorage(),
    });
    Object.defineProperty(globalThis, "File", {
      configurable: true,
      value: class File {
        name: string;
        constructor(_bits: unknown[], name: string) {
          this.name = name;
        }
      },
    });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("sanitizes sensitive payment fields and files", () => {
    const file = new File(["x"], "logo.png", { type: "image/png" });
    const result = sanitizeDraftValues({
      organization: "Acme",
      logo: file,
      paymentData: {
        cardNumber: "4111111111111111",
        cardCode: "123",
        expirationDate: "09/25",
        billingAddress: { city: "OKC" },
      },
    });

    expect(result.organization).toBe("Acme");
    expect(result.logo).toBeUndefined();
    expect(result.paymentData).toEqual({
      billingAddress: { city: "OKC" },
    });
  });

  it("round-trips draft values in sessionStorage", () => {
    saveWizardDraft("2", "online", {
      stepKey: "booth_registration",
      values: {
        registration_type: "Vendor",
        registrant: { first: "Test" },
        paymentData: { cardNumber: "4111", billingAddress: { zip: "73101" } },
      },
    });

    const draft = loadWizardDraft("2", "online");
    expect(draft?.stepKey).toBe("booth_registration");
    expect(draft?.values.registration_type).toBe("Vendor");
    expect(
      (draft?.values.paymentData as { cardNumber?: string })?.cardNumber
    ).toBeUndefined();
    expect(
      (draft?.values.paymentData as { billingAddress?: { zip: string } })
        ?.billingAddress?.zip
    ).toBe("73101");

    clearWizardDraft("2", "online");
    expect(loadWizardDraft("2", "online")).toBeNull();
  });

  it("ignores drafts for a different conference or source", () => {
    saveWizardDraft("2", "online", {
      stepKey: "billing_step",
      values: { registration_type: "Vendor" },
    });
    expect(loadWizardDraft("3", "online")).toBeNull();
    expect(loadWizardDraft("2", "kiosk")).toBeNull();
  });

  it("reads and writes the step URL param without dropping admin/test flags", () => {
    expect(getStepKeyFromUrl("?admin=&step=booth_registration")).toBe(
      "booth_registration"
    );
    expect(getStepKeyFromUrl("?conference_id=2")).toBeNull();

    let href =
      "http://localhost:4202/?admin=&test=&conference_id=2&source=online";
    const history = {
      state: null as unknown,
      replaceState: (_state: unknown, _title: string, next?: string) => {
        if (typeof next === "string") href = next;
      },
    };
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        location: {
          get href() {
            return href;
          },
          get search() {
            return new URL(href).search;
          },
        },
        history,
      },
    });

    setStepKeyInUrl("booth_registration");
    const withStep = new URL(href);
    expect(withStep.searchParams.get(WIZARD_STEP_PARAM)).toBe(
      "booth_registration"
    );
    expect(withStep.searchParams.has("admin")).toBe(true);
    expect(withStep.searchParams.has("test")).toBe(true);
    expect(withStep.searchParams.get("conference_id")).toBe("2");
    expect(withStep.searchParams.get("source")).toBe("online");

    setStepKeyInUrl(null);
    const cleared = new URL(href);
    expect(cleared.searchParams.has(WIZARD_STEP_PARAM)).toBe(false);
    expect(cleared.searchParams.has("admin")).toBe(true);
    expect(cleared.searchParams.has("test")).toBe(true);
  });

  it("resolves preferred active step index", () => {
    expect(
      resolveActiveStepIndex(
        ["registration_type", "sponsorship", "booth_registration"],
        "booth_registration"
      )
    ).toBe(2);
    expect(
      resolveActiveStepIndex(["registration_type", "billing_step"], "missing")
    ).toBe(0);
  });
});
