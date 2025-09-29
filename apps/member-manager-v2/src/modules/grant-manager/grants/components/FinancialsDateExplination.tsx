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