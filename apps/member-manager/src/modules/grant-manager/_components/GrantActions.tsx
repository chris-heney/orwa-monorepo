import React from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  ConfigurableDatagridColumn,
  RaRecord,
  useDataProvider,
  useStore,
} from "react-admin";
import { usePageManifest } from "../../../framework/PageContext";
import { useListManifest } from "../../../framework/ListScope";
import HeadingAction from "../../_components/heading/HeadingAction";
import { ExportAction } from "../../_components/heading/HeadingActions";
import CustomExportFunction from "../../../helpers/custom-export-function";
import { useGrantContext } from "../GrantContextProvider";
import exportPayouts from "../payouts/helpers/exportPayouts";
import ExportApplications from "../grant-application/helpers/ExportApplication";
import ExportAdminPayouts from "../grant-application/helpers/ExportAdminPayouts";
import { IGrantApplication } from "../grant-application/GrantApplicationTypes";
import { payoutTypeFromTab } from "../payouts/helpers/payoutCreateDefaults";

/**
 * Bar title: the selected grant's name (the framework appends ` : <tab>`).
 * A component rather than `ctx.store(...)` so no extra "selected grant name"
 * RaStore key has to be synced to Strapi user preferences.
 */
export const SelectedGrantTitle = () => {
  const { grants, grantIndex } = useGrantContext();
  const name = grants[grantIndex]?.name;
  return <>{name && name !== "grant" ? name : "Grant Manager"}</>;
};

/**
 * Export the active tab's list with the per-tab exporter the legacy header
 * used (column selection from the DatagridConfigurable preferences, related
 * records resolved through the data provider).
 */
export const GrantExportAction = () => {
  const tab = usePageManifest().tab?.key;
  const resource = useListManifest()?.resource ?? "";
  const dataProvider = useDataProvider();

  const preferenceKey = `${resource}.datagrid`;
  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );
  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );

  const exporter = (records: RaRecord[]) => {
    switch (tab) {
      case "applications":
        return ExportApplications(
          records as IGrantApplication[],
          availableColumns,
          columnIds,
          "Rig Applications",
          dataProvider
        );
      case "payouts":
        return exportPayouts(
          records,
          availableColumns,
          columnIds,
          "Rig Payouts",
          dataProvider
        );
      case "Admin Payouts":
        return ExportAdminPayouts(records, "Administrative Payouts", dataProvider);
      default:
        return CustomExportFunction(
          records,
          availableColumns,
          columnIds,
          "Grant Scores",
          dataProvider
        );
    }
  };

  return <ExportAction exporter={exporter} />;
};

/** "Payout" — opens the New Payout modal rendered by the payout panels. */
export const NewPayoutAction = () => {
  const tab = usePageManifest().tab?.key;
  const { openCreatePayoutModal } = useGrantContext();
  return (
    <HeadingAction
      icon={<AddIcon fontSize="small" />}
      label="Payout"
      onClick={() => openCreatePayoutModal(payoutTypeFromTab(tab))}
      data-testid="heading-action-new-payout"
    />
  );
};
