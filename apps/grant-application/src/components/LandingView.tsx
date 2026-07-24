import { CircularProgress } from "@mui/material";
import { useEditSession } from "../providers/EditSessionProvider";

const LandingView = () => {
  const { startNewApplication, beginModify, isLoadingSession } =
    useEditSession();

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

        {isLoadingSession ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <CircularProgress size={28} />
            <p className="text-sm text-slate-500">Loading your application…</p>
          </div>
        ) : (
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
        )}
      </div>
    </main>
  );
};

export default LandingView;
