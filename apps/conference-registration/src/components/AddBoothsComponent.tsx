import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  formatCurrency,
  formatMoneyOrIncluded,
} from "../helpers/currencyFormat";
import {
  useBoothIndex,
  useRegistrationOptions,
  useRegistrationSource,
} from "../AppContextProvider";
import { IBoothPayload } from "../types/types";
import { getExtraData } from "../helpers/getExtraData";
import { boothHasExtras } from "../helpers/boothHasExtras";
import { boothBasePrice } from "../helpers/boothBasePrice";

interface AddBoothComponentProps {
  setIsBoothModalOpen: Dispatch<
    SetStateAction<{
      open: boolean;
      context: string;
    }>
  >;
}

const AddBoothsComponent = ({
  setIsBoothModalOpen,
}: AddBoothComponentProps) => {
  const { control, watch, getValues } = useFormContext();
  const { setBoothIndex } = useBoothIndex();
  const { append, replace } = useFieldArray({
    control,
    name: "booths",
  });

  const { ConferenceOptions, ExtraOptions } = useRegistrationOptions();
  const registrationSource = useRegistrationSource();

  const booths = (watch("booths") || []) as IBoothPayload[];
  const hasOptions = boothHasExtras(ExtraOptions, registrationSource);

  const basePriceForIndex = (boothIndex: number) =>
    boothBasePrice(ConferenceOptions, boothIndex);

  const extrasTotalForBooth = (booth: IBoothPayload) =>
    (booth.extras || []).reduce((sum: number, extraId) => {
      const currentExtra = getExtraData(ExtraOptions, extraId);
      if (!currentExtra) return sum;
      return (
        sum +
        (registrationSource === "online"
          ? currentExtra.price_online
          : currentExtra.price_event)
      );
    }, 0);

  // Correct persisted $0 additional booths when booth_price_2 was null/0
  // (extras are preserved; only base+extras subtotal is recomputed).
  useEffect(() => {
    if (!ConferenceOptions || booths.length === 0) return;

    let needsUpdate = false;
    const next = booths.map((booth, index) => {
      const expected =
        basePriceForIndex(index) + extrasTotalForBooth(booth);
      if (booth.subtotal !== expected) {
        needsUpdate = true;
        return { ...booth, subtotal: expected };
      }
      return booth;
    });

    if (needsUpdate) {
      replace(next);
    }
  }, [ConferenceOptions, booths, ExtraOptions, registrationSource]);

  const handleAddBooth = () => {
    const nextIndex = booths.length;
    const nextBase = basePriceForIndex(nextIndex);

    if (hasOptions) {
      append({
        extras: [],
        subtotal: nextBase,
      } as IBoothPayload);
      setBoothIndex(nextIndex);
      setIsBoothModalOpen({
        open: true,
        context: "create",
      });
      return;
    }

    append({
      extras: [],
      subtotal: nextBase,
    } as IBoothPayload);
  };

  const handleEditBooth = (boothIndex: number) => {
    setBoothIndex(boothIndex);
    setIsBoothModalOpen({
      open: true,
      context: "edit",
    });
  };

  const handleRemoveBooth = (boothIndex: number) => {
    const next = ((getValues("booths") || []) as IBoothPayload[])
      .filter((_, index) => index !== boothIndex)
      .map((booth, index) => ({
        ...booth,
        subtotal: basePriceForIndex(index) + extrasTotalForBooth(booth),
      }));
    replace(next);
  };

  if (!ConferenceOptions) {
    return <p className="text-sm text-slate-500">Loading booth options…</p>;
  }

  const canAddMore = booths.length < ConferenceOptions.purchasable_booths;
  const nextPrice = basePriceForIndex(booths.length);

  return (
    <div>
      {booths.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-600">
            No booths added yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {hasOptions
              ? "Add a booth and choose any available options."
              : "Add a booth with one click."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {booths.map((booth: IBoothPayload, boothIndex: number) => {
            const basePrice = basePriceForIndex(boothIndex);
            const displaySubtotal =
              basePrice + extrasTotalForBooth(booth);
            return (
              <li key={`booth-${boothIndex}`}>
                <div className="px-4 py-4 hover:bg-slate-50/80">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold text-slate-900">
                          Booth {boothIndex + 1}
                        </span>
                        {hasOptions && (
                          <button
                            type="button"
                            className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditBooth(boothIndex)}
                          >
                            Edit options
                          </button>
                        )}
                        <button
                          type="button"
                          className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800"
                          onClick={() => handleRemoveBooth(boothIndex)}
                        >
                          Remove
                        </button>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {boothIndex === 0 ? "Primary booth" : "Additional booth"}
                      </p>
                    </div>
                    <span className="text-base font-bold tabular-nums text-slate-900">
                      {formatCurrency(displaySubtotal)}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
                    <li className="flex justify-between gap-4 text-slate-600">
                      <span>Booth space</span>
                      <span className="tabular-nums text-slate-800">
                        {formatCurrency(basePrice)}
                      </span>
                    </li>
                    {booth.extras?.map((extra, extraIndex: number) => {
                      const currentExtra = getExtraData(ExtraOptions, extra);
                      if (!currentExtra) return null;
                      return (
                        <li
                          key={`extra-${boothIndex}-${extraIndex}`}
                          className="flex justify-between gap-4 text-slate-600"
                        >
                          <span>{currentExtra.name}</span>
                          <span className="tabular-nums text-slate-800">
                            {formatMoneyOrIncluded(
                              registrationSource === "online"
                                ? currentExtra.price_online
                                : currentExtra.price_event
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex flex-col items-center gap-2">
        {canAddMore ? (
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleAddBooth}
          >
            {hasOptions
              ? "Add Booth"
              : `Add Booth — ${formatCurrency(nextPrice)}`}
          </button>
        ) : (
          <p className="text-sm italic text-slate-500">Max booths reached.</p>
        )}
      </div>
    </div>
  );
};

export default AddBoothsComponent;
