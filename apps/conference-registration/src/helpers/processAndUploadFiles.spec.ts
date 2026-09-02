import { beforeEach, describe, expect, it, vi } from "vitest";

const uploadFiles = vi.fn();
const uploadFile = vi.fn();

vi.mock("./uploadService", () => ({
  default: {
    uploadFiles: (...args: unknown[]) => uploadFiles(...args),
    uploadFile: (...args: unknown[]) => uploadFile(...args),
  },
}));

import {
  isUnresolvedUpload,
  processAndUploadFiles,
} from "./processAndUploadFiles";

describe("isUnresolvedUpload", () => {
  it("detects FileInput leftovers from a failed upload", () => {
    expect(
      isUnresolvedUpload([
        {
          src: "blob:https://orwa.org/35a2b7cc-2a8e-4f75-af63-7d6733400da6",
          title: "BF TrustInvesment logo Blue.jpg",
          rawFile: {},
        },
      ])
    ).toBe(true);
    expect(isUnresolvedUpload([5324])).toBe(false);
    expect(isUnresolvedUpload({ id: 5324 })).toBe(false);
  });
});

describe("processAndUploadFiles", () => {
  const notify = vi.fn();

  beforeEach(() => {
    notify.mockReset();
    uploadFiles.mockReset();
    uploadFile.mockReset();
  });

  it("does not skip the logo when an extras key is present", async () => {
    const file = new File(["logo"], "logo.png", { type: "image/png" });
    uploadFiles.mockResolvedValue([99]);

    const result = await processAndUploadFiles(
      {
        extras: [11, 12],
        tickets: [{ extras: [11] }],
        logo: [{ title: "logo.png", rawFile: file }],
      },
      notify
    );

    expect(uploadFiles).toHaveBeenCalledTimes(1);
    expect(result.logo).toEqual([99]);
    expect(result.extras).toEqual([11, 12]);
  });

  it("keeps sponsor line objects intact (never collapses them to bare ids)", async () => {
    const file = new File(["logo"], "logo.png", { type: "image/png" });
    uploadFiles.mockResolvedValue([99]);

    const sponsors = [
      {
        id: 19,
        name: "Golf Hole",
        description: "Claim Your Spot on the Course!",
        available: 15,
        amount: 150,
        allow_custom_amount: false,
        max_purchasable: 15,
      },
    ];

    const result = await processAndUploadFiles(
      {
        sponsors,
        logo: [{ title: "logo.png", rawFile: file }],
      },
      notify
    );

    // Regression: sponsors matched the uploaded-file shape and were rewritten
    // to [19], making the webhook throw "Sponsorship package not found
    // (id: undefined)". They must pass through untouched.
    expect(result.sponsors).toEqual(sponsors);
    expect(result.logo).toEqual([99]);
  });

  it("aborts when the logo rawFile is gone (blob leftover only)", async () => {
    await expect(
      processAndUploadFiles(
        {
          extras: [],
          logo: [
            {
              src: "blob:https://orwa.org/abc",
              title: "logo.jpg",
              rawFile: {},
            },
          ],
        },
        notify
      )
    ).rejects.toThrow(/no longer attached/);
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining("Error uploading files for logo"),
      "error"
    );
    expect(uploadFiles).not.toHaveBeenCalled();
  });
});
