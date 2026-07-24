import { useFormContext } from "react-hook-form";

interface CheckboxInputProps {
  name: string;
  label: string;
  required?: boolean;
  helperText?: string;
  onChange?: (checked: boolean) => void;
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

  const isChecked = watch(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue(name, checked, { shouldValidate: true });
    onChange?.(checked);
  };

  return (
    <div className="mb-4 text-left">
      <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 hover:bg-slate-100">
        <input
          {...register(name, { required })}
          type="checkbox"
          checked={Boolean(isChecked)}
          onChange={handleChange}
          className={`mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${
            errors[name] ? "border-red-500" : ""
          }`}
        />
        <span className="text-sm font-medium text-slate-800">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
      </label>
      {helperText && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
      {errors[name] && (
        <p className="mt-1 text-left text-sm text-red-500">
          {`${errors[name]?.message}*`}
        </p>
      )}
    </div>
  );
};
