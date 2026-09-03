import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import createService from "./conference-webhook";

const body = {
  organization: "ORWA Test Org",
  registrant: {
    first: "Jane",
    last: "Doe",
    email: "jane.doe@example.invalid",
    phone: "4055550100",
  },
  paymentType: "Card",
  paymentData: {
    amount: 150,
    cardNumber: "4111111111111111",
    expirationDate: "1230",
    cardCode: "123",
    billingAddress: { city: "OKC", state: "OK", zip: "73101" },
  },
  sponsors: [{ id: 19, name: "Golf Hole", amount: 150 }],
  tickets: [],
  booths: [],
  test: "sandbox-token",
};

describe("reportWebhookFailure", () => {
  let logCreate: ReturnType<typeof vi.fn>;
  let emailSend: ReturnType<typeof vi.fn>;
  let logError: ReturnType<typeof vi.fn>;
  let service: any;

  beforeEach(() => {
    logCreate = vi.fn(async () => ({ id: 1 }));
    emailSend = vi.fn(async () => ({}));
    logError = vi.fn();

    const strapi = {
      log: { error: logError, info: vi.fn(), warn: vi.fn() },
      documents: (uid: string) => {
        expect(uid).toBe("api::log.log");
        return { create: logCreate };
      },
      plugins: {
        email: { services: { email: { send: emailSend } } },
      },
    };

    service = createService({ strapi } as any);
  });

  afterEach(() => {
    delete process.env.WEBHOOK_ALERT_EMAIL;
  });

  it("logs a tagged error, persists a sanitized failure row, and emails the default recipient", async () => {
    await service.reportWebhookFailure(
      body,
      new Error("Sponsorship no longer available"),
      "sponsor-amount"
    );

    // Tagged, greppable log line with payload summary — never card data.
    const line = logError.mock.calls[0][0] as string;
    expect(line).toContain("[conference-webhook]");
    expect(line).toContain("Sponsorship no longer available");
    expect(line).toContain("org=ORWA Test Org");
    expect(line).toContain("registrant=jane.doe@example.invalid");
    expect(line).toContain("sponsors=1");
    expect(line).not.toContain("4111111111111111");

    // Failure row in the same `logs` collection, distinguished by resource.
    const row = logCreate.mock.calls[0][0].data;
    expect(row.resource).toBe("conference-registration-error");
    expect(row.data.result).toBe("error");
    expect(row.data.error).toBe("Sponsorship no longer available");
    expect(row.data.stage).toBe("sponsor-amount");
    expect(row.data.payload.paymentData.cardNumber).toBeNull();
    expect(row.data.payload.paymentData.expirationDate).toBeNull();
    expect(row.data.payload.paymentData.cardCode).toBeNull();
    expect(row.data.payload.test).toBeUndefined();

    // Alert email to the default recipient, without card data.
    const email = emailSend.mock.calls[0][0];
    expect(email.to).toBe("office@orwa.org");
    expect(email.subject).toContain(
      "[ORWA] Conference registration failure:"
    );
    expect(email.html).toContain("ORWA Test Org");
    expect(email.html).not.toContain("4111111111111111");
  });

  it("respects WEBHOOK_ALERT_EMAIL", async () => {
    process.env.WEBHOOK_ALERT_EMAIL = "alerts@example.invalid";
    await service.reportWebhookFailure(body, "declined", "payment");
    expect(emailSend.mock.calls[0][0].to).toBe("alerts@example.invalid");
  });

  it("never throws when persistence and email both fail", async () => {
    logCreate.mockRejectedValue(new Error("db down"));
    emailSend.mockRejectedValue(new Error("smtp down"));

    await expect(
      service.reportWebhookFailure(body, new Error("original"), "registration")
    ).resolves.toBeUndefined();

    // Original failure plus both reporter failures were logged.
    const lines = logError.mock.calls.map((call) => String(call[0]));
    expect(lines.some((l) => l.includes("original"))).toBe(true);
    expect(lines.some((l) => l.includes("persist"))).toBe(true);
    expect(lines.some((l) => l.includes("alert email failed"))).toBe(true);
  });
});
