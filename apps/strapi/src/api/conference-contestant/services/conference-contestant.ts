/**
 * conference-contestant service
 */

import { factories } from '@strapi/strapi';
import {
  assertGolfCapacity,
  countsAgainstGolfCapacity,
} from "../../conference-webhook/helpers/contestant-capacity";
import { findOneById } from "../../../utils/document-compat";
import { withContestantRestCreate } from "./contestant-lifecycle-context";
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
const RELATION_CHANGE_FIELDS = ["conference", "conference_ticket"];
const LIFECYCLE_MESSAGE =
  "Conference contestant lifecycle fields must be changed through cancel/restore actions.";
const RELATION_CHANGE_MESSAGE =
  "Cancel and create a new contestant to change conference or ticket.";

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

const rejectRelationChanges = (
  data: Record<string, unknown>,
  existing: Record<string, unknown>
) => {
  const attempted = RELATION_CHANGE_FIELDS.filter((field) => hasOwn(data, field));
  for (const field of attempted) {
    if (!sameRelation(data[field], existing[field])) {
      throw badRequest(RELATION_CHANGE_MESSAGE);
    }
  }
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

  if (requestedId == null) return true;
  return (
    requestedId === currentId ||
    requestedId === currentDocId ||
    String(requestedId) === String(currentEntityId)
  );
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

const conferenceCycleYear = (conference: Record<string, unknown>): number | null => {
  const date =
    conference.start_date ??
    conference.end_date ??
    conference.registration_start ??
    conference.registration_end;
  if (typeof date !== "string" || !date) return null;
  const year = new Date(`${date}T00:00:00Z`).getUTCFullYear();
  return Number.isFinite(year) ? year : null;
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
  if (expectedYear == null) {
    throw badRequest("Conference cycle year is required for contestant creation.");
  }
  if (expectedYear != null && year !== expectedYear) {
    throw badRequest(`Conference contestant year must match conference cycle ${expectedYear}.`);
  }
  const selectedConferenceDocumentId =
    typeof conference.documentId === "string" && conference.documentId
      ? conference.documentId
      : conferenceDocumentId;
  const ticket = await loadRelation<{
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
  rejectRelationChanges(data, existing);

  return strapi.documents(CONTESTANT_UID).update({
    documentId: input.documentId,
    data,
    populate: "*",
  });
};

export default factories.createCoreService('api::conference-contestant.conference-contestant');
