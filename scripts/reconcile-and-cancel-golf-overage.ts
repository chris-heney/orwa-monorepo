import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { config as loadDotenv } from "dotenv";

export const REQUIRED_REGISTRATION_IDS = [16781, 16792, 16817] as const;
export const MAXIMUM_GOLFERS = 36;
export const EXPECTED_ACTIVE_BEFORE = 59;
export const EXPECTED_AVAILABLE_BEFORE = -23;
export const EXPECTED_CANCELLED_GOLFERS = 12;
export const EXPECTED_ACTIVE_AFTER = 47;
export const EXPECTED_AVAILABLE_AFTER = -11;

const REQUIRED_REASON = "2026 Fall golf overage - pending card refund";
const AUDIT_DIR = "tmp/golf-overage-2026-fall";

type RegistrationId = (typeof REQUIRED_REGISTRATION_IDS)[number];

type ConferenceRow = {
  id?: number;
  documentId: string;
  name?: string | null;
  available_contestants?: number | string | null;
};

type TicketRow = {
  documentId?: string | null;
  name?: string | null;
  context?: string | null;
};

export type ContestantRow = {
  id?: number;
  documentId: string;
  status?: string | null;
  first?: string | null;
  last?: string | null;
  fee?: number | string | null;
  items?: Array<Record<string, unknown>> | null;
  cancelled_at?: string | null;
  cancelled_reason?: string | null;
  cancelled_by?: string | null;
  conference_ticket?: TicketRow | null;
};

export type RegistrationRow = {
  id: number;
  documentId: string;
  organization?: string | null;
  total?: number | string | null;
  payment_method?: string | null;
  wp_eid?: number | string | null;
  passport_id?: number | string | null;
  conference?: ConferenceRow | null;
  contestants?: ContestantRow[] | null;
};

export type GolfOverageSnapshot = {
  conference: ConferenceRow;
  registrations: RegistrationRow[];
  activeGolferCount: number;
};

type AuditPayload = {
  mode: "dry-run" | "apply";
  before: OperationSummary;
  after?: OperationSummary;
  plannedCounterReconciliation: {
    conferenceDocumentId: string;
    currentAvailableContestants: number | null;
    targetAvailableContestants: number;
  };
  plannedCancelRequests: CancelRequest[];
  responses?: unknown[];
};

type GolfOverageClient = {
  fetchSnapshot: () => Promise<GolfOverageSnapshot>;
  updateConferenceAvailability: (
    conferenceDocumentId: string,
    availableContestants: number
  ) => Promise<unknown>;
  cancelContestant: (
    contestantDocumentId: string,
    reason: string
  ) => Promise<unknown>;
};

type RunOptions = {
  apply: boolean;
  client: GolfOverageClient;
  writeAudit: (payload: AuditPayload) => void | Promise<void>;
};

type CancelRequest = {
  registrationId: number;
  contestantDocumentId: string;
  reason: string;
  name: string;
  ticket: string | null;
  fee: number | string | null | undefined;
  mulligans: unknown;
  registrationTotal: number | string | null | undefined;
  paymentReference: PaymentReference;
};

type PaymentReference = {
  method?: string | null;
  wpEid?: number | string | null;
  passportId?: number | string | null;
};

type OperationSummary = {
  conferenceDocumentId: string;
  activeGolferCount: number;
  availableContestants: number | null;
  targetAvailableContestants: number;
  registrations: Array<{
    id: number;
    documentId: string;
    organization?: string | null;
    activeGolfers: number;
    cancelledGolfers: number;
    total?: number | string | null;
    paymentReference: PaymentReference;
    golfers: Array<{
      documentId: string;
      status?: string | null;
      name: string;
      ticket: string | null;
      fee: number | string | null | undefined;
      mulligans: unknown;
    }>;
    totalGolfers: number;
  }>;
};

const sameIds = (left: readonly number[], right: readonly number[]) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

