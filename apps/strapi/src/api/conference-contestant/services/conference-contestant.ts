/**
 * conference-contestant service
 */

import { factories } from '@strapi/strapi';
import {
  assertGolfCapacity,
  countsAgainstGolfCapacity,
} from "../../conference-webhook/helpers/contestant-capacity";
import { conferenceCycleYear } from "../../conference-webhook/helpers/conference-cycle-year";
import { findOneById } from "../../../utils/document-compat";
import {
  withContestantRestCreate,
  withContestantTicketChange,
} from "./contestant-lifecycle-context";
import {
  badRequest,
  notFound,
} from "./contestant-domain-error";

const CONTESTANT_UID = "api::conference-contestant.conference-contestant";
const CONFERENCE_UID = "api::conference.conference";
const TICKET_UID = "api::conference-ticket.conference-ticket";
const CONFERENCE_TABLE = "conferences";

const LIFECYCLE_FIELDS = [
  "status",
  "cancelled_at",
  "cancelled_reason",
  "cancelled_by",
];
const LIFECYCLE_MESSAGE =
  "Conference contestant lifecycle fields must be changed through cancel/restore actions.";
const RELATION_CHANGE_MESSAGE =
  "Cancel and create a new contestant to change conference.";
const TICKET_REQUIRED_MESSAGE =
  "Conference contestants must keep a ticket. Choose a different ticket instead of clearing it.";
const TICKET_CONFERENCE_MISMATCH_MESSAGE =
  "Selected ticket does not belong to the contestant's conference.";

type WriteInput = {
  data: Record<string, unknown>;
};

type UpdateInput = WriteInput & {
  documentId: string;
};

const hasOwn = (value: Record<string, unknown>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

const normalizedStatus = (value: unknown): string =>
  value == null || value === "" ? "active" : String(value);

const sameLifecycleValue = (
  field: string,
  requested: unknown,
  current: unknown
): boolean => {
  if (field === "status") {
    return normalizedStatus(requested) === normalizedStatus(current);
  }
  return requested == null && current == null ? true : requested === current;
};

const rejectCreateLifecycleFields = (data: Record<string, unknown>) => {
  const attempted = LIFECYCLE_FIELDS.filter((field) => hasOwn(data, field));
  const safeDefaults = attempted.every((field) =>
    sameLifecycleValue(field, data[field], undefined)
  );
  if (attempted.length > 0 && !safeDefaults) {
    throw badRequest(LIFECYCLE_MESSAGE);
  }
};

const rejectLifecycleChanges = (
  data: Record<string, unknown>,
  existing: Record<string, unknown>
) => {
  const attempted = LIFECYCLE_FIELDS.filter((field) => hasOwn(data, field));
  const unchanged = attempted.every((field) =>
    sameLifecycleValue(field, data[field], existing[field])
  );
  if (attempted.length > 0 && !unchanged) {
    throw badRequest(LIFECYCLE_MESSAGE);
  }
};

const rejectConferenceChange = (
  data: Record<string, unknown>,
  existing: Record<string, unknown>
) => {
  if (!hasOwn(data, "conference")) return;
  if (!sameRelation(data.conference, existing.conference)) {
    throw badRequest(RELATION_CHANGE_MESSAGE);
  }
};

/**
 * The documentId of a different ticket the caller wants this contestant on,
 * or null when the payload leaves the ticket alone. Clearing is refused: a
 * contestant with no ticket has no type, no fee basis, and no capacity rule.
 */
const requestedTicketChange = (
  data: Record<string, unknown>,
  existing: Record<string, unknown>
): string | null => {
  if (!hasOwn(data, "conference_ticket")) return null;
  if (isExplicitRelationClear(data.conference_ticket)) {
    throw badRequest(TICKET_REQUIRED_MESSAGE);
  }
  if (sameRelation(data.conference_ticket, existing.conference_ticket)) return null;
  return relationDocumentId(data.conference_ticket);
};

const relationDocumentId = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  if (typeof record.documentId === "string" && record.documentId.trim()) {
    return record.documentId.trim();
  }
  if (record.id != null && (typeof record.id === "string" || typeof record.id === "number")) {
    return String(record.id);
  }

  for (const key of ["connect", "set"]) {
    const relationValue = record[key];
    const first = Array.isArray(relationValue) ? relationValue[0] : relationValue;
    const extracted = relationDocumentId(first);
    if (extracted) return extracted;
  }

  return null;
};

