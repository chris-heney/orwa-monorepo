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
import { formatCurrency } from "../../helpers/currencyFormat";
import { boothBasePrice } from "../../helpers/boothBasePrice";

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

  const boothPrice = boothBasePrice(
    ConferenceOptions,
    boothIndex < 0 ? 0 : boothIndex
  );

  const subtotal = (index: number) => {
    let total = boothPrice;

    const booths = watch("booths") as IBoothPayload[] | undefined;
    if (!booths || booths.length === 0 || !booths[index]) {
      return total;
    }

    const extrasTotal =
      booths[index]?.extras
        ?.map((extra: number) => {
          const currentExtra = getExtraData(ExtraOptions, extra);
          if (!currentExtra) return 0;
          return registrationSource === "online"
            ? currentExtra.price_online
            : currentExtra.price_event;
        })
        .reduce((acc: number, curr: number) => acc + curr, 0) || 0;

    return total + extrasTotal;
  };

  const closeModal = () => {
    if (isOpen.context === "create") {
      remove(boothIndex);
    }
    setIsOpen({
      open: false,
      context: "create",
    });
    setBoothIndex(-1);
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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!registrationSource || !ExtraOptions || !ConferenceOptions) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 p-4 sm:p-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booth-modal-title"
        className="flex max-h-[min(90vh,920px)] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <CustomSecondaryHeader
          title={`${isOpen.context === "edit" ? "Edit" : "Add"} Booth`}
          setIsOpen={closeModal as React.Dispatch<React.SetStateAction<boolean>>}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <section className="space-y-2">
            <h3
              id="booth-modal-title"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500"
            >
              Booth space
            </h3>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Booth {boothIndex + 1}
                </p>
                <p className="text-xs text-slate-500">
                  {boothIndex === 0 ? "Primary booth rate" : "Additional booth rate"}
                </p>
              </div>
              <span className="text-base font-bold tabular-nums text-slate-900">
                {formatCurrency(boothPrice)}
              </span>
            </div>
          </section>

          <section className="mt-8 border-t border-slate-200 pt-6">
            <AddExtras
              field={"booths"}
              fieldIndex={boothIndex}
              context="Booth"
            />
          </section>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-base font-semibold text-slate-900 sm:text-left">
            Subtotal:{" "}
            <span className="tabular-nums">
              {formatCurrency(subtotal(boothIndex))}
            </span>
          </p>
          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              onClick={closeModal}
            >
              Cancel
            </button>
            {isOpen.context === "edit" && (
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                onClick={() => {
                  remove(boothIndex);
                  setIsOpen({
                    open: false,
                    context: "create",
                  });
                  setBoothIndex(-1);
                }}
              >
                Remove
              </button>
            )}
            <button
              type="button"
              className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={handleSave}
            >
              {isOpen.context === "edit" ? "Update Booth" : "Add Booth"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBoothModal;