export function validateTargets(ids: readonly number[]): RegistrationId[] {
  const uniqueSorted = [...new Set(ids)].sort((a, b) => a - b);
  const required = [...REQUIRED_REGISTRATION_IDS];

  for (const id of uniqueSorted) {
    if (!required.includes(id as RegistrationId)) {
      throw new Error(`registration ${id} is not authorized for golf overage cancellation`);
    }
  }

  if (!sameIds(uniqueSorted, required)) {
    throw new Error(`targets must be exactly 16781, 16792, 16817`);
  }

  return [...REQUIRED_REGISTRATION_IDS];
}

export function reconciledAvailability(maximum: number, activeGolfers: number): number {
  return maximum - activeGolfers;
}

export function expectedAfter({
  maximum,
  activeBefore,
  cancelled,
}: {
  maximum: number;
  activeBefore: number;
  cancelled: number;
}) {
  const activeAfter = activeBefore - cancelled;
  return {
    activeAfter,
    availableAfter: reconciledAvailability(maximum, activeAfter),
  };
}

function isGolfer(contestant: ContestantRow): boolean {
  const ticket = contestant.conference_ticket;
  const name = ticket?.name ?? "";
  const context = ticket?.context;
  const contestantTicket =
    context === "Contestant" ||
    (!context && ["Golfer", "Fisher", "Contestant"].includes(name));

  return contestantTicket && name.toLowerCase().includes("golfer");
}

function isActive(contestant: ContestantRow): boolean {
  return (contestant.status ?? "active") === "active";
}

function isCancelled(contestant: ContestantRow): boolean {
  return contestant.status === "cancelled";
}

function numericOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function contestantName(contestant: ContestantRow): string {
  return [contestant.first, contestant.last].filter(Boolean).join(" ").trim();
}

function extractMulligans(items: ContestantRow["items"]): unknown {
  return (items ?? []).filter((item) =>
    String(item.label ?? item.name ?? item.field ?? "")
      .toLowerCase()
      .includes("mulligan")
  );
}

function paymentReference(registration: RegistrationRow): PaymentReference {
  return {
    method: registration.payment_method,
    wpEid: registration.wp_eid,
    passportId: registration.passport_id,
  };
}

function summarizeSnapshot(snapshot: GolfOverageSnapshot): OperationSummary {
  const conferenceDocumentId = snapshot.conference.documentId;
  const availableContestants = numericOrNull(snapshot.conference.available_contestants);

  return {
    conferenceDocumentId,
    activeGolferCount: snapshot.activeGolferCount,
    availableContestants,
    targetAvailableContestants: reconciledAvailability(
      MAXIMUM_GOLFERS,
      snapshot.activeGolferCount
    ),
    registrations: snapshot.registrations.map((registration) => {
      const golfers = (registration.contestants ?? []).filter(isGolfer);
      return {
        id: registration.id,
        documentId: registration.documentId,
        organization: registration.organization,
        activeGolfers: golfers.filter(isActive).length,
        cancelledGolfers: golfers.filter(isCancelled).length,
        total: registration.total,
        paymentReference: paymentReference(registration),
        golfers: golfers.map((golfer) => ({
          documentId: golfer.documentId,
          status: golfer.status ?? "active",
          name: contestantName(golfer),
          ticket: golfer.conference_ticket?.name ?? null,
          fee: golfer.fee,
          mulligans: extractMulligans(golfer.items),
        })),
        totalGolfers: golfers.length,
      };
    }),
  };
}

function requireFreshPendingState(summary: OperationSummary): void {
  if (summary.activeGolferCount !== EXPECTED_ACTIVE_BEFORE) {
    throw new Error(
      `expected ${EXPECTED_ACTIVE_BEFORE} active golfers before cancellation, found ${summary.activeGolferCount}`
    );
  }

  if (summary.targetAvailableContestants !== EXPECTED_AVAILABLE_BEFORE) {
    throw new Error(
      `expected target availability ${EXPECTED_AVAILABLE_BEFORE}, found ${summary.targetAvailableContestants}`
    );
  }

  for (const registration of summary.registrations) {
    if (registration.totalGolfers !== 4) {
      throw new Error(
        `registration ${registration.id} expected exactly 4 golfer records, found ${registration.totalGolfers}`
      );
    }
    if (registration.activeGolfers !== 4) {
      throw new Error(
        `registration ${registration.id} expected 4 active golfers, found ${registration.activeGolfers}`
      );
    }
  }
}

