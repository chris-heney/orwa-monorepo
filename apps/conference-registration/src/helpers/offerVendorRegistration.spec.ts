import { describe, expect, it } from "vitest";
import {
  boothsSoldOut,
  offerVendorRegistration,
} from "./offerVendorRegistration";

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

describe("offerVendorRegistration", () => {
  it("hides Vendor online once booths are sold out", () => {
    expect(offerVendorRegistration(0, "online", false)).toBe(false);
  });

  it("offers Vendor online while booths remain", () => {
    expect(offerVendorRegistration(3, "online", false)).toBe(true);
  });

  it("offers Vendor online before the conference has loaded", () => {
    expect(offerVendorRegistration(undefined, "online", false)).toBe(true);
  });

  it("always offers Vendor at the kiosk (reps join existing booths)", () => {
    expect(offerVendorRegistration(0, "kiosk", false)).toBe(true);
  });

  it("always offers Vendor to a logged-in admin", () => {
    expect(offerVendorRegistration(0, "online", true)).toBe(true);
  });
});
