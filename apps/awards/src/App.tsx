import { useMemo, type ReactNode } from "react";
import { TermsGate } from "@orwa/terms-gate";
import "./App.css";
import AwardNominationForm from "./components/AwardNominationForm";
import Header from "./components/Header";
import { NotifyProvider } from "./NotificationProvider";
import EntryListProvider from "./providers/EntryListProvider";
import { useUserContext } from "./providers/UserContextProvider";
import EntryList from "./entries/EntryList";
import LoginModal from "./components/LoginModal";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const { viewingEntries, isLoggedIn } = useUserContext();
  const terms = useMemo(() => ["ORWA Awards"], []);

  const content: ReactNode = (
    <ErrorBoundary>
      {!isLoggedIn && <LoginModal />}
      <Header />
      <EntryListProvider>
        <NotifyProvider>
          {viewingEntries ? <EntryList /> : <AwardNominationForm />}
        </NotifyProvider>
      </EntryListProvider>
    </ErrorBoundary>
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
