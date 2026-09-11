import React from "react";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import type { ActionManifest } from "../../framework/manifest";
import HeadingAction from "../_components/heading/HeadingAction";
import { useScheduleBar } from "./ScheduleBarContext";

const SCHEDULE_RESOURCE = "conference-schedules";

const DuplicateScheduleAction = () => {
  const bar = useScheduleBar();
  return (
    <HeadingAction
      icon={<FileCopyIcon fontSize="small" />}
      label="Duplicate schedule"
      disabled={!bar?.commands}
      onClick={() => bar?.setDialog("duplicate")}
      data-testid="heading-action-schedule-duplicate"
    />
  );
};

const ClearScheduleAction = () => {
  const bar = useScheduleBar();
  return (
    <HeadingAction
      icon={<DeleteIcon fontSize="small" />}
      label="Clear schedule"
      color="error"
      disabled={!bar?.commands || bar.recordCount === 0}
      onClick={() => bar?.setDialog("clear")}
      data-testid="heading-action-schedule-clear"
    />
  );
};

const PrintViewAction = () => {
  const bar = useScheduleBar();
  const on = Boolean(bar?.printView);
  return (
    <HeadingAction
      icon={on ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
      label={on ? "Exit print view" : "Print view"}
      active={on}
      disabled={!bar?.commands}
      onClick={() => bar?.setPrintView((prev) => !prev)}
      data-testid="heading-action-schedule-print-view"
    />
  );
};

/** Only offered in print view — the PDF captures the print layout. */
const DownloadPdfAction = () => {
  const bar = useScheduleBar();
  if (!bar?.printView) return null;
  return (
    <HeadingAction
      icon={<PictureAsPdfIcon fontSize="small" />}
      label="Download PDF"
      disabled={!bar.commands || bar.recordCount === 0}
      onClick={() => bar.commands?.downloadPdf()}
      data-testid="heading-action-schedule-pdf"
    />
  );
};

const ExportScheduleAction = () => {
  const bar = useScheduleBar();
  return (
    <HeadingAction
      icon={<FileDownloadIcon fontSize="small" />}
      label="Export"
      disabled={!bar?.commands || bar.recordCount === 0}
      onClick={() => bar?.commands?.exportCsv()}
      data-testid="heading-action-schedule-export"
    />
  );
};

/**
 * The Schedule tab's title-bar actions (were on-page `ScheduleControls`
 * buttons in both the edit and print views). Export is the schedule-shaped
 * CSV — the generic grid exporter read DatagridConfigurable column prefs this
 * tab never registers, so it downloaded an empty file.
 */
export const scheduleBarActions: ActionManifest[] = [
  {
    id: "schedule-duplicate",
    label: "Duplicate schedule",
    icon: FileCopyIcon,
    scope: "list",
    can: ["create", SCHEDULE_RESOURCE],
    component: DuplicateScheduleAction,
    order: 62,
  },
  {
    id: "schedule-clear",
    label: "Clear schedule",
    icon: DeleteIcon,
    scope: "list",
    can: ["delete", SCHEDULE_RESOURCE],
    component: ClearScheduleAction,
    order: 64,
  },
  {
    id: "schedule-print-view",
    label: "Print view",
    icon: VisibilityIcon,
    scope: "list",
    component: PrintViewAction,
    order: 66,
  },
  {
    id: "schedule-pdf",
    label: "Download PDF",
    icon: PictureAsPdfIcon,
    scope: "list",
    component: DownloadPdfAction,
    order: 68,
  },
  {
    id: "schedule-export",
    label: "Export",
    icon: FileDownloadIcon,
    scope: "list",
    component: ExportScheduleAction,
    order: 70,
  },
];

export default scheduleBarActions;
