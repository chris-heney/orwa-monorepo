import { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
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
  const [result, setResult] = useState<{ text: string; tone: "success" | "error" } | null>(null);

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
    <main className="flex flex-col items-center text-center px-4 py-12 md:py-20">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Modify Your Application
        </h1>
        <p className="text-gray-600 mb-8">
          Enter the email address used on your grant application. If your
          application is still eligible for changes, we will email you a
          secure link to modify it.
        </p>

        {sessionError && (
          <p className="mb-6 p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            {sessionError}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
          <TextField
            type="email"
            label="Email Address"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleVerify();
            }}
            className="flex-1"
          />
          {isVerifying || isLoadingSession ? (
            <CircularProgress className="self-center" />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleVerify}
              disabled={!email.trim()}
            >
              Verify Email
            </Button>
          )}
        </div>

        {result && (
          <p
            className={`mt-6 p-3 rounded-md border ${
              result.tone === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {result.text}
          </p>
        )}

        <Button
          variant="text"
          className="mt-8"
          onClick={() => setView("landing")}
        >
          &laquo; Back
        </Button>
      </div>
    </main>
  );
};

export default EmailVerificationView;
