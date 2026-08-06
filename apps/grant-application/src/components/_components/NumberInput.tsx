import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";

interface NumberInputProps {
  name: string;
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  decimalScale?: number;
  helperText?: string;
  mask?: "currency" | "percentage" | "none";
  disabled?: boolean;
  requiredMessage?: string;
  wholeNumber?: boolean;
}

const NumberInput = ({
  name,
  label,
  required = false,
  min,
  max,
  maxLength,
  decimalScale = 2,
  helperText,
  mask = "none",
  disabled = false,
  requiredMessage,
  wholeNumber = false,
}: NumberInputProps) => {
  const { register, formState, setValue, watch, getFieldState } =
    useFormContext();
  const number = watch(name);
  // Supports nested paths (e.g. project_costs.12) — errors[name] alone does not.
  const { error } = getFieldState(name, formState);

  const handleValueChange = (values: any) => {
    const { floatValue } = values;
    setValue(name, floatValue, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="mb-6">
      <label className="block mb-1 text-sm font-bold text-left">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <NumericFormat
        {...register(name, {
          required: required
            ? `${label} ${requiredMessage ? requiredMessage : "is required"}`
            : false,
          min: min,
          max: max,
          validate: (value: number) => {
            if (
              required &&
              (value === undefined || value === null || Number.isNaN(value))
            ) {
              return `${label} ${requiredMessage ? requiredMessage : "is required"}`;
            }
            if (min !== undefined && value != null && value < min) {
              return `${label} must be greater than or equal to ${min}`;
            }
            if (maxLength && value != null && value.toString().length > maxLength) {
              return `${label} must be ${maxLength} digits or less`;
            }
            return true;
          },
        })}
        disabled={disabled}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          disabled
            ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
            : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
        } ${error ? "border-red-500 focus:ring-red-500" : ""}`}
        thousandSeparator={
          mask === "currency" || mask === "percentage" ? "," : undefined
        }
        prefix={mask === "currency" ? "$" : undefined}
        suffix={mask === "percentage" ? "%" : undefined}
        onValueChange={handleValueChange}
        value={number ?? ""}
        allowNegative={false}
        decimalScale={wholeNumber ? 0 : decimalScale} // Disable decimal scale if wholeNumber is true
        isAllowed={(values) => {
          const { floatValue, formattedValue } = values;

          // Disallow decimals if wholeNumber is true
          if (wholeNumber && formattedValue.includes(".")) {
            return false;
          }

          return (
            !(max && floatValue && floatValue > max) &&
            !(min && floatValue && floatValue < min)
          );
        }}
      />
      {helperText && (
        <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1 text-left">{`${error.message}`}</p>
      )}
      {number !== undefined &&
        number !== null &&
        max !== undefined &&
        number > max && (
          <p className="text-red-500 text-sm mt-1 text-left">
            {`${label} must be less than or equal to ${max}`}
          </p>
        )}

      {number !== undefined &&
        number !== null &&
        min !== undefined &&
        number < min && (
          <p className="text-red-500 text-sm mt-1 text-left">
            {`${label} must be greater than or equal to ${min}`}
          </p>
        )}
    </div>
  );
};

export { NumberInput };