// @vitest-environment jsdom
//
// Renders with react-dom directly (not @testing-library/react): the monorepo
// root's testing-library is bound to React 19, while react-admin 4 here runs
// on member-manager's React 18.
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AdminContext,
  Datagrid,
  ListContextProvider,
  NumberInput,
  TextField,
  TextInput,
  memoryStore,
  useList,
} from "react-admin";

vi.mock("../../rbac-manager/useCan", () => ({
  useCan: () => ({
    can: () => true,
    canOnResource: () => true,
    canAction: () => true,
    isLoading: false,
  }),
}));

import DatagridExpandEdit, { DatagridExpandProps } from "./DatagridExpandEdit";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const waitFor = async (assertion: () => void, timeout = 5000) => {
  const started = Date.now();
  for (;;) {
    try {
      assertion();
      return;
    } catch (error) {
      if (Date.now() - started > timeout) throw error;
      await act(async () => {
        await new Promise((r) => setTimeout(r, 20));
      });
    }
  }
};

const byText = (text: string) =>
  [...document.querySelectorAll<HTMLElement>("body *")].find(
    (el) => el.children.length === 0 && el.textContent?.trim() === text
  );

const inputValue = (name: string) =>
  (document.querySelector(`input[name="${name}"]`) as HTMLInputElement | null)
    ?.value;

// Fall Conference "Attendee" ticket as the list row and as getOne returns it
// (Strapi 5 gives null for empty relations).
const row = {
  id: "u8tm5i9svrz1fz0wgahip8k4",
  name: "Attendee",
  price_online: 150,
  price_event: 200,
  conferences: [3],
  includes: null,
  excludes: null,
};

const Grid = () => {
  const list = useList({ data: [row], resource: "conference-tickets" });
  return (
    <ListContextProvider value={list}>
      <Datagrid
        rowClick="expand"
        bulkActionButtons={false}
        expand={({ id }: DatagridExpandProps) => (
          <DatagridExpandEdit
            id={id}
            resource="conference-tickets"
            arrayFields={["conferences", "includes", "excludes"]}
          >
            <TextInput source="name" />
            <NumberInput source="price_online" />
            <NumberInput source="price_event" />
          </DatagridExpandEdit>
        )}
      >
        <TextField source="name" />
      </Datagrid>
    </ListContextProvider>
  );
};

let unmount: (() => void) | undefined;
afterEach(() => {
  act(() => unmount?.());
  document.body.innerHTML = "";
});

describe("DatagridExpandEdit", () => {
  it("shows progress, hydrates from the fetched record, and saves real ticket fields", async () => {
    let resolveGetOne: (value: { data: typeof row }) => void = () => {};
    const dataProvider = {
      getOne: vi.fn(
        () => new Promise<{ data: typeof row }>((r) => (resolveGetOne = r))
      ),
      update: vi.fn((_resource: string, params: { id: string; data: object }) =>
        Promise.resolve({ data: { ...params.data, id: params.id } })
      ),
      getList: vi.fn(() => Promise.resolve({ data: [], total: 0 })),
      getMany: vi.fn(() => Promise.resolve({ data: [] })),
      getManyReference: vi.fn(() => Promise.resolve({ data: [], total: 0 })),
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      updateMany: vi.fn(),
    };

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    unmount = () => root.unmount();
    act(() => {
      root.render(
        <AdminContext dataProvider={dataProvider as never} store={memoryStore()}>
          <Grid />
        </AdminContext>
      );
    });

    await waitFor(() => expect(byText("Attendee")).toBeTruthy());
    act(() => byText("Attendee")!.click());

    // Only the expanded row is fetched, and a loading bar shows meanwhile.
    await waitFor(() => expect(dataProvider.getOne).toHaveBeenCalledTimes(1));
    expect(dataProvider.getOne.mock.calls[0][1]).toMatchObject({ id: row.id });
    await waitFor(() =>
      expect(document.querySelector('[role="progressbar"]')).toBeTruthy()
    );
    expect(inputValue("name")).toBeUndefined();

    await act(async () => resolveGetOne({ data: row }));

    await waitFor(() => expect(inputValue("name")).toBe("Attendee"));
    expect(inputValue("price_online")).toBe("150");
    expect(inputValue("price_event")).toBe("200");

    const save = [...document.querySelectorAll("button")].find((b) =>
      /save/i.test(b.textContent ?? "")
    );
    expect(save).toBeTruthy();
    act(() => save!.click());

    await waitFor(() => expect(dataProvider.update).toHaveBeenCalledTimes(1));
    const [resource, params] = dataProvider.update.mock.calls[0] as unknown as [
      string,
      {
        id: string;
        data: Record<string, unknown>;
        previousData: Record<string, unknown>;
      }
    ];
    expect(resource).toBe("conference-tickets");
    expect(params.id).toBe(row.id);
    expect(params.data).toMatchObject({
      name: "Attendee",
      price_online: 150,
      price_event: 200,
      conferences: [3],
      includes: [],
      excludes: [],
    });
    // The DatagridRow props object must never leak into the payload.
    expect(params.data).not.toHaveProperty("record");
    expect(params.data).not.toHaveProperty("resource");
    expect(params.previousData).toMatchObject({ name: "Attendee" });
  });
});
