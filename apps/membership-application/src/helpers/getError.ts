import { useFormContext } from "react-hook-form";

export const getError = (name: string,) => {

    const { formState: { errors } } = useFormContext();

  const errorPath = name.split(".").reduce((acc, key) => {
    return acc?.[key] || acc?.[parseInt(key)] || {};
  }, errors as any);

  return errorPath?.message;
};

// gets errors for arrays and regular inputs
