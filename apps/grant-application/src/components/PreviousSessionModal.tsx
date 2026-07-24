import { formatSavedDataTimestamp } from "../helpers/formPersistence";

interface PreviousSessionModalProps {
  open: boolean;
  savedTimestamp: number;
  onContinue: () => void;
  onStartFresh: () => void;
}

const PreviousSessionModal = ({
  open,
  savedTimestamp,
  onContinue,
  onStartFresh,
}: PreviousSessionModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="previous-session-title"
    >
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl text-left">
        <h2
          id="previous-session-title"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          Previous session found
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          We found a previous session where you were filling out this form
          (last updated {formatSavedDataTimestamp(savedTimestamp)}). Continue
          where you left off, or start fresh?
        </p>

        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          <p className="font-medium">
            Your form data and uploaded files can be restored from that session.
          </p>
          <p className="mt-1 text-emerald-800">
            Please re-check each step to confirm everything is still correct.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue where I left off
          </button>
          <button
            type="button"
            onClick={onStartFresh}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start fresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviousSessionModal;
