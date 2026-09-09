/** @vitest-environment jsdom */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const notify = vi.fn();
const refresh = vi.fn();
const invalidateResourceCache = vi.fn();

vi.mock("react-admin", () => ({
  useNotify: () => notify,
  useRefresh: () => refresh,
  useDataProvider: () => ({ invalidateResourceCache }),
}));

vi.mock("../../rbac-manager/useCan", () => ({
  useCan: () => ({
    can: () => true,
    canOnResource: () => true,
    canAction: () => true,
    isLoading: false,
  }),
}));

vi.mock("../../../helpers/ra-strapi-data-provider/src/httpClient", () => ({
  default: vi.fn(),
}));

import httpClient from "../../../helpers/ra-strapi-data-provider/src/httpClient";
import ContestantCancellationActions from "./ContestantCancellationActions";

const mockedHttpClient = vi.mocked(httpClient);

const activeContestant = { id: "abc123", status: "active" };

let container: HTMLDivElement;
let root: Root;

/**
 * Rendered with this app's own React 18 rather than @testing-library/react,
 * which resolves from the workspace root's React 19 and cannot render these
 * elements.
 */
const renderActions = async () => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  await act(async () => {
    root.render(<ContestantCancellationActions record={activeContestant} />);
  });
};

const buttonsLabelled = (label: string): HTMLButtonElement[] =>
  Array.from(document.body.querySelectorAll("button")).filter(
    (button) => button.textContent?.trim() === label
  );

const click = async (element: Element) => {
  await act(async () => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
};

/** React tracks its own value, so a plain assignment is ignored. */
const typeInto = async (element: HTMLTextAreaElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    "value"
  )!.set!;
  setter.call(element, value);

  await act(async () => {
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const bodyText = () => document.body.textContent ?? "";

/** Poll an assertion, e.g. while a MUI dialog plays its close transition. */
const waitFor = async (assertion: () => void, timeoutMs = 2000) => {
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    try {
      assertion();
      return;
    } catch (error) {
      if (Date.now() > deadline) throw error;
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });
    }
  }
};

const toastsOfType = (type: string) =>
  notify.mock.calls.filter(([, options]) => options?.type === type);

/** Open the confirm dialog, give a reason, and confirm. */
const cancelContestant = async () => {
  await click(buttonsLabelled("Cancel")[0]);

  const reason = document.body.querySelector("textarea");
  await typeInto(reason as HTMLTextAreaElement, "Player withdrew");

  // Both the row trigger and the dialog's confirm button read "Cancel".
  await click(buttonsLabelled("Cancel").at(-1)!);
};

beforeEach(() => {
  notify.mockReset();
  refresh.mockReset();
  invalidateResourceCache.mockReset();
  mockedHttpClient.mockReset();
  invalidateResourceCache.mockResolvedValue(undefined);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe("ContestantCancellationActions", () => {
  it("reports success and repaints when everything works", async () => {
    mockedHttpClient.mockResolvedValue({} as never);

    await renderActions();
    await cancelContestant();

    expect(toastsOfType("success")).toHaveLength(1);
    expect(toastsOfType("error")).toHaveLength(0);
    expect(invalidateResourceCache).toHaveBeenCalledWith("conference-contestants");
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  // The write is already committed by this point. Reporting a repaint problem
  // as a failure is what previously showed "the dataProvider threw an error"
  // over a successful cancellation, tempting the operator to cancel again.
  it("still reports success when cache invalidation fails", async () => {
    mockedHttpClient.mockResolvedValue({} as never);
    invalidateResourceCache.mockRejectedValue(new Error("cache exploded"));

    await renderActions();
    await cancelContestant();

    expect(toastsOfType("success")).toHaveLength(1);
    expect(toastsOfType("error")).toHaveLength(0);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(mockedHttpClient).toHaveBeenCalledTimes(1);
  });

  it("still reports success when the refresh itself throws", async () => {
    mockedHttpClient.mockResolvedValue({} as never);
    refresh.mockImplementation(() => {
      throw new Error("refresh exploded");
    });

    await renderActions();
    await cancelContestant();

    expect(toastsOfType("success")).toHaveLength(1);
    expect(toastsOfType("error")).toHaveLength(0);
    expect(mockedHttpClient).toHaveBeenCalledTimes(1);
  });

  it("closes the dialog after a success even when the repaint fails", async () => {
    mockedHttpClient.mockResolvedValue({} as never);
    invalidateResourceCache.mockRejectedValue(new Error("cache exploded"));

    await renderActions();
    await cancelContestant();

    await waitFor(() => expect(bodyText()).not.toContain("Cancel contestant?"));
  });

  it("reports a genuine write failure and keeps the dialog open for a retry", async () => {
    mockedHttpClient.mockRejectedValue(new Error("Golf capacity is full."));

    await renderActions();
    await cancelContestant();

    expect(toastsOfType("error")).toHaveLength(1);
    expect(toastsOfType("error")[0][0]).toBe("Golf capacity is full.");
    expect(toastsOfType("success")).toHaveLength(0);
    expect(refresh).not.toHaveBeenCalled();
    expect(bodyText()).toContain("Cancel contestant?");
  });
});
