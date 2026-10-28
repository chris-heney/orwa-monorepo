import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNotify, useRefresh } from "react-admin";
import {
  regenerateApplicantPdf,
  RegeneratedApplicantPdf,
} from "../helpers/regenerateApplicantPdf";

interface RegenerateApplicantPdfButtonProps {
  documentId: string;
  hasPdf: boolean;
  /** Receives the regenerated file so the view link can bust its cache immediately. */
  onRegenerated?: (file: RegeneratedApplicantPdf) => void;
}

/**
 * Re-render the stored applicant PDF from the current application record.
 * Shown on the grant application view for every status; New Application /
 * Awaiting Committee saves already regenerate automatically.
 */
const RegenerateApplicantPdfButton = ({
  documentId,
  hasPdf,
  onRegenerated,
}: RegenerateApplicantPdfButtonProps) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    try {
      const file = await regenerateApplicantPdf(documentId);
      onRegenerated?.(file);
      notify(
        hasPdf
          ? `Applicant PDF regenerated (${file.name}).`
          : `Applicant PDF created (${file.name}).`,
        { type: "success" }
      );
      refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      notify(`Could not regenerate the applicant PDF: ${message}`, {
        type: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      color="primary"
      onClick={handleClick}
      disabled={busy}
      startIcon={
        busy ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon />
      }
      title="Re-render the stored applicant PDF from the current application data"
    >
      {hasPdf ? "Regenerate PDF" : "Generate PDF"}
    </Button>
  );
};

export default RegenerateApplicantPdfButton;
