import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchReimbursementSession } from "../data/API";
import {
  clearStoredReimbursementToken,
  getReimbursementTokenFromUrl,
  getStoredReimbursementToken,
  storeReimbursementToken,
  stripReimbursementTokenFromUrl,
} from "../helpers/reimbursementTokenStorage";
import { IReimbursementSession } from "../types/reimbursement";
import { useEditSession } from "./EditSessionProvider";

interface ReimbursementSessionContext {
  /** Non-null while a verified reimbursement session is active. */
  token: string | null;
  session: IReimbursementSession | null;
  isLoading: boolean;
  /** Message shown on the verify view when a token was rejected. */
  error: string | null;
  /** "Request Reimbursement": use stored token if present, else email verification. */
  beginReimbursement: () => void;
  /** Re-fetch balances (after a successful submit). */
  refreshSession: () => Promise<void>;
  /** Token was rejected server-side mid-session. */
  invalidate: (message: string) => void;
  /** Forget the stored link (e.g. "not me" / different email). */
  signOut: () => void;
}

const Ctx = createContext<ReimbursementSessionContext>({
  token: null,
  session: null,
  isLoading: false,
  error: null,
  beginReimbursement: () => {},
  refreshSession: async () => {},
  invalidate: () => {},
  signOut: () => {},
});

export const useReimbursementSession = () => useContext(Ctx);

export const REIMBURSE_MESSAGES = {
  invalid:
    "Your reimbursement link is no longer valid. Please verify your email to receive a new one.",
  not_eligible:
    "None of the grant applications linked to your email are currently eligible for reimbursement.",
  no_balance:
    "This grant has no remaining balance available for reimbursement.",
  error: "We were unable to load your reimbursement session. Please try again.",
};

const ReimbursementSessionProvider = ({ children }: PropsWithChildren) => {
  const { setView } = useEditSession();
  const [token, setToken] = useState<string | null>(null);
  const [session, setSession] = useState<IReimbursementSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = useCallback(
    async (candidate: string, { silent = false } = {}) => {
      if (!silent) setIsLoading(true);
      setError(null);
      try {
        const response = await fetchReimbursementSession(candidate);
        if (response.code === "ok" && response.applications) {
          storeReimbursementToken(candidate);
          setToken(candidate);
          setSession({
            email: response.email ?? "",
            expires: response.expires ?? "",
            applications: response.applications,
          });
          setView("reimburse");
        } else {
          clearStoredReimbursementToken();
          setToken(null);
          setSession(null);
          setError(
            response.code === "not_eligible"
              ? REIMBURSE_MESSAGES.not_eligible
              : REIMBURSE_MESSAGES.invalid
          );
          setView("reimburse-verify");
        }
      } catch (err) {
        console.error("Failed to load reimbursement session:", err);
        setError(REIMBURSE_MESSAGES.error);
        setView("reimburse-verify");
      } finally {
        setIsLoading(false);
      }
    },
    [setView]
  );

  // Arriving from the email link skips the landing screen entirely.
  useEffect(() => {
    const urlToken = getReimbursementTokenFromUrl();
    if (urlToken) {
      stripReimbursementTokenFromUrl();
      startSession(urlToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const beginReimbursement = () => {
    const stored = getStoredReimbursementToken();
    if (stored) {
      startSession(stored);
    } else {
      setError(null);
      setView("reimburse-verify");
    }
  };

  const refreshSession = async () => {
    if (token) await startSession(token, { silent: true });
  };

  const invalidate = (message: string) => {
    clearStoredReimbursementToken();
    setToken(null);
    setSession(null);
    setError(message);
    setView("reimburse-verify");
  };

  const signOut = () => {
    clearStoredReimbursementToken();
    setToken(null);
    setSession(null);
    setError(null);
    setView("landing");
  };

  return (
    <Ctx.Provider
      value={{
        token,
        session,
        isLoading,
        error,
        beginReimbursement,
        refreshSession,
        invalidate,
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export default ReimbursementSessionProvider;
