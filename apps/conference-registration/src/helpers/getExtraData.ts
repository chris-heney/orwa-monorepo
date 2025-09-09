import { IExtraOption } from "../types/types";

export const getExtraData = (
  extraOptions: IExtraOption[],
  extraOptionId: number
) => {
  // Ensure extraOptions is an array
  return extraOptions.find((extraOption) => {
    return extraOption.id === extraOptionId;
  });
};
