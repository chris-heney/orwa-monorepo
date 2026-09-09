// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const notify = vi.fn();
const submitRegistration = vi.fn();
const setViewingEntries = vi.fn();
const setSidebarVisible = vi.fn();
const updateAdminOptions = vi.fn();

vi.mock("mj-react-form-builder", () => ({
  useNotify: () => ({ notify }),
}));

vi.mock("../data/API", () => ({
  useSubmitRegistration2: (payload: unknown) => submitRegistration(payload),
}));

vi.mock("../helpers/processAndUploadFiles", () => ({
  isUnresolvedUpload: () => false,
  processAndUploadFiles: async (payload: unknown) => payload,
}));

vi.mock("../helpers/calculateSubtotal", () => ({
  calculateSubtotal: () => 100,
}));

vi.mock("react-hook-form", () => ({
  useFormContext: () => ({
    getValues: (key?: string) => {
      const values: Record<string, unknown> = {
        paymentData: { cardNumber: "4111 1111 1111 1111", expirationDate: "12/26" },
        "paymentData.cardNumber": "4111 1111 1111 1111",
        "paymentData.expirationDate": "12/26",
      };
      return key ? values[key] : values;
    },
  }),
}));

vi.mock("../AppContextProvider", () => ({
  useRegistrationOptions: () => ({
    ConferenceOptions: { non_member_fee: 0 },
    ExtraOptions: [],
  }),
  useRegistrationSource: () => "online",
  useUserContext: () => ({ setViewingEntries }),
}));

vi.mock("../providers/EntryListProvider", () => ({
  useEntryList: () => ({
    adminOptions: {
      resubmit: true,
      registrantNotification: true,
      adminNotification: true,
      customEmail: "",
    },
    updateAdminOptions,
    selectedSubmission: {
      resource: "conference-registrations",
      data: {
        documentId: "reg-doc-1",
        organization: "ORWA Test",
        paymentData: {},
        sponsors: [],
      },
    },
    setSidebarVisible,
  }),
}));

import EntryListSidebar from "./EntryListSidebar";

describe("EntryListSidebar payment risk guard", () => {
  it("locks the selected entry and prevents a second webhook call after payment risk response", async () => {
    submitRegistration.mockResolvedValueOnce({
      result: "error",
      paymentMayHaveSucceeded: true,
      message: "Registration did not complete.",
    });

    render(<EntryListSidebar />);

    const button = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(submitRegistration).toHaveBeenCalledTimes(1);
      expect(
        (screen.getByRole("button", { name: "Contact ORWA" }) as HTMLButtonElement)
          .disabled
      ).toBe(true);
    });

    fireEvent.click(screen.getByRole("button", { name: "Contact ORWA" }));

    expect(submitRegistration).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining("duplicate charge"),
      "error"
    );
    expect(setViewingEntries).not.toHaveBeenCalled();
  });
});
