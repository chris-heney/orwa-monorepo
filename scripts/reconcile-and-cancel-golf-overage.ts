import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { config as loadDotenv } from "dotenv";
import { countsAgainstGolfCapacity } from "../apps/strapi/src/api/conference-webhook/helpers/contestant-capacity";

export const REQUIRED_REGISTRATION_IDS = [16781, 16792, 16817] as const;
export const MAXIMUM_GOLFERS = 36;
export const EXPECTED_ACTIVE_BEFORE = 59;
export const EXPECTED_AVAILABLE_BEFORE = -23;
export const EXPECTED_CANCELLED_GOLFERS = 12;
export const EXPECTED_ACTIVE_AFTER = 47;
export const EXPECTED_AVAILABLE_AFTER = -11;

export const REQUIRED_REASON = "2026 Fall golf overage — pending card refund";
export const TARGET_CONFERENCE = {
  id: 3,
  documentId: "s55n2bz60qx2c2cxg7mb6jx5",
  name: "Fall Conference",
} as const;
export const TARGET_YEAR = 2026;
const AUDIT_DIR = "tmp/golf-overage-2026-fall";
const DEFAULT_HTTP_TIMEOUT_MS = 15_000;
const MAX_PAGES = 100;
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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
  year?: number | string | null;
  status?: string | null;
  first?: string | null;
  last?: string | null;
  fee?: number | string | null;
  items?: Array<Record<string, unknown>> | null;
  cancelled_at?: string | null;
  cancelled_reason?: string | null;
  cancelled_by?: string | null;
  conference?: ConferenceRow | null;
  conference_ticket?: TicketRow | null;
};

export type RegistrationRow = {
  id: number;
  documentId: string;
  year?: number | string | null;
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
  noOpReason?: string;
  currentPhase?: string;
  errorMessage?: string;
  before: OperationSummary;
  after?: OperationSummary;
  plannedCounterReconciliation: {
    conferenceDocumentId: string;
    currentAvailableContestants: number | null;
    targetAvailableContestants: number;
  };
  plannedCancelRequests: CancelRequest[];
  responseAudit?: {
    counterUpdated?: boolean;
    cancelledContestants: Array<{
      documentId: string;
      status?: string | null;
      cancelled_at?: string | null;
      cancelled_reason?: string | null;
    }>;
  };
};

type GolfOverageClient = {
  fetchSnapshot: () => Promise<GolfOverageSnapshot>;
  fetchConferenceAvailability: (conferenceDocumentId: string) => Promise<number | null>;
  readinessCheck: (firstContestantDocumentId: string) => Promise<unknown>;
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
      cancelled_at?: string | null;
      cancelled_reason?: string | null;
      cancelled_by?: string | null;
      name: string;
      ticket: string | null;
      fee: number | string | null | undefined;
      mulligans: unknown;
      itemsSnapshot: unknown[];
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
  return countsAgainstGolfCapacity({
    ticket_type: {
      name: contestant.conference_ticket?.name,
      context: contestant.conference_ticket?.context,
    },
  } as Parameters<typeof countsAgainstGolfCapacity>[0]);
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
    [
      item.key,
      item.label,
      item.name,
      item.field,
      (item.item as { name?: unknown } | undefined)?.name,
    ]
      .map((part) => String(part ?? ""))
      .join(" ")
      .toLowerCase()
      .includes("mulligan")
  );
}

function requireItemsSnapshot(registrationId: number, contestant: ContestantRow): unknown[] {
  if (!Object.prototype.hasOwnProperty.call(contestant, "items")) {
    throw new Error(
      `contestant ${contestant.documentId} on registration ${registrationId} items were not populated`
    );
  }
  if (!Array.isArray(contestant.items)) {
    throw new Error(
      `contestant ${contestant.documentId} on registration ${registrationId} items were not an array`
    );
  }
  return structuredClone(contestant.items);
}

function paymentReference(registration: RegistrationRow): PaymentReference {
  return {
    method: registration.payment_method,
    wpEid: registration.wp_eid,
    passportId: registration.passport_id,
  };
}

