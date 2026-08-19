import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";

const items = [
  ["Draft", "Saved internally but not submitted by the applicant."],
  ["Submitted", "The public form created a complete application."],
  ["Under Review", "Staff or committee is evaluating the packet."],
  ["Approved", "The applicant was selected for an ORWEF scholarship."],
  ["Denied", "The application was not selected."],
];

const ScholarshipGlossary = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>What these counts mean</DialogTitle>
    <DialogContent>
      {items.map(([title, body]) => (
        <Typography key={title} sx={{ mb: 1.5 }}>
          <strong>{title}.</strong> {body}
        </Typography>
      ))}
    </DialogContent>
  </Dialog>
);

export default ScholarshipGlossary;
