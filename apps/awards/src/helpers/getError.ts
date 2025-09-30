import { useFormContext } from "react-hook-form";

export const getError = (name: string) => {
  const { formState: { errors } } = useFormContext();

  // Handle undefined or invalid name parameter
  if (!name || typeof name !== 'string') {
    console.warn('getError called with invalid name:', name);
    return null;
  }

  try {
    const errorPath = name.split(".").reduce((acc, key) => {
      return acc?.[key] || acc?.[parseInt(key)] || {};
    }, errors as any);

    return errorPath?.message;
  } catch (error) {
    console.warn('Error accessing form errors for field:', name, error);
    return null;
  }
};

// gets errors for arrays and regular inputs
