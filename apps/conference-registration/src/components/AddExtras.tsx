import { Checkbox, IconButton, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import currencyFormatter from "../helpers/currencyFormat";
import { ITicketOption, IExtraOption } from "../types/types";
import {
  useExtraDetails,
  useRegistrationOptions,
  useRegistrationSource,
} from "../AppContextProvider";
import { useFieldArray, useFormContext } from "react-hook-form";
import { isExtraIncluded } from "../helpers/isExtraIncluded";
import { useState, useEffect } from "react";

const AddExtras = ({
  field,
  fieldIndex,
  context,
  useYesNo = false,
}: {
  field: string;
  fieldIndex?: number;
  context: "Attendee" | "Vendor" | "Registration" | "Contestant" | "Booth";
  useYesNo?: boolean;
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
        updatedExtras.push(extra.id);
      }
      
      if (fieldIndex === undefined) {
        setValue(field, updatedExtras);
      } else {
        update(fieldIndex, { ...ticket, extras: updatedExtras });
      }
    } else {
      // Original checkbox behavior
      const isSelected = typeof value === 'boolean' ? value : value === 'yes';
      const updatedExtras =
        fieldIndex !== undefined
          ? isSelected
            ? [...(ticket.extras || []), extra.id]
            : (ticket.extras || []).filter((id: string) => id !== extra.id)
          : isSelected
          ? [...(ticket || []), extra.id]
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

  return ExtraOptions.filter((extra) => {
    const isExcluded = extra.excluded.data.some(
      (excludedTicket: ITicketOption) => {
        return (
          excludedTicket.id === ticket?.ticket_type?.id && context !== "Booth"
        );
      }
    );

    return (!isExcluded && extra.context === context)
  }).length > 0 ? (
    <div className="border-t pt-3">
      <h3 className="font-semibold text-gray-800 text-lg">Extras</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ExtraOptions.sort((a,b) => {
          if (!a.order || !b.order) return 0;
          return a.order - b.order;
        }).filter((extra) => {
          const isExcluded = extra.excluded.data.some(
            (excludedTicket: ITicketOption) => {
              return (
                excludedTicket.id === ticket?.ticket_type?.id &&
                context !== "Booth"
              );
            }
          );

          return !isExcluded && extra.context === context

        }).filter((extra) => {
          return registrationSource === "kiosk" ? extra.price_event > 0 : true
        }).map((extra) => {
          const currentQuantity =
            ticket?.extras?.filter((id: string) => id === extra.id).length || 0;

          return (
            <div
              key={extra.id}
              className="flex flex-col bg-gray-50 border p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
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
                        checked={isExtraSelected(extra.id)}
                        onChange={(e) => handleExtrasChange(extra, e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-gray-800 text-sm text-left">
                          {extra.name}
                        </span>
                        <span className="text-gray-500 text-sm text-left">
                          {extra.description}
                        </span>
                      </div>
                    </>
                  )}
                  {extra.details && (
                    <InfoIcon
                      fontSize="small"
                      className="text-blue-400 cursor-pointer"
                      onClick={() => openDetailsModal(extra)}
                    />
                  )}
                </div>
                {(extra.price_event > 0 || extra.price_online > 0) && <span className="text-gray-700 font-medium">
                  {isExtraIncluded(ticket, ExtraOptions, extra.id)
                    ? "Included"
                    : currencyFormatter.format(
                        registrationSource === "online"
                          ? extra.price_online
                          : extra.price_event
                      )}
                </span>}
              </div>
              {extra.max_qty_each > 1 && (!useYesNo || isExtraSelected(extra.id) === 'yes') && (
                <div className="flex items-center mt-2">
                  <IconButton
                    onClick={() => {
                      const index = ticket.extras?.indexOf(extra.id);

                      if (index !== undefined && index > -1) {
                        const updatedExtras = [...ticket.extras];
                        updatedExtras.splice(index, 1);

                        if (fieldIndex === undefined) {
                          setValue(field, updatedExtras);
                        } else {
                          update(fieldIndex, {
                            ...ticket,
                            extras: updatedExtras,
                          });
                        }
                      }
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
                    onChange={(e) => {
                      const quantity = Math.min(
                        Math.max(0, parseInt(e.target.value || "0", 10)),
                        extra.max_qty_each
                      );
                      const diff = quantity - currentQuantity;

                      const updatedExtras = [...(ticket.extras || [])];
                      for (let i = 0; i < Math.abs(diff); i++) {
                        if (diff > 0) updatedExtras.push(extra.id);
                        else updatedExtras.pop();
                      }

                      if (fieldIndex === undefined) {
                        setValue(field, updatedExtras);
                      } else {
                        update(fieldIndex, {
                          ...ticket,
                          extras: updatedExtras,
                        });
                      }
                    }}
                    inputProps={{
                      min: 0,
                      max: extra.max_qty_each,
                    }}
                    className="w-20 mx-2"
                  />
                  <IconButton
                    onClick={() => handleExtrasChange(extra, useYesNo ? 'yes' : true)}
                    disabled={currentQuantity === extra.max_qty_each}
                    className="w-8 h-8"
                  >
                    <AddIcon />
                  </IconButton>
                  <Typography className="text-gray-500 text-sm ml-2">
                    Max: {extra.max_qty_each}
                  </Typography>
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
