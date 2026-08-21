import { describe, expect, it } from "vitest";
import { sanitizeStrapiWritePayload } from "../../../../helpers/ra-strapi-data-provider/src/sanitizeStrapiWritePayload";
import {
  findSponsorshipCatalogRow,
  toSponsorshipFormId,
  toSponsorWritePayload,
} from "./sponsorWritePayload";

const DOC = "w43unty8pzc4fc6j11jx0l4n";
const DOC2 = "m06vnq7vqvxw22joapq8j8lj";

const gold = {
  id: DOC,
  documentId: DOC,
  entityId: 5,
  name: "Gold",
  amount: 2500,
};

const silver = {
  id: DOC2,
  documentId: DOC2,
  entityId: 8,
  name: "Silver",
  amount: 1000,
};

const catalog = [gold, silver];

describe("findSponsorshipCatalogRow", () => {
  it("matches a remapped documentId (record.id after withStableId)", () => {
    expect(findSponsorshipCatalogRow(catalog, DOC)).toEqual(gold);
  });

  it("matches a numeric entityId from a nested populate", () => {
    expect(findSponsorshipCatalogRow(catalog, 5)).toEqual(gold);
    expect(findSponsorshipCatalogRow(catalog, "5")).toEqual(gold);
  });

  it("matches a fat populated row", () => {
    expect(
      findSponsorshipCatalogRow(catalog, {
        id: 5,
        documentId: DOC,
        name: "Gold",
      })
    ).toEqual(gold);
  });
});

describe("toSponsorshipFormId", () => {
  it("prefers documentId so AutocompleteInput matches catalog choices", () => {
    expect(toSponsorshipFormId({ id: 5, documentId: DOC, name: "Gold" })).toBe(
      DOC
    );
  });

  it("keeps a scalar documentId or numeric id", () => {
    expect(toSponsorshipFormId(DOC)).toBe(DOC);
    expect(toSponsorshipFormId(5)).toBe(5);
  });
});

describe("toSponsorWritePayload", () => {
  it("resolves nested numeric ids to documentIds and sets sponsorships", () => {
    expect(
      toSponsorWritePayload(
        {
          organization: "Acme",
          email: "a@example.com",
          amount: 2500,
          sponsorship_items: [
            { id: 11, sponsorship: 5, label: "stale", value: 1 },
          ],
        },
        catalog
      )
    ).toEqual({
      organization: "Acme",
      email: "a@example.com",
      amount: 2500,
      sponsorship_items: [
        {
          id: 11,
          sponsorship: DOC,
          label: "Gold",
          value: 2500,
          key: "Gold-0",
        },
      ],
      sponsorships: [DOC],
    });
  });

  it("keeps the component instance id and existing label when catalog misses", () => {
    expect(
      toSponsorWritePayload(
        {
          sponsorship_items: [
            {
              id: 22,
              sponsorship: "unknownid00000001",
              label: "Custom Booth",
              value: 750,
              key: "custom-1",
            },
          ],
        },
        catalog
      )
    ).toEqual({
      sponsorship_items: [
        {
          id: 22,
          sponsorship: "unknownid00000001",
          label: "Custom Booth",
          value: 750,
          key: "custom-1",
        },
      ],
      sponsorships: ["unknownid00000001"],
    });
  });

  it("drops empty rows and syncs oneToMany sponsorships from remaining items", () => {
    expect(
      toSponsorWritePayload(
        {
          sponsorship_items: [
            { sponsorship: DOC },
            { sponsorship: null },
            { sponsorship: DOC2, id: 3 },
          ],
        },
        catalog
      )
    ).toEqual({
      sponsorship_items: [
        {
          sponsorship: DOC,
          label: "Gold",
          value: 2500,
          key: "Gold-0",
        },
        {
          id: 3,
          sponsorship: DOC2,
          label: "Silver",
          value: 1000,
          key: "Silver-1",
        },
      ],
      sponsorships: [DOC, DOC2],
    });
  });

  it("sends an empty sponsorships set when every item is cleared", () => {
    expect(
      toSponsorWritePayload({ organization: "Acme", sponsorship_items: [] }, catalog)
    ).toEqual({
      organization: "Acme",
      sponsorship_items: [],
      sponsorships: [],
    });
  });

  it("sanitizes to a Strapi 5 write body that keeps both item and relation links", () => {
    expect(
      sanitizeStrapiWritePayload(
        toSponsorWritePayload(
          {
            id: "sponsordocid000001",
            documentId: "sponsordocid000001",
            entityId: 99,
            organization: "Acme",
            sponsorship_items: [{ id: 11, sponsorship: 5 }],
            registration: {
              id: "regdocid0000000001",
              documentId: "regdocid0000000001",
              entityId: 40,
              organization: "Acme",
            },
          },
          catalog
        )
      )
    ).toEqual({
      organization: "Acme",
      sponsorship_items: [
        {
          id: 11,
          sponsorship: DOC,
          label: "Gold",
          value: 2500,
          key: "Gold-0",
        },
      ],
      sponsorships: [DOC],
      registration: "regdocid0000000001",
    });
  });
});
