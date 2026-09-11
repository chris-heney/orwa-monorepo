import React, { useEffect, useMemo } from "react";
import {
  Datagrid as RaDatagrid,
  DatagridConfigurable as RaDatagridConfigurable,
  useResourceContext,
  useStore,
  useTranslate,
} from "react-admin";
import {
  EditableDatagrid as RaEditableDatagrid,
  EditableDatagridConfigurable as RaEditableDatagridConfigurable,
} from "@react-admin/ra-editable-datagrid";
import { ensureEntityIdColumn } from "./ensureEntityIdColumn";

type WithChildren = { children?: React.ReactNode };

type ColumnMeta = { index: string; source?: string; label?: string };

/**
 * The column list react-admin's `DatagridConfigurable` registers for these
 * children (same index / source / label rules), so it can be compared with
 * what the store holds.
 */
export const registeredColumnsFor = (
  children: React.ReactNode,
  translate: (key: string, options?: Record<string, unknown>) => string
): ColumnMeta[] =>
  React.Children.toArray(children)
    .filter((child): child is React.ReactElement<{ source?: string; label?: unknown }> =>
      React.isValidElement(child)
    )
    .map((child, index) => ({
      index: String(index),
      source: child.props.source,
      label:
        child.props.label && typeof child.props.label === "string"
          ? child.props.label
          : child.props.source
            ? undefined
            : translate("ra.configurable.Datagrid.unlabeled", {
                column: index,
                _: "Unlabeled column #%{column}",
              }),
    }));

export const columnsSignature = (columns: ColumnMeta[] | undefined): string =>
  JSON.stringify(
    (columns ?? []).map((c) => [String(c.index), c.source ?? null, c.label ?? null])
  );

/**
 * react-admin re-registers `preferences.<key>.availableColumns` only when the
 * column COUNT changes. Preferences sync across devices, so an older layout
 * with the same number of columns (or entries whose labels were never
 * stored) survives indefinitely — and the Columns picker plus every CSV export
 * read those stale entries. Rewrite them whenever the signature differs.
 */
const useRegisteredColumnsInSync = (
  columns: React.ReactNode,
  preferenceKey: string | undefined,
  resourceProp: string | undefined
) => {
  const resource = useResourceContext({ resource: resourceProp });
  const translate = useTranslate();
  const [stored, setStored] = useStore<ColumnMeta[]>(
    `preferences.${preferenceKey || `${resource}.datagrid`}.availableColumns`,
    []
  );
  const expected = useMemo(
    () => registeredColumnsFor(columns, translate),
    [columns, translate]
  );
  const expectedSignature = columnsSignature(expected);
  const storedSignature = columnsSignature(stored);

  useEffect(() => {
    // An empty store is react-admin's own first registration; leave it be.
    if (!resource || !Array.isArray(stored) || stored.length === 0) return;
    if (storedSignature !== expectedSignature) setStored(expected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, expectedSignature, storedSignature]);
};

function withEntityIdColumn<P extends WithChildren>(
  Component: React.ComponentType<P>,
  displayName: string
) {
  const Wrapped = (props: P) => {
    const { children, ...rest } = props;
    return (
      <Component {...(rest as P)}>{ensureEntityIdColumn(children)}</Component>
    );
  };
  Wrapped.displayName = displayName;
  return Wrapped;
}

function withEntityIdColumnConfigurable<
  P extends WithChildren & { preferenceKey?: string; resource?: string }
>(Component: React.ComponentType<P>, displayName: string) {
  const Wrapped = (props: P) => {
    const { children, ...rest } = props;
    const columns = ensureEntityIdColumn(children);
    useRegisteredColumnsInSync(columns, props.preferenceKey, props.resource);
    return <Component {...(rest as P)}>{columns}</Component>;
  };
  Wrapped.displayName = displayName;
  return Wrapped;
}

/** react-admin Datagrid with numeric PK display (documentId identity unchanged). */
export const Datagrid = withEntityIdColumn(
  RaDatagrid,
  "EntityIdDatagrid"
);

export const DatagridConfigurable = withEntityIdColumnConfigurable(
  RaDatagridConfigurable,
  "EntityIdDatagridConfigurable"
);

export const EditableDatagrid = withEntityIdColumn(
  RaEditableDatagrid,
  "EntityIdEditableDatagrid"
);

export const EditableDatagridConfigurable = withEntityIdColumn(
  RaEditableDatagridConfigurable,
  "EntityIdEditableDatagridConfigurable"
);
