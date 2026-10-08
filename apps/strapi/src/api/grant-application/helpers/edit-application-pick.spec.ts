import { describe, expect, it } from "vitest";
import {
  contactEmails,
  pickApplicationForEdit,
  pickEditableSibling,
  switchedApplicationNotice,
} from "./edit-application-pick";

const app = (
  documentId: string,
  status: string,
  legal_entity_name = "Gans Utility Authority"
) => ({
  documentId,
  legal_entity_name,
  application_id: documentId,
  status: { name: status },
});

describe("pickApplicationForEdit", () => {
  it("skips a newer locked application and returns the still-editable one", () => {
    const picked = pickApplicationForEdit([
      app("20502", "Not Approved"),
      app("20351", "New Application"),
    ]);
    expect(picked?.documentId).toBe("20351");
  });

  it("returns the newest New Application when several are still editable", () => {
    const picked = pickApplicationForEdit([
      app("20502", "New Application"),
      app("20351", "New Application"),
    ]);
    expect(picked?.documentId).toBe("20502");
  });

  it("returns the newest locked application when none are editable", () => {
    const picked = pickApplicationForEdit([
      app("20502", "Not Approved"),
      app("20351", "Withdrawn"),
    ]);
    expect(picked?.documentId).toBe("20502");
  });

  it("returns null when the email matches nothing", () => {
    expect(pickApplicationForEdit([])).toBeNull();
  });
});

describe("pickEditableSibling", () => {
  const locked = {
    ...app("20502", "Not Approved"),
    point_of_contact: { email: "Ha***@Diamondnet.us" },
    chairman: { email: "ga@gmail.com" },
    engineer: null,
    additional_contacts: [],
  };

  it("opens the same utility's New Application", () => {
    const sibling = pickEditableSibling(locked, [
      locked,
      app("20351", "New Application"),
    ]);
    expect(sibling?.documentId).toBe("20351");
  });

  it("does not open a different utility that shares a contact", () => {
    const sibling = pickEditableSibling(locked, [
      app("99999", "New Application", "Other Rural Water"),
    ]);
    expect(sibling).toBeNull();
  });

  it("does not treat a missing legal name as a match-all", () => {
    const sibling = pickEditableSibling(
      { ...locked, legal_entity_name: "  " },
      [app("20351", "New Application")]
    );
    expect(sibling).toBeNull();
  });
});

describe("contactEmails", () => {
  it("dedupes and lowercases every contact role", () => {
    expect(
      contactEmails({
        point_of_contact: { email: " Ha@Diamondnet.us " },
        chairman: { email: "ga@gmail.com" },
        engineer: { email: "ha@diamondnet.us" },
        additional_contacts: [{ email: "GA@gmail.com" }, { email: "" }, null],
      })
    ).toEqual(["ha@diamondnet.us", "ga@gmail.com"]);
  });
});

describe("switchedApplicationNotice", () => {
  it("names both applications and the status that blocked the first", () => {
    expect(
      switchedApplicationNotice(
        { application_id: 20502, status: { name: "Not Approved" } },
        { application_id: 20351 }
      )
    ).toBe(
      "Application #20502 is Not Approved, so it can no longer be modified. This form is application #20351, which is still a New Application."
    );
  });
});
