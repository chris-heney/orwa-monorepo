import { describe, expect, it, vi } from "vitest";

const downloads = vi.hoisted(() => [] as { csv: string; name: string }[]);

vi.mock("react-admin", () => ({
  downloadCSV: (csv: string, name: string) => downloads.push({ csv, name }),
}));

import jsonExport from "jsonexport/dist";
import downloadJsonAsCsv from "./downloadJsonAsCsv";

describe("downloadJsonAsCsv", () => {
  it("documents the jsonexport trap: the callback form never settles its promise", async () => {
    let settled = false;
    const pending = Promise.resolve(
      jsonExport([{ a: 1 }], () => undefined)
    ).then(() => {
      settled = true;
    });
    await new Promise((r) => setTimeout(r, 50));
    expect(settled).toBe(false);
    void pending;
  });

  it("resolves once the CSV is downloaded", async () => {
    downloads.length = 0;
    await downloadJsonAsCsv(
      [
        { Name: "Jason", Phone: "(918) 949-5678" },
        { Name: "Tony", Phone: "(918) 251-2828" },
      ],
      "contestants"
    );
    expect(downloads).toHaveLength(1);
    expect(downloads[0].csv.split("\n")[0]).toBe("Name,Phone");
    expect(downloads[0].name).toBe("contestants");
    expect(downloads[0].csv).toContain("Jason");
  });
});
