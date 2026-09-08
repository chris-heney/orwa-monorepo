/**
 * conference-contestant service
 */

import { factories } from '@strapi/strapi';
import {
  assertGolfCapacity,
  countsAgainstGolfCapacity,
} from "../../conference-webhook/helpers/contestant-capacity";

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

const rejectLifecycleFields = (data: Record<string, unknown>) => {
  const attempted = LIFECYCLE_FIELDS.filter((field) => hasOwn(data, field));
  if (attempted.length > 0) {
    throw new Error(LIFECYCLE_MESSAGE);
  }
};

const rejectRelationChanges = (data: Record<string, unknown>) => {
  const attempted = RELATION_CHANGE_FIELDS.filter((field) => hasOwn(data, field));
  if (attempted.length > 0) {
    throw new Error(RELATION_CHANGE_MESSAGE);
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

  for (const key of ["connect", "set"]) {
    const relationValue = record[key];
    const first = Array.isArray(relationValue) ? relationValue[0] : relationValue;
    const extracted = relationDocumentId(first);
    if (extracted) return extracted;
  }

  return null;
};

const loadRelation = async <T>(
  strapi: any,
  uid: string,
  documentId: string | null
): Promise<T | null> => {
  if (!documentId) return null;
  return strapi.documents(uid).findOne({ documentId });
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
  rejectLifecycleFields(data);

  const conferenceDocumentId = relationDocumentId(data.conference);
  const ticketDocumentId = relationDocumentId(data.conference_ticket);
  const ticket = await loadRelation<{ name?: string | null; context?: string | null }>(
    strapi,
    TICKET_UID,
    ticketDocumentId
  );
  const countsAgainstGolf = ticketConsumesGolfCapacity(ticket);

  return strapi.db.transaction(async ({ trx }: { trx: unknown }) => {
    if (countsAgainstGolf) {
      if (!conferenceDocumentId) {
        throw new Error("Conference is required for golfer capacity enforcement.");
      }

      const conference = await lockConference(strapi, trx, conferenceDocumentId);
      assertGolfCapacity(conference.available_contestants, 1);
    }

    const created = await strapi.documents(CONTESTANT_UID).create({
      data,
      populate: "*",
    });

    if (countsAgainstGolf) {
      await strapi.db
        .connection(CONFERENCE_TABLE)
        .where({ document_id: conferenceDocumentId })
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
  rejectLifecycleFields(data);
  rejectRelationChanges(data);

  const existing = await strapi.documents(CONTESTANT_UID).findOne({
    documentId: input.documentId,
    populate: { conference_ticket: true, conference: true },
  });
  if (!existing) {
    throw new Error("Conference contestant not found.");
  }
  if (existing.status === "cancelled") {
    throw new Error("Cancelled conference contestants are read-only.");
  }

  return strapi.documents(CONTESTANT_UID).update({
    documentId: input.documentId,
    data,
    populate: "*",
  });
};

export default factories.createCoreService('api::conference-contestant.conference-contestant');
