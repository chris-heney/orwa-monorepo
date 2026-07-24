import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useScheduleContext } from "../ScheduleProvider";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";

const ClearScheduleModal: React.FC = () => {
  const { isClearModalOpen, setIsClearModalOpen, handleClearSchedule } =
    useScheduleContext();

  return (
    <Modal open={isClearModalOpen} onClose={() => setIsClearModalOpen(false)}>
      <Box
        sx={{
          backgroundColor: "background.paper",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        <CustomSecondaryHeader
          title="Clear Schedule"
          sx={{
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4,
          }}
        />
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Are you sure you want to clear the conference schedule?
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              sx={{
                backgroundColor: "red",
                color: "white",
                "&:hover": { backgroundColor: "darkred" },
              }}
              onClick={handleClearSchedule}
            >
              Yes, Clear
            </Button>
            <Button
              sx={{
                backgroundColor: "#262626",
                color: "white",
                "&:hover": { backgroundColor: "#3e3e3e" },
              }}
              onClick={() => setIsClearModalOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ClearScheduleModal;
