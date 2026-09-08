import { describe, expect, it, vi } from "vitest";
import StrapiRestDataProviderFactory from "./DataProviderFactory";
import httpClient from "./httpClient";

vi.mock("./httpClient", () => ({
  default: vi.fn(),
}));

const listResponse = (status: "active" | "cancelled") => ({
  status: 200,
  headers: new Headers(),
  body: "",
  json: {
    data: [
      {
        id: 1,
        documentId: "contestant-document-id",
        status,
      },
    ],
    meta: {
      pagination: {
        total: 1,
      },
    },
  },
});

describe("StrapiRestDataProviderFactory cache invalidation", () => {
  it("invalidates stale contestant list cache without disabling other resource cache", async () => {
    const mockedHttpClient = vi.mocked(httpClient);
    mockedHttpClient
      .mockResolvedValueOnce(listResponse("active") as any)
      .mockResolvedValueOnce(listResponse("cancelled") as any);

    const provider = new StrapiRestDataProviderFactory({
      endpoint: "https://admin.test/api",
      type: "rest",
      cacheTTL: 30_000,
    }).init() as any;

    const params = {
      pagination: { page: 1, perPage: 25 },
      sort: { field: "id", order: "ASC" },
      filter: { status: "active" },
    };

    await expect(
      provider.getList("conference-contestants", params)
    ).resolves.toMatchObject({
      data: [{ id: "contestant-document-id", status: "active" }],
    });
    await provider.getList("conference-contestants", params);
    expect(mockedHttpClient).toHaveBeenCalledTimes(1);

    provider.invalidateResourceCache("conference-contestants");

    await expect(
      provider.getList("conference-contestants", params)
    ).resolves.toMatchObject({
      data: [{ id: "contestant-document-id", status: "cancelled" }],
    });
    expect(mockedHttpClient).toHaveBeenCalledTimes(2);
  });
});
