/** @vitest-environment jsdom */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const setFilters = vi.fn();

let filterValues: Record<string, any> = {};

vi.mock("react-admin", () => ({
  useListFilterContext: () => ({ filterValues, setFilters }),
  FilterList: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  FilterListItem: () => null,
}));

const conferenceContext: Record<string, any> = {};

vi.mock("../ConferenceContext", () => ({
  useConferenceContext: () => conferenceContext,
}));

import ConferenceAccordionFilter from "./ConferenceAccordionFilter";

const CONTESTANT_TAB = {
  selectedTab: "contestants",
  resource: "conference-contestants",
};

const ATTENDEE_TAB = {
  selectedTab: "attendees",
  resource: "conference-attendees",
};

let container: HTMLDivElement;
let root: Root;

/**
 * Rendered with this app's own React 18 rather than @testing-library/react,
 * which resolves from the workspace root's React 19.
 */
const render = async () => {
  await act(async () => {
    root.render(<ConferenceAccordionFilter conferenceYears={[2024, 2025]} />);
  });
};

/**
 * Move to another tab and back. In the app the list remounts on a tab change
 * and re-seeds its filters from the persisted view, which is what the second
 * argument stands in for here.
 */
const visitTab = async (
  tab: typeof CONTESTANT_TAB,
  seededFilters: Record<string, any>
) => {
  Object.assign(conferenceContext, tab);
  filterValues = seededFilters;
  await render();
};

/** Filters handed to the list by the most recent effect. */
const lastAppliedFilters = () => setFilters.mock.calls.at(-1)?.[0];

beforeEach(() => {
  setFilters.mockReset();
  filterValues = {};

  Object.assign(conferenceContext, {
    ...CONTESTANT_TAB,
    tickets: [],
    conferences: [],
    tabFilters: {
      contestants: { conference: 3, year: 2024 },
      attendees: { conference: 3, year: 2024 },
    },
    setTabFilters: vi.fn(),
  });

  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe("ConferenceAccordionFilter", () => {
  // The narrow-viewport filter applies the incoming tab's shared filters, which
  // carry no contestant status. Dropping the sentinel would leave the toggle
  // reading Cancelled while the list quietly showed every contestant.
  it("preserves an explicit cancelled sentinel when applying tab filters", async () => {
    filterValues = { conference: 3, year: 2024, status: "cancelled" };

    await render();

    expect(lastAppliedFilters()).toMatchObject({
      conference: 3,
      status: "cancelled",
    });
  });

  it("preserves the all sentinel across a tab round trip", async () => {
    await visitTab(CONTESTANT_TAB, {
      conference: 3,
      year: 2024,
      status: "all",
    });
    expect(lastAppliedFilters()).toMatchObject({ status: "all" });

    await visitTab(ATTENDEE_TAB, { conference: 3, year: 2024 });
    expect(lastAppliedFilters()).not.toHaveProperty("status");

    await visitTab(CONTESTANT_TAB, {
      conference: 3,
      year: 2024,
      status: "all",
    });
    expect(lastAppliedFilters()).toMatchObject({ status: "all" });
  });

  it("defaults the contestant list to the active view", async () => {
    filterValues = { conference: 3, year: 2024 };

    await render();

    expect(lastAppliedFilters()).toMatchObject({ status: "active" });
  });

  it("adds no status to lists that have none", async () => {
    Object.assign(conferenceContext, ATTENDEE_TAB);
    filterValues = { conference: 3, year: 2024 };

    await render();

    expect(lastAppliedFilters()).not.toHaveProperty("status");
  });
});
