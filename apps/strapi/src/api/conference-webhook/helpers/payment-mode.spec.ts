import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  authorizeNetMode,
  normalizeTestEmail,
  shouldUseAuthorizeNetTestMode,
} from "./payment-mode";

const md5 = (value: string) =>
  createHash("md5").update(value, "utf8").digest("hex");

describe("Authorize.Net test-mode decision", () => {
  it("always uses sandbox test mode in development", () => {
    expect(
      shouldUseAuthorizeNetTestMode({
        nodeEnv: "development",
        email: "person@example.org",
      })
    ).toBe(true);
  });

  it("accepts only MD5 of the trimmed lowercase email in production", () => {
    const email = "  Person@Example.ORG ";
    const test = md5("person@example.org");

    expect(normalizeTestEmail(email)).toBe("person@example.org");
    expect(
      shouldUseAuthorizeNetTestMode({
        nodeEnv: "production",
        email,
        test,
      })
    ).toBe(true);
  });

  it.each([undefined, "", "not-a-hash", md5("other@example.org")])(
    "keeps production live mode for malformed or mismatched token %s",
    (test) => {
      expect(
        shouldUseAuthorizeNetTestMode({
          nodeEnv: "production",
          email: "person@example.org",
          test,
        })
      ).toBe(false);
    }
  );

  it("selects sandbox endpoint, sandbox credentials, and testRequest together", () => {
    const mode = authorizeNetMode(true);

    expect(mode.endpoint).toContain("apitest.authorize.net");
    expect(mode.credentials).toEqual({
      name: expect.any(String),
      transactionKey: expect.any(String),
    });
    expect(mode.transactionSettings).toEqual({
      setting: {
        settingName: "testRequest",
        settingValue: "true",
      },
    });
  });

  it("does not include testRequest in live mode", () => {
    const mode = authorizeNetMode(false);

    expect(mode.endpoint).toContain("api.authorize.net");
    expect(mode.endpoint).not.toContain("apitest");
    expect(mode.transactionSettings).toBeUndefined();
  });
});