function requireTargetConference(conference: ConferenceRow | null | undefined, label: string) {
  if (
    !conference ||
    conference.id !== TARGET_CONFERENCE.id ||
    conference.documentId !== TARGET_CONFERENCE.documentId ||
    conference.name !== TARGET_CONFERENCE.name
  ) {
    throw new Error(
      `${label} conference mismatch; expected ${TARGET_CONFERENCE.id}/${TARGET_CONFERENCE.documentId}/${TARGET_CONFERENCE.name}`
    );
  }
}

function summarizeSnapshot(snapshot: GolfOverageSnapshot): OperationSummary {
  requireTargetConference(snapshot.conference, "target");
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
      requireTargetConference(registration.conference, `registration ${registration.id}`);
      if (Number(registration.year) !== TARGET_YEAR) {
        throw new Error(`registration ${registration.id} expected year ${TARGET_YEAR}`);
      }
      const golfers = (registration.contestants ?? []).filter(isGolfer);
      for (const golfer of golfers) {
        if (Number(golfer.year) !== TARGET_YEAR) {
          throw new Error(`contestant ${golfer.documentId} expected year ${TARGET_YEAR}`);
        }
        requireTargetConference(
          golfer.conference,
          `contestant conference mismatch ${golfer.documentId}`
        );
      }
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
          cancelled_at: golfer.cancelled_at ?? null,
          cancelled_reason: golfer.cancelled_reason ?? null,
          cancelled_by: golfer.cancelled_by ?? null,
          name: contestantName(golfer),
          ticket: golfer.conference_ticket?.name ?? null,
          fee: golfer.fee,
          mulligans: extractMulligans(golfer.items),
          itemsSnapshot: requireItemsSnapshot(registration.id, golfer),
        })),
        totalGolfers: golfers.length,
      };
    }),
  };
}

function requireStoredAvailability(summary: OperationSummary): number {
  if (summary.availableContestants === null) {
    throw new Error("conference available_contestants is required");
  }
  if (summary.availableContestants > 0) {
    throw new Error("conference available_contestants must be non-positive");
  }
  return summary.availableContestants;
}

function requireOperableState(summary: OperationSummary): number {
  const storedAvailable = requireStoredAvailability(summary);
  let alreadyCancelledTargets = 0;

  for (const registration of summary.registrations) {
    if (registration.totalGolfers !== 4) {
      throw new Error(
        `registration ${registration.id} expected exactly 4 golfer records, found ${registration.totalGolfers}`
      );
    }

    for (const golfer of registration.golfers) {
      if (golfer.status !== "cancelled") continue;
      if (golfer.cancelled_reason !== REQUIRED_REASON) {
        throw new Error(
          `contestant ${golfer.documentId} is cancelled without the exact cancellation reason`
        );
      }
      if (!golfer.cancelled_at) {
        throw new Error(`contestant ${golfer.documentId} is cancelled without cancelled_at`);
      }
    }

    alreadyCancelledTargets += registration.cancelledGolfers;
    if (registration.activeGolfers + registration.cancelledGolfers !== 4) {
      throw new Error(
        `registration ${registration.id} expected active plus already-cancelled golfers to equal 4`
      );
    }
  }

  const expectedActive = EXPECTED_ACTIVE_BEFORE - alreadyCancelledTargets;
  if (summary.activeGolferCount !== expectedActive) {
    throw new Error(
      `expected ${expectedActive} active golfers before cancellation, found ${summary.activeGolferCount}`
    );
  }

  const expectedTarget = reconciledAvailability(MAXIMUM_GOLFERS, summary.activeGolferCount);
  if (summary.targetAvailableContestants !== expectedTarget) {
    throw new Error(
      `expected target availability ${expectedTarget}, found ${summary.targetAvailableContestants}`
    );
  }

  return storedAvailable;
}

