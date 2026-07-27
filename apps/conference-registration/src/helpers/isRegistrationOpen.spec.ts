import { describe, expect, it } from "vitest";
import { isRegistrationOpen } from "./isRegistrationOpen";

describe("isRegistrationOpen", () => {
  it("is true for Online Registration from any source", () => {
    expect(isRegistrationOpen("Online Registration", "online")).toBe(true);
    expect(isRegistrationOpen("Online Registration", "kiosk")).toBe(true);
  });

  it("is true for Kiosk Registration only when source is kiosk", () => {
    expect(isRegistrationOpen("Kiosk Registration", "kiosk")).toBe(true);
    expect(isRegistrationOpen("Kiosk Registration", "online")).toBe(false);
  });

  it("is false when registration is not open", () => {
    expect(isRegistrationOpen("Online Registration Closed", "online")).toBe(
      false
    );
    expect(isRegistrationOpen("Closed", "online")).toBe(false);
    expect(isRegistrationOpen("Archived", "kiosk")).toBe(false);
    expect(isRegistrationOpen("Coming Soon", "online")).toBe(false);
  });

  it("is false when status is missing", () => {
    expect(isRegistrationOpen(undefined, "online")).toBe(false);
    expect(isRegistrationOpen("", "online")).toBe(false);
  });
});
