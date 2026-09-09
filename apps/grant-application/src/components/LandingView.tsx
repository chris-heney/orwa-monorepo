import { CircularProgress } from "@mui/material";
import { useEditSession } from "../providers/EditSessionProvider";
import { useReimbursementSession } from "../providers/ReimbursementSessionProvider";

const LandingView = () => {
  const { startNewApplication, beginModify, isLoadingSession } =
    useEditSession();
  const { beginReimbursement, isLoading: isLoadingReimbursement } =
    useReimbursementSession();

  const isLoading = isLoadingSession || isLoadingReimbursement;

  return (
    <main className="flex flex-col items-center px-4 py-12 text-left md:py-20">
      <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          ORWA Grant Application
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
          Welcome to the Oklahoma Rural Water Association grant application
          portal. Start a new application, or make changes to one you have
          already submitted — applications can be modified until they enter
          processing.
        </p>

        {isLoading ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <CircularProgress size={28} />
            <p className="text-sm text-slate-500">
              {isLoadingReimbursement
                ? "Loading your approved grants…"
                : "Loading your application…"}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startNewApplication}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex-1"
              >
                Start New Application
              </button>
              <button
                type="button"
                onClick={beginModify}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex-1"
              >
                Modify Existing Application
              </button>
            </div>

            <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50/60 p-5">
              <h2 className="text-base font-semibold text-emerald-900">
                Already approved? Request a reimbursement
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-emerald-900/80">
                If your grant agreement has been signed and returned, submit
                paid invoices, proof of payment, and project photos for
                reimbursement. You will need an email address listed on your
                application.
              </p>
              <button
                type="button"
                onClick={beginReimbursement}
                className="mt-4 w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
              >
                Request Reimbursement
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default LandingView;
