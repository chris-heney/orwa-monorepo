import {
  assertGolfCapacity,
  countsAgainstGolfCapacity,
} from "../../conference-webhook/helpers/contestant-capacity";

const CONTESTANT_UID = "api::conference-contestant.conference-contestant";
const CONFERENCE_TABLE = "conferences";

export type Contestant = {
  documentId: string;
  status?: "active" | "cancelled" | string | null;
  conference?: {
    documentId?: string | null;
    available_contestants?: unknown;
  } | null;
  conference_ticket?: {
    name?: string | null;
    context?: "Attendee" | "Vendor" | "Contestant" | string | null;
  } | null;
  [key: string]: unknown;
};

export type ContestantCancellationInput = {
  documentId: string;
  reason: string;
  actor?: string | null;
};

const CONTESTANT_POPULATE = {
  conference: true,
  conference_ticket: true,
  registration: true,
  items: true,
  team: true,
};

const normalizeRequiredReason = (reason: string): string => {
  const trimmed = reason?.trim();
  if (!trimmed) {
    throw new Error("A cancellation reason is required.");
  }
  return trimmed;
};

const normalizeActor = (actor?: string | null): string | null => {
  const trimmed = actor?.trim();
  return trimmed || null;
};

const loadContestant = async (
  strapi: any,
  documentId: string
): Promise<Contestant> => {
  const contestant = await strapi.documents(CONTESTANT_UID).findOne({
    documentId,
    populate: CONTESTANT_POPULATE,
  });

  if (!contestant) {
    throw new Error("Conference contestant not found.");
  }

  return contestant;
};

const isGolferTicket = (contestant: Contestant): boolean => {
  const ticketPayload = {
    ticket_type: {
      name: contestant.conference_ticket?.name,
      context: contestant.conference_ticket?.context,
    },
  };

  return countsAgainstGolfCapacity(ticketPayload as any);
};

const requireConferenceDocumentId = (contestant: Contestant): string => {
  const documentId = contestant.conference?.documentId;
  if (!documentId) {
    throw new Error("Conference contestant is missing a conference relation.");
  }
  return documentId;
};

export const cancelContestant = async (
  strapi: any,
  input: ContestantCancellationInput
): Promise<Contestant> => {
  const reason = normalizeRequiredReason(input.reason);
  const actor = normalizeActor(input.actor);

  return strapi.db.transaction(async ({ trx }: { trx: unknown }) => {
    const fresh = await loadContestant(strapi, input.documentId);
    if (fresh.status === "cancelled") return fresh;

    if (isGolferTicket(fresh)) {
      await strapi.db
        .connection(CONFERENCE_TABLE)
        .where({ document_id: requireConferenceDocumentId(fresh) })
        .increment("available_contestants", 1)
        .transacting(trx);
    }

    return strapi.documents(CONTESTANT_UID).update({
      documentId: input.documentId,
      data: {
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancelled_reason: reason,
        cancelled_by: actor,
      },
      populate: CONTESTANT_POPULATE,
    });
  });
};

export const restoreContestant = async (
  strapi: any,
  input: ContestantCancellationInput
): Promise<Contestant> => {
  normalizeRequiredReason(input.reason);

  return strapi.db.transaction(async ({ trx }: { trx: unknown }) => {
    const fresh = await loadContestant(strapi, input.documentId);
    if (fresh.status !== "cancelled") return fresh;

    if (isGolferTicket(fresh)) {
      assertGolfCapacity(fresh.conference?.available_contestants, 1);
      await strapi.db
        .connection(CONFERENCE_TABLE)
        .where({ document_id: requireConferenceDocumentId(fresh) })
        .decrement("available_contestants", 1)
        .transacting(trx);
    }

    return strapi.documents(CONTESTANT_UID).update({
      documentId: input.documentId,
      data: {
        status: "active",
        cancelled_at: null,
        cancelled_reason: null,
        cancelled_by: null,
      },
      populate: CONTESTANT_POPULATE,
    });
  });
};
