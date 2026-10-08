import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchEditSession } from "../data/API";
import {
  clearStoredEditToken,
  getEditTokenFromUrl,
  getStoredEditToken,
  replaceEditTokenInUrl,
  storeEditToken,
} from "../helpers/editTokenStorage";
import { IGrantApplicationFormPayload } from "../types/types";

export type AppView =
  | "landing"
  | "verify"
  | "form"
  // Reimbursement requests for approved applications (ReimbursementSessionProvider)
  | "reimburse-verify"
  | "reimburse";

interface EditSessionContext {
  view: AppView;
  setView: (view: AppView) => void;
  /** Non-null while editing an existing application. */
  editToken: string | null;
  /** Hydrated application data, present once an edit session is validated. */
  editPayload: IGrantApplicationFormPayload | null;
  isEditMode: boolean;
  isLoadingSession: boolean;
  /** Message shown on the verify view when a token was rejected. */
  sessionError: string | null;
  /** Shown on the form when a locked link opened a different application. */
  sessionNotice: string | null;
  startNewApplication: () => void;
  /** "Modify Existing": use stored token if present, else email verification. */
  beginModify: () => void;
  /** Called after a successful new submission to enable future edits. */
  rememberEditToken: (token: string) => void;
  /** Token/status was rejected server-side mid-session. */
  invalidateSession: (message: string) => void;
}

const EditSession = createContext<EditSessionContext>({
  view: "landing",
  setView: () => {},
  editToken: null,
  editPayload: null,
  isEditMode: false,
  isLoadingSession: false,
  sessionError: null,
  sessionNotice: null,
  startNewApplication: () => {},
  beginModify: () => {},
  rememberEditToken: () => {},
  invalidateSession: () => {},
});

export const useEditSession = () => useContext(EditSession);

export const lockedApplicationMessage = (status?: string | null) =>
  status
    ? `This application is "${status}" and can no longer be modified.`
    : "Your application is already being processed and cannot be modified at this time.";

const INVALID_MESSAGE =
  "Your edit link is no longer valid. Please verify your email to receive a new one.";

const EditSessionProvider = ({ children }: PropsWithChildren) => {
  const [view, setView] = useState<AppView>("landing");
  const [editToken, setEditToken] = useState<string | null>(null);
  const [editPayload, setEditPayload] =
    useState<IGrantApplicationFormPayload | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

  const startEditSession = async (token: string) => {
    setIsLoadingSession(true);
    setSessionError(null);
    try {
      const response = await fetchEditSession(token);

      if (response.code === "ok" && response.application) {
        const activeToken = response.editToken || token;
        storeEditToken(activeToken);
        replaceEditTokenInUrl(activeToken);
        setEditToken(activeToken);
        setEditPayload(
          response.application as unknown as IGrantApplicationFormPayload
        );
        setSessionNotice(response.notice ?? null);
        setView("form");
      } else {
        clearStoredEditToken();
        setEditToken(null);
        setEditPayload(null);
        setSessionNotice(null);
        setSessionError(
          response.code === "locked"
            ? lockedApplicationMessage(response.status)
            : INVALID_MESSAGE
        );
        setView("verify");
      }
    } catch (error) {
      console.error("Failed to load edit session:", error);
      setSessionError(
        "We were unable to load your application. Please try again."
      );
      setView("verify");
    } finally {
      setIsLoadingSession(false);
    }
  };

  // Arriving from the email link skips the landing screen entirely.
  useEffect(() => {
    const urlToken = getEditTokenFromUrl();
    if (urlToken) {
      startEditSession(urlToken);
    }
  }, []);

  const startNewApplication = () => {
    setEditToken(null);
    setEditPayload(null);
    setSessionError(null);
    setSessionNotice(null);
    setView("form");
  };

  const beginModify = () => {
    const storedToken = getStoredEditToken();
    if (storedToken) {
      startEditSession(storedToken);
    } else {
      setSessionError(null);
      setSessionNotice(null);
      setView("verify");
    }
  };

  const rememberEditToken = (token: string) => {
    storeEditToken(token);
    setEditToken(token);
  };

  const invalidateSession = (message: string) => {
    clearStoredEditToken();
    setEditToken(null);
    setEditPayload(null);
    setSessionNotice(null);
    setSessionError(message);
    setView("verify");
  };

  return (
    <EditSession.Provider
      value={{
        view,
        setView,
        editToken,
        editPayload,
        isEditMode: editToken !== null && editPayload !== null,
        isLoadingSession,
        sessionError,
        sessionNotice,
        startNewApplication,
        beginModify,
        rememberEditToken,
        invalidateSession,
      }}
    >
      {children}
    </EditSession.Provider>
  );
};

export default EditSessionProvider;
