import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";

interface FieldSelectorProps {
  open: boolean;
  onClose: () => void;
  fields: string[];
  onFieldSelect: (field: string) => void;
  defaultField?: string;
}

const FieldSelector = ({
  open,
  onClose,
  fields,
  onFieldSelect,
  defaultField,
}: FieldSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState<string>(defaultField || "");

  // Filter fields based on search query
  const filteredFields = fields.filter((field) =>
    field.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select a Field to Insert</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search fields..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <List sx={{ maxHeight: "300px", overflow: "auto" }}>
          {filteredFields.map((field, i) => (
            <ListItemButton
              key={i}
              onClick={() => {
                onFieldSelect(field);
                setSearchQuery("");
              }}
            >
              <ListItemText primary={field} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldSelector; 