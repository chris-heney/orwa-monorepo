import { describe, expect, it } from "vitest";
import { submissionErrorMessage } from "./submissionErrorMessage";

const FALLBACK = "Error submitting. Please try again later.";

describe("submissionErrorMessage", () => {
  it("reads Strapi ctx.badRequest shape", () => {
    expect(
      submissionErrorMessage(
        {
          data: null,
          error: {
            status: 400,
            name: "BadRequestError",
            message: "Acme RWD does not have an active ORWA membership.",
            details: { field: "watersystem" },
          },
        },
        FALLBACK
      )
    ).toBe("Acme RWD does not have an active ORWA membership.");
  });

  it("reads the controller catch-block shape", () => {
    expect(
      submissionErrorMessage({ message: "error", error: "boom" }, FALLBACK)
    ).toBe("boom");
  });

  it("reads legacy { message } 400s", () => {
    expect(
      submissionErrorMessage({ message: "Missing required fields." }, FALLBACK)
    ).toBe("Missing required fields.");
  });

  it("falls back for success / empty / non-object", () => {
    expect(submissionErrorMessage({ message: "success" }, FALLBACK)).toBe(
      FALLBACK
    );
    expect(submissionErrorMessage({}, FALLBACK)).toBe(FALLBACK);
    expect(submissionErrorMessage(undefined, FALLBACK)).toBe(FALLBACK);
    expect(submissionErrorMessage("nope", FALLBACK)).toBe(FALLBACK);
  });
});
