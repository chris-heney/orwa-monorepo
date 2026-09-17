/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../rbac-manager/rolePreview", () => ({
  getImpersonateRoleHeader: () => null,
}));
vi.mock("../../../helpers/ra-strapi-data-provider/src/CookieStore", () => ({
  default: { getCookie: () => "jwt-123" },
}));

import {
  NAYLOR_WATERSYSTEMS_PATH,
  downloadNaylorWaterSystems,
  fileNameFromContentDisposition,
} from "./downloadNaylorWaterSystems";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fileNameFromContentDisposition", () => {
  it("reads the quoted and the bare form", () => {
    expect(
      fileNameFromContentDisposition('attachment; filename="Watersystems-Naylor-2026-09-17.csv"')
    ).toBe("Watersystems-Naylor-2026-09-17.csv");
    expect(fileNameFromContentDisposition("attachment; filename=naylor.csv")).toBe("naylor.csv");
  });

  it("prefers the RFC 5987 form and survives a missing header", () => {
    expect(
      fileNameFromContentDisposition("attachment; filename=\"x.csv\"; filename*=UTF-8''Water%20Systems.csv")
    ).toBe("Water Systems.csv");
    expect(fileNameFromContentDisposition(null)).toBeNull();
    expect(fileNameFromContentDisposition("attachment")).toBeNull();
  });
});

describe("downloadNaylorWaterSystems", () => {
  it("asks the server for the file — no columns, filters, sort or paging travel with it", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "Content-Disposition": 'attachment; filename="Watersystems-Naylor-2026-09-17.csv"' }),
      blob: async () => new Blob(['"System Name"\r\n'], { type: "text/csv" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    URL.createObjectURL = vi.fn(() => "blob:naylor");
    URL.revokeObjectURL = vi.fn();
    const downloads: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      downloads.push(this.download);
    });

    await downloadNaylorWaterSystems();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url).endsWith(NAYLOR_WATERSYSTEMS_PATH)).toBe(true);
    expect(String(url)).not.toContain("?");
    expect(init.headers.Authorization).toBe("Bearer jwt-123");
    expect(downloads).toEqual(["Watersystems-Naylor-2026-09-17.csv"]);
  });

  it("rejects with the API's message when the role may not export", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        headers: new Headers(),
        json: async () => ({ data: null, error: { status: 403, name: "ForbiddenError", message: "Forbidden" } }),
      })
    );
    await expect(downloadNaylorWaterSystems()).rejects.toThrow("Forbidden");
  });
});
