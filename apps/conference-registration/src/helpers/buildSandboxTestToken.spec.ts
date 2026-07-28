import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  buildSandboxTestToken,
  normalizeTestEmail,
} from "./buildSandboxTestToken";

const md5 = (value: string) =>
  createHash("md5").update(value, "utf8").digest("hex");

describe("normalizeTestEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeTestEmail("  Person@Example.ORG ")).toBe(
      "person@example.org"
    );
  });

  it.each([undefined, null, 123, {}])("returns empty for non-strings: %s", (value) => {
    expect(normalizeTestEmail(value)).toBe("");
  });
});

describe("buildSandboxTestToken", () => {
  it("returns md5 of normalized registrant email", () => {
    expect(buildSandboxTestToken("  Person@Example.ORG ")).toBe(
      md5("person@example.org")
    );
  });

  it.each(["", "   ", undefined, null])(
    "returns undefined when email empty: %s",
    (value) => {
      expect(buildSandboxTestToken(value)).toBeUndefined();
    }
  );
});
