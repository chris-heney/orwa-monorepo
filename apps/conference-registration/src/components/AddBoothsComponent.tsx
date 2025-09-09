import { Dispatch, SetStateAction } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import currencyFormatter from "../helpers/currencyFormat";
import {
  useBoothIndex,
  useRegistrationOptions,
  useRegistrationSource,
} from "../AppContextProvider";
import { IBoothPayload } from "../types/types";
import { getExtraData } from "../helpers/getExtraData";

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
  
  const { control, getValues } = useFormContext();
  const { setBoothIndex } = useBoothIndex();
  const { append } = useFieldArray({ control, name: "booths" });

  const { ConferenceOptions, ExtraOptions } = useRegistrationOptions();
  const registrationSource = useRegistrationSource();

  const booths = getValues("booths");

  const handleAddBooth = () => {
    append({
      extras: [],
      subtotal: 0,
    });
    setIsBoothModalOpen({
      open: true,
      context: "create",
    });
    setBoothIndex(booths.length);
  };

  const handleEditBooth = (boothIndex: number) => {
    const currentBoothIndex = getValues("booths").findIndex(
      (_: any, index: number) => index === boothIndex
    );
    setBoothIndex(currentBoothIndex);
    setIsBoothModalOpen({
      open: true,
      context: "edit",
    });
    return currentBoothIndex;
  };

  return !ConferenceOptions ? (
    <>Loading...</>
  ) : (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <ul>
          {booths.map((booth: IBoothPayload, boothIndex: number) => (
            <li key={`booth-${boothIndex}`} className="mb-3">
              <div className="flex items-start text-base font-semibold">
                <span>Booth {boothIndex + 1}</span>
                <button
                  type="button"
                  className="text-blue-500 underline mr-auto italic"
                  onClick={() => handleEditBooth(boothIndex)}
                >
                  (Edit)
                </button>
                <span className="ml-auto">
                  {currencyFormatter.format(
                    boothIndex === 0
                      ? ConferenceOptions.booth_price
                      : ConferenceOptions.booth_price_2
                  )}
                </span>
              </div>
              <ul className="border-t-2 border-slate-300">
                {booth.extras.map((extra, extraIndex: number) => {
                  const currentExtra = getExtraData(ExtraOptions, extra);
                  if (!currentExtra) return null;
                  return (
                  <li
                    key={`extra-${extraIndex}`}
                    className={`flex justify-between ml-3 border-b border-gray-100 ${
                      extraIndex % 2 === 0 ? "bg-gray-200" : "bg-white"
                    }`}
                  >
                    <span>{currentExtra.name}</span>
                    <span>
                      {registrationSource === "online"
                        ? currencyFormatter.format(currentExtra.price_online)
                        : currencyFormatter.format(currentExtra.price_event)}
                    </span>
                  </li>
                )})}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Button */}
      {booths.length < ConferenceOptions.purchasable_booths && (
        <div className="py-4">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddBooth}
          >
            Add Booth
          </button>
        </div>
      )}
      {booths.length === ConferenceOptions.purchasable_booths && (
        <p className="italic text-slate-700 mt-3">Max Booths Reached.</p>
      )}
    </div>
  );
};

export default AddBoothsComponent;
