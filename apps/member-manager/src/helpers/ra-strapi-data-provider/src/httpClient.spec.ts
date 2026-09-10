import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchJson = vi.fn();

vi.mock("react-admin", () => ({
  fetchUtils: {
    fetchJson: (...args: unknown[]) => fetchJson(...args),
  },
}));

vi.mock("./CookieStore", () => ({
  default: { getCookie: () => "token-value" },
}));

vi.mock("../../../modules/rbac-manager/rolePreview", () => ({
  getImpersonateRoleHeader: () => null,
}));

import httpClient from "./httpClient";

const SOLD_OUT =
  "The golf tournament is sold out — no golfer spots remain. Please remove the golfer entries and try again.";

/** What react-admin's fetchJson rejects with: no statusText over HTTP/2. */
const httpError = (body: unknown, status = 400) =>
  Object.assign(new Error(""), { status, body });

describe("httpClient", () => {
  beforeEach(() => {
    fetchJson.mockReset();
  });

  it("resolves untouched on success", async () => {
    const response = { status: 200, json: { data: { id: 1 } } };
    fetchJson.mockResolvedValue(response);

    await expect(httpClient("/api/conference-contestants")).resolves.toBe(
      response
    );
  });

  it("surfaces the Strapi message instead of the empty statusText", async () => {
    const body = {
      data: null,
      error: {
        status: 400,
        name: "ApplicationError",
        message: SOLD_OUT,
        details: {},
      },
    };
    fetchJson.mockRejectedValue(httpError(body));

    const error = await httpClient("/api/conference-contestants", {
      method: "POST",
      body: "{}",
    }).catch((thrown) => thrown);

    expect(error.message).toBe(SOLD_OUT);
    // status/body must survive for authProvider.checkError and RA form errors.
    expect(error.status).toBe(400);
    expect(error.body).toBe(body);
  });

  it("leaves the message alone when the body carries nothing readable", async () => {
    const error = httpError("<html>502 Bad Gateway</html>", 502);
    error.message = "Bad Gateway";
    fetchJson.mockRejectedValue(error);

    const thrown = await httpClient("/api/conferences").catch((e) => e);

    expect(thrown.message).toBe("Bad Gateway");
    expect(thrown.status).toBe(502);
  });
});
