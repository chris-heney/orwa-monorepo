import { describe, expect, it } from "vitest";
import {
  sanitizeStrapiWritePayload,
  sanitizeWriteValue,
} from "./sanitizeStrapiWritePayload";

const DOC = "w43unty8pzc4fc6j11jx0l4n";
const DOC2 = "m06vnq7vqvxw22joapq8j8lj";

const fatStatus = {
  id: DOC,
  documentId: DOC,
  entityId: 2,
  name: "Approved",
  color: "#00ff00",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  publishedAt: "2024-01-01T00:00:00.000Z",
  next_statuses: [
    {
      id: DOC2,
      documentId: DOC2,
      entityId: 3,
      name: "Paid",
    },
  ],
};

describe("sanitizeWriteValue — relations", () => {
  it("collapses a oneToOne / manyToOne fat row to documentId", () => {
    expect(sanitizeWriteValue(fatStatus)).toBe(DOC);
  });

  it("collapses oneToMany / manyToMany arrays of fat rows to documentIds", () => {
    expect(sanitizeWriteValue([fatStatus, { ...fatStatus, documentId: DOC2, id: DOC2 }])).toEqual(
      [DOC, DOC2]
    );
  });

  it("leaves scalar documentIds and numeric ids alone", () => {
    expect(sanitizeWriteValue(DOC)).toBe(DOC);
    expect(sanitizeWriteValue(12)).toBe(12);
    expect(sanitizeWriteValue([DOC, DOC2])).toEqual([DOC, DOC2]);
    expect(sanitizeWriteValue([1, 2])).toEqual([1, 2]);
  });

  it("collapses slim { id, entityId } leftovers to id", () => {
    expect(sanitizeWriteValue({ id: DOC, entityId: 2 })).toBe(DOC);
    expect(sanitizeWriteValue({ id: 7, entityId: 7 })).toBe(7);
  });

  it("keeps a component instance that is only { id }", () => {
    expect(sanitizeWriteValue({ id: 11 })).toEqual({ id: 11 });
  });

  it("leaves an empty many-to-many / one-to-many array as []", () => {
    expect(sanitizeWriteValue([])).toEqual([]);
  });

  it("recurses into set/connect/disconnect operators", () => {
    expect(
      sanitizeWriteValue({
        set: [fatStatus],
        disconnect: [{ documentId: DOC2, id: DOC2, entityId: 3, name: "Paid" }],
      })
    ).toEqual({
      set: [DOC],
      disconnect: [DOC2],
    });
  });
});

describe("sanitizeWriteValue — media", () => {
  it("keeps the numeric upload id, not documentId", () => {
    expect(
      sanitizeWriteValue({
        id: 44,
        documentId: "abcmediaid0000001",
        mime: "image/png",
        url: "/uploads/x.png",
      })
    ).toBe(44);
  });

  it("collapses multi-media arrays to numeric ids", () => {
    expect(
      sanitizeWriteValue([
        { id: 1, mime: "image/png", url: "/a.png" },
        { id: "2", mime: "image/jpeg", url: "/b.jpg" },
      ])
    ).toEqual([1, 2]);
  });
});

describe("sanitizeWriteValue — components / repeaters", () => {
  it("keeps repeater items as objects and preserves component instance id", () => {
    const repeater = [
      { id: 11, title: "Hours", description: "8 CE", important: false, order: 1 },
      { title: "New row", description: "added", important: true, order: 2 },
    ];
    expect(sanitizeWriteValue(repeater)).toEqual(repeater);
  });

  it("does not collapse a component that has id but no documentId", () => {
    const address = {
      id: 9,
      street: "123 Main",
      city: "OKC",
      entityId: 9,
      createdAt: "2024-01-01T00:00:00.000Z",
    };
    expect(sanitizeWriteValue(address)).toEqual({
      id: 9,
      street: "123 Main",
      city: "OKC",
    });
  });

  it("collapses nested relations inside a repeater item", () => {
    expect(
      sanitizeWriteValue([
        {
          id: 3,
          key: "Lunch",
          label: "Lunch",
          value: "25",
          item: fatStatus,
        },
      ])
    ).toEqual([
      {
        id: 3,
        key: "Lunch",
        label: "Lunch",
        value: "25",
        item: DOC,
      },
    ]);
  });

  it("keeps repeater rows and collapses nested media to numeric upload ids", () => {
    expect(
      sanitizeWriteValue([
        {
          id: 4,
          caption: "Logo",
          file: { id: 88, mime: "image/png", url: "/logo.png", documentId: "logodoc" },
        },
      ])
    ).toEqual([{ id: 4, caption: "Logo", file: 88 }]);
  });

  it("keeps dynamic-zone __component and does not treat it as a relation", () => {
    expect(
      sanitizeWriteValue({
        __component: "conference.conference-details",
        id: 4,
        title: "Parking",
        entityId: 4,
      })
    ).toEqual({
      __component: "conference.conference-details",
      id: 4,
      title: "Parking",
    });
  });
});

describe("sanitizeStrapiWritePayload", () => {
  it("strips top-level system fields and collapses mixed relation + repeater + media", () => {
    expect(
      sanitizeStrapiWritePayload({
        id: DOC,
        documentId: DOC,
        entityId: 3575,
        createdAt: "2026-01-01T00:00:00.000Z",
        payout_status: fatStatus,
        application: { id: "appdocid000000001", documentId: "appdocid000000001", entityId: 10, legal_entity_name: "Arnett" },
        badges: [fatStatus, DOC2],
        conference_details: [
          { id: 1, title: "Hours", description: "8", order: 1 },
        ],
        logo: { id: 88, mime: "image/png", url: "/logo.png", documentId: "logodoc" },
        comments: "ok",
        amount: 100,
      })
    ).toEqual({
      payout_status: DOC,
      application: "appdocid000000001",
      badges: [DOC, DOC2],
      conference_details: [{ id: 1, title: "Hours", description: "8", order: 1 }],
      logo: 88,
      comments: "ok",
      amount: 100,
    });
  });

  it("turns empty strings into null", () => {
    expect(sanitizeStrapiWritePayload({ comments: "" })).toEqual({
      comments: null,
    });
  });

  it("strips timestamps so Award Payouts row saves do not 400 Invalid key createdAt", () => {
    expect(
      sanitizeStrapiWritePayload({
        amount: 100,
        type: "Reimbursement",
        createdAt: "2026-08-14T20:49:27.058Z",
        updatedAt: "2026-08-17T23:07:33.212Z",
        publishedAt: "2026-08-17T23:07:33.208Z",
        totalPayouts: 999,
        balance: 0,
      })
    ).toEqual({
      amount: 100,
      type: "Reimbursement",
      totalPayouts: 999,
      balance: 0,
    });
  });
});
