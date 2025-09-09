import { Checkbox, IconButton, TextField, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import currencyFormatter from "../helpers/currencyFormat";
import { IExtraOption } from "../types/types";
import {
  useExtraDetails,
  useRegistrationOptions,
  useRegistrationSource,
} from "../AppContextProvider";
import { useFieldArray, useFormContext } from "react-hook-form";

const AddRegistrationExtras = ({
  field,
  fieldIndex,
  context,
}: {
  field: string;
  fieldIndex?: number;
  context: "Attendee" | "Vendor" | "Booth" | "Contestant";
}) => {
  const { control, watch, setValue } = useFormContext();

  const tickets = watch(field);
  const ticket = fieldIndex !== undefined ? tickets[fieldIndex] : watch(field);

  const { update } = useFieldArray({
    control,
    name: field,
  });

  const { RegistrationAddons } = useRegistrationOptions();
  const registrationSource = useRegistrationSource();
  const { setExtraDetails, setIsOpen } = useExtraDetails();

  const openDetailsModal = (extra: IExtraOption) => {
    setExtraDetails(extra.details);
    setIsOpen(true);
  };

  const handleExtrasChange = (extra: any, checked: boolean) => {
    const updatedExtras =
      fieldIndex !== undefined
        ? checked
          ? [...(ticket.extras || []), extra.id]
          : (ticket.extras || []).filter((id: string) => id !== extra.id)
        : checked
        ? [...(ticket || []), extra.id]
        : (ticket || []).filter((id: string) => id !== extra.id);

    if (fieldIndex === undefined) {
      setValue(field, updatedExtras);
    } else {
      update(fieldIndex, { ...ticket, extras: updatedExtras });
    }
  };

  const isExtraChecked = (id: string) =>
    fieldIndex !== undefined
      ? ticket.extras?.includes(id)
      : ticket?.includes(id);

  return (
    <div className="border-t p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RegistrationAddons.sort((a, b) => {
          if (!a.order || !b.order) return 0;
          return a.order - b.order;
        }).filter((addon) => {
          return addon.context === context;
        }).map((extra) => {
          const currentQuantity = Array.isArray(ticket)
            ? ticket.length
            : ticket?.extras?.filter((id: string) => id === extra.id).length ||
              0;

          return (
            <div
              key={extra.id}
              className="flex flex-col bg-gray-50 border p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isExtraChecked(extra.id)}
                    onChange={(e) =>
                      handleExtrasChange(extra, e.target.checked)
                    }
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
                  {extra.details && (
                    <InfoIcon
                      fontSize="small"
                      className="text-blue-400 cursor-pointer"
                      onClick={() => openDetailsModal(extra)}
                    />
                  )}
                </div>
                {registrationSource === "online"
                  ? extra.price_online > 0 && (
                      <span className="text-gray-700 font-medium">
                        {currencyFormatter.format(extra.price_online)}
                      </span>
                    )
                  : extra.price_event > 0 && (
                      <span className="text-gray-700 font-medium">
                        {currencyFormatter.format(extra.price_event)}
                      </span>
                    )}
              </div>
              {extra.max_qty_each > 1 && (
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

                      const updatedExtras = [...(ticket || [])];
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
                    onClick={() => handleExtrasChange(extra, true)}
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
  );
};

export default AddRegistrationExtras;