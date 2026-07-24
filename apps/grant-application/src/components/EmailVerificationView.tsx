import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { requestEditLink } from "../data/API";
import { useEditSession } from "../providers/EditSessionProvider";

const MESSAGES: Record<string, { text: string; tone: "success" | "error" }> = {
  not_found: {
    text: "Sorry, we were unable to locate an application associated with the email provided.",
    tone: "error",
  },
  locked: {
    text: "Your application is already being processed and cannot be modified at this time.",
    tone: "error",
  },
  sent: {
    text: "An email has been sent with a link to modify your application.",
    tone: "success",
  },
};

const EmailVerificationView = () => {
  const { setView, sessionError, isLoadingSession } = useEditSession();
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
      const response = await requestEditLink(email.trim());
      setResult(
        MESSAGES[response.code] ?? {
          text: "Something went wrong. Please try again later.",
          tone: "error",
        }
      );
    } catch (error) {
      console.error("Email verification failed:", error);
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
          Modify your application
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Enter an email address from your grant application (point of contact,
          board chair, engineer, or any additional contact). If the application
          is still eligible for changes, we will email a secure edit link.
        </p>

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
          {isVerifying || isLoadingSession ? (
            <div className="flex h-[42px] items-center justify-center px-4">
              <CircularProgress size={24} />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleVerify}
              disabled={!email.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Verify email
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

export default EmailVerificationView;
