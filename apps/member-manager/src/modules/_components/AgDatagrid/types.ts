import type { ColumnState, ColDef } from "ag-grid-community";

export type AgDatagridPrefs = {
  pageSize?: number;
  columnState?: ColumnState[];
};

export type AgDatagridRowClick =
  | string
  | false
  | ((
      id: string | number,
      resource: string,
      record: Record<string, unknown>
    ) => string | false);

export type AgDatagridProps = {
  /** RA Field children (mode A). Ignored when `columnDefs` is provided. */
  children?: React.ReactNode;
  /** Native AG Grid columns (mode B). */
  columnDefs?: ColDef[];
  /** useStore key for widths/pageSize; defaults to `agGrid.<resource>`. */
  preferenceKey?: string;
  /**
   * RA SelectColumnsButton key (show/hide + order).
   * Defaults to `<resource>.datagrid` — same as DatagridConfigurable.
   */
  columnsPreferenceKey?: string;
  /**
   * Field `source` values hidden until the user enables them in COLUMNS.
   * Same store key as RA DatagridConfigurable (`preferences.<key>.omit`).
   */
  omit?: string[];
  rowClick?: AgDatagridRowClick;
  height?: string | number;
  className?: string;
  /**
   * Enable multi-row checkboxes. Selected row ids are written to
   * `useStore(selectionStoreKey)` (defaults to `<resource>.selectedIds`).
   */
  rowSelection?: boolean;
  selectionStoreKey?: string;
};
