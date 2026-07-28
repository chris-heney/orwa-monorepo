import { describe, expect, it } from "vitest";
import { detectTestMode } from "./detectTestMode";

describe("detectTestMode", () => {
  it.each(["?test", "?test=", "?test=1", "?conference_id=3&test", "?test&admin="])(
    "is true for presence-only flag: %s",
    (search) => {
      expect(detectTestMode(search)).toBe(true);
    }
  );

  it.each(["", "?", "?conference_id=3", "?admin=", "?testing=1", "?contest=1"])(
    "is false when test param absent: %s",
    (search) => {
      expect(detectTestMode(search)).toBe(false);
    }
  );
});
