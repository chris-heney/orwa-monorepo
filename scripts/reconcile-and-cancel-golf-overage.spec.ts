import { describe, expect, it, vi } from "vitest";

import {
  EXPECTED_ACTIVE_AFTER,
  EXPECTED_ACTIVE_BEFORE,
  EXPECTED_AVAILABLE_AFTER,
  EXPECTED_AVAILABLE_BEFORE,
  EXPECTED_CANCELLED_GOLFERS,
  REQUIRED_REGISTRATION_IDS,
  REQUIRED_REASON,
  TARGET_CONFERENCE,
  createStrapiApiClient,
  expectedAfter,
  renderAuditMarkdown,
  resolveApiConfig,
  parseCliArgs,
  reconciledAvailability,
  runGolfOverageOperation,
  validateTargets,
} from "./reconcile-and-cancel-golf-overage";

const cancelledAt = "2026-09-08T22:00:00.000Z";

const makeGolfer = (
  suffix: string,
  overrides: Partial<{
    documentId: string;
    status: string;
    ticketName: string;
    fee: number;
    items: Array<Record<string, unknown>>;
    cancelled_reason: string | null;
    cancelled_at: string | null;
    cancelled_by: string | null;
    conference: { id: number; documentId: string; name: string } | null;
    year: number;
  }> = {}
) => ({
  id: 1000 + Number(suffix.replace(/\D/g, "") || 0),
  documentId: overrides.documentId ?? `contestant-${suffix}`,
  status: overrides.status ?? "active",
  year: overrides.year ?? 2026,
  first: `First${suffix}`,
  last: `Last${suffix}`,
  fee: overrides.fee ?? 150,
  items: overrides.items ?? [
    {
      key: "mulligans",
      label: "Mulligans",
      value: "2",
      selection: "Two Mulligans",
      item: { documentId: "extra-mulligans", name: "Mulligans" },
    },
  ],
  cancelled_at: overrides.cancelled_at ?? null,
  cancelled_reason: overrides.cancelled_reason ?? null,
  cancelled_by: overrides.cancelled_by ?? null,
  conference: overrides.conference ?? {
    id: TARGET_CONFERENCE.id,
    documentId: TARGET_CONFERENCE.documentId,
    name: TARGET_CONFERENCE.name,
  },
  conference_ticket: {
    documentId: `ticket-${suffix}`,
    name: overrides.ticketName ?? "Golfer - Contestant Only",
    context: "Contestant",
  },
});

const makeRegistration = (id: number, offset: number) => ({
  id,
  documentId: `registration-${id}`,
  year: 2026,
  organization: `Water System ${id}`,
  total: 600,
  payment_method: "Credit Card",
  wp_eid: id + 50000,
  passport_id: id + 60000,
  contestants: [0, 1, 2, 3].map((index) =>
    makeGolfer(`${id}-${index + offset}`)
  ),
});

const fixtureSnapshot = (alreadyCancelled = 0) => {
  let cancelled = 0;
  const conference = {
    ...TARGET_CONFERENCE,
    available_contestants: reconciledAvailability(
      36,
      EXPECTED_ACTIVE_BEFORE - alreadyCancelled
    ),
  };
  const registrations = REQUIRED_REGISTRATION_IDS.map((id, index) =>
    ({
      ...makeRegistration(id, index * 10),
      conference,
    })
  );
  for (const registration of registrations) {
    for (const contestant of registration.contestants) {
      if (cancelled >= alreadyCancelled) continue;
      contestant.status = "cancelled";
      contestant.cancelled_at = cancelledAt;
      contestant.cancelled_reason = REQUIRED_REASON;
      contestant.cancelled_by = "registration-admin-token";
      cancelled += 1;
    }
  }
  return {
    conference,
    registrations,
    activeGolferCount: EXPECTED_ACTIVE_BEFORE - alreadyCancelled,
  };
};

const completedSnapshot = () => {
  const snapshot = fixtureSnapshot(EXPECTED_CANCELLED_GOLFERS);
  snapshot.conference.available_contestants = EXPECTED_AVAILABLE_AFTER;
  snapshot.activeGolferCount = EXPECTED_ACTIVE_AFTER;
  return snapshot;
};

