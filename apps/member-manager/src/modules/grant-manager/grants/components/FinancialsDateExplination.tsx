import React from "react";
import { Box, Typography, Modal, Button } from "@mui/material";

interface FilterExplanationModalProps {
  open: boolean;
  onClose: () => void;
}

const FilterExplanationModal: React.FC<FilterExplanationModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="filter-explanation-modal"
      aria-describedby="filter-explanation-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "4px",
        }}
      >
        <Typography variant="h6" id="filter-explanation-modal" gutterBottom>
          How Applications Are Filtered
        </Typography>
        <Typography variant="body1" id="filter-explanation-modal-description">
          Applications are filtered based on the following rules:
          <ul>
            <li>
              If the application has a <strong>committee review date</strong>, it is
              filtered based on whether the <strong>committee review date</strong> falls
              within the selected date range.
            </li>
            <li>
              If the application does not have a <strong>committee review date</strong>,
              it is filtered based on either the <strong>application submission date</strong> or
              <strong> creation date</strong>, whichever is available.
            </li>
            <li>
              Applications with the status <strong>&quot;New Application&quot;</strong> are
              always filtered based on their <strong>creation date</strong>.
            </li>
            <li>
              <strong>Reimbursement payouts</strong> are attributed to the fiscal year
              of their application&apos;s <strong>committee review date</strong>, not the
              payout transaction date. This keeps disbursements in the same year as
              the approval they draw from.
            </li>
            <li>
              <strong>Administrative payouts</strong> are not tied to an application,
              so they are filtered by their <strong>transaction date</strong>.
            </li>
            <li>
              <strong>Previous FY Rollover</strong> is grant money carried in from
              every earlier fiscal year: allocation that was never awarded, plus
              funds returned by closed-out applications that spent less than their
              award. It is added to the year&apos;s available funds, so a year whose
              approvals draw on carryover does not appear overdrawn. Awards that are
              still open but unpaid remain committed and do not roll over.
            </li>
            <li>
              <strong>Closeout returns accrue over time.</strong> When an open award
              closes out and returns unspent funds, the rollover of the year that
              award belonged to grows. Historical figures are therefore a living
              record — every view reflects the books as of today, and a past
              year&apos;s numbers can shift as its awards finish closing out.
            </li>
          </ul>
        </Typography>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ mt: 2, float: "right" }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default FilterExplanationModal;