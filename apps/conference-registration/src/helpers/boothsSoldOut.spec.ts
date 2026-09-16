import { describe, expect, it } from "vitest";
import { boothsSoldOut } from "./boothsSoldOut";

describe("boothsSoldOut", () => {
  it("is true at zero or below", () => {
    expect(boothsSoldOut(0)).toBe(true);
    expect(boothsSoldOut(-1)).toBe(true);
  });

  it("is false while booths remain", () => {
    expect(boothsSoldOut(1)).toBe(false);
    expect(boothsSoldOut(40)).toBe(false);
  });

  it("treats an unloaded count as not sold out", () => {
    expect(boothsSoldOut(undefined)).toBe(false);
    expect(boothsSoldOut(null)).toBe(false);
  });
});
