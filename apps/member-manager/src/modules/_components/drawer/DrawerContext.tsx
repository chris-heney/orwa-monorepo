import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import {
  Identifier,
  RaRecord,
  SortPayload,
  useRecordContext,
  useResourceContext,
} from 'react-admin';
import { getRelationFilterId } from '../../../helpers/strapiIds';

/**
 * THE one way a right drawer learns what it is about.
 *
 * A drawer is opened either from a show/edit page (it is about the CURRENT
 * RECORD) or from a list/dashboard (it is about the CURRENT RECORD LIST).
 * Both shapes carry the react-admin `resource` so a drawer body can be
 * reused across modules (Activity Feed, Notifications, Filters, …).
 *
 * Ids follow the data-provider convention: `id` is the Strapi documentId
 * (react-admin identifier, use for routing / CRUD) and `entityId` is the
 * numeric PK (use for legacy numeric APIs such as `activity-relations`).
 */
export type RecordDrawerContext = {
  kind: 'record';
  resource: string;
  /** react-admin identifier — Strapi documentId after the provider remap. */
  id: Identifier;
  /** Numeric Strapi PK when the record carries one (`record.entityId`). */
  entityId?: number;
  record?: RaRecord;
};

export type ListDrawerContext = {
  kind: 'list';
  resource: string;
  /** Effective list filter (react-admin shape, before Strapi serialization). */
  filter?: Record<string, unknown>;
  sort?: SortPayload;
  selectedIds?: Identifier[];
  total?: number;
};

export type DrawerContextValue = RecordDrawerContext | ListDrawerContext;

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export const DrawerContextProvider = ({
  value,
  children,
}: {
  value: DrawerContextValue | undefined;
  children: ReactNode;
}) => <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;

/** Whatever context the enclosing RightDrawer was given (may be undefined). */
export const useDrawerContext = () => useContext(DrawerContext);

/** Record context of the enclosing drawer, or undefined on list drawers. */
export const useRecordDrawerContext = (): RecordDrawerContext | undefined => {
  const ctx = useContext(DrawerContext);
  return ctx?.kind === 'record' ? ctx : undefined;
};

/** List context of the enclosing drawer, or undefined on record drawers. */
export const useListDrawerContext = (): ListDrawerContext | undefined => {
  const ctx = useContext(DrawerContext);
  return ctx?.kind === 'list' ? ctx : undefined;
};

/** Build a record context from a record + resource (plain function). */
export const recordDrawerContext = (
  record: RaRecord | undefined | null,
  resource: string
): RecordDrawerContext | undefined => {
  if (!record || record.id == null) return undefined;
  return {
    kind: 'record',
    resource,
    id: record.id,
    entityId: getRelationFilterId(record),
    record,
  };
};

/** Build a list context (plain function — list state usually lives in a module context). */
export const listDrawerContext = (
  input: Omit<ListDrawerContext, 'kind'>
): ListDrawerContext => ({ kind: 'list', ...input });

/**
 * Record context for the record currently in react-admin's RecordContext
 * (show / edit pages). Returns undefined until the record has loaded.
 */
export const useCurrentRecordDrawerContext = (
  resourceOverride?: string
): RecordDrawerContext | undefined => {
  const record = useRecordContext();
  const resource = useResourceContext();
  const effectiveResource = resourceOverride ?? resource;
  return useMemo(
    () => recordDrawerContext(record, effectiveResource),
    [record, effectiveResource]
  );
};

export default DrawerContext;
