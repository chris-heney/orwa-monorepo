import { Box, Button, Modal } from "@mui/material";
import { useUpdateGrantApplication } from "../helpers/APIService";
import { useMapContext } from "../providers/MapContext";

const UpdateLocationModal = () => {
  const {
    isInfoWindowOpen,
    setIsInfoWindowOpen,
    currentApplication,
    newLocation,
    setNewLocation,
  } = useMapContext();

  const updateGrantApplication = useUpdateGrantApplication();

  const handleConfirm = () => {
    if (currentApplication && newLocation) {
      updateGrantApplication(currentApplication.id, {
        ...currentApplication,
        location: { ...newLocation },
      });
      setNewLocation(null);
      setIsInfoWindowOpen(false);
    }
  };

  const handleCancel = () => {
    setNewLocation(null);
    setIsInfoWindowOpen(false);
  };

  return (
    <Modal
      open={isInfoWindowOpen}
      onClose={handleCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          maxHeight: "60%",
          overflowY: "scroll",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 2,
          color: "black",
        }}
      >
        <h2 id="modal-modal-title">
          Update Location for {currentApplication?.legal_entity_name}
        </h2>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button color="error" variant="contained" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateLocationModal;
