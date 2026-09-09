import { useFormContext } from "react-hook-form";
import currencyFormatter from "../../helpers/currencyFormat";
import { IReimbursableApplication } from "../../types/reimbursement";

const money = (n: number) => currencyFormatter.format(n || 0);

interface Props {
  applications: IReimbursableApplication[];
}

/**
 * Radio-card list of approved applications the verified email may draw
 * against. Fully drawn applications stay visible (so the applicant sees why)
 * but cannot be selected.
 */
const ApplicationPicker = ({ applications }: Props) => {
  const { watch, setValue, register } = useFormContext();
  const selected = watch("application");

  register("application", {
    validate: (value: string) =>
      value ? true : "Select the grant application to reimburse.",
  });

  return (
    <div className="grid grid-cols-1 gap-3">
      {applications.map((app) => {
        const isSelected = selected === app.documentId;
        const exhausted = app.remaining_balance <= 0;
        return (
          <label
            key={app.documentId}
            className={[
              "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition",
              exhausted
                ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-70"
                : isSelected
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/30"
                  : "border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/40",
            ].join(" ")}
          >
            <input
              type="radio"
              name="application-picker"
              className="mt-1 h-4 w-4 shrink-0 text-emerald-600 focus:ring-emerald-500"
              checked={isSelected}
              disabled={exhausted}
              onChange={() =>
                setValue("application", app.documentId, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-base font-semibold text-slate-900">
                  {app.legal_entity_name}
                </span>
                <span className="text-sm font-medium text-slate-600">
                  Application ID #{app.application_id || "—"}
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {[app.grant_name, app.county && `${app.county} County`, app.status]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Award
                  </dt>
                  <dd className="font-semibold tabular-nums text-slate-900">
                    {money(app.award_amount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Paid to date
                  </dt>
                  <dd className="font-semibold tabular-nums text-slate-900">
                    {money(app.paid_to_date)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Pending
                  </dt>
                  <dd className="font-semibold tabular-nums text-slate-900">
                    {money(app.pending_requests)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Remaining
                  </dt>
                  <dd
                    className={`font-semibold tabular-nums ${
                      exhausted ? "text-red-600" : "text-emerald-700"
                    }`}
                  >
                    {money(app.remaining_balance)}
                  </dd>
                </div>
              </dl>
              {exhausted && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  This grant has been fully requested or paid; no balance remains.
                </p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default ApplicationPicker;
