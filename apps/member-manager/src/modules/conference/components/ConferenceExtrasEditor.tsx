import React, { useEffect, useMemo, useRef } from "react";
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
  extraIsIncludedForTicket,
  itemMatchesExtra,
  maxQtyFor,
  minQtyFor,
  missingSelectionExtras,
  quantitySelectionEnabled,
  requiresSelection,
  seedIncludedExtras,
  selectionOptionsFor,
  shouldShowConferenceExtra,
  type ContestantExtraOption,
  type ContestantItemRow,
  type ExtraVisibilityContext,
} from "../helpers/contestantExtras";

const money = new Intl.NumberFormat("en-US", CurrencyOptions);

const relationId = (value: unknown): string | number | undefined => {
  if (value == null || value === "") return undefined;
  if (typeof value === "number" || typeof value === "string") return value;
  return getRelationFilterId(value as { id?: unknown; entityId?: unknown });
};

const ConferenceExtrasEditor = ({
  conferenceId: conferenceIdProp,
  context = "Contestant",
  seedIncluded = false,
}: {
  conferenceId?: number;
  context?: ExtraVisibilityContext;
  /** On create, pre-check extras the selected ticket already includes. */
  seedIncluded?: boolean;
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
      sort: { field: "order", order: "ASC" },
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
      (extras ?? [])
        .filter((extra) =>
          shouldShowConferenceExtra(extra, items, resolvedTicket, context)
        )
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [extras, items, resolvedTicket, context]
  );

  const seededForTicket = useRef<string>("");
  useEffect(() => {
    if (!seedIncluded || !extras?.length) return;
    const ticketKey =
      resolvedTicket == null || resolvedTicket === ""
        ? ""
        : String(relationId(resolvedTicket) ?? "");
    if (!ticketKey || seededForTicket.current === ticketKey) return;
    seededForTicket.current = ticketKey;
    const current = (field.value ?? []) as ContestantItemRow[];
    const next = seedIncludedExtras(extras, current, resolvedTicket, context);
    if (next !== current) field.onChange(next);
    // Seed once per ticket pick; omit `field` so onChange does not re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedIncluded, extras, resolvedTicket, context]);

  if (!extrasEnabled) return null;
  if (isLoading) return <Loading />;
  if (error) {
    return (
      <Typography variant="body2" color="error" sx={{ mt: 2 }}>
        Could not load extras.
      </Typography>
    );
  }

  const setQty = (
    extra: ContestantExtraOption,
    qty: number,
    selection?: string | null
  ) => {
    field.onChange(applyExtraQuantity(items, extra, qty, selection));
  };

  const unitPrice = (extra: ContestantExtraOption) => {
    if (extraIsIncludedForTicket(extra, resolvedTicket)) return "Included";
    const amount = extra.price_event ?? extra.price_online;
    if (amount == null || Number(amount) === 0) return "Included";
    return money.format(Number(amount));
  };

  const hasTicket =
    resolvedTicket != null && resolvedTicket !== "";

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Extras</Typography>
      <Divider sx={{ mb: 1.5 }} />
      {fieldState.error?.message && (
        <FormHelperText error sx={{ mb: 1 }}>
          {fieldState.error.message}
        </FormHelperText>
      )}
      {visibleExtras.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {hasTicket
            ? "No extras for this ticket."
            : "Select a conference ticket to choose extras."}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {visibleExtras.map((extra) => {
            const qty = countForExtra(items, extra);
            const isQty = quantitySelectionEnabled(extra);
            const needsChoice = requiresSelection(extra);
            const options = selectionOptionsFor(extra);
            const selection =
              items.find((row) => itemMatchesExtra(row, extra))?.selection ??
              "";
            const choiceError = Boolean(
              needsChoice && qty > 0 && !String(selection).trim()
            );
            const rowClickable = !isQty;

            return (
              <Box
                key={String(extra.id)}
                onClick={
                  rowClickable
                    ? () => setQty(extra, qty > 0 ? 0 : 1, selection)
                    : undefined
                }
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  cursor: rowClickable ? "pointer" : "default",
                  bgcolor: choiceError
                    ? theme.palette.error.main + "14"
                    : theme.palette.action.hover,
                  outline: choiceError
                    ? `2px solid ${theme.palette.error.main}`
                    : "none",
                  "&:hover": rowClickable
                    ? { bgcolor: theme.palette.action.selected }
                    : undefined,
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
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    onClick={(event) => event.stopPropagation()}
                  >
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
                      {minQtyFor(extra) > 0
                        ? `Min: ${minQtyFor(extra)} · Max: ${maxQtyFor(extra)}`
                        : `Max: ${maxQtyFor(extra)}`}
                    </Typography>
                  </Box>
                ) : (
                  <Checkbox
                    checked={qty > 0}
                    onClick={(event) => event.stopPropagation()}
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
                    sx={{ minWidth: 160 }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <InputLabel>
                      {extra.selection_name || "Option"} *
                    </InputLabel>
                    <Select
                      label={`${extra.selection_name || "Option"} *`}
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
                    <FormHelperText>
                      {`Required — choose ${(
                        extra.selection_name || "an option"
                      ).toLowerCase()}`}
                    </FormHelperText>
                  </FormControl>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ConferenceExtrasEditor;