const makeClient = (snapshots: ReturnType<typeof fixtureSnapshot>[]) => ({
  fetchSnapshot: vi.fn(async () => {
    const next = snapshots.shift();
    if (!next) throw new Error("unexpected snapshot fetch");
    return next;
  }),
  fetchConferenceAvailability: vi.fn(async () => EXPECTED_AVAILABLE_BEFORE),
  readinessCheck: vi.fn(async () => ({ ok: true })),
  updateConferenceAvailability: vi.fn(async (_documentId: string, value: number) => ({
    documentId: "fall-conference-2026",
    available_contestants: value,
  })),
  cancelContestant: vi.fn(async (documentId: string) => ({
    documentId,
    status: "cancelled",
    cancelled_at: cancelledAt,
    cancelled_reason: REQUIRED_REASON,
    fee: 150,
    items: [{ key: "mulligans", label: "Mulligans", value: "2" }],
  })),
});

describe("golf overage reconciliation guards", () => {
  it("uses the exact approved cancellation reason with an em dash", () => {
    expect(REQUIRED_REASON).toBe("2026 Fall golf overage — pending card refund");
  });

  it("pins the approved Fall conference identity in the operation", () => {
    expect(TARGET_CONFERENCE).toEqual({
      id: 3,
      documentId: "s55n2bz60qx2c2cxg7mb6jx5",
      name: "Fall Conference",
    });
  });

  it("refuses any registration outside the fixed allowlist", () => {
    expect(() => validateTargets([16781, 99999])).toThrow("not authorized");
  });

  it("requires the exact fixed allowlist", () => {
    expect(() => validateTargets([16781, 16792])).toThrow(
      "exactly 16781, 16792, 16817"
    );
    expect(validateTargets([16817, 16781, 16792])).toEqual(
      REQUIRED_REGISTRATION_IDS
    );
  });

  it("derives available slots from active golfers", () => {
    expect(reconciledAvailability(36, 59)).toBe(-23);
  });

  it("expects 47 active golfers and -11 availability after 12 cancellations", () => {
    expect(
      expectedAfter({
        maximum: 36,
        activeBefore: 59,
        cancelled: 12,
      })
    ).toEqual({ activeAfter: 47, availableAfter: -11 });
  });
});

