import React from "react";
import get from "lodash/get";
import type { ColDef, ICellRendererParams, ValueGetterParams } from "ag-grid-community";
import { RecordContextProvider } from "react-admin";
import { getDisplayEntityId } from "../../../helpers/strapiIds";

type FieldProps = {
  source?: string;
  sortBy?: string;
  label?: React.ReactNode;
  textAlign?: "left" | "right" | "center";
  sortable?: boolean;
};

const headerNameFromLabel = (label: React.ReactNode, fallback: string) => {
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }
  return fallback;
};

export const getColId = (
  element: React.ReactElement<FieldProps>,
  index: number
) => {
  const { source, sortBy, label } = element.props;
  if (source) return source;
  if (sortBy) return sortBy;
  if (typeof label === "string" && label) return `label:${label}`;
  return `col-${index}`;
};

const makeRaFieldRenderer = (fieldElement: React.ReactElement) => {
  const Renderer = (params: ICellRendererParams) => {
    if (!params.data) return null;
    return (
      <RecordContextProvider value={params.data}>
        {React.cloneElement(fieldElement as React.ReactElement<any>, {
          record: params.data,
        })}
      </RecordContextProvider>
    );
  };
  Renderer.displayName = "RaFieldCellRenderer";
  return Renderer;
};

/**
 * Map react-admin Field / FunctionField children into AG Grid ColDefs.
 * Cells render the original RA elements inside a RecordContextProvider.
 *
 * Server sort is only enabled when `source` or `sortBy` is present — computed
 * FunctionFields (e.g. Balance) must not send bogus sort fields to Strapi.
 */
export const childrenToColumnDefs = (children: React.ReactNode): ColDef[] => {
  return React.Children.toArray(children)
    .filter((child): child is React.ReactElement<FieldProps> =>
      React.isValidElement(child)
    )
    .map((child, index) => {
      const { source, sortBy, label, textAlign, sortable } = child.props;
      const colId = getColId(child, index);
      const sortField = sortBy || source;
      const canSort = Boolean(sortField) && sortable !== false;
      const headerName = headerNameFromLabel(label, colId);

      const cellStyle: ColDef["cellStyle"] =
        textAlign === "right"
          ? {
              textAlign: "right",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }
          : { display: "flex", alignItems: "center" };

      return {
        colId,
        field: sortField || colId,
        headerName,
        sortable: canSort,
        resizable: true,
        minWidth: headerName === "Status" ? 140 : 80,
        // Keep server order; header still shows sort UI via RA setSort.
        comparator: () => 0,
        cellStyle,
        valueGetter: (params: ValueGetterParams) => {
          if (!params.data) return null;
          if (source === "id" || source === "entityId") {
            return getDisplayEntityId(params.data) ?? null;
          }
          if (source) return get(params.data, source);
          return null;
        },
        cellRenderer: makeRaFieldRenderer(child),
      } satisfies ColDef;
    });
};
