import React, { useState, useEffect } from "react";
import { TextField, MenuItem, IconButton, Box, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import {
  FilterPayload,
  useGetList,
  useListFilterContext,
  useDataProvider,
  useNotify,
} from "react-admin";
import { useGetIdentity } from "../../helpers/useGetIdentity";
import SaveFilterModal from "./SaveFilter";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PublicIcon from "@mui/icons-material/Public";
import PublicOffIcon from "@mui/icons-material/PublicOff";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const SavedFilters = ({
  resource,
  savingQuery,
  setSavingQuery,
}: {
  resource: string;
  savingQuery: boolean;
  setSavingQuery: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { filterValues, setFilters } = useListFilterContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [editingFilter, setEditingFilter] = useState<string | null>(null);
  const [newFilterName, setNewFilterName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("-1");
  const [deleteConfirmation, setDeleteConfirmation] = useState<{open: boolean; filterId: string | null; filterName: string}>({
    open: false,
    filterId: null,
    filterName: ""
  });

  const identity = useGetIdentity();

  // 🔹 Fetch all saved filters dynamically
  const {
    data: savedFilters = [],
    isLoading,
    refetch,
  } = useGetList("saved-queries", {
    filter: { resource: resource },
    pagination: { page: 1, perPage: 50 },
    sort: { field: "createdAt", order: "DESC" },
  });

  // Refetch filters when a new filter has been saved
  useEffect(() => {
    if (savingQuery === false) {
      refetch();
    }
  }, [savingQuery]);

  // Check if current filters match any saved filter and select it
  useEffect(() => {
    if (!savedFilters || savedFilters.length === 0) return;

    // Check if the current filter values match any saved filter
    const matchingFilter = savedFilters.find(filter => {
      if (!filter.filters) return false;
      
      // Check if the filter has the same properties and values
      const filterEntries = Object.entries(filter.filters);
      if (filterEntries.length === 0) return false;
      
      // Check if filterValues has all the keys in this filter
      if (Object.keys(filterValues || {}).length < filterEntries.length) return false;
      
      // All filter criteria must match
      return filterEntries.every(([key, value]) => {
        // Check deep equality for arrays, objects, or simple equality for primitives
        if (Array.isArray(value) && Array.isArray(filterValues[key])) {
          if (value.length !== filterValues[key].length) return false;
          return value.every((v, i) => v === filterValues[key][i]);
        } else if (typeof value === 'object' && value !== null && typeof filterValues[key] === 'object' && filterValues[key] !== null) {
          return JSON.stringify(value) === JSON.stringify(filterValues[key]);
        }
        return value === filterValues[key];
      });
    });

    // Update selected value based on whether we found a match
    if (matchingFilter) {
      setSelectedValue(matchingFilter.id);
    } else if (selectedValue !== "-1" && Object.keys(filterValues || {}).length > 0) {
      // If no match found but we have a selected filter and active filters, deselect it
      setSelectedValue("-1");
    }
  }, [savedFilters, filterValues]);

  if (!identity?.id) {
    return null;
  }

  // 🔹 Apply a saved filter
  const applyFilter = (selectedFilter: FilterPayload) => {
    if (selectedFilter === undefined) {
      setFilters([], {});
      return;
    } else {
      setFilters(selectedFilter.filters, {
        ...filterValues,
        ...selectedFilter,
      });
    }
  };

  // 🔹 Update filter name
  const handleUpdateFilterName = async (filterId: string) => {
    if (!newFilterName.trim()) {
      notify("Please enter a filter name", { type: "error" });
      return;
    }

    try {
      await dataProvider.update("saved-queries", {
        id: filterId,
        data: { name: newFilterName.trim() },
        previousData: savedFilters.find((f) => f.id === filterId),
      });
      notify("Filter name updated successfully", { type: "success" });
      setEditingFilter(null);
      refetch();
    } catch (error) {
      notify("Error updating filter name", { type: "error" });
    }
  };

  // 🔹 Delete filter
  const handleDeleteFilter = async (filterId: string) => {
    try {
      await dataProvider.delete("saved-queries", { id: filterId });
      notify("Filter deleted successfully", { type: "success" });
      setDeleteConfirmation({ open: false, filterId: null, filterName: "" });
      refetch();
    } catch (error) {
      notify("Error deleting filter", { type: "error" });
    }
  };

  // 🔹 Toggle filter public status
  const handleTogglePublic = async (
    filterId: string,
    currentStatus: boolean
  ) => {
    try {
      await dataProvider.update("saved-queries", {
        id: filterId,
        data: { is_public: !currentStatus },
        previousData: savedFilters.find((f) => f.id === filterId),
      });
      notify(`Filter is now ${!currentStatus ? "public" : "private"}`, {
        type: "success",
      });
      refetch();
    } catch (error) {
      notify("Error updating filter visibility", { type: "error" });
    }
  };

  // 🔹 Handle dropdown open/close
  const handleDropdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
    setIsOpen(!isOpen);
    if (!isOpen) {
      setEditingFilter(null);
    }
    applyFilter(savedFilters.find((f) => f.id === e.target.value));
  };

  const renderFilterContent = (filter: any, showActions: boolean = true) => (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {editingFilter === filter.id ? (
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <TextField
            size="small"
            value={newFilterName}
            onChange={(e) => setNewFilterName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleUpdateFilterName(filter.id);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{ flex: 1 }}
          />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Save changes">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateFilterName(filter.id);
                }}
                sx={{ color: 'success.main' }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingFilter(null);
                }}
                sx={{ color: 'error.main' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1 }}>{filter.name}</Box>
          {showActions && filter.user === parseInt(identity.id.toString()) && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Edit name">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFilter(filter.id);
                    setNewFilterName(filter.name);
                  }}
                  sx={{ color: 'primary.main' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={filter.is_public ? "Make private" : "Make public"}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePublic(filter.id, filter.is_public);
                  }}
                  sx={{ color: filter.is_public ? 'success.main' : 'text.secondary' }}
                >
                  {filter.is_public ? <PublicIcon fontSize="small" /> : <PublicOffIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete filter">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmation({ 
                      open: true, 
                      filterId: filter.id,
                      filterName: filter.name
                    });
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </>
      )}
    </Box>
  );

  return (
    <>
      <TextField
        select
        label="Selected Filter"
        fullWidth
        value={selectedValue}
        disabled={isLoading}
        onChange={handleDropdownChange}
        SelectProps={{
          open: isOpen,
          onClose: () => {
            setIsOpen(false);
            setEditingFilter(null);
          },
          onOpen: () => setIsOpen(true),
          renderValue: (value) => {
            const filter = savedFilters.find((f) => f.id === value);
            return filter ? filter.name : "None";
          }
        }}
      >
        {/* Reset */}
        <MenuItem value="-1">None</MenuItem>
        {/* Saved filters */}
        {savedFilters
          .filter((filter) => {
            return (
              filter.user === parseInt(identity?.id?.toString()) ||
              filter.is_public
            );
          })
          .map((filter) => (
            <MenuItem key={filter.id} value={filter.id}>
              {renderFilterContent(filter, isOpen)}
            </MenuItem>
          ))}
      </TextField>
      <SaveFilterModal
        resource={resource}
        savingQuery={savingQuery}
        setSavingQuery={setSavingQuery}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, filterId: null, filterName: "" })}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Delete Saved Filter</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the filter &ldquo;{deleteConfirmation.filterName}&rdquo;? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirmation({ open: false, filterId: null, filterName: "" })}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => deleteConfirmation.filterId && handleDeleteFilter(deleteConfirmation.filterId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SavedFilters;
