import { describe, expect, it } from "vitest";
import { extractStrapiErrorMessage } from "./strapiErrorMessage";

const SOLD_OUT =
  "The golf tournament is sold out — no golfer spots remain. Please remove the golfer entries and try again.";

describe("extractStrapiErrorMessage", () => {
  it("reads the message off a Strapi 5 ApplicationError body", () => {
    expect(
      extractStrapiErrorMessage({
        data: null,
        error: {
          status: 400,
          name: "ApplicationError",
          message: SOLD_OUT,
          details: {},
        },
      })
    ).toBe(SOLD_OUT);
  });

  it("appends per-field validation details to the summary message", () => {
    expect(
      extractStrapiErrorMessage({
        data: null,
        error: {
          status: 400,
          name: "ValidationError",
          message: "2 errors occurred",
          details: {
            errors: [
              { path: ["first"], message: "first must be defined" },
              { path: ["last"], message: "last must be defined" },
            ],
          },
        },
      })
    ).toBe("2 errors occurred: first must be defined; last must be defined");
  });

  it("does not repeat a detail the summary message already contains", () => {
    expect(
      extractStrapiErrorMessage({
        error: {
          message: "first must be defined",
          details: { errors: [{ message: "first must be defined" }] },
        },
      })
    ).toBe("first must be defined");
  });

  it("falls back to the details when the summary message is empty", () => {
    expect(
      extractStrapiErrorMessage({
        error: {
          message: "   ",
          details: { errors: [{ message: "fee must be a number" }] },
        },
      })
    ).toBe("fee must be a number");
  });

  it("still reads a legacy top-level message", () => {
    expect(extractStrapiErrorMessage({ message: "Forbidden" })).toBe(
      "Forbidden"
    );
    expect(
      extractStrapiErrorMessage({ error: { status: 403 }, message: "Forbidden" })
    ).toBe("Forbidden");
  });

  it("returns null for bodies with nothing to show the user", () => {
    expect(extractStrapiErrorMessage(undefined)).toBeNull();
    expect(extractStrapiErrorMessage(null)).toBeNull();
    expect(extractStrapiErrorMessage("<html>502 Bad Gateway</html>")).toBeNull();
    expect(extractStrapiErrorMessage([{ message: "nope" }])).toBeNull();
    expect(extractStrapiErrorMessage({ error: { status: 500 } })).toBeNull();
    expect(extractStrapiErrorMessage({ error: { message: "" } })).toBeNull();
    expect(
      extractStrapiErrorMessage({
        error: { message: 42, details: { errors: [] } },
      })
    ).toBeNull();
  });
});
