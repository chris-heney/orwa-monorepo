/**
 * Nomination ⇄ Winner link helpers (pure).
 *
 * `award_winner.award_nomination` is the one source of truth connecting a
 * gallery entry to the nomination it came from. These helpers turn a
 * nomination into the winner fields staff would otherwise re-key.
 *
 * Recipient convention — the gallery seed (`apps/awards/src/data/awardWinners.ts`)
 * and the form helper text both use "Person — System" with an em dash
 * (e.g. "Roger McCracken — Lincoln Co RW&SD #4"). Prefill follows that: the
 * nominee's name, then the linked water system (falling back to the typed
 * `system_name`); a System of the Year style nomination where the nominee IS
 * the system collapses to a single name instead of "X — X".
 */

import type { NominationStatus } from "./metrics";

/** Nomination statuses that belong in the Winners gallery. */
export const WINNER_STATUSES: readonly NominationStatus[] = ["Winner", "Runner Up"];

export const isWinnerStatus = (
  status: NominationStatus | string | null | undefined
): boolean => status != null && (WINNER_STATUSES as readonly string[]).includes(status);

export type LinkableNomination = {
  id?: string | number;
  documentId?: string;
  nominee_name?: string | null;
  system_name?: string | null;
  award_type?: string | null;
  award_year?: number | null;
  nomination_status?: NominationStatus | string | null;
  watersystem?:
    | { id?: string | number; documentId?: string; entityId?: number; name?: string | null }
    | string
    | number
    | null;
  contact?: {
    first?: string;
    last?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
  } | null;
  /** Media in any shape the data provider yields (rows, ids, or `{ data }`). */
  photographs?: unknown;
};

export type WinnerDraft = {
  award_year?: number | null;
  title?: string | null;
  recipient?: string | null;
  watersystem?: string | number | null;
  award_nomination?: string | number | null;
  photo?: number | null;
  is_published?: boolean;
  sort_order?: number | null;
};

const text = (value: unknown): string =>
  typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();

const isBlank = (value: unknown): boolean =>
  value == null || value === "" || (typeof value === "string" && value.trim() === "");

/** Water system name — populated row, else nothing (a bare id has no name). */
export const nominationSystemName = (nomination: LinkableNomination): string => {
  const ws = nomination.watersystem;
  if (ws && typeof ws === "object") return text(ws.name);
  return "";
};

/**
 * Relation value for the winner's `watersystem`. The numeric PK is preferred
 * because the data provider's media heuristic (`url != null`) mistakes
 * watersystem rows (they have a `url` attribute) for uploads and collapses
 * them to their numeric id on read — so the winner form's Water System
 * picker is keyed by `entityId`, and the write side accepts numeric ids
 * (`numeric-id-compat`). Falls back to documentId / id.
 */
export const nominationSystemRef = (
  nomination: LinkableNomination
): string | number | null => {
  const ws = nomination.watersystem;
  if (ws == null) return null;
  if (typeof ws === "string" || typeof ws === "number") return ws;
  if (typeof ws.entityId === "number") return ws.entityId;
  if (typeof ws.id === "number") return ws.id;
  return ws.documentId ?? ws.id ?? null;
};

const contactName = (nomination: LinkableNomination): string => {
  const contact = nomination.contact;
  if (!contact) return "";
  return (
    text(contact.name) ||
    [contact.first_name || contact.first, contact.last_name || contact.last]
      .map(text)
      .filter(Boolean)
      .join(" ")
  );
};

/** Person half of the recipient line: nominee, else the linked contact. */
export const nominationPersonName = (nomination: LinkableNomination): string =>
  text(nomination.nominee_name) || contactName(nomination);

/** "Person — System" (or just one of them when the other is missing/identical). */
export const nominationRecipientLine = (nomination: LinkableNomination): string => {
  const person = nominationPersonName(nomination);
  const system = nominationSystemName(nomination) || text(nomination.system_name);
  if (person && system && person.toLowerCase() !== system.toLowerCase()) {
    return `${person} — ${system}`;
  }
  return person || system;
};

/** Autocomplete label: "Nominee · System · Award type (year)". */
export const nominationOptionText = (nomination: LinkableNomination | null | undefined): string => {
  if (!nomination) return "";
  const parts = [
    nominationPersonName(nomination),
    nominationSystemName(nomination) || text(nomination.system_name),
    text(nomination.award_type),
  ].filter(Boolean);
  const unique = parts.filter((part, index) => parts.indexOf(part) === index);
  const year = nomination.award_year != null ? ` (${nomination.award_year})` : "";
  return `${unique.join(" · ")}${year}`;
};

/** First uploaded photograph's numeric upload id, if any. */
export const firstPhotographId = (nomination: LinkableNomination): number | null => {
  let raw = nomination.photographs;
  if (raw && typeof raw === "object" && !Array.isArray(raw) && "data" in raw) {
    raw = (raw as { data?: unknown }).data;
  }
  const first: unknown = Array.isArray(raw) ? raw[0] : raw;
  if (first == null) return null;
  const id =
    typeof first === "object" ? (first as { id?: unknown }).id : first;
  if (typeof id === "number") return id;
  if (typeof id === "string" && /^\d+$/.test(id)) return parseInt(id, 10);
  return null;
};

/**
 * Fields to copy from a nomination into a winner form — only the ones the
 * form currently leaves blank. Never overwrites what staff already typed.
 */
export const winnerPrefillFromNomination = (
  nomination: LinkableNomination,
  current: WinnerDraft
): Partial<WinnerDraft> => {
  const patch: Partial<WinnerDraft> = {};
  if (isBlank(current.title) && text(nomination.award_type)) {
    patch.title = text(nomination.award_type);
  }
  if (isBlank(current.recipient)) {
    const line = nominationRecipientLine(nomination);
    if (line) patch.recipient = line;
  }
  if (isBlank(current.watersystem)) {
    const ref = nominationSystemRef(nomination);
    if (ref != null) patch.watersystem = ref;
  }
  if (isBlank(current.award_year) && nomination.award_year != null) {
    patch.award_year = nomination.award_year;
  }
  return patch;
};

/**
 * Full create payload for "Add to Winners": hidden from the public gallery
 * until staff review it, first photograph reused as the gallery photo.
 */
export const winnerFromNomination = (nomination: LinkableNomination): WinnerDraft => {
  const ref = nomination.documentId ?? nomination.id ?? null;
  const photo = firstPhotographId(nomination);
  return {
    ...winnerPrefillFromNomination(nomination, {}),
    award_nomination: ref,
    is_published: false,
    sort_order: 0,
    ...(photo != null ? { photo } : {}),
  };
};