const sameRelation = (requested: unknown, current: unknown): boolean => {
  const requestedId = relationDocumentId(requested);
  const currentId = relationDocumentId(current);
  const currentRecord =
    typeof current === "object" && current ? (current as Record<string, unknown>) : {};
  const currentDocId = currentRecord.documentId;
  const currentEntityId = currentRecord.id;

  if (isExplicitRelationClear(requested)) {
    return currentId == null && currentDocId == null && currentEntityId == null;
  }
  if (requestedId == null) return true;
  return (
    requestedId === currentId ||
    requestedId === currentDocId ||
    String(requestedId) === String(currentEntityId)
  );
};

const isExplicitRelationClear = (value: unknown): boolean => {
  if (value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (record.set === null) return true;
  if (Array.isArray(record.set) && record.set.length === 0) return true;
  if (Array.isArray(record.connect) && record.connect.length === 0) return true;
  const hasReattach =
    relationDocumentId(record.set) != null ||
    relationDocumentId(record.connect) != null;
  if (Array.isArray(record.disconnect) && record.disconnect.length > 0 && !hasReattach) return true;
  return false;
};

const isNumericId = (value: string | number): boolean =>
  typeof value === "number" || /^\d+$/.test(value);

const loadRelation = async <T extends { documentId?: string | null }>(
  strapi: any,
  uid: string,
  documentId: string | null,
  populate?: unknown
): Promise<T | null> => {
  if (!documentId) return null;
  const params = populate ? { populate } : {};
  if (isNumericId(documentId)) {
    return findOneById(uid, documentId, params);
  }
  return strapi.documents(uid).findOne({ ...params, documentId });
};

const ticketConsumesGolfCapacity = (ticket: {
  name?: string | null;
  context?: string | null;
} | null): boolean =>
  countsAgainstGolfCapacity({
    ticket_type: {
      name: ticket?.name,
      context: ticket?.context,
    },
  } as never);

const requireIntegerYear = (value: unknown): number => {
  const year = typeof value === "string" && value.trim() ? Number(value) : value;
  if (!Number.isInteger(year)) {
    throw badRequest("Conference contestant year is required and must be an integer.");
  }
  return year as number;
};

const ticketBelongsToConference = (
  ticket: { conferences?: Array<{ id?: string | number | null; documentId?: string | null }> } | null,
  conferenceId: string | number
): boolean =>
  Array.isArray(ticket?.conferences) &&
  ticket.conferences.some(
    (conference) =>
      conference.documentId === conferenceId ||
      String(conference.id) === String(conferenceId)
  );

const lockConference = async (strapi: any, trx: unknown, documentId: string) => {
  const row = await strapi.db
    .connection(CONFERENCE_TABLE)
    .where({ document_id: documentId })
    .forUpdate()
    .transacting(trx)
    .first();

  if (!row) {
    throw new Error("Conference not found.");
  }

  return row;
};

export const createContestant = async (
  strapi: any,
  input: WriteInput
): Promise<unknown> => {
  const data = input.data ?? {};
  rejectCreateLifecycleFields(data);

  const conferenceDocumentId = relationDocumentId(data.conference);
  const ticketDocumentId = relationDocumentId(data.conference_ticket);
  const year = requireIntegerYear(data.year);
  const conference = await loadRelation<Record<string, unknown>>(
    strapi,
    CONFERENCE_UID,
    conferenceDocumentId
  );
  if (!conference) {
    throw notFound("Selected conference was not found.");
  }
  const expectedYear = conferenceCycleYear(conference);
  if (year !== expectedYear) {
    throw badRequest(`Conference contestant year must match conference cycle ${expectedYear}.`);
  }
  const selectedConferenceDocumentId =
    typeof conference.documentId === "string" && conference.documentId
      ? conference.documentId
      : conferenceDocumentId;
  const ticket = await loadRelation<{
    documentId?: string | null;
    name?: string | null;
    context?: string | null;
    conferences?: Array<{ id?: string | number | null; documentId?: string | null }>;
  }>(
    strapi,
    TICKET_UID,
    ticketDocumentId,
    { conferences: true }
  );
  if (!ticket) {
    throw notFound("Selected conference ticket was not found.");
  }
  if (!ticketBelongsToConference(ticket, selectedConferenceDocumentId!)) {
    throw badRequest("Selected ticket does not belong to the selected conference.");
  }
  const countsAgainstGolf = ticketConsumesGolfCapacity(ticket);

  return strapi.db.transaction(async ({ trx }: { trx: unknown }) => {
    if (countsAgainstGolf) {
      if (!selectedConferenceDocumentId) {
        throw badRequest("Conference is required for golfer capacity enforcement.");
      }

      const conference = await lockConference(strapi, trx, selectedConferenceDocumentId);
      assertGolfCapacity(conference.available_contestants, 1);
    }

    const created = await withContestantRestCreate(() =>
      strapi.documents(CONTESTANT_UID).create({
        data,
        populate: "*",
      })
    );

    if (countsAgainstGolf) {
      await strapi.db
        .connection(CONFERENCE_TABLE)
        .where({ document_id: selectedConferenceDocumentId })
        .decrement("available_contestants", 1)
        .transacting(trx);
    }

    return created;
  });
};

export const updateContestant = async (
  strapi: any,
  input: UpdateInput
): Promise<unknown> => {
  const data = input.data ?? {};
  const existing = await strapi.documents(CONTESTANT_UID).findOne({
    documentId: input.documentId,
    populate: { conference_ticket: true, conference: true },
  });
  if (!existing) {
    throw notFound("Conference contestant not found.");
  }
  if (existing.status === "cancelled") {
    throw badRequest("Cancelled conference contestants are read-only.");
  }
  rejectLifecycleChanges(data, existing);
  rejectConferenceChange(data, existing);

  const nextTicketId = requestedTicketChange(data, existing);
  if (nextTicketId == null) {
    return strapi.documents(CONTESTANT_UID).update({
      documentId: input.documentId,
      data,
      populate: "*",
    });
  }

  return changeContestantTicket(strapi, input.documentId, existing, data, nextTicketId);
};

type ExistingContestant = {
  conference?: { id?: string | number | null; documentId?: string | null } | null;
  conference_ticket?: { name?: string | null; context?: string | null } | null;
};

/**
 * Move an active contestant onto another ticket of the same conference and
 * keep "Available Golf Contestants" honest: Golfer → non-Golfer frees a slot,
 * non-Golfer → Golfer takes one (and is refused when none remain), and a swap
 * between two golf tickets leaves the counter alone. Same lock/transaction
 * discipline as create, cancel, and restore.
 */
const changeContestantTicket = async (
  strapi: any,
  documentId: string,
  existing: ExistingContestant,
  data: Record<string, unknown>,
  nextTicketId: string
): Promise<unknown> => {
  const conferenceDocumentId = existing.conference?.documentId ?? null;
  if (!conferenceDocumentId) {
    throw badRequest(
      "Conference contestant is missing a conference; cancel and create a new contestant."
    );
  }

  const ticket = await loadRelation<{
    documentId?: string | null;
    name?: string | null;
    context?: string | null;
    conferences?: Array<{ id?: string | number | null; documentId?: string | null }>;
  }>(strapi, TICKET_UID, nextTicketId, { conferences: true });
  if (!ticket) {
    throw notFound("Selected conference ticket was not found.");
  }
  if (!ticketBelongsToConference(ticket, conferenceDocumentId)) {
    throw badRequest(TICKET_CONFERENCE_MISMATCH_MESSAGE);
  }

  const freesGolfSlot =
    ticketConsumesGolfCapacity(existing.conference_ticket ?? null) &&
    !ticketConsumesGolfCapacity(ticket);
  const takesGolfSlot =
    ticketConsumesGolfCapacity(ticket) &&
    !ticketConsumesGolfCapacity(existing.conference_ticket ?? null);

  return strapi.db.transaction(async ({ trx }: { trx: unknown }) => {
    if (takesGolfSlot || freesGolfSlot) {
      const conference = await lockConference(strapi, trx, conferenceDocumentId);
      if (takesGolfSlot) {
        assertGolfCapacity(conference.available_contestants, 1);
      }
    }

    const updated = await withContestantTicketChange(() =>
      strapi.documents(CONTESTANT_UID).update({
        documentId,
        data,
        populate: "*",
      })
    );

    if (takesGolfSlot) {
      await strapi.db
        .connection(CONFERENCE_TABLE)
        .where({ document_id: conferenceDocumentId })
        .decrement("available_contestants", 1)
        .transacting(trx);
    } else if (freesGolfSlot) {
      await strapi.db
        .connection(CONFERENCE_TABLE)
        .where({ document_id: conferenceDocumentId })
        .increment("available_contestants", 1)
        .transacting(trx);
    }

    return updated;
  });
};

export default factories.createCoreService('api::conference-contestant.conference-contestant');
