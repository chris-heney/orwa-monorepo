import { beforeEach, describe, expect, it, vi } from "vitest";

const testState = vi.hoisted(() => ({
  strapi: {},
  sanitizeOutput: vi.fn(),
  sanitizeInput: vi.fn(),
  transformResponse: vi.fn(),
}));

vi.mock("@strapi/strapi", () => ({
  factories: {
    createCoreController: vi.fn((_uid: string, extension?: (args: { strapi: unknown }) => any) => {
      const controller: Record<string, unknown> = {
        sanitizeOutput: testState.sanitizeOutput,
        sanitizeInput: testState.sanitizeInput,
        transformResponse: testState.transformResponse,
      };
      const extensionMethods = extension?.({ strapi: testState.strapi }) ?? {};

      for (const [key, value] of Object.entries(extensionMethods)) {
        controller[key] =
          typeof value === "function" ? value.bind(controller) : value;
      }

      return controller;
    }),
  },
}));

vi.mock("../services/contestant-cancellation", () => ({
  cancelContestant: vi.fn(),
  restoreContestant: vi.fn(),
}));

vi.mock("../services/conference-contestant", () => ({
  createContestant: vi.fn(),
  updateContestant: vi.fn(),
}));

import controller from "./conference-contestant";
import {
  cancelContestant,
  restoreContestant,
} from "../services/contestant-cancellation";
import {
  createContestant,
  updateContestant,
} from "../services/conference-contestant";
import { ContestantDomainError } from "../services/contestant-domain-error";

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
    vi.mocked(createContestant).mockResolvedValue({
      documentId: "contestant-2",
      status: "active",
    } as any);
    vi.mocked(updateContestant).mockResolvedValue({
      documentId: "contestant-1",
      status: "active",
    } as any);
    testState.sanitizeOutput.mockImplementation(async (entity) => ({
      sanitized: entity,
    }));
    testState.sanitizeInput.mockImplementation(async (data) => data);
    testState.transformResponse.mockImplementation((sanitized) => ({
      data: sanitized,
    }));
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

    const response = await (controller as any).cancel(request);

    expect(cancelContestant).toHaveBeenCalledWith(
      testState.strapi,
      expect.objectContaining({
        documentId: "contestant-1",
        reason: "Golf overage",
        actor: "staff@example.org",
      })
    );
    expect(response).toEqual({
      data: {
        sanitized: {
          documentId: "contestant-1",
          status: "cancelled",
        },
      },
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

    const response = await (controller as any).restore(request);

    expect(restoreContestant).toHaveBeenCalledWith(
      testState.strapi,
      expect.objectContaining({
        documentId: "contestant-1",
        reason: "Refund reversed",
      })
    );
    expect(response).toEqual({
      data: {
        sanitized: {
          documentId: "contestant-1",
          status: "active",
        },
      },
    });
  });

  it("creates contestants through the lifecycle service", async () => {
    const request = ctx({ data: { first: "Ada", conference_ticket: "golfer" } });

    const response = await (controller as any).create(request);

    expect(createContestant).toHaveBeenCalledWith(testState.strapi, {
      data: { first: "Ada", conference_ticket: "golfer" },
    });
    expect(response).toEqual({
      data: {
        sanitized: {
          documentId: "contestant-2",
          status: "active",
        },
      },
    });
  });

  it("sanitizes custom create and update input before service calls", async () => {
    testState.sanitizeInput
      .mockResolvedValueOnce({ first: "Sanitized Create" })
      .mockResolvedValueOnce({ first: "Sanitized Update" });

    await (controller as any).create(ctx({ data: { first: "Raw Create" } }));
    await (controller as any).update(ctx({ data: { first: "Raw Update" } }));

    expect(testState.sanitizeInput).toHaveBeenNthCalledWith(
      1,
      { first: "Raw Create" },
      expect.anything()
    );
    expect(testState.sanitizeInput).toHaveBeenNthCalledWith(
      2,
      { first: "Raw Update" },
      expect.anything()
    );
    expect(createContestant).toHaveBeenCalledWith(testState.strapi, {
      data: { first: "Sanitized Create" },
    });
    expect(updateContestant).toHaveBeenCalledWith(testState.strapi, {
      documentId: "contestant-1",
      data: { first: "Sanitized Update" },
    });
  });

  it("updates contestants through the lifecycle service", async () => {
    const request = ctx({ data: { first: "Grace" } });

    await (controller as any).update(request);

    expect(updateContestant).toHaveBeenCalledWith(testState.strapi, {
      documentId: "contestant-1",
      data: { first: "Grace" },
    });
  });

  it("maps direct create/update lifecycle errors without leaking internals", async () => {
    const createRequest = ctx({ data: { status: "cancelled" } });
    vi.mocked(createContestant).mockRejectedValueOnce(
      new Error("Lifecycle fields must use cancel/restore actions")
    );

    await (controller as any).create(createRequest);

    expect(createRequest.badRequest).toHaveBeenCalledWith(
      "Unable to update conference contestant."
    );

    const updateRequest = ctx({ data: { conference_ticket: "other" } });
    vi.mocked(updateContestant).mockRejectedValueOnce(
      new Error("Cancel and create a new contestant to change conference or ticket.")
    );

    await (controller as any).update(updateRequest);

    expect(updateRequest.badRequest).toHaveBeenCalledWith(
      "Unable to update conference contestant."
    );
  });

  it("maps typed direct-write validation errors to public 400 and 404 messages", async () => {
    const mismatchRequest = ctx({ data: { conference_ticket: "other" } });
    vi.mocked(createContestant).mockRejectedValueOnce(
      new ContestantDomainError(
        400,
        "Selected ticket does not belong to the selected conference."
      )
    );

    await (controller as any).create(mismatchRequest);

    expect(mismatchRequest.badRequest).toHaveBeenCalledWith(
      "Selected ticket does not belong to the selected conference."
    );

    const missingRequest = ctx({ data: { conference: "missing" } });
    vi.mocked(createContestant).mockRejectedValueOnce(
      new ContestantDomainError(404, "Selected conference was not found.")
    );

    await (controller as any).create(missingRequest);

    expect(missingRequest.notFound).toHaveBeenCalledWith(
      "Selected conference was not found."
    );
  });

  it("returns the plain-language capacity message for direct create/restore", async () => {
    const message =
      "The golf tournament is sold out — no golfer spots remain. Please remove the golfer entries and try again.";
    const createRequest = ctx({ data: { conference_ticket: "golfer" } });
    vi.mocked(createContestant).mockRejectedValueOnce(Object.assign(new Error(message), {
      name: "ContestantCapacityError",
    }));

    await (controller as any).create(createRequest);

    expect(createRequest.conflict).toHaveBeenCalledWith(message);

    const restoreRequest = ctx({ reason: "Restore slot" });
    vi.mocked(restoreContestant).mockRejectedValueOnce(Object.assign(new Error(message), {
      name: "ContestantCapacityError",
    }));

    await (controller as any).restore(restoreRequest);

    expect(restoreRequest.conflict).toHaveBeenCalledWith(message);
  });

  it("maps limited-remaining capacity messages as controlled conflicts", async () => {
    const message =
      "Only 1 golfer spot remains for the golf tournament, but this registration includes 2 golfers. Please remove 1 golfer entry and try again.";
    const createRequest = ctx({ data: { conference_ticket: "golfer" } });
    vi.mocked(createContestant).mockRejectedValueOnce(Object.assign(new Error(message), {
      name: "ContestantCapacityError",
    }));

    await (controller as any).create(createRequest);

    expect(createRequest.conflict).toHaveBeenCalledWith(message);
  });

  it("sanitizes and transforms the cancelled contestant response", async () => {
    const request = ctx({ reason: "Golf overage" });
    const entity = {
      documentId: "contestant-1",
      status: "cancelled",
      privateAuditField: "internal",
    };
    const sanitized = { documentId: "contestant-1", status: "cancelled" };
    const transformed = { data: { id: "contestant-1", attributes: sanitized } };
    vi.mocked(cancelContestant).mockResolvedValueOnce(entity as any);
    testState.sanitizeOutput.mockResolvedValueOnce(sanitized);
    testState.transformResponse.mockReturnValueOnce(transformed);

    const response = await (controller as any).cancel(request);

    expect(testState.sanitizeOutput).toHaveBeenCalledWith(entity, request);
    expect(testState.transformResponse).toHaveBeenCalledWith(sanitized);
    expect(response).toEqual(transformed);
  });

  it("sanitizes and transforms the restored contestant response", async () => {
    const request = ctx({ reason: "Refund reversed" });
    const entity = {
      documentId: "contestant-1",
      status: "active",
      privateAuditField: "internal",
    };
    const sanitized = { documentId: "contestant-1", status: "active" };
    const transformed = { data: { id: "contestant-1", attributes: sanitized } };
    vi.mocked(restoreContestant).mockResolvedValueOnce(entity as any);
    testState.sanitizeOutput.mockResolvedValueOnce(sanitized);
    testState.transformResponse.mockReturnValueOnce(transformed);

    const response = await (controller as any).restore(request);

    expect(testState.sanitizeOutput).toHaveBeenCalledWith(entity, request);
    expect(testState.transformResponse).toHaveBeenCalledWith(sanitized);
    expect(response).toEqual(transformed);
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
