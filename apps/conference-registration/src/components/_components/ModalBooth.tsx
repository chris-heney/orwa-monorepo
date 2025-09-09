import { useContext, useEffect } from "react";
import {
  RegistrationSource,
  useBoothIndex,
  useRegistrationOptions,
} from "../../AppContextProvider";
import { IBoothPayload } from "../../types/types";
import CustomSecondaryHeader from "./CustomSecondaryHeader";
import AddExtras from "../AddExtras";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useNotify } from "mj-react-form-builder";
import { getExtraData } from "../../helpers/getExtraData";

interface IBoothModalProps {
  isOpen: {
    open: boolean;
    context: string;
  };
  setIsOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      context: string;
    }>
  >;
}

const AddBoothModal = ({ setIsOpen, isOpen }: IBoothModalProps) => {
  const { ConferenceOptions, ExtraOptions } = useRegistrationOptions();
  const registrationSource = useContext(RegistrationSource);
  const { boothIndex, setBoothIndex } = useBoothIndex();
  const { watch, trigger, control } = useFormContext();
  const { notify } = useNotify();

  const { append, update, remove } = useFieldArray({
    control,
    name: "booths",
  });

  if (!registrationSource || !ExtraOptions) return;

  const boothPrice =
    watch("booths").length < 1 || boothIndex === 0
      ? ConferenceOptions.booth_price
      : ConferenceOptions.booth_price_2;

  const subtotal = (boothIndex: number) => {
    let total = 0;

    // Add booth price to the total
    total += boothPrice;

    // Fetch booths from watch
    const booths = watch("booths") as IBoothPayload[] | undefined;

    // Validate booths and the specific booth index
    if (!booths || booths.length === 0 || !booths[boothIndex]) {
      return total; // Return the total if no booths or the index is invalid
    }

    // Loop through extras for the specific booth and calculate their prices
    const extrasTotal =
      booths[boothIndex]?.extras
        ?.map((extra: number) => {
          const currentExtra = getExtraData(ExtraOptions, extra);
          if (!currentExtra) return 0; // Skip if the extra is not found
          return registrationSource === "online"
            ? currentExtra.price_online
            : currentExtra.price_event;
        })
        .reduce((acc: number, curr: number) => acc + curr, 0) || 0; // Sum up the extras or default to 0

    // Add extras total to the total
    total += extrasTotal;

    return total;
  };

  const handleSave = async () => {
    const booths = watch("booths") || [];
    const booth = booths[boothIndex] || {};

    const isValid = await trigger(`booths[${boothIndex}]`);
    if (!isValid) {
      notify("Please fix the errors before saving.", "error");
      return;
    }
    const updatedBooth = { ...booth, subtotal: subtotal(boothIndex) };
    if (boothIndex === -1) append(updatedBooth);
    else update(boothIndex, updatedBooth);

    setIsOpen({
      open: false,
      context: "create",
    });
    setBoothIndex(-1);
  };

  const isModalOpen = () => {
    if (isOpen.context === "create") {
      remove(boothIndex);
      return setIsOpen({
        open: false,
        context: "create",
      });
    } else {
      return setIsOpen({
        open: false,
        context: "create",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isOpen.context === "create") {
          remove(boothIndex);
          return setIsOpen({
            open: false,
            context: "create",
          });
        } else {
          return setIsOpen({
            open: false,
            context: "create",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return !ConferenceOptions ? (
    <>Loading</>
  ) : (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black rounded-lg shadow-lg w-full max-w-xl mx-4 sm:mx-auto">
        <CustomSecondaryHeader setIsOpen={isModalOpen} title={"Add Booth"} />
        <div className="p-3">
          <AddExtras field={"booths"} fieldIndex={boothIndex} context="Booth" />
        </div>
        <div className="p-3">
          <p className="mt-2">Subtotal: ${subtotal(boothIndex)}</p>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => {
                handleSave();
              }}
            >
              {isOpen.context === "create" ? "Add Booth" : "Update Booth"}
            </button>

            {boothIndex !== -1 && (
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 ml-2"
                onClick={() => {
                  setIsOpen({
                    open: false,
                    context: "create",
                  });
                  setBoothIndex(-1);
                  remove(boothIndex);
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBoothModal;