function isCompletedState(summary: OperationSummary): boolean {
  return (
    summary.activeGolferCount === EXPECTED_ACTIVE_AFTER &&
    summary.availableContestants === EXPECTED_AVAILABLE_AFTER &&
    summary.registrations.every(
      (registration) =>
        registration.totalGolfers === 4 &&
        registration.activeGolfers === 0 &&
        registration.cancelledGolfers === 4
    )
  );
}

function requireCompletedState(summary: OperationSummary): void {
  if (!isCompletedState(summary)) {
    throw new Error(
      `expected completed state: ${EXPECTED_ACTIVE_AFTER} active golfers and ${EXPECTED_AVAILABLE_AFTER} availability`
    );
  }
}

function buildCancelRequests(summary: OperationSummary): CancelRequest[] {
  const requests = summary.registrations.flatMap((registration) =>
    registration.golfers
      .filter((golfer) => golfer.status !== "cancelled")
      .map((golfer) => ({
        registrationId: registration.id,
        contestantDocumentId: golfer.documentId,
        reason: REQUIRED_REASON,
        name: golfer.name,
        ticket: golfer.ticket,
        fee: golfer.fee,
        mulligans: golfer.mulligans,
        registrationTotal: registration.total,
        paymentReference: registration.paymentReference,
      }))
  );

  if (requests.length !== EXPECTED_CANCELLED_GOLFERS) {
    throw new Error(
      `expected ${EXPECTED_CANCELLED_GOLFERS} cancel requests, found ${requests.length}`
    );
  }

  return requests;
}

function verifyTotalsAndPaymentsUnchanged(
  before: OperationSummary,
  after: OperationSummary
): void {
  for (const beforeRegistration of before.registrations) {
    const afterRegistration = after.registrations.find(
      (registration) => registration.id === beforeRegistration.id
    );
    if (!afterRegistration) {
      throw new Error(`registration ${beforeRegistration.id} missing after apply`);
    }

    if (String(afterRegistration.total) !== String(beforeRegistration.total)) {
      throw new Error(`registration ${beforeRegistration.id} total changed`);
    }

    if (
      JSON.stringify(afterRegistration.paymentReference) !==
      JSON.stringify(beforeRegistration.paymentReference)
    ) {
      throw new Error(`registration ${beforeRegistration.id} payment reference changed`);
    }

    for (const beforeGolfer of beforeRegistration.golfers) {
      const afterGolfer = afterRegistration.golfers.find(
        (golfer) => golfer.documentId === beforeGolfer.documentId
      );
      if (!afterGolfer) {
        throw new Error(`contestant ${beforeGolfer.documentId} missing after apply`);
      }
      if (String(afterGolfer.fee) !== String(beforeGolfer.fee)) {
        throw new Error(`contestant ${beforeGolfer.documentId} fee changed`);
      }
      if (JSON.stringify(afterGolfer.mulligans) !== JSON.stringify(beforeGolfer.mulligans)) {
        throw new Error(`contestant ${beforeGolfer.documentId} Mulligans changed`);
      }
    }
  }
}

