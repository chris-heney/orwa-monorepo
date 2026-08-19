import { useFormContext } from "react-hook-form";
import { HighlightByName } from "../../helpers/validationHighlight";

// Checkbox Input Component
interface CheckboxInputProps {
  name: string;
  label: string;
  required?: boolean;
  helperText?: string;
  onChange?: (checked: boolean) => void; // Allow passing an onChange function
}

export const CheckboxInput = ({
  name,
  label,
  required = false,
  helperText,
  onChange,
}: CheckboxInputProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Get the current value of the checkbox
  const isChecked = watch(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue(name, checked); // Update the form state
    if (onChange) {
      onChange(checked); // Trigger the custom onChange handler
    }
  };

  return (
    <HighlightByName name={name}>
    <div className="mb-4">
      <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-slate-50 px-3 py-3 cursor-pointer hover:bg-slate-100">
        <input
          {...register(name, { required })}
          type="checkbox"
          checked={Boolean(isChecked)}
          onChange={handleChange}
          className={`h-4 w-4 cursor-pointer ${
            errors[name] ? "border-red-500" : "border-gray-300"
          }`}
        />
        <span className="block text-left text-sm font-semibold">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
      </label>
      {helperText && (
        <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 text-left">{`${errors[name]?.message}*`}</p>
      )}
    </div>
    </HighlightByName>
  );
};