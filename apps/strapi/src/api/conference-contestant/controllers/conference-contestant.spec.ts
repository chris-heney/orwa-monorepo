import { beforeEach, describe, expect, it, vi } from "vitest";

const testState = vi.hoisted(() => ({
  strapi: {},
}));

vi.mock("@strapi/strapi", () => ({
  factories: {
    createCoreController: vi.fn(
      (_uid: string, extension?: (args: { strapi: unknown }) => unknown) =>
        extension?.({ strapi: testState.strapi }) ?? {}
    ),
  },
}));

vi.mock("../services/contestant-cancellation", () => ({
  cancelContestant: vi.fn(),
  restoreContestant: vi.fn(),
}));

import controller from "./conference-contestant";
import {
  cancelContestant,
  restoreContestant,
} from "../services/contestant-cancellation";

const ctx = (
  body: Record<string, unknown> = {},
  state: Record<string, unknown> = {},
  params: Record<string, unknown> = { documentId: "contestant-1" }
) =>
  ({
    params,
    request: { body },
    state,
    body: undefined,
    badRequest: vi.fn(),
    conflict: vi.fn(),
    methodNotAllowed: vi.fn(),
    notFound: vi.fn(),
    internalServerError: vi.fn(),
  } as any);

describe("conference contestant controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cancelContestant).mockResolvedValue({
      documentId: "contestant-1",
      status: "cancelled",
    } as any);
    vi.mocked(restoreContestant).mockResolvedValue({
      documentId: "contestant-1",
      status: "active",
    } as any);
  });

  it("requires a cancellation reason", async () => {
    const request = ctx({ reason: " " });

    await (controller as any).cancel(request);

    expect(request.badRequest).toHaveBeenCalledWith("reason is required");
    expect(cancelContestant).not.toHaveBeenCalled();
  });

  it("passes the authenticated actor to the service", async () => {
    const request = ctx(
      { reason: "Golf overage" },
      {
        user: { email: "staff@example.org" },
      }
    );

    await (controller as any).cancel(request);

    expect(cancelContestant).toHaveBeenCalledWith(
      testState.strapi,
      expect.objectContaining({
        documentId: "contestant-1",
        reason: "Golf overage",
        actor: "staff@example.org",
      })
    );
    expect(request.body).toEqual({
      documentId: "contestant-1",
      status: "cancelled",
    });
  });

  it("falls back from user email to username then API token name", async () => {
    const usernameRequest = ctx(
      { reason: "Duplicate entry" },
      { user: { username: "orwa-staff" } }
    );
    const tokenRequest = ctx(
      { reason: "Duplicate entry" },
      { auth: { credentials: { name: "registration-admin-token" } } }
    );

    await (controller as any).cancel(usernameRequest);
    await (controller as any).cancel(tokenRequest);

    expect(cancelContestant).toHaveBeenNthCalledWith(
      1,
      testState.strapi,
      expect.objectContaining({ actor: "orwa-staff" })
    );
    expect(cancelContestant).toHaveBeenNthCalledWith(
      2,
      testState.strapi,
      expect.objectContaining({ actor: "registration-admin-token" })
    );
  });

  it("leaves the actor null when no real identity is available", async () => {
    const request = ctx({ reason: "Duplicate entry" });

    await (controller as any).cancel(request);

    expect(cancelContestant).toHaveBeenCalledWith(
      testState.strapi,
      expect.objectContaining({ actor: null })
    );
  });

  it("restores a contestant through the cancellation service", async () => {
    const request = ctx({ reason: "Refund reversed" });

    await (controller as any).restore(request);

    expect(restoreContestant).toHaveBeenCalledWith(
      testState.strapi,
      expect.objectContaining({
        documentId: "contestant-1",
        reason: "Refund reversed",
      })
    );
    expect(request.body).toEqual({
      documentId: "contestant-1",
      status: "active",
    });
  });

  it("maps known service errors without leaking internal messages", async () => {
    const missingRequest = ctx({ reason: "Duplicate entry" });
    vi.mocked(cancelContestant).mockRejectedValueOnce(
      new Error("Conference contestant not found.")
    );

    await (controller as any).cancel(missingRequest);

    expect(missingRequest.notFound).toHaveBeenCalledWith(
      "Conference contestant not found."
    );

    const capacityRequest = ctx({ reason: "Refund reversed" });
    vi.mocked(restoreContestant).mockRejectedValueOnce(
      new Error("Golf contestant capacity is sold out: available_contestants=0")
    );

    await (controller as any).restore(capacityRequest);

    expect(capacityRequest.conflict).toHaveBeenCalledWith(
      "Conference contestant capacity is unavailable."
    );
  });

  it("rejects generic hard deletion", async () => {
    const request = ctx();

    await (controller as any).delete(request);

    expect(request.methodNotAllowed).toHaveBeenCalledWith(
      "Conference contestants must be cancelled, not deleted."
    );
  });
});
