import { describe, expect, it } from "vitest";
import { boothBasePrice } from "./boothBasePrice";

describe("boothBasePrice", () => {
  const conference = { booth_price: 500, booth_price_2: 350 };

  it("uses primary price for index 0", () => {
    expect(boothBasePrice(conference, 0)).toBe(500);
  });

  it("uses positive booth_price_2 for additional booths", () => {
    expect(boothBasePrice(conference, 1)).toBe(350);
    expect(boothBasePrice(conference, 3)).toBe(350);
  });

  it("falls back to primary when booth_price_2 is null/undefined/0/NaN", () => {
    expect(boothBasePrice({ booth_price: 500, booth_price_2: null }, 1)).toBe(
      500
    );
    expect(
      boothBasePrice({ booth_price: 500, booth_price_2: undefined }, 2)
    ).toBe(500);
    expect(boothBasePrice({ booth_price: 500, booth_price_2: 0 }, 1)).toBe(
      500
    );
    expect(boothBasePrice({ booth_price: 500, booth_price_2: NaN }, 1)).toBe(
      500
    );
  });

  it("returns 0 when conference or prices are missing", () => {
    expect(boothBasePrice(undefined, 0)).toBe(0);
    expect(boothBasePrice({ booth_price: null, booth_price_2: null }, 1)).toBe(
      0
    );
  });
});
