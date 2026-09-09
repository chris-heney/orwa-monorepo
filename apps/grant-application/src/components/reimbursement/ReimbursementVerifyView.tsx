import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { requestReimbursementLink } from "../../data/API";
import { useEditSession } from "../../providers/EditSessionProvider";
import { useReimbursementSession } from "../../providers/ReimbursementSessionProvider";

const MESSAGES: Record<string, { text: string; tone: "success" | "error" }> = {
  not_found: {
    text: "Sorry, we were unable to locate a grant application associated with the email provided.",
    tone: "error",
  },
  not_eligible: {
    text: "We found your application, but it is not yet eligible for reimbursement. Reimbursements open once the grant agreement has been signed, sealed, and returned. Contact rig@orwa.org with questions.",
    tone: "error",
  },
  sent: {
    text: "An email has been sent with a secure link to submit your reimbursement request. The link is valid for 14 days.",
    tone: "success",
  },
};

const ReimbursementVerifyView = () => {
  const { setView } = useEditSession();
  const { error: sessionError, isLoading } = useReimbursementSession();
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    tone: "success" | "error";
  } | null>(null);

  const handleVerify = async () => {
    if (!email.trim()) return;
    setIsVerifying(true);
    setResult(null);
    try {
      const response = await requestReimbursementLink(email.trim());
      setResult(
        MESSAGES[response.code] ?? {
          text: "Something went wrong. Please try again later.",
          tone: "error",
        }
      );
    } catch (err) {
      console.error("Reimbursement email verification failed:", err);
      setResult({
        text: "Something went wrong. Please try again later.",
        tone: "error",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="flex flex-col items-center px-4 py-12 text-left md:py-20">
      <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Request a reimbursement
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Enter an email address from your approved grant application (point of
          contact, board chair, engineer, or any additional contact). We will
          email a secure link to the reimbursement request form.
        </p>

        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Copy of all paid invoices / pay applications</li>
          <li>Proof of payment (cleared check, card receipt, ACH, etc.)</li>
          <li>Photos of the project / work performed (if applicable)</li>
        </ul>

        {sessionError && (
          <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {sessionError}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1 text-left text-sm font-medium text-slate-700">
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerify();
              }}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="you@example.com"
            />
          </label>
          {isVerifying || isLoading ? (
            <div className="flex h-[42px] items-center justify-center px-4">
              <CircularProgress size={24} />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleVerify}
              disabled={!email.trim()}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Email me a link
            </button>
          )}
        </div>

        {result && (
          <p
            className={`mt-6 rounded-md border px-3 py-2 text-sm ${
              result.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {result.text}
          </p>
        )}

        <button
          type="button"
          className="mt-8 text-sm font-medium text-blue-600 hover:underline"
          onClick={() => setView("landing")}
        >
          ← Back
        </button>
      </div>
    </main>
  );
};

export default ReimbursementVerifyView;
