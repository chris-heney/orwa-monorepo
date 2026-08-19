import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { HighlightByName } from "../../helpers/validationHighlight";
import { getError } from "../../helpers/getError";

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
  step?: number;
  defaultValue?: number;
  placeholder?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
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
  step,
  defaultValue,
  placeholder,
  wrapperClassName,
  labelClassName,
  inputClassName,
}: NumberInputProps) => {
  const { register, setValue, watch } = useFormContext();
  const number = watch(name);
  const fieldError = getError(name);
  const numericValue =
    typeof number === "number" && Number.isFinite(number)
      ? number
      : typeof number === "string" &&
          number.trim() !== "" &&
          Number.isFinite(Number(number))
        ? Number(number)
        : undefined;
  const showMinHint =
    numericValue !== undefined && min !== undefined && numericValue < min;
  const showMaxHint =
    numericValue !== undefined && max !== undefined && numericValue > max;

  const handleValueChange = (values: any) => {
    const { floatValue } = values;
    setValue(name, floatValue);
  };

  return (
    <HighlightByName name={name}>
    <div className={wrapperClassName ?? "mb-6"}>
      <label
        className={
          labelClassName ?? "block mb-1 text-sm font-bold text-left"
        }
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <NumericFormat
        {...register(name, {
          required: required
            ? `${label} ${requiredMessage ? requiredMessage : "is required"}`
            : false,
          validate: (value: number | string | null | undefined) => {
            if (
              value === undefined ||
              value === null ||
              value === "" ||
              (typeof value === "number" && !Number.isFinite(value))
            ) {
              if (required) {
                return `${label} ${requiredMessage ? requiredMessage : "is required"}`;
              }
              return true;
            }
            const n = typeof value === "number" ? value : Number(value);
            if (!Number.isFinite(n)) {
              return true;
            }
            if (maxLength && n.toString().length > maxLength) {
              return `${label} must be ${maxLength} digits or less`;
            }
            if (min !== undefined && n < min) {
              return `${label} must be greater than or equal to ${min}`;
            }
            if (max !== undefined && n > max) {
              return `${label} must be less than or equal to ${max}`;
            }
            return true;
          },
        })}
        disabled={disabled}
        className={`block w-full border shadow-sm focus:outline-none focus:ring-2 ${
          inputClassName ?? "px-3 py-2 rounded-md"
        } ${
          disabled
            ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
            : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
        } ${fieldError ? "border-red-500 focus:ring-red-500" : ""}`}
        thousandSeparator={
          mask === "currency" || mask === "percentage" ? "," : undefined
        }
        prefix={mask === "currency" ? "$" : undefined}
        suffix={mask === "percentage" ? "%" : undefined}
        onValueChange={handleValueChange}
        value={number || defaultValue}
        placeholder={placeholder}
        allowNegative={false}
        decimalScale={wholeNumber ? 0 : decimalScale} // Disable decimal scale if wholeNumber is true
        isAllowed={(values) => {
          const { floatValue, formattedValue } = values;

          // Disallow decimals if wholeNumber is true
          if (wholeNumber && formattedValue.includes(".")) {
            return false;
          }

          return !(max != null && floatValue != null && floatValue > max);
        }}
      />
      {helperText && !fieldError && (
        <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
      )}
      {fieldError && !showMinHint && !showMaxHint && (
        <p className="text-red-500 text-sm mt-1 text-left">{`${fieldError}`}</p>
      )}
      {showMaxHint && (
          <p className="text-red-500 text-sm mt-1 text-left">
            {`${label} must be less than or equal to ${max}`}
          </p>
        )}

      {showMinHint && (
          <p className="text-red-500 text-sm mt-1 text-left">
            {`${label} must be greater than or equal to ${min}`}
          </p>
        )}
    </div>
    </HighlightByName>
  );
};

export { NumberInput };