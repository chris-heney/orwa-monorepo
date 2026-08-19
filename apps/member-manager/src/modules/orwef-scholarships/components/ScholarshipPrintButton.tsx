import React, { useState } from "react";
import { Button, useDataProvider, useNotify, useStore } from "react-admin";
import PrintIcon from "@mui/icons-material/Print";
import CircularProgress from "@mui/material/CircularProgress";
import {
  printScholarshipPacket,
  type ScholarshipPacketRecord,
} from "../helpers/printScholarshipPacket";

export const SCHOLARSHIP_SELECTED_IDS_KEY =
  "scholarship-applications.selectedIds";

type ScholarshipPrintButtonProps = {
  /** When set, print this record (Show view). */
  record?: ScholarshipPacketRecord | null;
  /** List mode: print selected row ids from the store. */
  listMode?: boolean;
  sx?: object;
};

const ScholarshipPrintButton = ({
  record,
  listMode = false,
  sx,
}: ScholarshipPrintButtonProps) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [selectedIds] = useStore<(string | number)[]>(
    SCHOLARSHIP_SELECTED_IDS_KEY,
    []
  );
  const [busy, setBusy] = useState(false);

  const disabled = listMode
    ? selectedIds.length === 0 || busy
    : record == null || busy;

  const title = listMode
    ? selectedIds.length === 0
      ? "Select one or more applications to print"
      : `Print ${selectedIds.length} selected packet${
          selectedIds.length === 1 ? "" : "s"
        }`
    : "Print application packet";

  const handleClick = async () => {
    setBusy(true);
    try {
      if (listMode) {
        for (const id of selectedIds) {
          const { data } = await dataProvider.getOne(
            "scholarship-applications",
            {
              id,
              meta: { populate: "*", raw: true },
            }
          );
          await printScholarshipPacket(data as ScholarshipPacketRecord);
        }
        notify(
          selectedIds.length === 1
            ? "Scholarship packet downloaded"
            : `${selectedIds.length} scholarship packets downloaded`,
          { type: "info" }
        );
      } else if (record != null) {
        // Prefer a freshly populated copy when the Show record is thin.
        let packet = record;
        if (record.id != null) {
          try {
            const { data } = await dataProvider.getOne(
              "scholarship-applications",
              {
                id: record.id as string | number,
                meta: { populate: "*", raw: true },
              }
            );
            packet = data as ScholarshipPacketRecord;
          } catch {
            packet = record;
          }
        }
        await printScholarshipPacket(packet);
        notify("Scholarship packet downloaded", { type: "info" });
      }
    } catch (error) {
      console.error(error);
      notify(
        error instanceof Error ? error.message : "Could not generate PDF",
        { type: "warning" }
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      label="Print"
      title={title}
      sx={sx}
    >
      {busy ? (
        <CircularProgress size={16} color="inherit" />
      ) : (
        <PrintIcon />
      )}
    </Button>
  );
};

export default ScholarshipPrintButton;