function isCompletedState(summary: OperationSummary): boolean {
  if (summary.availableContestants === null) return false;
  return (
    summary.activeGolferCount === EXPECTED_ACTIVE_AFTER &&
    summary.availableContestants === EXPECTED_AVAILABLE_AFTER &&
    summary.registrations.every(
      (registration) =>
        registration.totalGolfers === 4 &&
        registration.activeGolfers === 0 &&
        registration.cancelledGolfers === 4 &&
        registration.golfers.every(
          (golfer) =>
            golfer.cancelled_reason === REQUIRED_REASON && Boolean(golfer.cancelled_at)
        )
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

  const alreadyCancelled = summary.registrations.reduce(
    (total, registration) => total + registration.cancelledGolfers,
    0
  );
  const expectedRemaining = EXPECTED_CANCELLED_GOLFERS - alreadyCancelled;

  if (requests.length !== expectedRemaining) {
    throw new Error(
      `expected ${expectedRemaining} cancel requests, found ${requests.length}`
    );
  }

  return requests;
}

function projectDryRunAfter(before: OperationSummary, cancelRequests: CancelRequest[]): OperationSummary {
  const cancelIds = new Set(cancelRequests.map((request) => request.contestantDocumentId));
  return {
    ...before,
    activeGolferCount: EXPECTED_ACTIVE_AFTER,
    availableContestants: EXPECTED_AVAILABLE_AFTER,
    targetAvailableContestants: EXPECTED_AVAILABLE_AFTER,
    registrations: before.registrations.map((registration) => {
      const golfers = registration.golfers.map((golfer) =>
        cancelIds.has(golfer.documentId)
          ? {
              ...golfer,
              status: "cancelled",
              cancelled_at: "(dry-run)",
              cancelled_reason: REQUIRED_REASON,
            }
          : golfer
      );
      return {
        ...registration,
        golfers,
        activeGolfers: golfers.filter((golfer) => golfer.status !== "cancelled").length,
        cancelledGolfers: golfers.filter((golfer) => golfer.status === "cancelled").length,
      };
    }),
  };
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
      if (
        JSON.stringify(afterGolfer.itemsSnapshot) !==
        JSON.stringify(beforeGolfer.itemsSnapshot)
      ) {
        throw new Error(`contestant ${beforeGolfer.documentId} item snapshot changed`);
      }
      if (afterGolfer.status !== "cancelled") {
        throw new Error(`contestant ${beforeGolfer.documentId} was not cancelled`);
      }
      if (afterGolfer.cancelled_reason !== REQUIRED_REASON) {
        throw new Error(`contestant ${beforeGolfer.documentId} cancellation reason changed`);
      }
      if (!afterGolfer.cancelled_at) {
        throw new Error(`contestant ${beforeGolfer.documentId} missing cancelled_at`);
      }
    }
  }
}

function sanitizedCancelResponse(response: unknown) {
  const contestant = response as ContestantRow;
  return {
    documentId: contestant.documentId,
    status: contestant.status,
    cancelled_at: contestant.cancelled_at,
    cancelled_reason: contestant.cancelled_reason,
  };
}

function redactMessage(message: string): string {
  return message.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]");
}

function sanitizeFailureSummary(summary: OperationSummary): OperationSummary {
  return {
    ...summary,
    registrations: summary.registrations.map((registration) => ({
      ...registration,
      organization: undefined,
      total: undefined,
      paymentReference: { method: registration.paymentReference.method },
      golfers: registration.golfers.map((golfer) => ({
        ...golfer,
        name: "[redacted]",
      })),
    })),
  };
}

function sanitizeFailureRequests(cancelRequests: CancelRequest[]): CancelRequest[] {
  return cancelRequests.map((request) => ({
    ...request,
    name: "[redacted]",
    registrationTotal: undefined,
    paymentReference: { method: request.paymentReference.method },
  }));
}

