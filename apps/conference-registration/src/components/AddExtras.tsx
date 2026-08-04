import { Checkbox, IconButton, MenuItem, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { formatMoneyOrIncluded } from "../helpers/currencyFormat";
import { IExtraOption } from "../types/types";
import {
  useExtraDetails,
  useRegistrationOptions,
  useRegistrationSource,
} from "../AppContextProvider";
import { useFieldArray, useFormContext } from "react-hook-form";
import { isExtraIncluded } from "../helpers/isExtraIncluded";
import { filterVisibleExtras } from "../helpers/filterVisibleExtras";
import { validationHighlightClassName } from "../helpers/validationHighlight";
import {
  getExtraSelection,
  maxQtyFor,
  minQtyFor,
  quantitySelectionEnabled,
  requiresSelection,
  selectionOptionsFor,
} from "../helpers/extraSelection";
import { useState, useEffect } from "react";

const AddExtras = ({
  field,
  fieldIndex,
  context,
  useYesNo = false,
  highlightInvalid = false,
}: {
  field: string;
  fieldIndex?: number;
  context: "Attendee" | "Vendor" | "Registration" | "Contestant" | "Booth";
  useYesNo?: boolean;
  highlightInvalid?: boolean;
}) => {
  const { control, watch, setValue, register, formState: { errors } } = useFormContext();
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  if (context === "Vendor") context = "Attendee";

  const { ExtraOptions } = useRegistrationOptions();
  const registrationSource = useRegistrationSource();
  const { setExtraDetails, setIsOpen } = useExtraDetails();

  const tickets = watch(field);
  const ticket = fieldIndex !== undefined ? tickets[fieldIndex] : watch(field);
  const extrasValues = watch('extras');

  const { update } = useFieldArray({
    control,
    name: field,
  });

  // Chosen option per extra id (e.g. shirt size) for extras that require a
  // selection. Ticket/booth rows carry their own map; top-level id-array
  // usage (Registration extras) stores it beside the ids.
  const registrationSelections = watch("registration_extra_selections");
  const rowSelections: Record<string, string> | undefined =
    fieldIndex !== undefined ? ticket?.extra_selections : registrationSelections;

  const handleSelectionChange = (extra: IExtraOption, value: string) => {
    const nextSelections = {
      ...(rowSelections || {}),
      [String(extra.id)]: value,
    };
    if (fieldIndex !== undefined) {
      update(fieldIndex, { ...ticket, extra_selections: nextSelections });
    } else {
      setValue("registration_extra_selections", nextSelections);
    }
  };

  // When opting into a quantity extra with a minimum, start at the minimum.
  const initialCopiesFor = (extra: IExtraOption): number =>
    quantitySelectionEnabled(extra) ? Math.max(1, minQtyFor(extra)) : 1;

  // Rewrite this extra's id-count in the extras array (dup ids = quantity),
  // clamping to [0, max] and snapping nonzero values up to the minimum.
  const setExtraQuantity = (extra: IExtraOption, rawQuantity: number) => {
    const minQty = minQtyFor(extra);
    const maxQty = maxQtyFor(extra);
    let quantity = Math.min(
      Math.max(0, Number.isFinite(rawQuantity) ? rawQuantity : 0),
      maxQty
    );
    if (quantity > 0 && quantity < minQty) quantity = minQty;

    const currentIds: unknown[] =
      (fieldIndex !== undefined ? ticket?.extras : ticket) || [];
    const next = [
      ...currentIds.filter((id) => String(id) !== String(extra.id)),
      ...Array(quantity).fill(extra.id),
    ];

    if (fieldIndex === undefined) {
      setValue(field, next);
    } else {
      update(fieldIndex, { ...ticket, extras: next });
    }
  };

  // Initialize selections from existing form values
  useEffect(() => {
    if (!useYesNo) return;

    const currentSelections: Record<string, boolean> = {};
    ExtraOptions.forEach(extra => {
      const value = extrasValues?.[extra.id];
      if (value === 'yes' || value === 'no') {
        currentSelections[extra.id] = true;
      }
    });
    setSelections(currentSelections);
  }, [extrasValues, useYesNo, ExtraOptions]);

  const openDetailsModal = (extra: IExtraOption) => {
    setExtraDetails(extra.details);
    setIsOpen(true);
  };

  const handleExtrasChange = (extra: any, value: boolean | string) => {
    if (useYesNo) {
      // Mark that this extra has been selected
      setSelections(prev => ({
        ...prev,
        [extra.id]: true
      }));
      
      // Store the yes/no selection in the form
      setValue(`extras.${extra.id}`, value);
      
      // Update the extras array based on yes/no selection
      const updatedExtras = fieldIndex !== undefined
        ? [...(ticket.extras || []).filter((id: string) => id !== extra.id)]
        : [...(ticket || []).filter((id: string) => id !== extra.id)];
      
      if (value === 'yes') {
        for (let i = 0; i < initialCopiesFor(extra); i++) {
          updatedExtras.push(extra.id);
        }
      }
      
      if (fieldIndex === undefined) {
        setValue(field, updatedExtras);
      } else {
        update(fieldIndex, { ...ticket, extras: updatedExtras });
      }
    } else {
      // Original checkbox behavior
      const isSelected = typeof value === 'boolean' ? value : value === 'yes';
      const addedCopies = Array(initialCopiesFor(extra)).fill(extra.id);
      const updatedExtras =
        fieldIndex !== undefined
          ? isSelected
            ? [...(ticket.extras || []), ...addedCopies]
            : (ticket.extras || []).filter((id: string) => id !== extra.id)
          : isSelected
          ? [...(ticket || []), ...addedCopies]
          : (ticket || []).filter((id: string) => id !== extra.id);

      if (fieldIndex === undefined) {
        setValue(field, updatedExtras);
      } else {
        update(fieldIndex, { ...ticket, extras: updatedExtras });
      }
    }
  };

  const isExtraSelected = (id: string) => {
    if (!useYesNo) {
      return fieldIndex !== undefined
        ? ticket?.extras?.includes(id)
        : ticket?.includes(id);
    }
    
    // For Yes/No mode, check the form value first
    const formValue = watch(`extras.${id}`);
    
    // Return empty string if no selection has been made
    if (!selections[id] && formValue !== 'yes' && formValue !== 'no') return '';
    
    // Return the selected value if it exists
    if (formValue === 'yes' || formValue === 'no') return formValue;
    
    // If no form value but selection was made, check extras array
    const isSelected = fieldIndex !== undefined
      ? ticket?.extras?.includes(id)
      : ticket?.includes(id);
    
    return isSelected ? 'yes' : 'no';
  };

  const visibleExtras = filterVisibleExtras({
    extras: ExtraOptions,
    context,
    registrationSource,
    ticketTypeId: ticket?.ticket_type?.id,
  }).sort((a, b) => {
    if (!a.order || !b.order) return 0;
    return a.order - b.order;
  });

  return visibleExtras.length > 0 ? (
    <div
      data-validation-field="ticket-extras"
      className={highlightInvalid ? validationHighlightClassName : undefined}
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Extras
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Optional add-ons for this registration.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visibleExtras.map((extra) => {
          const currentQuantity =
            ticket?.extras?.filter((id: string) => id === extra.id).length || 0;

          const selected = !!isExtraSelected(extra.id);

          return (
            <div
              key={extra.id}
              className={`flex flex-col rounded-lg border border-slate-200 px-3 py-2 transition ${
                useYesNo
                  ? "bg-slate-50/80"
                  : "cursor-pointer bg-slate-50 hover:bg-slate-100"
              }`}
              onClick={
                useYesNo
                  ? undefined
                  : () => handleExtrasChange(extra, !selected)
              }
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {useYesNo ? (
                    <FormControl 
                      {...register(`extras.${extra.id}`, {
                        validate: () => {
                          // Only show error if no selection has been made yet
                          if (!selections[extra.id]) {
                            return `Please select yes or no for ${extra.name}`;
                          }
                          return true;
                        }
                      })}
                    >
                      <FormLabel id={`extra-${extra.id}-label`} className="text-gray-800 text-sm text-left">
                        {extra.name}
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby={`extra-${extra.id}-label`}
                        value={isExtraSelected(extra.id)}
                        onChange={(e) => handleExtrasChange(extra, e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                      <div className="text-left text-red-500 text-sm">
                        {/* @ts-expect-error - Dynamic property access on errors object */}
                        {errors.extras && errors.extras[extra.id]?.message}
                      </div>
                      <span className="text-gray-500 text-sm">
                        {extra.description}
                      </span>
                    </FormControl>
                  ) : (
                    <>
                      <Checkbox
                        checked={selected}
                        onChange={(e) => handleExtrasChange(extra, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        sx={{ p: 0 }}
                      />
                      <div className="flex min-w-0 flex-col">
                        <span className="text-left text-sm text-slate-800">
                          {extra.name}
                        </span>
                        <span className="text-left text-sm text-slate-500">
                          {extra.description}
                        </span>
                      </div>
                    </>
                  )}
                  {extra.details && (
                    <InfoIcon
                      fontSize="small"
                      className="shrink-0 cursor-pointer text-blue-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailsModal(extra);
                      }}
                    />
                  )}
                </div>
                <span className="shrink-0 font-medium text-slate-700">
                  {isExtraIncluded(ticket, ExtraOptions, extra.id)
                    ? "Included"
                    : formatMoneyOrIncluded(
                        registrationSource === "online"
                          ? extra.price_online
                          : extra.price_event
                      )}
                </span>
              </div>
              {quantitySelectionEnabled(extra) &&
                maxQtyFor(extra) > 1 &&
                (!useYesNo || isExtraSelected(extra.id) === 'yes') && (
                <div
                  className="mt-2 flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton
                    onClick={() => {
                      // Dropping below the minimum removes the extra entirely.
                      const target =
                        currentQuantity - 1 < minQtyFor(extra)
                          ? 0
                          : currentQuantity - 1;
                      setExtraQuantity(extra, target);
                    }}
                    disabled={currentQuantity === 0}
                    className="w-8 h-8"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    type="number"
                    size="small"
                    value={currentQuantity}
                    onChange={(e) =>
                      setExtraQuantity(
                        extra,
                        parseInt(e.target.value || "0", 10)
                      )
                    }
                    inputProps={{
                      min: 0,
                      max: maxQtyFor(extra),
                    }}
                    className="w-20 mx-2"
                  />
                  <IconButton
                    onClick={() => setExtraQuantity(extra, currentQuantity + 1)}
                    disabled={currentQuantity >= maxQtyFor(extra)}
                    className="w-8 h-8"
                  >
                    <AddIcon />
                  </IconButton>
                  <Typography className="text-gray-500 text-sm ml-2">
                    {minQtyFor(extra) > 0
                      ? `Min: ${minQtyFor(extra)} · Max: ${maxQtyFor(extra)}`
                      : `Max: ${maxQtyFor(extra)}`}
                  </Typography>
                </div>
              )}
              {requiresSelection(extra) &&
                (useYesNo ? isExtraSelected(extra.id) === "yes" : selected) && (
                <div
                  className={`mt-2 rounded-md p-2 ${
                    highlightInvalid &&
                    !getExtraSelection(rowSelections, extra.id)
                      ? validationHighlightClassName
                      : "bg-white/70"
                  }`}
                  data-validation-field={`extra-selection-${extra.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <TextField
                    select
                    required
                    fullWidth
                    size="small"
                    label={extra.selection_name || "Select an option"}
                    value={getExtraSelection(rowSelections, extra.id)}
                    onChange={(e) =>
                      handleSelectionChange(extra, e.target.value)
                    }
                  >
                    {selectionOptionsFor(extra).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <span className="mt-1 block text-left text-xs text-slate-500">
                    Required — choose{" "}
                    {(extra.selection_name || "an option").toLowerCase()} to
                    continue.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default AddExtras;
