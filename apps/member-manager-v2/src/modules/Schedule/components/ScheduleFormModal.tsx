import React from "react";
import { Modal, Box, Typography, Button, CircularProgress } from "@mui/material";
import { SimpleForm } from "react-admin";
import { useScheduleContext } from "../ScheduleProvider";
import ScheduleForm from "./ScheduleForm";
import { useConferenceContext } from "../../conference/ConferenceContext";

const EditScheduleModal: React.FC = () => {
  const {
    handleClose,
    editingRecord,
    saving,
    handleDelete,
    handleSave,
  } = useScheduleContext();

  const { isCreating } = useConferenceContext();


  return (
    <Modal open={isCreating} onClose={handleClose}>
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 600,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#262626",
            color: "white",
            width: "100%",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            {editingRecord ? "Edit Schedule Item" : "New Schedule Item"}
          </Typography>
          <Button
            sx={{
              color: "white",
              fontSize: "1.5rem",
              minWidth: "auto",
              padding: 0,
            }}
            onClick={handleClose}
          >
            &times;
          </Button>
        </Box>
        {saving ? (
          <CircularProgress sx={{ my: 3 }} />
        ) : (
          <SimpleForm toolbar={false}>
            <ScheduleForm
              onDelete={handleDelete}
              record={editingRecord}
              onSave={handleSave}
            />
          </SimpleForm>
        )}
      </Box>
    </Modal>
  );
};

export default EditScheduleModal;