export async function runGolfOverageOperation(options: RunOptions) {
  validateTargets(REQUIRED_REGISTRATION_IDS);

  const beforeSnapshot = await options.client.fetchSnapshot();
  const before = summarizeSnapshot(beforeSnapshot);
  const completedBeforeStart = isCompletedState(before);
  const plannedCounterReconciliation = {
    conferenceDocumentId: before.conferenceDocumentId,
    currentAvailableContestants: before.availableContestants,
    targetAvailableContestants: EXPECTED_AVAILABLE_BEFORE,
  };

  if (completedBeforeStart) {
    const audit = {
      mode: options.apply ? "apply" : "dry-run",
      before,
      after: before,
      plannedCounterReconciliation,
      plannedCancelRequests: [],
      responses: [],
    } satisfies AuditPayload;
    await options.writeAudit(audit);
    return {
      mode: audit.mode,
      before,
      after: before,
      cancelRequests: [],
      responses: [],
    };
  }

  requireFreshPendingState(before);
  const cancelRequests = buildCancelRequests(before);

  if (!options.apply) {
    const after = {
      ...before,
      activeGolferCount: EXPECTED_ACTIVE_AFTER,
      availableContestants: EXPECTED_AVAILABLE_AFTER,
      targetAvailableContestants: EXPECTED_AVAILABLE_AFTER,
    };
    await options.writeAudit({
      mode: "dry-run",
      before,
      after,
      plannedCounterReconciliation,
      plannedCancelRequests: cancelRequests,
    });
    return { mode: "dry-run" as const, before, after, cancelRequests, responses: [] };
  }

  const responses: unknown[] = [];
  responses.push(
    await options.client.updateConferenceAvailability(
      before.conferenceDocumentId,
      EXPECTED_AVAILABLE_BEFORE
    )
  );

  for (const request of cancelRequests) {
    const response = await options.client.cancelContestant(
      request.contestantDocumentId,
      request.reason
    );
    if (!response || (response as { status?: string }).status !== "cancelled") {
      throw new Error(`cancel endpoint returned unexpected response for ${request.contestantDocumentId}`);
    }
    responses.push(response);
  }

  const afterSnapshot = await options.client.fetchSnapshot();
  const after = summarizeSnapshot(afterSnapshot);
  requireCompletedState(after);
  verifyTotalsAndPaymentsUnchanged(before, after);

  await options.writeAudit({
    mode: "apply",
    before,
    after,
    plannedCounterReconciliation,
    plannedCancelRequests: cancelRequests,
    responses,
  });

  return { mode: "apply" as const, before, after, cancelRequests, responses };
}

