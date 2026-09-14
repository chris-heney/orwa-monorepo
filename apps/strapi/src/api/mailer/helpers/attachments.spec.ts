import { describe, expect, it } from "vitest";
import { mergeAttachments, templateAttachments, uploadsBaseUrl } from "./attachments";

const RIG_FORM = {
  name: "RIG REIMBURSEMENT REQUEST FORM - REQUIRED SUBJECT LINE.pdf",
  url: "/uploads/RIG_REIMBURSEMENT_REQUEST_FORM_REQUIRED_SUBJECT_LINE_8ef8a520c6.pdf",
};

const AWARD_PDF = {
  name: "Awards-Letter.pdf",
  url: "https://admin.orwa.org/uploads/RIG_Agreement_20325_abc123.pdf",
};

describe("uploadsBaseUrl", () => {
  it("never serves uploads from the /api prefix", () => {
    expect(uploadsBaseUrl({ STRAPI_API_ENDPOINT: "https://admin.orwa.org/api" })).toBe(
      "https://admin.orwa.org"
    );
    expect(uploadsBaseUrl({ STRAPI_API_ENDPOINT: "https://admin.orwa.org/api/" })).toBe(
      "https://admin.orwa.org"
    );
  });

  it("prefers PUBLIC_URL, then URL, and trims trailing slashes", () => {
    expect(
      uploadsBaseUrl({
        PUBLIC_URL: "https://public.example/",
        URL: "https://url.example",
        STRAPI_API_ENDPOINT: "https://api.example/api",
      })
    ).toBe("https://public.example");
    expect(uploadsBaseUrl({ URL: "https://url.example" })).toBe("https://url.example");
  });

  it("falls back to production when nothing is configured", () => {
    expect(uploadsBaseUrl({})).toBe("https://admin.orwa.org");
  });
});

describe("templateAttachments", () => {
  it("builds absolute /uploads URLs from the template's files", () => {
    expect(templateAttachments([RIG_FORM], "https://admin.orwa.org")).toEqual([
      {
        name: RIG_FORM.name,
        url: "https://admin.orwa.org/uploads/RIG_REIMBURSEMENT_REQUEST_FORM_REQUIRED_SUBJECT_LINE_8ef8a520c6.pdf",
      },
    ]);
  });

  it("keeps already-absolute URLs and skips files without one", () => {
    expect(
      templateAttachments(
        [{ name: "cdn.pdf", url: "https://cdn.example/x.pdf" }, { name: "broken" }, null as never],
        "https://admin.orwa.org"
      )
    ).toEqual([{ name: "cdn.pdf", url: "https://cdn.example/x.pdf" }]);
  });

  it("treats a template with no attachments as an empty list", () => {
    expect(templateAttachments(null, "https://admin.orwa.org")).toEqual([]);
    expect(templateAttachments(undefined, "https://admin.orwa.org")).toEqual([]);
  });
});

describe("mergeAttachments", () => {
  const fromTemplate = templateAttachments([RIG_FORM], "https://admin.orwa.org");

  it("sends the template attachment AND the generated award PDF", () => {
    expect(mergeAttachments(fromTemplate, [AWARD_PDF])).toEqual([...fromTemplate, AWARD_PDF]);
  });

  it("still sends the template attachment when the caller posts none", () => {
    expect(mergeAttachments(fromTemplate, undefined)).toEqual(fromTemplate);
    expect(mergeAttachments(fromTemplate, null)).toEqual(fromTemplate);
    expect(mergeAttachments(fromTemplate, [])).toEqual(fromTemplate);
  });

  it("sends only the caller's attachments for templates without files", () => {
    expect(mergeAttachments([], [AWARD_PDF])).toEqual([AWARD_PDF]);
  });

  it("attaches the same URL once", () => {
    expect(mergeAttachments(fromTemplate, [...fromTemplate, AWARD_PDF, AWARD_PDF])).toEqual([
      ...fromTemplate,
      AWARD_PDF,
    ]);
  });

  it("returns undefined rather than an empty list", () => {
    expect(mergeAttachments([], null)).toBeUndefined();
    expect(mergeAttachments([], [])).toBeUndefined();
  });
});
