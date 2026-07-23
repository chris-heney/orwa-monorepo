import { describe, expect, it } from "vitest";
import { boothHasExtras, getBoothExtras } from "./boothHasExtras";
import { IExtraOption } from "../types/types";

const boothExtra = {
  id: 1,
  context: "Booth",
  name: "Table",
  price_online: 50,
  price_event: 40,
} as unknown as IExtraOption;

const attendeeExtra = {
  id: 2,
  context: "Attendee",
  name: "Meal",
  price_online: 25,
  price_event: 20,
} as unknown as IExtraOption;

const freeKioskBoothExtra = {
  id: 3,
  context: "Booth",
  name: "Free sign",
  price_online: 10,
  price_event: 0,
} as unknown as IExtraOption;

describe("boothHasExtras", () => {
  it("returns false when there are no booth-context extras", () => {
    expect(boothHasExtras([attendeeExtra], "online")).toBe(false);
    expect(boothHasExtras([], "online")).toBe(false);
    expect(boothHasExtras(undefined, "online")).toBe(false);
  });

  it("returns true when booth extras exist for online", () => {
    expect(boothHasExtras([boothExtra, attendeeExtra], "online")).toBe(true);
  });

  it("hides zero-priced booth extras in kiosk mode", () => {
    expect(getBoothExtras([freeKioskBoothExtra], "kiosk")).toHaveLength(0);
    expect(boothHasExtras([freeKioskBoothExtra], "kiosk")).toBe(false);
    expect(boothHasExtras([boothExtra], "kiosk")).toBe(true);
  });
});
