import React, { useMemo } from "react";
import {
  Loading,
  useGetList,
  useInput,
  useRecordContext,
} from "react-admin";
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useWatch } from "react-hook-form";
import { getRelationFilterId } from "../../../helpers/strapiIds";
import { CurrencyOptions } from "../../../config/Settings";
import {
  applyExtraQuantity,
  countForExtra,
  itemMatchesExtra,
  maxQtyFor,
  minQtyFor,
  missingSelectionExtras,
  quantitySelectionEnabled,
  requiresSelection,
  selectionOptionsFor,
  shouldShowContestantExtra,
  type ContestantExtraOption,
  type ContestantItemRow,
} from "../helpers/contestantExtras";

const money = new Intl.NumberFormat("en-US", CurrencyOptions);

const relationId = (value: unknown): string | number | undefined => {
  if (value == null || value === "") return undefined;
  if (typeof value === "number" || typeof value === "string") return value;
  return getRelationFilterId(value as { id?: unknown; entityId?: unknown });
};

const ContestantExtrasEditor = ({
  conferenceId: conferenceIdProp,
}: {
  conferenceId?: number;
}) => {
  const theme = useTheme();
  const record = useRecordContext();
  const ticketId = useWatch({ name: "conference_ticket" });

  const conferenceId =
    conferenceIdProp ??
    relationId(record?.conference) ??
    (typeof record?.conference === "number" ? record.conference : undefined);

  const extrasEnabled = conferenceId != null && Number(conferenceId) > 0;

  const { data: extras, isLoading, error } = useGetList<ContestantExtraOption>(
    "conference-extras",
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: "id", order: "ASC" },
      meta: { raw: true },
      filter: extrasEnabled
        ? { conferences: [conferenceId] }
        : { conferences: [0] },
    },
    { enabled: extrasEnabled }
  );

  const { field, fieldState } = useInput({
    source: "items",
    defaultValue: [],
    validate: (value: ContestantItemRow[]) => {
      const catalog = extras ?? [];
      const missing = missingSelectionExtras(catalog, value);
      if (missing.length === 0) return undefined;
      const extra = missing[0];
      return `Choose ${extra.selection_name || "an option"} for ${extra.name}`;
    },
  });

  const items = (field.value ?? []) as ContestantItemRow[];
  const resolvedTicket = ticketId ?? record?.conference_ticket;

  const visibleExtras = useMemo(
    () =>
      (extras ?? []).filter((extra) =>
        shouldShowContestantExtra(extra, items, resolvedTicket)
      ),
    [extras, items, resolvedTicket]
  );

  if (!extrasEnabled) return null;
  if (isLoading) return <Loading />;
  if (error) {
    return (
      <Typography variant="body2" color="error" sx={{ mt: 2 }}>
        Could not load contestant extras.
      </Typography>
    );
  }
  if (visibleExtras.length === 0) return null;

  const setQty = (
    extra: ContestantExtraOption,
    qty: number,
    selection?: string | null
  ) => {
    field.onChange(applyExtraQuantity(items, extra, qty, selection));
  };

  const unitPrice = (extra: ContestantExtraOption) => {
    const amount = extra.price_event ?? extra.price_online;
    if (amount == null || Number(amount) === 0) return "Included";
    return money.format(Number(amount));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Extras</Typography>
      <Divider sx={{ mb: 1.5 }} />
      {fieldState.error?.message && (
        <FormHelperText error sx={{ mb: 1 }}>
          {fieldState.error.message}
        </FormHelperText>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {visibleExtras.map((extra) => {
          const qty = countForExtra(items, extra);
          const isQty = quantitySelectionEnabled(extra);
          const needsChoice = requiresSelection(extra);
          const options = selectionOptionsFor(extra);
          const selection =
            items.find((row) => itemMatchesExtra(row, extra))?.selection ?? "";
          const choiceError = Boolean(
            fieldState.error && needsChoice && qty > 0 && !String(selection).trim()
          );

          return (
            <Box
              key={String(extra.id)}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 1,
                borderRadius: 1,
                bgcolor: theme.palette.action.hover,
              }}
            >
              <Box sx={{ flex: "1 1 160px", minWidth: 140 }}>
                <Typography variant="body2">{extra.name}</Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {unitPrice(extra)}
                </Typography>
              </Box>

              {isQty ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    aria-label={`Decrease ${extra.name}`}
                    disabled={qty <= 0}
                    onClick={() => {
                      const next = qty - 1;
                      setQty(
                        extra,
                        next < minQtyFor(extra) ? 0 : next,
                        selection
                      );
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    size="small"
                    type="number"
                    value={qty}
                    onChange={(event) =>
                      setQty(
                        extra,
                        parseInt(event.target.value || "0", 10),
                        selection
                      )
                    }
                    inputProps={{
                      min: 0,
                      max: maxQtyFor(extra),
                      "aria-label": `${extra.name} quantity`,
                    }}
                    sx={{ width: 72 }}
                  />
                  <IconButton
                    size="small"
                    aria-label={`Increase ${extra.name}`}
                    disabled={qty >= maxQtyFor(extra)}
                    onClick={() => setQty(extra, qty + 1, selection)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary, ml: 0.5 }}
                  >
                    Max: {maxQtyFor(extra)}
                  </Typography>
                </Box>
              ) : (
                <Checkbox
                  checked={qty > 0}
                  onChange={(event) =>
                    setQty(extra, event.target.checked ? 1 : 0, selection)
                  }
                  inputProps={{ "aria-label": extra.name }}
                />
              )}

              {needsChoice && qty > 0 && (
                <FormControl
                  size="small"
                  error={choiceError}
                  sx={{ minWidth: 140 }}
                >
                  <InputLabel>{extra.selection_name || "Option"}</InputLabel>
                  <Select
                    label={extra.selection_name || "Option"}
                    value={selection}
                    onChange={(event) =>
                      setQty(extra, qty, String(event.target.value))
                    }
                  >
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ContestantExtrasEditor;
