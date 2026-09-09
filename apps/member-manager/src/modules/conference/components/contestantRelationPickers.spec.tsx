/** @vitest-environment jsdom */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Both pickers that can assign a contestant to something — a team and a
 * registration — must offer active contestants only, while still showing a
 * cancelled one that is already linked.
 */

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let record: Record<string, any> | undefined;

/**
 * React-admin is stubbed wholesale: these tests are about the props the forms
 * hand to their inputs, so the inputs only need to record them.
 */
const { stub, rendered } = vi.hoisted(() => {
  const rendered: { name: string; props: Record<string, any> }[] = [];

  return {
    rendered,
    stub: (name: string) => {
      const Component = (props: Record<string, any>) => {
        rendered.push({ name, props });
        return props.children ?? null;
      };
      Component.displayName = name;
      return Component;
    },
  };
});

vi.mock("react-admin", () => {
  const hooks: Record<string, unknown> = {
    useListContext: () => ({ filterValues: {} }),
    useListFilterContext: () => ({ filterValues: {} }),
    useRecordContext: () => record,
    useNotify: () => vi.fn(),
    useCreate: () => [vi.fn()],
    useUpdate: () => [vi.fn()],
    useRemoveFromStore: () => vi.fn(),
  };

  return new Proxy(hooks, {
    get: (target, property) => {
      // A module namespace carrying `then` is treated as a promise by the
      // importer, which then awaits the stub forever.
      if (typeof property !== "string" || property === "then") return undefined;
      if (property in target) return target[property];
      target[property] = stub(property);
      return target[property];
    },
  });
});

vi.mock("@orwa/entity-id", () => ({ DatagridConfigurable: stub("Datagrid") }));
vi.mock("./RegistrationReceipt", () => ({ default: stub("Receipt") }));
vi.mock("../../rbac-manager/useCan", () => ({
  useCan: () => ({ can: () => true, canOnResource: () => true, isLoading: false }),
}));

import { contestantChoicesFilter } from "../helpers/listQueryFilters";
import { TeamFormFields } from "./ConferenceTeams";
import { RegistrationFormFields } from "./ConferenceRegistrations";

const ACTIVE_OR_NULL = [
  { status: { $eq: "active" } },
  { status: { $null: true } },
];

let container: HTMLDivElement;
let root: Root;

/**
 * Rendered with this app's own React 18 rather than @testing-library/react,
 * which resolves from the workspace root's React 19.
 */
const renderFields = async (element: React.ReactElement) => {
  rendered.length = 0;
  await act(async () => {
    root.render(element);
  });
  return rendered.slice();
};

const contestantPickerIn = (
  inputs: { props: Record<string, any> }[]
): Record<string, any> | undefined =>
  inputs.find((input) => input.props.reference === "conference-contestants")
    ?.props;

/** The contestant picker on each of the two forms that can assign one. */
const pickers = async () => ({
  team: contestantPickerIn(await renderFields(<TeamFormFields />)),
  registration: contestantPickerIn(await renderFields(<RegistrationFormFields />)),
});

beforeEach(() => {
  record = undefined;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe("contestant relation pickers", () => {
  it("offers only active contestants when nothing is linked yet", async () => {
    for (const [form, picker] of Object.entries(await pickers())) {
      expect(picker, form).toBeDefined();
      expect(picker!.filter, form).toEqual({ status: "active" });
    }
  });

  // The cancelled contestant is already on this record; it has to keep
  // rendering, but nothing else cancelled may be picked.
  it("keeps an already-linked cancelled contestant selectable", async () => {
    record = {
      id: "reg-1",
      contestants: [
        { documentId: "da0uvx5z0tfprqkaefl9fp3o", status: "cancelled" },
      ],
    };

    for (const [form, picker] of Object.entries(await pickers())) {
      expect(picker!.filter, form).toEqual({
        $or: [
          ...ACTIVE_OR_NULL,
          { documentId: { $in: ["da0uvx5z0tfprqkaefl9fp3o"] } },
        ],
      });
    }
  });

  it("builds the same filter the shared helper does", async () => {
    record = { id: "team-1", contestants: [{ id: 99 }] };

    for (const [form, picker] of Object.entries(await pickers())) {
      expect(picker!.filter, form).toEqual(
        contestantChoicesFilter(record!.contestants)
      );
    }
  });

  // Cancellation is a contestant concept; the other pickers on these forms must
  // not have picked up a status constraint.
  it("leaves the other relation pickers unconstrained", async () => {
    record = { id: "reg-1", contestants: [] };

    const others = [
      ...(await renderFields(<TeamFormFields />)),
      ...(await renderFields(<RegistrationFormFields />)),
    ].filter(
      (input) =>
        input.props.reference != null &&
        input.props.reference !== "conference-contestants"
    );

    expect(others.length).toBeGreaterThan(0);
    for (const input of others) {
      expect(input.props.filter, input.props.reference).toBeUndefined();
    }
  });
});