describe("golf overage reconciliation operation", () => {
  it("dry-runs the 12 allowed cancellations without writes", async () => {
    const client = makeClient([fixtureSnapshot()]);
    const writeAudit = vi.fn();

    const result = await runGolfOverageOperation({
      apply: false,
      client,
      writeAudit,
    });

    expect(result.mode).toBe("dry-run");
    expect(result.cancelRequests).toHaveLength(EXPECTED_CANCELLED_GOLFERS);
    expect(result.before.activeGolferCount).toBe(EXPECTED_ACTIVE_BEFORE);
    expect(result.before.availableContestants).toBe(EXPECTED_AVAILABLE_BEFORE);
    expect(result.after.activeGolferCount).toBe(EXPECTED_ACTIVE_AFTER);
    expect(result.after.availableContestants).toBe(EXPECTED_AVAILABLE_AFTER);
    expect(result.after.registrations[0].activeGolfers).toBe(0);
    expect(result.after.registrations[0].cancelledGolfers).toBe(4);
    expect(result.after.registrations[0].golfers[0]).toMatchObject({
      status: "cancelled",
      cancelled_reason: REQUIRED_REASON,
    });
    expect(client.updateConferenceAvailability).not.toHaveBeenCalled();
    expect(client.cancelContestant).not.toHaveBeenCalled();
    expect(writeAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        before: expect.any(Object),
        plannedCancelRequests: expect.arrayContaining([
          expect.objectContaining({ reason: expect.stringContaining("pending card refund") }),
        ]),
      })
    );
  });

  it("extracts Mulligans from key and related item name shapes", async () => {
    const snapshot = fixtureSnapshot();
    snapshot.registrations[0].contestants[0].items = [
      {
        key: "mulligan_count",
        label: "Add-on",
        value: "2",
        selection: "Two",
        item: { documentId: "extra-mulligans", name: "Mulligans" },
      },
    ];

    const result = await runGolfOverageOperation({
      apply: false,
      client: makeClient([snapshot]),
      writeAudit: vi.fn(),
    });

    expect(result.cancelRequests[0].mulligans).toEqual([
      expect.objectContaining({
        key: "mulligan_count",
        item: expect.objectContaining({ name: "Mulligans" }),
      }),
    ]);
  });

  it("allows partial rerun when one target golfer is already cancelled correctly", async () => {
    const snapshot = fixtureSnapshot(1);
    const client = makeClient([snapshot]);

    await expect(
      runGolfOverageOperation({ apply: false, client, writeAudit: vi.fn() })
    ).resolves.toMatchObject({ cancelRequests: { length: 11 } });
  });

  it("refuses a parent registration with extra golfer records", async () => {
    const snapshot = fixtureSnapshot();
    snapshot.registrations[0].contestants.push(
      makeGolfer("16781-extra", { status: "cancelled" })
    );
    const client = makeClient([snapshot]);

    await expect(
      runGolfOverageOperation({ apply: false, client, writeAudit: vi.fn() })
    ).rejects.toThrow("expected exactly 4 golfer records");
  });

  it("refuses target contestants from a different conference before any write", async () => {
    const snapshot = fixtureSnapshot();
    snapshot.registrations[0].contestants[0].conference = {
      id: 99,
      documentId: "wrong-conference",
      name: "Wrong Conference",
    };
    const client = makeClient([snapshot]);

    await expect(
      runGolfOverageOperation({ apply: true, client, writeAudit: vi.fn() })
    ).rejects.toThrow("contestant conference mismatch");
    expect(client.fetchConferenceAvailability).not.toHaveBeenCalled();
    expect(client.updateConferenceAvailability).not.toHaveBeenCalled();
    expect(client.cancelContestant).not.toHaveBeenCalled();
  });

  it("refuses a malicious snapshot with a non-allowlisted parent id before any write", async () => {
    const snapshot = fixtureSnapshot();
    snapshot.registrations[0].id = 99999;
    const client = makeClient([snapshot]);

    await expect(
      runGolfOverageOperation({ apply: true, client, writeAudit: vi.fn() })
    ).rejects.toThrow("not authorized");
    expect(client.fetchConferenceAvailability).not.toHaveBeenCalled();
    expect(client.updateConferenceAvailability).not.toHaveBeenCalled();
    expect(client.cancelContestant).not.toHaveBeenCalled();
  });

  it("refuses already-cancelled target golfers without the exact reason", async () => {
    const snapshot = fixtureSnapshot();
    snapshot.registrations[0].contestants[0].status = "cancelled";
    snapshot.registrations[0].contestants[0].cancelled_at = cancelledAt;
    snapshot.registrations[0].contestants[0].cancelled_reason = "other reason";
    const client = makeClient([snapshot]);

    await expect(
      runGolfOverageOperation({ apply: false, client, writeAudit: vi.fn() })
    ).rejects.toThrow("exact cancellation reason");
  });

  it("requires stored availability to exist and be non-positive", async () => {
    const missing = fixtureSnapshot();
    missing.conference.available_contestants = null;
    await expect(
      runGolfOverageOperation({
        apply: false,
        client: makeClient([missing]),
        writeAudit: vi.fn(),
      })
    ).rejects.toThrow("available_contestants is required");

    const positive = fixtureSnapshot();
    positive.conference.available_contestants = 3;
    await expect(
      runGolfOverageOperation({
        apply: false,
        client: makeClient([positive]),
        writeAudit: vi.fn(),
      })
    ).rejects.toThrow("must be non-positive");
  });

  it("applies through the supported counter update and cancel endpoint only", async () => {
    const before = fixtureSnapshot();
    before.conference.available_contestants = -20;
    const mid = fixtureSnapshot();
    mid.conference.available_contestants = EXPECTED_AVAILABLE_BEFORE;
    const client = makeClient([before, mid, completedSnapshot()]);
    const calls: string[] = [];
    client.fetchSnapshot.mockImplementation(async () => {
      calls.push("fetch-snapshot");
      const snapshots = [before, mid, completedSnapshot()];
      return snapshots[client.fetchSnapshot.mock.calls.length - 1];
    });
    client.fetchConferenceAvailability
      .mockImplementationOnce(async () => {
      calls.push("recheck-before-put");
      return -20;
      })
      .mockImplementationOnce(async () => {
        calls.push("recheck-before-put");
        return -23;
      });
    client.updateConferenceAvailability.mockImplementation(async () => {
      calls.push("put-counter");
      return { documentId: "fall-conference-2026", available_contestants: -23 };
    });
    client.cancelContestant.mockImplementation(async (documentId: string) => {
      calls.push(`cancel:${documentId}`);
      return {
        documentId,
        status: "cancelled",
        cancelled_at: cancelledAt,
        cancelled_reason: REQUIRED_REASON,
      };
    });

    const result = await runGolfOverageOperation({
      apply: true,
      client,
      writeAudit: vi.fn(),
    });

    expect(result.mode).toBe("apply");
    expect(client.updateConferenceAvailability).toHaveBeenCalledTimes(1);
    expect(client.updateConferenceAvailability).toHaveBeenCalledWith(
      TARGET_CONFERENCE.documentId,
      EXPECTED_AVAILABLE_BEFORE
    );
    expect(calls.slice(0, 3)).toEqual([
      "fetch-snapshot",
      "recheck-before-put",
      "put-counter",
    ]);
    expect(calls.slice(3, 5)).toEqual(["recheck-before-put", "fetch-snapshot"]);
    expect(calls[5]).toMatch(/^cancel:/);
    expect(client.cancelContestant).toHaveBeenCalledTimes(
      EXPECTED_CANCELLED_GOLFERS
    );
    expect(client.cancelContestant).toHaveBeenNthCalledWith(
      1,
      "contestant-16781-0",
      REQUIRED_REASON
    );
  });

  it("skips the absolute counter PUT when stored availability already equals the derived target", async () => {
    const client = makeClient([fixtureSnapshot(), fixtureSnapshot(), completedSnapshot()]);
    client.fetchConferenceAvailability.mockResolvedValue(EXPECTED_AVAILABLE_BEFORE);

    await runGolfOverageOperation({
      apply: true,
      client,
      writeAudit: vi.fn(),
    });

    expect(client.updateConferenceAvailability).not.toHaveBeenCalled();
    expect(client.cancelContestant).toHaveBeenCalledTimes(12);
  });

  it("aborts before cancellation when the pre-PUT quiet-window recheck changes", async () => {
    const before = fixtureSnapshot();
    before.conference.available_contestants = -20;
    const client = makeClient([before]);
    client.fetchConferenceAvailability.mockResolvedValue(-19);

    await expect(
      runGolfOverageOperation({ apply: true, client, writeAudit: vi.fn() })
    ).rejects.toThrow("changed before counter update");
    expect(client.cancelContestant).not.toHaveBeenCalled();
  });

  it("stops on the kth cancel failure and can resume from exact-reason partial state", async () => {
    const failingClient = makeClient([fixtureSnapshot(), fixtureSnapshot()]);
    failingClient.cancelContestant.mockImplementation(async (documentId: string) => {
      if (failingClient.cancelContestant.mock.calls.length === 5) {
        throw new Error("HTTP 500");
      }
      return {
        documentId,
        status: "cancelled",
        cancelled_at: cancelledAt,
        cancelled_reason: REQUIRED_REASON,
      };
    });

    await expect(
      runGolfOverageOperation({
        apply: true,
        client: failingClient,
        writeAudit: vi.fn(),
      })
    ).rejects.toThrow("HTTP 500");
    expect(failingClient.cancelContestant).toHaveBeenCalledTimes(5);

    const resumeClient = makeClient([
      fixtureSnapshot(4),
      fixtureSnapshot(4),
      completedSnapshot(),
    ]);
    await expect(
      runGolfOverageOperation({
        apply: true,
        client: resumeClient,
        writeAudit: vi.fn(),
      })
    ).resolves.toMatchObject({ cancelRequests: { length: 8 } });
    expect(resumeClient.cancelContestant).toHaveBeenCalledTimes(8);
  });

  it("writes a sanitized failure audit before rethrowing a kth cancellation error", async () => {
    const writeAudit = vi.fn();
    const client = makeClient([fixtureSnapshot(), fixtureSnapshot()]);
    client.cancelContestant.mockImplementation(async (documentId: string) => {
      if (client.cancelContestant.mock.calls.length === 3) {
        throw new Error("HTTP 500 with customer@example.invalid");
      }
      return {
        documentId,
        status: "cancelled",
        cancelled_at: cancelledAt,
        cancelled_reason: REQUIRED_REASON,
        email: "golfer@example.invalid",
      };
    });

    await expect(
      runGolfOverageOperation({ apply: true, client, writeAudit })
    ).rejects.toThrow("HTTP 500");

    const audit = writeAudit.mock.calls[0][0];
    expect(audit.mode).toBe("apply");
    expect(audit.currentPhase).toContain("cancel");
    expect(audit.errorMessage).toBe("HTTP 500 with [redacted-email]");
    expect(JSON.stringify(audit)).not.toContain("golfer@example.invalid");
    expect(JSON.stringify(audit)).not.toContain("First16781");
    expect(JSON.stringify(audit)).not.toContain("Water System");
    expect(audit.responseAudit.cancelledContestants).toHaveLength(2);
  });

  it("keeps first-cancel failure resumable after counter reconciliation", async () => {
    const before = fixtureSnapshot();
    before.conference.available_contestants = -20;
    const mid = fixtureSnapshot();
    mid.conference.available_contestants = EXPECTED_AVAILABLE_BEFORE;
    const failingClient = makeClient([before, mid]);
    failingClient.fetchConferenceAvailability
      .mockResolvedValueOnce(-20)
      .mockResolvedValueOnce(EXPECTED_AVAILABLE_BEFORE);
    failingClient.cancelContestant.mockRejectedValueOnce(new Error("HTTP 500"));

    await expect(
      runGolfOverageOperation({
        apply: true,
        client: failingClient,
        writeAudit: vi.fn(),
      })
    ).rejects.toThrow("HTTP 500");
    expect(failingClient.updateConferenceAvailability).toHaveBeenCalledTimes(1);
    expect(failingClient.cancelContestant).toHaveBeenCalledTimes(1);

    const resume = fixtureSnapshot();
    resume.conference.available_contestants = EXPECTED_AVAILABLE_BEFORE;
    const resumeClient = makeClient([resume, resume, completedSnapshot()]);
    await runGolfOverageOperation({
      apply: true,
      client: resumeClient,
      writeAudit: vi.fn(),
    });
    expect(resumeClient.updateConferenceAvailability).not.toHaveBeenCalled();
    expect(resumeClient.cancelContestant).toHaveBeenCalledTimes(12);
  });

  it("writes sanitized apply audit details instead of raw endpoint responses", async () => {
    const writeAudit = vi.fn();
    const client = makeClient([fixtureSnapshot(), fixtureSnapshot(), completedSnapshot()]);
    client.cancelContestant.mockImplementation(async (documentId: string) => ({
      documentId,
      status: "cancelled",
      cancelled_at: cancelledAt,
      cancelled_reason: REQUIRED_REASON,
      email: "golfer@example.invalid",
      phone: "4055550100",
    }));

    await runGolfOverageOperation({ apply: true, client, writeAudit });

    const audit = writeAudit.mock.calls[0][0];
    expect(audit.responses).toBeUndefined();
    expect(JSON.stringify(audit.responseAudit)).not.toContain("golfer@example.invalid");
    expect(audit.responseAudit.cancelledContestants).toHaveLength(12);
  });

  it("treats a fully completed exact-reason rerun as a no-op audit", async () => {
    const writeAudit = vi.fn();
    const client = makeClient([completedSnapshot()]);

    const result = await runGolfOverageOperation({
      apply: true,
      client,
      writeAudit,
    });

    expect(result.cancelRequests).toHaveLength(0);
    expect(client.updateConferenceAvailability).not.toHaveBeenCalled();
    expect(client.cancelContestant).not.toHaveBeenCalled();
    expect(writeAudit).toHaveBeenCalledWith(
      expect.objectContaining({ noOpReason: expect.stringContaining("already completed") })
    );
  });
});

