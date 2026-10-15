import { beforeEach, describe, expect, it, vi } from "vitest";

import lifecycles, { nominationRefFromValue } from "./lifecycles";

const NOM_DOC = "ckcwn3jyuqjn3yq06wm6bz4l";

type Row = Record<string, unknown>;

const nominationFindOne = vi.fn();
const winnerFindOne = vi.fn();
const winnerFindMany = vi.fn();

const query = (uid: string) => {
  if (uid === "api::award-nomination.award-nomination") {
    return { findOne: nominationFindOne };
  }
  if (uid === "api::award-winner.award-winner") {
    return { findOne: winnerFindOne, findMany: winnerFindMany };
  }
  throw new Error(`unexpected uid ${uid}`);
};

(globalThis as Record<string, unknown>).strapi = { db: { query } };

const event = (data: Row, where: Row = {}) => ({ params: { data, where } });

const nomination = { id: 7, documentId: NOM_DOC, nominee_name: "Jane Doe" };

beforeEach(() => {
  nominationFindOne.mockReset();
  winnerFindOne.mockReset();
  winnerFindMany.mockReset();
  nominationFindOne.mockResolvedValue(nomination);
  winnerFindMany.mockResolvedValue([]);
  winnerFindOne.mockResolvedValue(null);
});

describe("nominationRefFromValue", () => {
  it("reads every relation shape Strapi accepts", () => {
    expect(nominationRefFromValue(null)).toBeNull();
    expect(nominationRefFromValue("")).toBeNull();
    expect(nominationRefFromValue([])).toBeNull();
    expect(nominationRefFromValue(7)).toEqual({ id: 7 });
    expect(nominationRefFromValue("7")).toEqual({ id: 7 });
    expect(nominationRefFromValue(NOM_DOC)).toEqual({ documentId: NOM_DOC });
    expect(nominationRefFromValue({ id: 7, documentId: NOM_DOC })).toEqual({
      documentId: NOM_DOC,
    });
    expect(nominationRefFromValue({ set: [NOM_DOC] })).toEqual({ documentId: NOM_DOC });
    expect(nominationRefFromValue({ connect: [{ id: 7 }] })).toEqual({ id: 7 });
    expect(nominationRefFromValue({ set: [] })).toBeNull();
    expect(nominationRefFromValue({ disconnect: [7] })).toBeNull();
  });
});

describe("award-winner lifecycle guard", () => {
  it("registers create + update hooks", () => {
    expect(lifecycles.beforeCreate).toBeTypeOf("function");
    expect(lifecycles.beforeUpdate).toBeTypeOf("function");
  });

  it("ignores writes that do not touch the nomination link", async () => {
    await lifecycles.beforeCreate(event({ title: "Man of the Year", award_year: 2027 }));
    await lifecycles.beforeUpdate(event({ recipient: "x" }, { documentId: "abc" }));
    expect(nominationFindOne).not.toHaveBeenCalled();
    expect(winnerFindMany).not.toHaveBeenCalled();
  });

  it("lets the first winner claim a nomination and leaves the payload alone", async () => {
    const data: Row = { title: "Man of the Year", award_year: 2027, award_nomination: NOM_DOC };
    await lifecycles.beforeCreate(event(data));
    expect(nominationFindOne).toHaveBeenCalledWith(
      expect.objectContaining({ where: { documentId: NOM_DOC } })
    );
    expect(winnerFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { award_nomination: { id: 7 } } })
    );
    expect(data).toEqual({ title: "Man of the Year", award_year: 2027, award_nomination: NOM_DOC });
  });

  it("rejects a second winner for the same nomination with a 400", async () => {
    winnerFindMany.mockResolvedValue([
      { id: 11, documentId: "w1w1w1w1w1w1w1w1w1w1w1w1", title: "Man of the Year", award_year: 2027 },
    ]);
    const err = await lifecycles
      .beforeCreate(event({ title: "Dup", award_nomination: NOM_DOC }))
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).name).toBe("ApplicationError");
    expect((err as Error).message).toMatch(/already in the Winners gallery/);
    expect((err as Error).message).toMatch(/Jane Doe/);
    expect((err as Error).message).toMatch(/2027 Man of the Year/);
  });

  it("rejects a link to a nomination that does not exist", async () => {
    nominationFindOne.mockResolvedValue(null);
    await expect(
      lifecycles.beforeCreate(event({ award_nomination: NOM_DOC }))
    ).rejects.toThrow(/does not exist/);
  });

  it("on update, the winner may keep pointing at its own nomination", async () => {
    winnerFindOne.mockResolvedValue({ id: 11 });
    winnerFindMany.mockResolvedValue([{ id: 11, title: "Man of the Year", award_year: 2027 }]);
    await expect(
      lifecycles.beforeUpdate(
        event({ award_nomination: NOM_DOC }, { documentId: "selfdocselfdocselfdoc1" })
      )
    ).resolves.toBeUndefined();
  });

  it("on update, repointing at a nomination another winner owns is rejected", async () => {
    winnerFindOne.mockResolvedValue({ id: 12 });
    winnerFindMany.mockResolvedValue([{ id: 11, title: "Man of the Year", award_year: 2027 }]);
    await expect(
      lifecycles.beforeUpdate(event({ award_nomination: 7 }, { id: 12 }))
    ).rejects.toThrow(/already in the Winners gallery/);
  });

  it("unlinking (null / empty set) is always allowed", async () => {
    await lifecycles.beforeUpdate(event({ award_nomination: null }, { id: 1 }));
    await lifecycles.beforeUpdate(event({ award_nomination: { set: [] } }, { id: 1 }));
    expect(winnerFindMany).not.toHaveBeenCalled();
  });
});
