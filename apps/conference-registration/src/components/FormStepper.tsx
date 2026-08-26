import { Dispatch, SetStateAction, useContext } from "react";
import { FormSteps, useUserContext } from "../AppContextProvider";
import { IFormStep } from "./FormSteps";
import { canJumpWizardSteps } from "../helpers/canJumpWizardSteps";

interface FormStepperProps {
  stepIndex: number;
  setStepIndex: Dispatch<SetStateAction<number>>;
}

const FormStepper = ({ stepIndex, setStepIndex }: FormStepperProps) => {
  const { steps } = useContext(FormSteps);
  const { isLoggedIn, isAdminView } = useUserContext();
  const canJumpSteps = canJumpWizardSteps(isLoggedIn, isAdminView);
  const activeSteps = steps.filter((step) => step.active);
  const current = activeSteps[stepIndex];
  const total = activeSteps.length;
  const progressPct = total > 0 ? ((stepIndex + 1) / total) * 100 : 0;

  const goToStep = (index: number) => {
    if (!canJumpSteps) return;
    setStepIndex(index);
  };

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-3 sm:py-4">
        {/* Mobile: compact progress + current label */}
        <div className="sm:hidden">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">
              {current?.label ?? "Registration"}
            </p>
            <p className="shrink-0 text-xs tabular-nums text-slate-500">
              Step {stepIndex + 1} of {total}
            </p>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-valuenow={stepIndex + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label={`Step ${stepIndex + 1} of ${total}`}
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-[width] duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {total > 1 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeSteps.map((step: IFormStep, index) => {
                const isCurrent = index === stepIndex;
                const isComplete = index < stepIndex;
                const chipClass = `rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  isCurrent
                    ? "bg-blue-600 text-white"
                    : isComplete
                      ? canJumpSteps
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-blue-100 text-blue-800"
                      : canJumpSteps
                        ? "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                        : "bg-white text-slate-600 ring-1 ring-slate-200"
                } ${canJumpSteps ? "cursor-pointer" : "cursor-default"}`;

                return canJumpSteps ? (
                  <button
                    key={step.key}
                    type="button"
                    id={`step-index-${index}`}
                    onClick={() => goToStep(index)}
                    className={chipClass}
                  >
                    {step.label}
                  </button>
                ) : (
                  <span
                    key={step.key}
                    id={`step-index-${index}`}
                    className={chipClass}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {step.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop / tablet: slim connected steps */}
        <nav className="hidden sm:block" aria-label="Registration progress">
          <ol className="flex items-center gap-0">
            {activeSteps.map((step: IFormStep, index) => {
              const isCurrent = index === stepIndex;
              const isComplete = index < stepIndex;
              const isLast = index === activeSteps.length - 1;
              const circleClass = `flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors ${
                isCurrent
                  ? "bg-blue-600 text-white"
                  : isComplete
                    ? canJumpSteps
                      ? "bg-blue-100 text-blue-800 group-hover:bg-blue-200"
                      : "bg-blue-100 text-blue-800"
                    : canJumpSteps
                      ? "bg-white text-slate-500 ring-1 ring-slate-300 group-hover:ring-slate-400"
                      : "bg-white text-slate-500 ring-1 ring-slate-300"
              }`;
              const labelClass = `truncate text-sm font-medium ${
                isCurrent
                  ? "text-slate-900"
                  : isComplete
                    ? canJumpSteps
                      ? "text-slate-700 group-hover:text-slate-900"
                      : "text-slate-700"
                    : canJumpSteps
                      ? "text-slate-500 group-hover:text-slate-700"
                      : "text-slate-500"
              }`;
              const marker = (
                <>
                  <span
                    className={circleClass}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isComplete ? (
                      <svg
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <path d="M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className={labelClass}>{step.label}</span>
                </>
              );

              return (
                <li
                  key={step.key}
                  className={`flex min-w-0 items-center ${isLast ? "" : "flex-1"}`}
                >
                  {canJumpSteps ? (
                    <button
                      type="button"
                      id={`step-index-${index}`}
                      onClick={() => goToStep(index)}
                      className="group flex min-w-0 max-w-full cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      {marker}
                    </button>
                  ) : (
                    <div
                      id={`step-index-${index}`}
                      className="flex min-w-0 max-w-full cursor-default items-center gap-2 rounded-md px-1 py-0.5 text-left"
                    >
                      {marker}
                    </div>
                  )}

                  {!isLast && (
                    <div
                      className={`mx-2 h-px min-w-[0.75rem] flex-1 ${
                        isComplete ? "bg-blue-300" : "bg-slate-200"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </section>
  );
};

export default FormStepper;
