import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, useTheme } from "@mui/material";
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeDark,
  colorSchemeLight,
  themeQuartz,
  type ColDef,
  type GridReadyEvent,
  type SortChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  useListContext,
  useRedirect,
  useResourceContext,
  useStore,
  useTranslate,
} from "react-admin";
import { childrenToColumnDefs } from "./childrenToColumnDefs";
import type { AgDatagridPrefs, AgDatagridProps } from "./types";

ModuleRegistry.registerModules([AllCommunityModule]);

const INTERACTIVE_SELECTOR =
  "input,button,a,label,textarea,select,.MuiCheckbox-root,.MuiSwitch-root,.MuiIconButton-root,[data-ag-skip-row-click]";

type RaColumnMeta = {
  index: string;
  source?: string;
  label?: string;
};

const AgDatagrid = ({
  children,
  columnDefs: columnDefsProp,
  preferenceKey,
  columnsPreferenceKey,
  rowClick = "show",
  height = "calc(100vh - 320px)",
  className,
}: AgDatagridProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const gridRef = useRef<AgGridReact>(null);
  const appliedWidths = useRef(false);
  const pageSizeHydrated = useRef(false);

  const {
    data,
    isLoading,
    isFetching,
    sort,
    setSort,
    perPage,
    setPerPage,
    resource: listResource,
  } = useListContext();
  const resourceContext = useResourceContext();
  const resource = resourceContext || listResource;
  const redirect = useRedirect();

  const storeKey = preferenceKey || `agGrid.${resource}`;
  const raColumnsKey = columnsPreferenceKey || `${resource}.datagrid`;
  const [prefs, setPrefs] = useStore<AgDatagridPrefs>(storeKey, {});

  // Same preference shape as DatagridConfigurable so the black-bar
  // SelectColumnsButton (show/hide + reorder) drives this grid.
  const [availableColumns, setAvailableColumns] = useStore<RaColumnMeta[]>(
    `preferences.${raColumnsKey}.availableColumns`,
    []
  );
  const [columnIds] = useStore<string[] | undefined>(
    `preferences.${raColumnsKey}.columns`,
    undefined
  );

  type FieldChild = React.ReactElement<{
    source?: string;
    label?: React.ReactNode;
  }>;

  const fieldChildren = useMemo(
    () =>
      React.Children.toArray(children).filter((child): child is FieldChild =>
        React.isValidElement(child)
      ),
    [children]
  );

  // Register columns for SelectColumnsButton / export (index-based, like RA).
  useEffect(() => {
    const columns: RaColumnMeta[] = fieldChildren.map((child, index) => ({
      index: String(index),
      source: child.props.source,
      label:
        child.props.label && typeof child.props.label === "string"
          ? child.props.label
          : child.props.source
            ? undefined
            : translate("ra.configurable.Datagrid.unlabeled", {
                column: index,
                _: `Unlabeled column #%{column}`,
              }),
    }));
    if (columns.length !== availableColumns.length) {
      setAvailableColumns(columns);
    }
  }, [availableColumns.length, fieldChildren, setAvailableColumns, translate]);

  const columnDefs = useMemo<ColDef[]>(() => {
    if (columnDefsProp?.length) return columnDefsProp;

    const ordered =
      columnIds === undefined
        ? fieldChildren
        : columnIds
            .map((index) => fieldChildren[Number(index)])
            .filter(Boolean);

    return childrenToColumnDefs(ordered);
  }, [children, columnDefsProp, columnIds, fieldChildren]);

  // Hydrate page size once, then persist later changes only.
  useEffect(() => {
    if (prefs.pageSize && prefs.pageSize !== perPage) {
      setPerPage(prefs.pageSize);
    }
    pageSizeHydrated.current = true;
    // Clear a stuck sort on a non-API field (e.g. previous Total Paid Out clicks).
    if (sort?.field?.startsWith("label:")) {
      setSort({ field: "application_date", order: "DESC" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only hydrate
  }, []);

  useEffect(() => {
    if (!pageSizeHydrated.current) return;
    if (!perPage || perPage === prefs.pageSize) return;
    setPrefs((prev) => ({ ...prev, pageSize: perPage }));
  }, [perPage, prefs.pageSize, setPrefs]);

  const persistColumnWidths = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    setPrefs((prev) => ({
      ...prev,
      columnState: api.getColumnState(),
    }));
  }, [setPrefs]);

  const applySavedWidths = useCallback(
    (api: GridReadyEvent["api"]) => {
      if (!prefs.columnState?.length) return;
      // Visibility/order come from RA SelectColumnsButton; only restore widths.
      // Clamp so previously saved ultra-narrow Status/etc. don't come back.
      const widthState = prefs.columnState.map((c) => {
        const floor =
          c.colId === "label:Status" || c.colId === "Status" ? 140 : 80;
        return {
          colId: c.colId,
          width:
            typeof c.width === "number" ? Math.max(c.width, floor) : undefined,
          flex: c.flex,
          pinned: c.pinned,
        };
      });
      api.applyColumnState({ state: widthState });
    },
    [prefs.columnState]
  );

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      if (!appliedWidths.current) {
        applySavedWidths(event.api);
        appliedWidths.current = true;
      }
    },
    [applySavedWidths]
  );

  // Re-apply widths when column set changes (tab back / columns toggled).
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api || !prefs.columnState?.length) return;
    applySavedWidths(api);
  }, [applySavedWidths, columnDefs]);

  const onSortChanged = useCallback(
    (event: SortChangedEvent) => {
      const sorted = event.api
        .getColumnState()
        .filter((c) => c.sort != null)
        .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));

      if (sorted.length === 0) return;

      const primary = sorted[0];
      const col = event.api.getColumn(primary.colId || "");
      const colDef = col?.getColDef();
      // Guard: never send label:* / computed columns to the API.
      if (!colDef?.sortable || !colDef.field || String(colDef.field).startsWith("label:")) {
        event.api.applyColumnState({
          defaultState: { sort: null },
          state: sort?.field
            ? [
                {
                  colId: sort.field,
                  sort: sort.order === "DESC" ? "desc" : "asc",
                },
              ]
            : [],
        });
        return;
      }

      const field = String(colDef.field);
      const order = primary.sort === "desc" ? "DESC" : "ASC";
      if (sort?.field === field && sort?.order === order) return;
      setSort({ field, order });
    },
    [setSort, sort?.field, sort?.order]
  );

  // Reflect RA list sort into AG Grid header indicators.
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api || !sort?.field) return;
    api.applyColumnState({
      defaultState: { sort: null },
      state: [
        {
          colId: sort.field,
          sort: sort.order === "DESC" ? "desc" : "asc",
        },
      ],
    });
  }, [sort?.field, sort?.order, data]);

  const handleRowClicked = useCallback(
    (event: { data?: Record<string, unknown>; event?: Event | null }) => {
      if (!rowClick || !event.data) return;
      const target = event.event?.target as HTMLElement | null;
      if (target?.closest?.(INTERACTIVE_SELECTOR)) return;

      const id = event.data.id as string | number;
      const result =
        typeof rowClick === "function"
          ? rowClick(id, resource, event.data)
          : rowClick;
      if (!result) return;
      redirect(result, resource, id);
    },
    [redirect, resource, rowClick]
  );

  const agTheme = useMemo(
    () =>
      themeQuartz.withPart(
        theme.palette.mode === "dark" ? colorSchemeDark : colorSchemeLight
      ),
    [theme.palette.mode]
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: true,
      minWidth: 80,
      comparator: () => 0,
    }),
    []
  );

  const rowData = useMemo(() => data ?? [], [data]);

  return (
    <Box className={className} sx={{ width: "100%" }}>
      <Box
        sx={{
          width: "100%",
          height,
          minHeight: 360,
          "& .ag-root-wrapper": {
            borderRadius: 1,
          },
        }}
      >
        <AgGridReact
          ref={gridRef}
          theme={agTheme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={(p) => String(p.data?.id ?? p.data?.documentId ?? "")}
          loading={Boolean(isLoading || isFetching)}
          animateRows
          suppressCellFocus
          onGridReady={onGridReady}
          onSortChanged={onSortChanged}
          onColumnMoved={persistColumnWidths}
          onColumnResized={(e) => {
            if (e.finished) persistColumnWidths();
          }}
          onRowClicked={handleRowClicked}
          rowStyle={rowClick ? { cursor: "pointer" } : undefined}
        />
      </Box>
    </Box>
  );
};

export default AgDatagrid;
