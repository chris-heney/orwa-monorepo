import React, { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  ConfigurableDatagridColumn,
  DataProvider,
  RaRecord,
  useDataProvider,
  useListContext,
  useNotify,
  useStore,
} from "react-admin";
import type { ActionManifest } from "../../../framework/manifest";
import HeadingAction from "../../_components/heading/HeadingAction";
import CustomExportFunction from "../../../helpers/custom-export-function";
import exportAttendees from "../helpers/exportAttendes";
import exportBooths from "../helpers/exportBooths";
import exportContestants from "../helpers/exportContestants";
import exportRegistrations from "../helpers/exportRegistrations";
import exportSponsors from "../helpers/exportSponsors";
import { useConferenceContext, useConferenceSelection } from "../ConferenceContext";
import { getConferenceFilterId } from "../helpers/mergeConferenceAcrossTabFilters";

type ResourceExporter = (
  records: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string,
  dataProvider: DataProvider
) => void | Promise<void>;

/** The module's per-resource CSV exporters (relations resolved via the data provider). */
const EXPORTERS: Record<string, ResourceExporter> = {
  "conference-attendees": exportAttendees,
  "conference-booths": exportBooths,
  "conference-registrations": exportRegistrations,
  "conference-contestants": exportContestants,
  "conference-sponsors": exportSponsors,
};

const EXPORT_MAX_RESULTS = 1000;

/**
 * Export the current tab's list with the module's resource-aware exporters
 * (they need the data provider to resolve relations, which the framework's
 * `list.exporter(records, ctx)` does not hand over) using the user's visible
 * DatagridConfigurable columns, named "<Conference> <Tab>-<date>" as before.
 */
const ConferenceExportAction = () => {
  // `filter` is the manifest's permanent conference / year scope.
  const { resource, filterValues, filter, sort, total } = useListContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { conferences, selectedTab } = useConferenceContext();
  const selection = useConferenceSelection();
  const [loading, setLoading] = useState(false);

  const preferenceKey = `${resource}.datagrid`;
  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );
  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );

  const handleClick = async () => {
    if (!resource) return;
    setLoading(true);
    try {
      const { data } = await dataProvider.getList(resource, {
        pagination: { page: 1, perPage: EXPORT_MAX_RESULTS },
        sort: sort ?? { field: "id", order: "ASC" },
        filter: { ...(filterValues ?? {}), ...(filter ?? {}) },
      });
      const conferenceName =
        conferences.find(
          (c) => getConferenceFilterId(c) === selection.conference
        )?.name ?? "";
      const tabTitle =
        selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1);
      const title = `${conferenceName} ${tabTitle}-${new Date().toLocaleDateString()}`;
      const exporter = EXPORTERS[resource] ?? CustomExportFunction;
      await exporter(data, availableColumns, columnIds, title, dataProvider);
    } catch (e) {
      console.error(e);
      notify("Export failed.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeadingAction
      icon={<FileDownloadIcon fontSize="small" />}
      label="Export"
      onClick={handleClick}
      disabled={loading || total === 0}
    />
  );
};

export const conferenceExportAction: ActionManifest = {
  id: "export",
  label: "Export",
  icon: FileDownloadIcon,
  scope: "list",
  component: ConferenceExportAction,
  order: 70,
};

export default ConferenceExportAction;