function parseArgs(argv: string[]) {
  return {
    apply: argv.includes("--apply"),
    live: argv.includes("--live") || argv.includes("--apply"),
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

function loadApiConfig() {
  const envPaths = [
    ".env.local",
    "apps/conference-registration/.env.production",
    "apps/member-manager/.env.production",
  ];
  for (const envPath of envPaths) {
    if (existsSync(envPath)) loadDotenv({ path: envPath, override: false });
  }

  const apiBase = (
    process.env.STRAPI_API_ENDPOINT ??
    process.env.STRAPI_API_BASE ??
    process.env.VITE_API_ENDPOINT
  )?.replace(/\/$/, "");
  const apiKey = process.env.STRAPI_API_TOKEN ?? process.env.STRAPI_API_KEY ?? process.env.VITE_API_KEY;

  if (!apiBase || !apiKey) {
    throw new Error(
      "live mode requires STRAPI_API_ENDPOINT/STRAPI_API_BASE/VITE_API_ENDPOINT and STRAPI_API_TOKEN/STRAPI_API_KEY/VITE_API_KEY"
    );
  }

  return { apiBase, apiKey };
}

function strapiParams(params: Array<[string, string | number]>) {
  const search = new URLSearchParams();
  for (const [key, value] of params) search.append(key, String(value));
  return search.toString();
}

async function fetchJson<T>(
  apiBase: string,
  apiKey: string,
  pathAndQuery: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${apiBase}/${pathAndQuery}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`${init.method ?? "GET"} ${pathAndQuery} failed with HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

function makeApiClient(apiBase: string, apiKey: string): GolfOverageClient {
  return {
    async fetchSnapshot() {
      const registrationParams: Array<[string, string | number]> = [
        ["pagination[pageSize]", 100],
        ["sort[0]", "id:ASC"],
        ["fields[0]", "id"],
        ["fields[1]", "documentId"],
        ["fields[2]", "organization"],
        ["fields[3]", "total"],
        ["fields[4]", "payment_method"],
        ["fields[5]", "wp_eid"],
        ["fields[6]", "passport_id"],
        ["populate[conference][fields][0]", "id"],
        ["populate[conference][fields][1]", "documentId"],
        ["populate[conference][fields][2]", "name"],
        ["populate[conference][fields][3]", "available_contestants"],
        ["populate[contestants][fields][0]", "id"],
        ["populate[contestants][fields][1]", "documentId"],
        ["populate[contestants][fields][2]", "status"],
        ["populate[contestants][fields][3]", "first"],
        ["populate[contestants][fields][4]", "last"],
        ["populate[contestants][fields][5]", "fee"],
        ["populate[contestants][fields][6]", "items"],
        ["populate[contestants][fields][7]", "cancelled_at"],
        ["populate[contestants][fields][8]", "cancelled_reason"],
        ["populate[contestants][fields][9]", "cancelled_by"],
        ["populate[contestants][populate][conference_ticket][fields][0]", "documentId"],
        ["populate[contestants][populate][conference_ticket][fields][1]", "name"],
        ["populate[contestants][populate][conference_ticket][fields][2]", "context"],
      ];
      REQUIRED_REGISTRATION_IDS.forEach((id, index) => {
        registrationParams.push([`filters[id][$in][${index}]`, id]);
      });

      const registrationsResponse = await fetchJson<{ data: RegistrationRow[] }>(
        apiBase,
        apiKey,
        `conference-registrations?${strapiParams(registrationParams)}`
      );
      const registrations = registrationsResponse.data ?? [];
      const receivedIds = registrations.map((registration) => registration.id);
      validateTargets(receivedIds);

      const conference = registrations[0]?.conference;
      if (!conference?.documentId) {
        throw new Error("target registrations are missing conference relation");
      }
      if (
        registrations.some(
          (registration) => registration.conference?.documentId !== conference.documentId
        )
      ) {
        throw new Error("target registrations do not share one conference");
      }

      let activeGolferCount = 0;
      for (let page = 1; page <= 20; page += 1) {
        const params = strapiParams([
          ["pagination[page]", page],
          ["pagination[pageSize]", 100],
          ["fields[0]", "documentId"],
          ["fields[1]", "status"],
          ["filters[conference][documentId][$eq]", conference.documentId],
          ["filters[status][$eq]", "active"],
          ["populate[conference_ticket][fields][0]", "name"],
          ["populate[conference_ticket][fields][1]", "context"],
        ]);
        const pageResponse = await fetchJson<{
          data: ContestantRow[];
          meta?: { pagination?: { pageCount?: number } };
        }>(apiBase, apiKey, `conference-contestants?${params}`);
        activeGolferCount += (pageResponse.data ?? []).filter(isGolfer).length;
        const pageCount = pageResponse.meta?.pagination?.pageCount ?? 1;
        if (page >= pageCount) break;
      }

      return { conference, registrations, activeGolferCount };
    },

    async updateConferenceAvailability(conferenceDocumentId, availableContestants) {
      const response = await fetchJson<{ data: ConferenceRow }>(
        apiBase,
        apiKey,
        `conferences/${conferenceDocumentId}`,
        {
          method: "PUT",
          body: JSON.stringify({ data: { available_contestants: availableContestants } }),
        }
      );
      if (numericOrNull(response.data?.available_contestants) !== availableContestants) {
        throw new Error("conference capacity update returned unexpected availability");
      }
      return response.data;
    },

    async cancelContestant(contestantDocumentId, reason) {
      const response = await fetchJson<{ data?: ContestantRow }>(
        apiBase,
        apiKey,
        `conference-contestants/${contestantDocumentId}/cancel`,
        {
          method: "POST",
          body: JSON.stringify({ reason }),
        }
      );
      const contestant = response.data ?? (response as unknown as ContestantRow);
      if (contestant.status !== "cancelled") {
        throw new Error(`cancel endpoint did not return cancelled for ${contestantDocumentId}`);
      }
      return contestant;
    },
  };
}

function makeFixtureClient(): GolfOverageClient {
  const registrations = REQUIRED_REGISTRATION_IDS.map((id, registrationIndex) => ({
    id,
    documentId: `registration-${id}`,
    organization: `Fixture System ${id}`,
    total: 600,
    payment_method: "Credit Card",
    wp_eid: id + 50000,
    passport_id: id + 60000,
    conference: {
      id: 98,
      documentId: "fall-conference-2026",
      name: "2026 Fall Conference",
      available_contestants: EXPECTED_AVAILABLE_BEFORE,
    },
    contestants: [0, 1, 2, 3].map((index) => ({
      id: id * 10 + index,
      documentId: `fixture-contestant-${id}-${index + 1}`,
      status: "active",
      first: `Fixture${registrationIndex + 1}`,
      last: `Golfer${index + 1}`,
      fee: 150,
      items: [{ label: "Mulligans", value: "2" }],
      conference_ticket: {
        documentId: "fixture-golfer-ticket",
        name: "Golfer - Contestant Only",
        context: "Contestant",
      },
    })),
  }));

  return {
    async fetchSnapshot() {
      return {
        conference: registrations[0].conference,
        registrations: structuredClone(registrations),
        activeGolferCount: EXPECTED_ACTIVE_BEFORE,
      };
    },
    async updateConferenceAvailability() {
      throw new Error("fixture client is dry-run only");
    },
    async cancelContestant() {
      throw new Error("fixture client is dry-run only");
    },
  };
}

async function writeAuditFiles(payload: AuditPayload) {
  const auditDir = resolve(AUDIT_DIR);
  mkdirSync(auditDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = join(auditDir, `${stamp}-${payload.mode}.json`);
  const markdownPath = join(auditDir, `${stamp}-${payload.mode}.md`);

  writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
  writeFileSync(
    markdownPath,
    [
      `# 2026 Fall Golf Overage ${payload.mode === "apply" ? "Apply" : "Dry Run"} Audit`,
      "",
      `- Mode: ${payload.mode}`,
      `- Active golfers before: ${payload.before.activeGolferCount}`,
      `- Counter reconciliation: ${payload.plannedCounterReconciliation.currentAvailableContestants} -> ${payload.plannedCounterReconciliation.targetAvailableContestants}`,
      `- Planned cancellation requests: ${payload.plannedCancelRequests.length}`,
      payload.after
        ? `- Active golfers after: ${payload.after.activeGolferCount}; availability after: ${payload.after.availableContestants}`
        : "",
      "",
      "No secrets, card data, refunds, invoice mutations, payment mutations, or email sends are included in this audit.",
      "",
    ]
      .filter(Boolean)
      .join("\n")
  );

  console.log(`Audit JSON: ${jsonPath}`);
  console.log(`Audit Markdown: ${markdownPath}`);
}

