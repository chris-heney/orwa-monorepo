import { useCallback, useMemo, useState, type ReactNode } from "react";
import { TermsGate } from "@orwa/terms-gate";
import "./App.css";
import AwardNominationForm from "./components/AwardNominationForm";
import Header from "./components/Header";
import LandingView from "./components/LandingView";
import { NotifyProvider } from "./NotificationProvider";
import EntryListProvider from "./providers/EntryListProvider";
import { useUserContext } from "./providers/UserContextProvider";
import EntryList from "./entries/EntryList";
import LoginModal from "./components/LoginModal";
import ErrorBoundary from "./components/ErrorBoundary";

// Admins (?admin), direct nomination links (?nominate), and reloads mid-wizard
// (?step=…, written by WizardStateSync) bypass the landing page.
const searchParams = new URLSearchParams(window.location.search);
const skipsLanding =
  searchParams.has("admin") ||
  searchParams.has("nominate") ||
  searchParams.has("step");

function App() {
  const { viewingEntries, isLoggedIn } = useUserContext();
  const [showForm, setShowForm] = useState(skipsLanding);
  const terms = useMemo(() => ["ORWA Awards"], []);

  const startNomination = useCallback(() => {
    setShowForm(true);
    window.scrollTo({ top: 0 });
  }, []);

  const content: ReactNode = (
    <NotifyProvider>
      <ErrorBoundary key={viewingEntries ? "entries" : "form"}>
        {!isLoggedIn && <LoginModal />}
        <Header />
        {showForm ? (
          <EntryListProvider>
            {viewingEntries ? <EntryList /> : <AwardNominationForm />}
          </EntryListProvider>
        ) : (
          <LandingView onStartNomination={startNomination} />
        )}
      </ErrorBoundary>
    </NotifyProvider>
  );

  return (
    <TermsGate
      terms={terms}
      apiEndpoint={import.meta.env.VITE_API_ENDPOINT}
      apiKey={import.meta.env.VITE_API_KEY}
    >
      {content}
    </TermsGate>
  );
}

export default App;
