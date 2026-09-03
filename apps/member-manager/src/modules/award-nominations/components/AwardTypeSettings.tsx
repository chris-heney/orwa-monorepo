import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  Loading,
  useDataProvider,
  useDelete,
  useGetList,
  useNotify,
  useRedirect,
  useRefresh,
} from "react-admin";
import { sectionCardSx } from "../../_components/review-packet";
import {
  sortAwardTypes,
  type AwardTypeRecord,
} from "../helpers/awardTypes";

const AwardTypeCard = ({
  row,
  dragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onPatch,
  onDelete,
}: {
  row: AwardTypeRecord;
  dragging: boolean;
  onDragStart: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onPatch: (patch: Partial<AwardTypeRecord>) => void;
  onDelete: () => void;
}) => {
  const [name, setName] = useState(row.name || "");
  const [description, setDescription] = useState(row.description || "");

  useEffect(() => {
    setName(row.name || "");
    setDescription(row.description || "");
  }, [row.name, row.description]);

  return (
    <Box
      onDragOver={onDragOver}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
      sx={{
        ...sectionCardSx,
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        opacity: dragging ? 0.55 : 1,
        outline: dragging ? "2px dashed" : "none",
        outlineColor: "divider",
      }}
    >
      <IconButton
        draggable
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", String(row.id));
          onDragStart();
        }}
        onDragEnd={onDragEnd}
        aria-label={`Reorder ${row.name || "award type"}`}
        sx={{
          mt: 0.5,
          cursor: "grab",
          color: "text.secondary",
          "&:active": { cursor: "grabbing" },
        }}
      >
        <DragIndicatorIcon />
      </IconButton>
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TextField
            id={`award-type-name-${row.id}`}
            name="name"
            label="Name"
            size="small"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => {
              const next = name.trim();
              if (next && next !== row.name) onPatch({ name: next });
            }}
            sx={{ flex: "1 1 220px" }}
          />
          <FormControlLabel
            sx={{ ml: 0.5 }}
            control={
              <Switch
                checked={Boolean(row.nominatable)}
                onChange={(event) =>
                  onPatch({ nominatable: event.target.checked })
                }
                inputProps={{ "aria-label": "Nominatable" }}
              />
            }
            label="Nominatable"
          />
          <IconButton
            aria-label={`Delete ${row.name || "award type"}`}
            onClick={onDelete}
            color="error"
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
        <TextField
          label="Description"
          size="small"
          multiline
          minRows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() => {
            if (description !== (row.description || "")) {
              onPatch({ description });
            }
          }}
        />
      </Box>
    </Box>
  );
};

const AwardTypeSettings = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const [deleteOne] = useDelete();
  const { data, isLoading, isError } = useGetList<AwardTypeRecord>(
    "award-types",
    {
      pagination: { page: 1, perPage: 200 },
      sort: { field: "order", order: "ASC" },
    }
  );

  const remote = useMemo(() => sortAwardTypes(data || []), [data]);
  const [items, setItems] = useState<AwardTypeRecord[]>(remote);
  const itemsRef = React.useRef(items);
  itemsRef.current = items;
  const [dragId, setDragId] = useState<string | number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AwardTypeRecord | null>(
    null
  );

  useEffect(() => {
    if (dragId == null) setItems(remote);
  }, [remote, dragId]);

  useEffect(() => {
    if (isError) {
      notify("Could not load award types.", { type: "error" });
    }
  }, [isError, notify]);

  const recordId = (row: AwardTypeRecord) =>
    (row as AwardTypeRecord & { documentId?: string }).documentId || row.id;

  const persistPatch = async (
    row: AwardTypeRecord,
    patch: Partial<AwardTypeRecord>
  ) => {
    try {
      await dataProvider.update("award-types", {
        id: recordId(row),
        data: patch,
        previousData: row,
      });
      setItems((current) =>
        current.map((item) =>
          String(item.id) === String(row.id) ? { ...item, ...patch } : item
        )
      );
      refresh();
    } catch {
      notify("Could not save award type.", { type: "error" });
    }
  };

  const persistOrder = async (next: AwardTypeRecord[]) => {
    setItems(next);
    try {
      await Promise.all(
        next.map((row, index) => {
          const order = (index + 1) * 10;
          if (row.order === order) return Promise.resolve();
          return dataProvider.update("award-types", {
            id: row.id,
            data: { order },
            previousData: row,
          });
        })
      );
      refresh();
    } catch {
      notify("Could not save award type order.", { type: "error" });
      refresh();
    }
  };

  const moveRow = (overId: string | number) => {
    if (dragId == null || dragId === overId) return;
    const from = items.findIndex((row) => String(row.id) === String(dragId));
    const to = items.findIndex((row) => String(row.id) === String(overId));
    if (from < 0 || to < 0) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    deleteOne(
      "award-types",
      { id: pendingDelete.id, previousData: pendingDelete },
      {
        onSuccess: () => {
          setPendingDelete(null);
          refresh();
          notify("Award type deleted.", { type: "info" });
        },
        onError: () => notify("Could not delete award type.", { type: "error" }),
      }
    );
  };

  if (isLoading && !items.length) return <Loading />;

  return (
    <Box sx={{ p: { xs: 1.5, md: 2 }, maxWidth: 920 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
          Award types are global (not year-filtered). Nominatable types appear
          on the public awards form, sorted by this list order. Drag the handle
          on the left to reorder — order is saved on drop.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => redirect("/award-types/create")}
          aria-label="Add Award Type"
        >
          Add Award Type
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {items.map((row) => (
          <AwardTypeCard
            key={row.id}
            row={row}
            dragging={String(dragId) === String(row.id)}
            onDragStart={() => setDragId(row.id)}
            onDragOver={(event) => {
              event.preventDefault();
              moveRow(row.id);
            }}
            onDrop={() => {
              void persistOrder(itemsRef.current);
              setDragId(null);
            }}
            onDragEnd={() => {
              if (dragId != null) void persistOrder(itemsRef.current);
              setDragId(null);
            }}
            onPatch={(patch) => persistPatch(row, patch)}
            onDelete={() => setPendingDelete(row)}
          />
        ))}
        {!items.length ? (
          <Typography color="text.secondary">
            No award types yet. Add one or restart Strapi so the catalog seed
            can run.
          </Typography>
        ) : null}
      </Box>

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
      >
        <DialogTitle>Delete award type?</DialogTitle>
        <DialogContent>
          <Typography>
            Delete “{pendingDelete?.name}”? Existing nominations keep the stored
            award type text.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AwardTypeSettings;
