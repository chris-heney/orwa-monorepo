import { useFormContext } from "react-hook-form";
import { HighlightByName } from "../../helpers/validationHighlight";

interface RadioGroupInputProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  helperText?: string;
  requiredMessage?: string;
}

export const RadioGroupInput = ({
  name,
  label,
  options,
  required = false,
  helperText,
  requiredMessage,
}: RadioGroupInputProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedValue = watch(name);
  const fieldError = errors[name]?.message as string | undefined;

  return (
    <HighlightByName name={name}>
      <div className="mb-6">
        <p className="block mb-2 text-left text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
        <div className="space-y-2" role="radiogroup" aria-label={label}>
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-slate-50 px-3 py-3 cursor-pointer hover:bg-slate-100"
            >
              <input
                {...register(name, {
                  required: required
                    ? `${label} ${requiredMessage ? requiredMessage : "is required"}`
                    : false,
                })}
                type="radio"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => setValue(name, option.value, { shouldValidate: true })}
                className="h-4 w-4 cursor-pointer"
              />
              <span className="text-sm text-gray-800 text-left">{option.label}</span>
            </label>
          ))}
        </div>
        {helperText && !fieldError && (
          <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
        )}
        {fieldError && (
          <p className="text-red-500 text-sm mt-1 text-left">{`${fieldError}*`}</p>
        )}
      </div>
    </HighlightByName>
  );
};
