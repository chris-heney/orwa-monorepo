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
  storeEditToken,
} from "../helpers/editTokenStorage";
import { IGrantApplicationFormPayload } from "../types/types";

export type AppView = "landing" | "verify" | "form";

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
  startNewApplication: () => {},
  beginModify: () => {},
  rememberEditToken: () => {},
  invalidateSession: () => {},
});

export const useEditSession = () => useContext(EditSession);

const LOCKED_MESSAGE =
  "Your application is already being processed and cannot be modified at this time.";
const INVALID_MESSAGE =
  "Your edit link is no longer valid. Please verify your email to receive a new one.";

const EditSessionProvider = ({ children }: PropsWithChildren) => {
  const [view, setView] = useState<AppView>("landing");
  const [editToken, setEditToken] = useState<string | null>(null);
  const [editPayload, setEditPayload] =
    useState<IGrantApplicationFormPayload | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const startEditSession = async (token: string) => {
    setIsLoadingSession(true);
    setSessionError(null);
    try {
      const response = await fetchEditSession(token);

      if (response.code === "ok" && response.application) {
        storeEditToken(token);
        setEditToken(token);
        setEditPayload(
          response.application as unknown as IGrantApplicationFormPayload
        );
        setView("form");
      } else {
        clearStoredEditToken();
        setEditToken(null);
        setEditPayload(null);
        setSessionError(
          response.code === "locked" ? LOCKED_MESSAGE : INVALID_MESSAGE
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
    setView("form");
  };

  const beginModify = () => {
    const storedToken = getStoredEditToken();
    if (storedToken) {
      startEditSession(storedToken);
    } else {
      setSessionError(null);
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
