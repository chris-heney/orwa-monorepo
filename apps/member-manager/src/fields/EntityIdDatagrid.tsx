import React from "react";
import {
  Datagrid as RaDatagrid,
  DatagridConfigurable as RaDatagridConfigurable,
} from "react-admin";
import {
  EditableDatagrid as RaEditableDatagrid,
  EditableDatagridConfigurable as RaEditableDatagridConfigurable,
} from "@react-admin/ra-editable-datagrid";
import { ensureEntityIdColumn } from "./ensureEntityIdColumn";

type WithChildren = { children?: React.ReactNode };

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

/** react-admin Datagrid with numeric PK display (documentId identity unchanged). */
export const Datagrid = withEntityIdColumn(
  RaDatagrid,
  "EntityIdDatagrid"
);

export const DatagridConfigurable = withEntityIdColumn(
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
