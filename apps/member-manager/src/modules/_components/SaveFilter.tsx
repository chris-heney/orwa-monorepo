import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useDataProvider, useListFilterContext, useNotify } from "react-admin";
import { useGetIdentity } from "../../helpers/useGetIdentity";
import CustomSecondaryHeader from "./CustomSecondaryHeader";

const SaveFilterModal = ({
  resource,
  savingQuery,
  setSavingQuery,
}: {
  resource: string;
  savingQuery: boolean;
  setSavingQuery: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dataProvider = useDataProvider();
  const { filterValues } = useListFilterContext();
  const [filterName, setFilterName] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const identity = useGetIdentity();
  const notify = useNotify();

  if (!identity) return null;

  // 🔹 Save the current filter selection
  const saveFilter = async () => {
    if (!filterName) return alert("Please enter a filter name.");
    if (!identity) return alert("User identity not available.");

    try {
      await dataProvider.create("saved-queries", {
        data: {
          name: filterName,
          filters: filterValues,
          is_public: isPublic,
          user: identity.id,
          resource: resource,
        },
      });

      notify("Filter saved successfully.", {
        type: "success",
      });
      setFilterName("");
      setIsPublic(false);
      setSavingQuery(false); // Close modal after saving
    } catch (error) {
      console.error("❌ Error saving filter:", error);
      notify("Error saving filter. Please try again.", {
        type: "error",
      });
    }
  };

  return (
    <Modal open={savingQuery} onClose={() => setSavingQuery(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
        }}
      >
        <CustomSecondaryHeader
          title="Save Filter"
          Component={() => {
            return (
              <Button
                sx={{
                  color: "white",
                }}
                onClick={() => setSavingQuery(false)}
              >
                Close
              </Button>
            );
          }}
        />
        <Box sx={{ p: 2 }}>
          <TextField
            label="Filter Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            fullWidth
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                />
              }
              label="Make Public"
              sx={{
                color: "text.primary",
                "& .MuiFormControlLabel-label": {
                  color: "text.primary",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={saveFilter}
              sx={{ mt: 2 }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SaveFilterModal;
