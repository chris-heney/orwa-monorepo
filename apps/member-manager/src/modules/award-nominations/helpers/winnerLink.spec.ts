import { describe, expect, it } from "vitest";
import {
  firstPhotographId,
  isWinnerStatus,
  nominationOptionText,
  nominationRecipientLine,
  winnerFromNomination,
  winnerPrefillFromNomination,
} from "./winnerLink";

const WS_DOC = "ws0ws0ws0ws0ws0ws0ws0ws0";
const NOM_DOC = "ckcwn3jyuqjn3yq06wm6bz4l";

const nomination = {
  id: NOM_DOC,
  documentId: NOM_DOC,
  entityId: 7,
  nominee_name: "Roger McCracken",
  system_name: "Lincoln County RWSD 4",
  award_type: "Excellence in Operations",
  award_year: 2027,
  nomination_status: "Winner",
  watersystem: { id: WS_DOC, documentId: WS_DOC, entityId: 44, name: "Lincoln Co RW&SD #4" },
  // ↑ stabilized raw row: id = documentId, numeric PK kept as entityId
  photographs: [
    { id: 901, documentId: "p1p1p1p1p1p1p1p1p1p1p1p1", url: "/uploads/a.jpg" },
    { id: 902, documentId: "p2p2p2p2p2p2p2p2p2p2p2p2", url: "/uploads/b.jpg" },
  ],
};

describe("isWinnerStatus", () => {
  it("is true only for Winner / Runner Up", () => {
    expect(isWinnerStatus("Winner")).toBe(true);
    expect(isWinnerStatus("Runner Up")).toBe(true);
    for (const s of ["Draft", "Submitted", "Under Review", "Not Selected", null, undefined, ""]) {
      expect(isWinnerStatus(s)).toBe(false);
    }
  });
});

describe("nominationRecipientLine", () => {
  it("uses the gallery convention 'Person — System' (linked system wins over typed name)", () => {
    expect(nominationRecipientLine(nomination)).toBe("Roger McCracken — Lincoln Co RW&SD #4");
  });

  it("falls back to the typed system_name when no water system is linked", () => {
    expect(nominationRecipientLine({ ...nomination, watersystem: null })).toBe(
      "Roger McCracken — Lincoln County RWSD 4"
    );
  });

  it("collapses System of the Year nominations where nominee == system", () => {
    expect(
      nominationRecipientLine({
        nominee_name: "Adair Co RWD #4",
        system_name: "Adair Co RWD #4",
        watersystem: { name: "Adair Co RWD #4" },
      })
    ).toBe("Adair Co RWD #4");
  });

  it("uses the linked contact when there is no nominee name", () => {
    expect(
      nominationRecipientLine({
        nominee_name: "",
        system_name: "Ada City of",
        contact: { first_name: "Korey", last_name: "Christiansen" },
      })
    ).toBe("Korey Christiansen — Ada City of");
  });
});

describe("nominationOptionText", () => {
  it("shows nominee, system, award type and year", () => {
    expect(nominationOptionText(nomination)).toBe(
      "Roger McCracken · Lincoln Co RW&SD #4 · Excellence in Operations (2027)"
    );
  });
  it("dedupes nominee == system and tolerates empties", () => {
    expect(
      nominationOptionText({ nominee_name: "Adair Co RWD #4", system_name: "Adair Co RWD #4" })
    ).toBe("Adair Co RWD #4");
    expect(nominationOptionText(null)).toBe("");
  });
});

describe("firstPhotographId", () => {
  it("returns the first upload's numeric id in any media shape", () => {
    expect(firstPhotographId(nomination)).toBe(901);
    expect(firstPhotographId({ photographs: [903] })).toBe(903);
    expect(firstPhotographId({ photographs: "904" })).toBe(904);
    expect(firstPhotographId({ photographs: [] })).toBeNull();
    expect(firstPhotographId({ photographs: null })).toBeNull();
    expect(firstPhotographId({})).toBeNull();
  });
});

describe("winnerPrefillFromNomination", () => {
  it("fills only blank fields (water system keyed by numeric PK)", () => {
    expect(winnerPrefillFromNomination(nomination, {})).toEqual({
      title: "Excellence in Operations",
      recipient: "Roger McCracken — Lincoln Co RW&SD #4",
      watersystem: 44,
      award_year: 2027,
    });
  });

  it("falls back to the water system documentId when no numeric PK is known", () => {
    expect(
      winnerPrefillFromNomination(
        { ...nomination, watersystem: { id: WS_DOC, documentId: WS_DOC, name: "x" } },
        {}
      ).watersystem
    ).toBe(WS_DOC);
    expect(
      winnerPrefillFromNomination({ ...nomination, watersystem: 12 }, {}).watersystem
    ).toBe(12);
  });

  it("never overwrites what staff already typed", () => {
    expect(
      winnerPrefillFromNomination(nomination, {
        title: "Man of the Year",
        recipient: "Someone Else",
        watersystem: "other",
        award_year: 2026,
      })
    ).toEqual({});
  });

  it("treats empty strings as blank", () => {
    expect(
      winnerPrefillFromNomination(nomination, { title: "", recipient: "  " })
    ).toMatchObject({ title: "Excellence in Operations", recipient: expect.any(String) });
  });
});

describe("winnerFromNomination", () => {
  it("builds a hidden winner linked to the nomination with the first photograph", () => {
    expect(winnerFromNomination(nomination)).toEqual({
      title: "Excellence in Operations",
      recipient: "Roger McCracken — Lincoln Co RW&SD #4",
      watersystem: 44,
      award_year: 2027,
      award_nomination: NOM_DOC,
      is_published: false,
      sort_order: 0,
      photo: 901,
    });
  });

  it("omits photo when the nomination has none", () => {
    const draft = winnerFromNomination({ ...nomination, photographs: [] });
    expect(draft).not.toHaveProperty("photo");
    expect(draft.is_published).toBe(false);
  });
});
