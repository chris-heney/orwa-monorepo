import { beforeEach, describe, expect, it, vi } from "vitest";
import { enrichProjectCosts } from "./enrich-project-costs";

describe("enrichProjectCosts", () => {
  beforeEach(() => {
    (globalThis as any).strapi = {
      db: {
        query: () => ({
          findMany: vi.fn(async ({ where }) => {
            const ids: number[] = where.id.$in;
            return ids
              .filter((id) => id === 12 || id === 41)
              .map((id) =>
                id === 12
                  ? {
                      id: 12,
                      name: "Customer Meters",
                      classification: "Drinking Water",
                    }
                  : {
                      id: 41,
                      name: "Existing Source Projects",
                      classification: "Drinking Water",
                    }
              );
          }),
        }),
      },
    };
  });

  it("snapshots name/classification and recomputes combined as rounded sum", async () => {
    const data: Record<string, unknown> = {
      combined_cost_of_projects: 999,
      project_costs: [
        { project_type_id: 12, amount: 1000.4 },
        { project_type_id: 41, amount: "500.6" },
      ],
    };

    await enrichProjectCosts(data);

    expect(data.combined_cost_of_projects).toBe(1501);
    expect(data.project_costs).toEqual([
      {
        project_type_id: 12,
        amount: 1000,
        name: "Customer Meters",
        classification: "Drinking Water",
      },
      {
        project_type_id: 41,
        amount: 501,
        name: "Existing Source Projects",
        classification: "Drinking Water",
      },
    ]);
  });

  it("no-ops when project_costs is absent", async () => {
    const data: Record<string, unknown> = {
      combined_cost_of_projects: 42,
    };
    await enrichProjectCosts(data);
    expect(data.combined_cost_of_projects).toBe(42);
  });
});