describe("golf overage HTTP client and CLI safety", () => {
  const ok = (data: unknown) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => data,
      text: async () => JSON.stringify(data),
    } as Response);

  it("uses realistic REST fixtures and nested item population for refund evidence", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(ok({ data: fixtureSnapshot().registrations }))
      .mockResolvedValueOnce(ok({ data: [], meta: { pagination: { page: 1, pageCount: 1 } } }));
    const client = createStrapiApiClient({
      apiBase: "https://admin.orwa.org/api",
      apiKey: "not-printed",
      fetchImpl,
    });

    const snapshot = await client.fetchSnapshot();

    const firstUrl = String(fetchImpl.mock.calls[0][0]);
    expect(firstUrl).toContain("populate%5Bcontestants%5D%5Bpopulate%5D%5Bitems%5D");
    expect(firstUrl).not.toContain("fields%5D=items");
    expect(snapshot.registrations[0].contestants?.[0].items).toEqual([
      expect.objectContaining({
        key: "mulligans",
        label: "Mulligans",
        value: "2",
        selection: "Two Mulligans",
        item: expect.objectContaining({ documentId: "extra-mulligans" }),
      }),
    ]);
  });

  it("refuses missing item population but accepts legitimately empty item arrays", async () => {
    const missingItems = fixtureSnapshot();
    delete (missingItems.registrations[0].contestants[0] as { items?: unknown }).items;
    const missingClient = makeClient([missingItems]);

    await expect(
      runGolfOverageOperation({
        apply: false,
        client: missingClient,
        writeAudit: vi.fn(),
      })
    ).rejects.toThrow("items were not populated");

    const emptyItems = fixtureSnapshot();
    emptyItems.registrations[0].contestants[0].items = [];
    await expect(
      runGolfOverageOperation({
        apply: false,
        client: makeClient([emptyItems]),
        writeAudit: vi.fn(),
      })
    ).resolves.toMatchObject({ cancelRequests: { length: 12 } });
  });

  it("counts active golfers client-side for 2026 only so null or missing status is still active", async () => {
    const registrations = fixtureSnapshot().registrations;
    const crossYear = makeGolfer("cross-year");
    crossYear.year = 2025;
    const scopedRows = [
      makeGolfer("active-null", { status: null as unknown as string }),
      makeGolfer("active-missing"),
      crossYear,
      makeGolfer("cancelled", {
        status: "cancelled",
        cancelled_reason: REQUIRED_REASON,
        cancelled_at: cancelledAt,
      }),
    ];
    delete (scopedRows[1] as { status?: unknown }).status;
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(ok({ data: registrations }))
      .mockResolvedValueOnce(
        ok({ data: scopedRows, meta: { pagination: { page: 1, pageCount: 1 } } })
      );
    const client = createStrapiApiClient({
      apiBase: "https://admin.orwa.org/api",
      apiKey: "not-printed",
      fetchImpl,
    });

    const snapshot = await client.fetchSnapshot();
    const activeCountUrl = String(fetchImpl.mock.calls[1][0]);

    expect(activeCountUrl).not.toContain("filters%5Bstatus%5D");
    expect(activeCountUrl).toContain("filters%5Byear%5D%5B%24eq%5D=2026");
    expect(snapshot.activeGolferCount).toBe(2);
  });

  it("fails closed when pagination metadata is missing", async () => {
    const registrations = fixtureSnapshot().registrations;
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(ok({ data: registrations }))
      .mockResolvedValueOnce(ok({ data: [makeGolfer("1")] }));
    const client = createStrapiApiClient({
      apiBase: "https://admin.orwa.org/api",
      apiKey: "not-printed",
      fetchImpl,
    });

    await expect(client.fetchSnapshot()).rejects.toThrow("pagination metadata");
  });

  it("sorts active golfer pages, dedupes documentIds, and detects duplicate IDs", async () => {
    const registrations = fixtureSnapshot().registrations;
    const pageOne = [makeGolfer("1"), makeGolfer("2")];
    const pageTwo = [makeGolfer("2"), makeGolfer("3")];
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(ok({ data: registrations }))
      .mockResolvedValueOnce(
        ok({ data: pageOne, meta: { pagination: { page: 1, pageCount: 2 } } })
      )
      .mockResolvedValueOnce(
        ok({ data: pageTwo, meta: { pagination: { page: 2, pageCount: 2 } } })
      );
    const client = createStrapiApiClient({
      apiBase: "https://admin.orwa.org/api",
      apiKey: "not-printed",
      fetchImpl,
    });

    await expect(client.fetchSnapshot()).rejects.toThrow("duplicate active golfer");
    const pageOneUrl = String(fetchImpl.mock.calls[1][0]);
    const pageTwoUrl = String(fetchImpl.mock.calls[2][0]);
    expect(pageOneUrl).toContain("sort%5B0%5D=id%3AASC");
    expect(pageTwoUrl).toContain("sort%5B0%5D=id%3AASC");
  });

  it("detects missing active golfer documentIds", async () => {
    const registrations = fixtureSnapshot().registrations;
    const missingId = makeGolfer("missing") as { documentId?: string };
    delete missingId.documentId;
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(ok({ data: registrations }))
      .mockResolvedValueOnce(
        ok({ data: [missingId], meta: { pagination: { page: 1, pageCount: 1 } } })
      );
    const client = createStrapiApiClient({
      apiBase: "https://admin.orwa.org/api",
      apiKey: "not-printed",
      fetchImpl,
    });

    await expect(client.fetchSnapshot()).rejects.toThrow("missing documentId");
  });

  it("rejects unknown CLI flags and unsafe apply API bases", () => {
    expect(() => parseCliArgs(["--bogus"])).toThrow("Unknown flag");
    expect(() => parseCliArgs(["--rehearse-local"])).toThrow(
      "--rehearse-local requires --apply"
    );
    expect(parseCliArgs(["--apply", "--rehearse-local"])).toMatchObject({
      apply: true,
      rehearseLocal: true,
      live: true,
    });
    expect(() =>
      resolveApiConfig({
        env: {
          STRAPI_API_ENDPOINT: "https://staging.example.org/api",
          STRAPI_API_TOKEN: "secret",
        },
        apply: true,
        cwd: "/repo",
      })
    ).toThrow("https://admin.orwa.org/api");
    expect(() =>
      resolveApiConfig({
        env: {
          STRAPI_API_ENDPOINT: "https://admin.orwa.org",
          STRAPI_API_TOKEN: "secret",
        },
        apply: false,
        cwd: "/repo",
      })
    ).toThrow("must end with /api");
    expect(
      resolveApiConfig({
        env: {
          STRAPI_API_ENDPOINT: "http://localhost:13370/api",
          STRAPI_API_TOKEN: "secret",
        },
        apply: true,
        rehearseLocal: true,
        cwd: "/repo",
      }).apiBase
    ).toBe("http://localhost:13370/api");
  });

  it("does not call users/me and performs only a contestant readiness GET", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(ok({ data: { documentId: "contestant-1", status: "active" } }));
    const client = createStrapiApiClient({
      apiBase: "https://admin.orwa.org/api",
      apiKey: "not-printed",
      fetchImpl,
    });

    await (client as unknown as { readinessCheck: (id: string) => Promise<unknown> })
      .readinessCheck("contestant-1");

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(String(fetchImpl.mock.calls[0][0])).toContain(
      "conference-contestants/contestant-1"
    );
    expect(String(fetchImpl.mock.calls[0][0])).not.toContain("users/me");
  });

  it("includes response bodies in HTTP errors and attaches timeout signals", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      status: 403,
      json: async () => ({ error: "forbidden" }),
      text: async () => "forbidden body",
    })) as unknown as typeof fetch;
    const client = createStrapiApiClient({
      apiBase: "https://admin.orwa.org/api",
      apiKey: "not-printed",
      fetchImpl,
      timeoutMs: 25,
    });

    await expect(client.fetchConferenceAvailability("conf-1")).rejects.toThrow(
      "forbidden body"
    );
    expect((fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1]).toEqual(
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it("renders a fee and Mulligan audit table with operational caveats", () => {
    const before = fixtureSnapshot();
    const payload = {
      mode: "dry-run" as const,
      before: {
        conferenceDocumentId: TARGET_CONFERENCE.documentId,
        activeGolferCount: 59,
        availableContestants: -23,
        targetAvailableContestants: -23,
        registrations: [
          {
            id: 16781,
            documentId: "registration-16781",
            activeGolfers: 4,
            cancelledGolfers: 0,
            totalGolfers: 4,
            total: 600,
            paymentReference: { method: "Credit Card" },
            golfers: [
              {
                documentId: before.registrations[0].contestants[0].documentId,
                status: "active",
                cancelled_at: null,
                cancelled_reason: null,
                cancelled_by: null,
                name: "Fixture Golfer",
                ticket: "Golfer - Contestant Only",
                fee: 150,
                mulligans: before.registrations[0].contestants[0].items,
                itemsSnapshot: before.registrations[0].contestants[0].items,
              },
            ],
          },
        ],
      },
      plannedCounterReconciliation: {
        conferenceDocumentId: TARGET_CONFERENCE.documentId,
        currentAvailableContestants: -23,
        targetAvailableContestants: -23,
      },
      plannedCancelRequests: [],
    };

    const markdown = renderAuditMarkdown(payload);

    expect(markdown).toContain("| Registration | Contestant | Fee | Mulligans | Status |");
    expect(markdown).toContain("Two Mulligans");
    expect(markdown).toContain("quiet-window");
    expect(markdown).toContain("local rehearsal");
    expect(markdown).toContain("production role inspection");
  });
});
