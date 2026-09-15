// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);

const state = vi.hoisted(() => ({ tier: "event" as "online" | "event" }));

// A draft saved during early pricing: the Attendee line still carries $150.
const values = {
  tickets: [
    {
      type: "Attendee",
      price: 150,
      extras: [],
      first: "Pat",
      last: "Doe",
      ticket_type: { id: 32, name: "Attendee", price_online: 150, price_event: 200 },
    },
  ],
  booths: [],
  sponsors: [],
  registrationExtrasIds: [],
  registrationAddonIds: [],
  agency: "true",
  member_status: "Member",
};

vi.mock("react-hook-form", () => ({
  useFormContext: () => ({
    getValues: (key?: string) =>
      key ? (values as Record<string, unknown>)[key] : values,
    watch: (key: string) => (values as Record<string, unknown>)[key],
  }),
}));

vi.mock("../AppContextProvider", () => ({
  useRegistrationOptions: () => ({
    ConferenceOptions: { non_member_fee: 1000, booth_price: 500 },
    ExtraOptions: [],
    RegistrationAddons: [],
  }),
  usePriceTier: () => state.tier,
}));

import CheckoutReceipt from "./CheckoutReciept";

describe("CheckoutReceipt pricing", () => {
  it("charges and shows the event price once early pricing has ended", () => {
    state.tier = "event";
    render(<CheckoutReceipt />);
    expect(screen.getAllByText("$200.00").length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText("$150.00")).toBeNull();
  });

  it("keeps the online price while early pricing is open", () => {
    state.tier = "online";
    render(<CheckoutReceipt />);
    expect(screen.getAllByText("$150.00").length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText("$200.00")).toBeNull();
  });
});
