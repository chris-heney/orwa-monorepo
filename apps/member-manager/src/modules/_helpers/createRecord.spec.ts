import { afterEach, describe, expect, it, vi } from "vitest";

import { createRecord } from "./createRecord";

describe("createRecord", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a backend error message when one is available", () => {
    const notify = vi.fn();
    const setIsCreating = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const create = vi.fn((_resource, _params, callbacks) => {
      callbacks.onError({ message: "Selected ticket does not belong to the selected conference." });
    });

    createRecord({}, create as never, notify, setIsCreating, "conference-contestants");

    expect(notify).toHaveBeenCalledWith(
      "Selected ticket does not belong to the selected conference.",
      { type: "error" }
    );
  });
});
