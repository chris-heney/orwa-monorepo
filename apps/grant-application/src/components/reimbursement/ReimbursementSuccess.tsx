import currencyFormatter from "../../helpers/currencyFormat";
import {
  IReimbursableApplication,
  IReimbursementSubmitResponse,
} from "../../types/reimbursement";

const money = (n: number | undefined) => currencyFormatter.format(n || 0);

interface Props {
  result: IReimbursementSubmitResponse;
  application: IReimbursableApplication;
  requesterEmail: string;
  onAnother: () => void;
  onDone: () => void;
}

const ReimbursementSuccess = ({
  result,
  application,
  requesterEmail,
  onAnother,
  onDone,
}: Props) => {
  const remainingAfter = result.balance?.remaining_after;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-left">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-7 w-7" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M16.704 5.004a.75.75 0 011.058 1.058l-8.5 8.5a.75.75 0 01-1.058 0l-4.25-4.25a.75.75 0 011.058-1.058l3.72 3.72 7.972-7.972z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {result.duplicate
            ? "This request was already received"
            : "Reimbursement request submitted"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Thank you. The RIG Grant Manager has been notified and a confirmation
          has been emailed to{" "}
          <span className="font-semibold text-slate-800">{requesterEmail}</span>.
          If ORWA needs anything else, we will reply to that email — please
          reply to the same thread so your request stays together.
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Email subject / reference
            </dt>
            <dd className="mt-0.5 break-words font-mono text-sm font-semibold text-slate-900">
              {result.subject}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Request #</dt>
            <dd className="font-semibold text-slate-900">{result.payout?.id ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">System</dt>
            <dd className="font-semibold text-slate-900">{application.legal_entity_name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Total invoices
            </dt>
            <dd className="font-semibold tabular-nums text-slate-900">
              {money(result.payout?.invoice_total)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Reimbursement requested
            </dt>
            <dd className="font-semibold tabular-nums text-emerald-700">
              {money(result.payout?.amount)}
            </dd>
          </div>
          {remainingAfter != null && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Grant balance remaining
              </dt>
              <dd className="font-semibold tabular-nums text-slate-900">
                {money(remainingAfter)}
              </dd>
            </div>
          )}
        </dl>

        {result.capped && (
          <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Your invoices exceeded the remaining grant balance, so the request
            was capped at the amount shown above.
          </p>
        )}

        {result.emails_sent === false && (
          <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Your request was recorded, but we could not send the confirmation
            email. Please keep the reference above.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {remainingAfter != null && remainingAfter > 0 && (
            <button
              type="button"
              onClick={onAnother}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Submit another request
            </button>
          )}
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </main>
  );
};

export default ReimbursementSuccess;
