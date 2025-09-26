import { useFormContext } from "react-hook-form";

export const getError = (name: string) => {
  const { formState: { errors } } = useFormContext();

  // Handle undefined or invalid name parameter
  if (!name || typeof name !== 'string') {
    return null;
  }

  const errorPath = name.split(".").reduce((acc, key) => {
    return acc?.[key] || acc?.[parseInt(key)] || {};
  }, errors as any);

  return errorPath?.message;
};

// gets errors for arrays and regular inputs
