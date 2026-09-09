import { describe, expect, it, vi } from "vitest";
import { GetListParams } from "react-admin";
import StrapiRestDataProviderFactory from "./DataProviderFactory";
import httpClient from "./httpClient";
import { IStrapiRestResponse } from "./types";
import { CONFERENCE_CONTESTANT_RECEIPT_POPULATE } from "../../../modules/conference/helpers/registrationReceiptContestants";

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

const CONTESTANT_DOC_ID = "w3wzeuycgq136zyx3pzp9vnu";

describe("StrapiRestDataProviderFactory cache invalidation", () => {
  it("invalidates stale contestant list cache without disabling other resource cache", async () => {
    const mockedHttpClient = vi.mocked(httpClient);
    mockedHttpClient
      .mockResolvedValueOnce(listResponse("active") as unknown as IStrapiRestResponse)
      .mockResolvedValueOnce(
        listResponse("cancelled") as unknown as IStrapiRestResponse
      );

    const provider = new StrapiRestDataProviderFactory({
      endpoint: "https://admin.test/api",
      type: "rest",
      cacheTTL: 30_000,
    }).init();

    const params: GetListParams = {
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

  it("resolves a promise so react-admin's dataProvider proxy can chain it", async () => {
    const provider = new StrapiRestDataProviderFactory({
      endpoint: "https://admin.test/api",
      type: "rest",
    }).init();

    // `useDataProvider` wraps every method and unconditionally calls `.then()`
    // on the result; returning void made it throw "The dataProvider threw an
    // error" and swallowed the caller's refresh.
    const result = provider.invalidateResourceCache("conference-contestants");

    expect(typeof (result as Promise<void>)?.then).toBe("function");
    await expect(result).resolves.toBeUndefined();
  });

  it("fetches contestant history by documentId with explicit nested populate meta", async () => {
    const mockedHttpClient = vi.mocked(httpClient);
    mockedHttpClient.mockResolvedValueOnce({
      status: 200,
      headers: new Headers(),
      body: "",
      json: {
        data: [
          {
            id: 1,
            documentId: CONTESTANT_DOC_ID,
            status: "cancelled",
            conference_ticket: { id: 2, documentId: "ticket-document-id", name: "Golfer" },
            team: { id: 3, documentId: "team-document-id", name: "Team One" },
            items: [{ key: "Mulligan 0", label: "Mulligan", value: "20" }],
          },
        ],
        meta: { pagination: { total: 1 } },
      },
    } as unknown as IStrapiRestResponse);

    const provider = new StrapiRestDataProviderFactory({
      endpoint: "https://admin.test/api",
      type: "rest",
      cacheTTL: 30_000,
    }).init();

    await expect(
      provider.getMany("conference-contestants", {
        ids: [CONTESTANT_DOC_ID],
        meta: { raw: true, populate: CONFERENCE_CONTESTANT_RECEIPT_POPULATE },
      })
    ).resolves.toMatchObject({
      data: [
        {
          id: CONTESTANT_DOC_ID,
          entityId: 1,
          status: "cancelled",
          conference_ticket: { id: "ticket-document-id", name: "Golfer" },
          team: { id: "team-document-id", name: "Team One" },
        },
      ],
    });

    expect(mockedHttpClient).toHaveBeenLastCalledWith(
      `https://admin.test/api/conference-contestants?populate[conference_ticket]=true&populate[team]=true&populate[items][populate][item]=true&filters[documentId][$in][0]=${CONTESTANT_DOC_ID}`
    );
  });

  it("serializes null-safe active contestant filters", async () => {
    const mockedHttpClient = vi.mocked(httpClient);
    mockedHttpClient.mockResolvedValueOnce(listResponse("active") as unknown as IStrapiRestResponse);

    const provider = new StrapiRestDataProviderFactory({
      endpoint: "https://admin.test/api",
      type: "rest",
      cacheTTL: 0,
    }).init();

    await provider.getList("conference-contestants", {
      pagination: { page: 1, perPage: 25 },
      sort: { field: "id", order: "ASC" },
      filter: {
        conference: 3,
        $or: [{ status: { $eq: "active" } }, { status: { $null: true } }],
      },
    });

    expect(mockedHttpClient).toHaveBeenLastCalledWith(
      expect.stringContaining("filters[$or][0][status][$eq]=active"),
      expect.anything()
    );
    expect(mockedHttpClient).toHaveBeenLastCalledWith(
      expect.stringContaining("filters[$or][1][status][$null]=true"),
      expect.anything()
    );
  });
});
