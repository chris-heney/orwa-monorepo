import { beforeEach, describe, expect, it, vi } from "vitest";

const uploadFile = vi.fn();
const getFile = vi.fn();

vi.mock("../services/uploadService", () => ({
  default: { uploadFile: (...args: unknown[]) => uploadFile(...args) },
}));
vi.mock("./fileCache", () => ({
  fileCache: { getFile: (...args: unknown[]) => getFile(...args) },
}));

import {
  FileUploadError,
  fileUploadErrorMessage,
  processAndUploadFiles,
} from "./processAndUploadFiles";

const existing = { id: 5611, src: "https://admin.orwa.org/uploads/a.pdf", title: "a.pdf" };

describe("processAndUploadFiles", () => {
  beforeEach(() => {
    uploadFile.mockReset();
    getFile.mockReset();
  });

  it("keeps existing ids and uploads new files, preferring the cached copy", async () => {
    const cached = new File(["cached"], "FY 2025 Audit Agreement.pdf", { type: "application/pdf" });
    getFile.mockResolvedValue(cached);
    uploadFile.mockResolvedValue(6109);

    const result = await processAndUploadFiles({
      proposals: [
        existing,
        { rawFile: new File(["raw"], "FY 2025 Audit Agreement.pdf"), src: "blob:x", title: "FY 2025 Audit Agreement.pdf", cacheId: "c1" },
      ],
      legal_entity_name: "Taft",
    });

    expect(result.proposals).toEqual([5611, 6109]);
    expect(result.legal_entity_name).toBe("Taft");
    expect(uploadFile).toHaveBeenCalledWith(cached);
  });

  it("throws FileUploadError naming the file when the upload fails (never sends raw objects)", async () => {
    getFile.mockResolvedValue(null);
    uploadFile.mockRejectedValue(new TypeError("Failed to fetch"));

    const error = await processAndUploadFiles({
      proposals: [
        existing,
        { rawFile: new File(["raw"], "FY 2025 Audit Agreement.pdf"), src: "blob:x", title: "FY 2025 Audit Agreement.pdfOK3005118" },
      ],
    }).catch((e) => e);

    expect(error).toBeInstanceOf(FileUploadError);
    expect(error.field).toBe("proposals");
    expect(fileUploadErrorMessage(error)).toBe(
      'Could not upload "FY 2025 Audit Agreement.pdf". Remove it and choose it again.'
    );
    expect(fileUploadErrorMessage(new Error("other"))).toBeNull();
  });

  it("links an already-uploaded single file by id", async () => {
    const result = await processAndUploadFiles({ consent_order: existing });
    expect(result.consent_order).toBe(5611);
    expect(uploadFile).not.toHaveBeenCalled();
  });
});