function printUsage() {
  console.log(`Usage:
  npx tsx scripts/reconcile-and-cancel-golf-overage.ts
  npx tsx scripts/reconcile-and-cancel-golf-overage.ts --live
  npx tsx scripts/reconcile-and-cancel-golf-overage.ts --apply

Default mode is a fixture-backed dry run and performs zero network calls or writes.
--live performs a read-only API dry run using local env/secret files.
--apply performs the guarded live reconciliation and cancellation operation.`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    return;
  }

  if (!args.live) {
    console.log("Mode: DRY RUN (fixture, zero writes, zero network calls)");
  } else {
    console.log(`Mode: ${args.apply ? "APPLY" : "DRY RUN"} (live API)`);
  }

  const apiConfig = args.live ? loadApiConfig() : null;
  const client = apiConfig
    ? makeApiClient(apiConfig.apiBase, apiConfig.apiKey)
    : makeFixtureClient();

  const result = await runGolfOverageOperation({
    apply: args.apply,
    client,
    writeAudit: writeAuditFiles,
  });

  console.log(`Target registrations: ${REQUIRED_REGISTRATION_IDS.join(", ")}`);
  console.log(`Cancel requests: ${result.cancelRequests.length}`);
  console.log(
    `Availability: ${result.before.availableContestants} -> ${result.after.availableContestants}`
  );
  console.log(
    `Active golfers: ${result.before.activeGolferCount} -> ${result.after.activeGolferCount}`
  );
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