export async function runGolfOverageOperation(options: RunOptions) {
  validateTargets(REQUIRED_REGISTRATION_IDS);

  const beforeSnapshot = await options.client.fetchSnapshot();
  validateTargets(beforeSnapshot.registrations.map((registration) => registration.id));
  const before = summarizeSnapshot(beforeSnapshot);
  const completedBeforeStart = isCompletedState(before);
  const plannedCounterReconciliation = {
    conferenceDocumentId: before.conferenceDocumentId,
    currentAvailableContestants: before.availableContestants,
    targetAvailableContestants: before.targetAvailableContestants,
  };

  if (completedBeforeStart) {
    const audit = {
      mode: options.apply ? "apply" : "dry-run",
      noOpReason: "already completed with exact target cancellations",
      before,
      after: before,
      plannedCounterReconciliation,
      plannedCancelRequests: [],
      responseAudit: { cancelledContestants: [] },
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

  const validatedAvailableBefore = requireOperableState(before);
  const cancelRequests = buildCancelRequests(before);

  if (!options.apply) {
    const after = projectDryRunAfter(before, cancelRequests);
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
  const responseAudit: NonNullable<AuditPayload["responseAudit"]> = {
    counterUpdated: false,
    cancelledContestants: [],
  };
  let currentPhase = "readiness check";

  try {
    await options.client.readinessCheck(cancelRequests[0].contestantDocumentId);

    if (validatedAvailableBefore !== before.targetAvailableContestants) {
      currentPhase = "counter quiet-window recheck";
      const immediateBefore = await options.client.fetchConferenceAvailability(
        before.conferenceDocumentId
      );
      if (immediateBefore !== validatedAvailableBefore) {
        throw new Error(
          `available_contestants changed before counter update: expected ${validatedAvailableBefore}, found ${immediateBefore}`
        );
      }

      currentPhase = "counter update";
      await options.client.updateConferenceAvailability(
        before.conferenceDocumentId,
        before.targetAvailableContestants
      );
      responseAudit.counterUpdated = true;

      currentPhase = "counter post-update recheck";
      const immediateAfter = await options.client.fetchConferenceAvailability(
        before.conferenceDocumentId
      );
      if (immediateAfter !== before.targetAvailableContestants) {
        throw new Error(
          `available_contestants after counter update expected ${before.targetAvailableContestants}, found ${immediateAfter}`
        );
      }
    }

    currentPhase = "pre-cancel active recount";
    const beforeFirstCancel = summarizeSnapshot(await options.client.fetchSnapshot());
    requireOperableState(beforeFirstCancel);
    if (beforeFirstCancel.activeGolferCount !== before.activeGolferCount) {
      throw new Error(
        `active golfer count changed before first cancellation: expected ${before.activeGolferCount}, found ${beforeFirstCancel.activeGolferCount}`
      );
    }

    for (const request of cancelRequests) {
      currentPhase = `cancel ${request.contestantDocumentId}`;
      const response = await options.client.cancelContestant(
        request.contestantDocumentId,
        request.reason
      );
      if (
        !response ||
        (response as { status?: string }).status !== "cancelled" ||
        (response as { cancelled_reason?: string | null }).cancelled_reason !== REQUIRED_REASON
      ) {
        throw new Error(`cancel endpoint returned unexpected response for ${request.contestantDocumentId}`);
      }
      responses.push(response);
      responseAudit.cancelledContestants.push(sanitizedCancelResponse(response));
    }

    currentPhase = "post-cancel verification";
    const afterSnapshot = await options.client.fetchSnapshot();
    const after = summarizeSnapshot(afterSnapshot);
    requireCompletedState(after);
    verifyTotalsAndPaymentsUnchanged(before, after);

    await options.writeAudit({
      mode: "apply",
      currentPhase,
      before,
      after,
      plannedCounterReconciliation,
      plannedCancelRequests: cancelRequests,
      responseAudit,
    });

    return { mode: "apply" as const, before, after, cancelRequests, responses };
  } catch (error) {
    await options.writeAudit({
      mode: "apply",
      currentPhase,
      errorMessage: redactMessage(error instanceof Error ? error.message : String(error)),
      before: sanitizeFailureSummary(before),
      plannedCounterReconciliation,
      plannedCancelRequests: sanitizeFailureRequests(cancelRequests),
      responseAudit,
    });
    throw error;
  }
}

export function parseCliArgs(argv: string[]) {
  const allowed = new Set(["--apply", "--live", "--rehearse-local", "--help", "-h"]);
  for (const arg of argv) {
    if (!allowed.has(arg)) {
      throw new Error(`Unknown flag: ${arg}`);
    }
  }
  const rehearseLocal = argv.includes("--rehearse-local");
  if (rehearseLocal && !argv.includes("--apply")) {
    throw new Error("--rehearse-local requires --apply");
  }
  return {
    apply: argv.includes("--apply"),
    rehearseLocal,
    live: argv.includes("--live") || argv.includes("--apply") || rehearseLocal,
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

export function resolveApiConfig({
  env,
  apply,
  rehearseLocal = false,
  cwd,
}: {
  env: NodeJS.ProcessEnv;
  apply: boolean;
  rehearseLocal?: boolean;
  cwd: string;
}) {
  const apiBase = (
    env.STRAPI_API_ENDPOINT ??
    env.STRAPI_API_BASE ??
    env.VITE_API_ENDPOINT
  )?.replace(/\/$/, "");
  const apiKey = env.STRAPI_API_TOKEN ?? env.STRAPI_API_KEY ?? env.VITE_API_KEY;

  if (!apiBase || !apiKey) {
    throw new Error(
      "live mode requires STRAPI_API_ENDPOINT/STRAPI_API_BASE/VITE_API_ENDPOINT and STRAPI_API_TOKEN/STRAPI_API_KEY/VITE_API_KEY"
    );
  }
  if (!apiBase.endsWith("/api")) {
    throw new Error("Strapi API base must end with /api");
  }
  if (apply && rehearseLocal && apiBase !== "http://localhost:13370/api") {
    throw new Error("apply rehearsal requires apiBase === http://localhost:13370/api");
  }
  if (apply && !rehearseLocal && apiBase !== "https://admin.orwa.org/api") {
    throw new Error("apply mode requires apiBase === https://admin.orwa.org/api");
  }

  return { apiBase, apiKey, cwd };
}

function loadApiConfig(apply: boolean, rehearseLocal: boolean) {
  const repoRoot = REPO_ROOT;
  const envPaths = [
    join(repoRoot, ".env.local"),
    join(repoRoot, "apps/conference-registration/.env.production"),
    join(repoRoot, "apps/member-manager/.env.production"),
  ];
  for (const envPath of envPaths) {
    if (existsSync(envPath)) loadDotenv({ path: envPath, override: false, quiet: true });
  }

  return resolveApiConfig({ env: process.env, apply, rehearseLocal, cwd: repoRoot });
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
  init: RequestInit = {},
  fetchImpl: typeof fetch = fetch,
  timeoutMs = DEFAULT_HTTP_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    headers.set("Authorization", `Bearer ${apiKey}`);
    if (init.body) headers.set("Content-Type", "application/json");

    const res = await fetchImpl(`${apiBase}/${pathAndQuery}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `${init.method ?? "GET"} ${pathAndQuery} failed with HTTP ${res.status}: ${body.slice(0, 500)}`
      );
    }
    return (await res.json()) as T;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") {
      throw new Error(`${init.method ?? "GET"} ${pathAndQuery} timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function createStrapiApiClient({
  apiBase,
  apiKey,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_HTTP_TIMEOUT_MS,
}: {
  apiBase: string;
  apiKey: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): GolfOverageClient {
  const getJson = <T>(pathAndQuery: string, init: RequestInit = {}) =>
    fetchJson<T>(apiBase, apiKey, pathAndQuery, init, fetchImpl, timeoutMs);

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
        ["fields[7]", "year"],
        ["populate[conference][fields][0]", "id"],
        ["populate[conference][fields][1]", "documentId"],
        ["populate[conference][fields][2]", "name"],
        ["populate[conference][fields][3]", "available_contestants"],
        ["populate[contestants][populate][conference_ticket][fields][0]", "documentId"],
        ["populate[contestants][populate][conference_ticket][fields][1]", "name"],
        ["populate[contestants][populate][conference_ticket][fields][2]", "context"],
        ["populate[contestants][populate][conference][fields][0]", "id"],
        ["populate[contestants][populate][conference][fields][1]", "documentId"],
        ["populate[contestants][populate][conference][fields][2]", "name"],
        ["populate[contestants][populate][items][fields][0]", "key"],
        ["populate[contestants][populate][items][fields][1]", "label"],
        ["populate[contestants][populate][items][fields][2]", "value"],
        ["populate[contestants][populate][items][fields][3]", "selection"],
        ["populate[contestants][populate][items][populate][item][fields][0]", "documentId"],
        ["populate[contestants][populate][items][populate][item][fields][1]", "name"],
      ];
      REQUIRED_REGISTRATION_IDS.forEach((id, index) => {
        registrationParams.push([`filters[id][$in][${index}]`, id]);
      });

      const registrationsResponse = await getJson<{ data: RegistrationRow[] }>(
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

      const activeGolferIds = new Set<string>();
      for (let page = 1; page <= MAX_PAGES; page += 1) {
        const params = strapiParams([
          ["pagination[page]", page],
          ["pagination[pageSize]", 100],
          ["sort[0]", "id:ASC"],
          ["fields[0]", "documentId"],
          ["fields[1]", "year"],
          ["filters[conference][documentId][$eq]", conference.documentId],
          ["filters[year][$eq]", TARGET_YEAR],
          ["populate[conference_ticket][fields][0]", "name"],
          ["populate[conference_ticket][fields][1]", "context"],
        ]);
        const pageResponse = await getJson<{
          data: ContestantRow[];
          meta?: { pagination?: { pageCount?: number } };
        }>(`conference-contestants?${params}`);
        const pagination = pageResponse.meta?.pagination;
        if (!pagination || typeof pagination.pageCount !== "number") {
          throw new Error("active golfer pagination metadata is required");
        }

        const activeGolfers = (pageResponse.data ?? [])
          .filter((contestant) => Number(contestant.year) === TARGET_YEAR)
          .filter((contestant) => contestant.status !== "cancelled")
          .filter(isGolfer);
        for (const contestant of activeGolfers) {
          if (!contestant.documentId) {
            throw new Error("active golfer row is missing documentId");
          }
          if (activeGolferIds.has(contestant.documentId)) {
            throw new Error(`duplicate active golfer documentId ${contestant.documentId}`);
          }
          activeGolferIds.add(contestant.documentId);
        }
        const pageCount = pagination.pageCount;
        if (page >= pageCount) break;
        if (page === MAX_PAGES) {
          throw new Error(`pagination exceeded ${MAX_PAGES} pages`);
        }
      }

      return { conference, registrations, activeGolferCount: activeGolferIds.size };
    },

    async fetchConferenceAvailability(conferenceDocumentId) {
      const params = strapiParams([["fields[0]", "available_contestants"]]);
      const response = await getJson<{ data: ConferenceRow }>(
        `conferences/${conferenceDocumentId}?${params}`
      );
      return numericOrNull(response.data?.available_contestants);
    },

    async readinessCheck(firstContestantDocumentId) {
      return getJson(
        `conference-contestants/${firstContestantDocumentId}?${strapiParams([
          ["fields[0]", "documentId"],
          ["fields[1]", "status"],
        ])}`
      );
    },

    async updateConferenceAvailability(conferenceDocumentId, availableContestants) {
      const response = await getJson<{ data: ConferenceRow }>(
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
      const response = await getJson<{ data?: ContestantRow }>(
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
    year: TARGET_YEAR,
    organization: `Fixture System ${id}`,
    total: 600,
    payment_method: "Credit Card",
    wp_eid: id + 50000,
    passport_id: id + 60000,
    conference: {
      id: TARGET_CONFERENCE.id,
      documentId: TARGET_CONFERENCE.documentId,
      name: TARGET_CONFERENCE.name,
      available_contestants: EXPECTED_AVAILABLE_BEFORE,
    },
    contestants: [0, 1, 2, 3].map((index) => ({
      id: id * 10 + index,
      documentId: `fixture-contestant-${id}-${index + 1}`,
      year: TARGET_YEAR,
      status: "active",
      conference: {
        id: TARGET_CONFERENCE.id,
        documentId: TARGET_CONFERENCE.documentId,
        name: TARGET_CONFERENCE.name,
      },
      first: `Fixture${registrationIndex + 1}`,
      last: `Golfer${index + 1}`,
      fee: 150,
      items: [
        {
          key: "mulligans",
          label: "Mulligans",
          value: "2",
          selection: "Two Mulligans",
          item: { documentId: "extra-mulligans", name: "Mulligans" },
        },
      ],
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
    async fetchConferenceAvailability() {
      throw new Error("fixture client is dry-run only");
    },
    async readinessCheck() {
      throw new Error("fixture client is dry-run only");
    },
    async cancelContestant() {
      throw new Error("fixture client is dry-run only");
    },
  };
}

async function writeAuditFiles(payload: AuditPayload) {
  const auditDir = join(REPO_ROOT, AUDIT_DIR);
  mkdirSync(auditDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = join(auditDir, `${stamp}-${payload.mode}.json`);
  const markdownPath = join(auditDir, `${stamp}-${payload.mode}.md`);

  writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
  writeFileSync(markdownPath, renderAuditMarkdown(payload));

  console.log(`Audit JSON: ${jsonPath}`);
  console.log(`Audit Markdown: ${markdownPath}`);
}

function formatMulligans(value: unknown): string {
  if (!Array.isArray(value) || value.length === 0) return "None";
  return value
    .map((item) => {
      const record = item as Record<string, unknown>;
      const relatedName = (record.item as { name?: unknown } | undefined)?.name;
      return [record.selection, relatedName, record.label, record.value]
        .filter(Boolean)
        .map(String)
        .join(" / ");
    })
    .join("; ");
}

export function renderAuditMarkdown(payload: AuditPayload): string {
  const rows = payload.before.registrations.flatMap((registration) =>
    registration.golfers.map((golfer) =>
      [
        registration.id,
        golfer.documentId,
        golfer.fee ?? "",
        formatMulligans(golfer.mulligans),
        golfer.status ?? "",
      ].join(" | ")
    )
  );

  return [
    `# 2026 Fall Golf Overage ${payload.mode === "apply" ? "Apply" : "Dry Run"} Audit`,
    "",
    `- Mode: ${payload.mode}`,
    payload.noOpReason ? `- No-op: ${payload.noOpReason}` : "",
    `- Target conference: ${TARGET_CONFERENCE.id}/${TARGET_CONFERENCE.documentId}/${TARGET_CONFERENCE.name}`,
    `- Explicit maximum golfers: ${MAXIMUM_GOLFERS}`,
    `- Active golfers before: ${payload.before.activeGolferCount}`,
    `- Counter reconciliation: ${payload.plannedCounterReconciliation.currentAvailableContestants} -> ${payload.plannedCounterReconciliation.targetAvailableContestants}`,
    `- Planned cancellation requests: ${payload.plannedCancelRequests.length}`,
    payload.after
      ? `- Active golfers after: ${payload.after.activeGolferCount}; availability after: ${payload.after.availableContestants}`
      : "",
    "",
    "## Fee And Mulligan Evidence",
    "",
    "| Registration | Contestant | Fee | Mulligans | Status |",
    "| --- | --- | ---: | --- | --- |",
    ...rows.map((row) => `| ${row} |`),
    "",
    "## Operational Caveats",
    "",
    "- The counter update uses an immediate quiet-window recheck, not true database CAS.",
    "- Cancel endpoint permission must be verified by local rehearsal and production role inspection before production apply.",
    "- No secrets, raw endpoint responses, card data, refunds, invoice mutations, payment mutations, or email sends are included in this audit.",
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

function printUsage() {
  console.log(`Usage:
  npx tsx scripts/reconcile-and-cancel-golf-overage.ts
  npx tsx scripts/reconcile-and-cancel-golf-overage.ts --live
  npx tsx scripts/reconcile-and-cancel-golf-overage.ts --apply --rehearse-local
  npx tsx scripts/reconcile-and-cancel-golf-overage.ts --apply

Default mode is a fixture-backed dry run and performs zero network calls or writes.
--live performs a read-only API dry run using local env/secret files.
--apply --rehearse-local allows apply only against http://localhost:13370/api.
--apply performs the guarded live reconciliation and cancellation operation.`);
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    return;
  }

  if (!args.live) {
    console.log("Mode: DRY RUN (fixture, zero writes, zero network calls)");
  } else if (args.rehearseLocal) {
    console.log("Mode: APPLY REHEARSAL (local API)");
  } else {
    console.log(`Mode: ${args.apply ? "APPLY" : "DRY RUN"} (live API)`);
  }

  const apiConfig = args.live ? loadApiConfig(args.apply, args.rehearseLocal) : null;
  console.log(`API base: ${apiConfig?.apiBase ?? "(fixture)"}`);
  const client = apiConfig
    ? createStrapiApiClient(apiConfig)
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
