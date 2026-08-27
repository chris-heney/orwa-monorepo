import React, { useState } from "react";
import { useDataProvider, useNotify, useStore } from "react-admin";
import {
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
  useTheme,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import {
  AWARD_PRINT_POPULATE,
  nominationRecordId,
  type AwardNominationPrintRecord,
} from "../helpers/nominationPrintModel";
import { printNominationApplications } from "../helpers/printNominationApplication";

export const AWARD_SELECTED_IDS_KEY = "award-nominations.selectedIds";

const EMPTY_SELECTION_TOAST = "Select at least one nomination to print";

const fetchNomination = async (
  dataProvider: ReturnType<typeof useDataProvider>,
  id: string | number
): Promise<AwardNominationPrintRecord> => {
  const { data } = await dataProvider.getOne("award-nominations", {
    id,
    meta: { populate: AWARD_PRINT_POPULATE, raw: true },
  });
  return data as AwardNominationPrintRecord;
};

const usePrintNominations = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{
    text: string;
    severity: "info" | "warning";
  } | null>(null);

  const showToast = (text: string, severity: "info" | "warning") => {
    setToast({ text, severity });
    notify(text, { type: severity });
  };

  const printIds = async (ids: Array<string | number>) => {
    if (ids.length === 0) {
      showToast(EMPTY_SELECTION_TOAST, "warning");
      return;
    }
    setBusy(true);
    try {
      const records: AwardNominationPrintRecord[] = [];
      for (const id of ids) {
        records.push(await fetchNomination(dataProvider, id));
      }
      await printNominationApplications(records);
      showToast(
        ids.length === 1
          ? "Print dialog opened"
          : `${ids.length} print jobs sent (one per nomination)`,
        "info"
      );
    } catch (error) {
      console.error(error);
      showToast(
        error instanceof Error
          ? error.message
          : "Could not generate the application PDF",
        "warning"
      );
    } finally {
      setBusy(false);
    }
  };

  const toastEl = (
    <Snackbar
      open={Boolean(toast)}
      autoHideDuration={5000}
      onClose={() => setToast(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={toast?.severity || "info"}
        variant="filled"
        onClose={() => setToast(null)}
        sx={{ width: "100%" }}
      >
        {toast?.text}
      </Alert>
    </Snackbar>
  );

  return { busy, printIds, toastEl };
};

/** Subheader icon — immediately to the right of Filter. */
export const AwardPrintSelectedButton = () => {
  const [selectedIds] = useStore<(string | number)[]>(
    AWARD_SELECTED_IDS_KEY,
    []
  );
  const { busy, printIds, toastEl } = usePrintNominations();
  const empty = selectedIds.length === 0;

  return (
    <>
      <Tooltip
        title={
          empty ? "Select one or more nominations to print" : "Print Selected"
        }
      >
        <span>
          <IconButton
            onClick={() => {
              void printIds(selectedIds);
            }}
            size="small"
            color="primary"
            aria-label="Print Selected"
            disabled={busy}
            sx={{
              opacity: empty && !busy ? 0.45 : 1,
              "&:hover": { color: "white" },
            }}
          >
            {busy ? (
              <CircularProgress size={16} sx={{ color: "white" }} />
            ) : (
              <PrintIcon fontSize="small" sx={{ color: "white" }} />
            )}
          </IconButton>
        </span>
      </Tooltip>
      {toastEl}
    </>
  );
};

export const AwardRowPrintButton = ({
  record,
}: {
  record: AwardNominationPrintRecord | Record<string, unknown>;
}) => {
  const theme = useTheme();
  const { busy, printIds, toastEl } = usePrintNominations();
  const id = nominationRecordId(record as AwardNominationPrintRecord);

  return (
    <>
      <Tooltip title="Print application">
        <span data-ag-skip-row-click="">
          <IconButton
            size="small"
            aria-label="Print application"
            disabled={busy || id == null}
            onClick={(event) => {
              event.stopPropagation();
              if (id == null) return;
              void printIds([id]);
            }}
            sx={{
              color: theme.palette.mode === "dark" ? "grey.100" : "grey.800",
              "&:hover": { color: "primary.main" },
            }}
          >
            {busy ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <PrintIcon fontSize="small" />
            )}
          </IconButton>
        </span>
      </Tooltip>
      {toastEl}
    </>
  );
};
