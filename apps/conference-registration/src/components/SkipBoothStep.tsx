import { useFormContext } from "react-hook-form";
import { useStepContext } from "../AppContextProvider";

const SkipBoothStep = () => {
  const { setFormSteps } = useStepContext();
  const { watch, setValue } = useFormContext();
  const previousRegistrationChange =
    (watch("previous_registration_change") as string | undefined) ?? "";

  const handleChange = (value: "Yes" | "No") => {
    setValue("previous_registration_change", value, { shouldDirty: true });
    setFormSteps((steps) =>
      steps.map((step) =>
        step.key === "booth_registration"
          ? { ...step, active: value === "No" }
          : step
      )
    );
  };

  // After answering "No", hide the prompt (booth step stays active).
  if (previousRegistrationChange === "No") {
    return null;
  }

  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Previous registration
      </h3>
      <p className="mb-4 text-sm text-slate-600">
        Are you making changes to a previous registration?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {(["Yes", "No"] as const).map((value) => {
          const selected = previousRegistrationChange === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleChange(value)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                selected
                  ? "border-blue-600 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  selected
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 bg-white"
                }`}
                aria-hidden="true"
              >
                {selected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              {value}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default SkipBoothStep;
