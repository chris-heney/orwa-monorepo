import { afterEach, describe, expect, it, vi } from "vitest";

import { updateRecord } from "./updateRecord";

describe("updateRecord", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a backend error message when one is available", () => {
    const notify = vi.fn();
    const remove = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const update = vi.fn((_resource, _params, callbacks) => {
      callbacks.onError({ message: "Cancel and create a new contestant to change conference or ticket." });
    });

    updateRecord({}, { id: "contestant-1" }, update as never, notify, remove, "conference-contestants");

    expect(notify).toHaveBeenCalledWith(
      "Cancel and create a new contestant to change conference or ticket.",
      { type: "error" }
    );
  });
});
