import { createRequire } from "node:module";
import { describe, expect, it, vi } from "vitest";

const require = createRequire(import.meta.url);
const { up } = require("./2026.09.09T00.00.00.backfill-conference-contestant-status.js");

const makeKnex = (state: {
  hasTable: boolean;
  hasColumn: boolean;
  rows: Array<{ status?: string | null }>;
}) => {
  const tableOps: string[] = [];
  const schema = {
    hasTable: vi.fn(async () => state.hasTable),
    hasColumn: vi.fn(async () => state.hasColumn),
    table: vi.fn(async (_name: string, callback: (table: any) => void) => {
      callback({
        string: vi.fn(() => ({
          defaultTo: vi.fn((value: string) => {
            state.hasColumn = true;
            tableOps.push(`status:${value}`);
          }),
        })),
      });
    }),
  };

  const knex = vi.fn(() => {
    const builder = {
      whereNull: vi.fn(() => builder),
      orWhere: vi.fn(() => builder),
      update: vi.fn(async (patch: { status: string }) => {
        for (const row of state.rows) {
          if (row.status == null || row.status === "") row.status = patch.status;
        }
      }),
    };
    return builder;
  }) as any;
  knex.schema = schema;
  knex.tableOps = tableOps;
  return knex;
};

describe("backfill conference contestant status migration", () => {
  it("creates the column before schema sync when needed and preserves cancelled values", async () => {
    const state = {
      hasTable: true,
      hasColumn: false,
      rows: [{ status: null }, { status: "" }, { status: "cancelled" }],
    };
    const knex = makeKnex(state);

    await up(knex);
    await up(knex);

    expect(knex.schema.table).toHaveBeenCalledTimes(1);
    expect(knex.tableOps).toEqual(["status:active"]);
    expect(state.rows).toEqual([
      { status: "active" },
      { status: "active" },
      { status: "cancelled" },
    ]);
  });

  it("is a no-op when the table does not exist yet", async () => {
    const knex = makeKnex({ hasTable: false, hasColumn: false, rows: [] });

    await up(knex);

    expect(knex.schema.hasColumn).not.toHaveBeenCalled();
    expect(knex).not.toHaveBeenCalled();
  });
});
