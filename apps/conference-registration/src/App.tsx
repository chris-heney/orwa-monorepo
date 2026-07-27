import { useMemo, type ReactNode } from "react";
import { NotifyProvider } from "mj-react-form-builder";
import { TermsGate } from "@orwa/terms-gate";
import "./App.css";
import {
  useConferenceId,
  useRegistrationOptions,
  useRegistrationSource,
  useUserContext,
} from "./AppContextProvider";
import ConferenceForm from "./components/ConferenceForm";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import EntryList from "./entries/EntryList";
import EntryListProvider from "./providers/EntryListProvider";
import { isRegistrationOpen } from "./helpers/isRegistrationOpen";

function App() {
  const { viewingEntries } = useUserContext();
  const conferenceId = useConferenceId() ?? "2";
  const registrationSource = useRegistrationSource();
  const { isLoading, ConferenceOptions } = useRegistrationOptions();

  const terms = useMemo(
    () => [`ORWA Conference ID #${conferenceId}`, "All Conferences"],
    [conferenceId]
  );

  const showTermsGate =
    !isLoading &&
    isRegistrationOpen(ConferenceOptions?.status, registrationSource);

  const content: ReactNode = (
    <>
      <LoginModal />
      <Header />

      <EntryListProvider>
        <NotifyProvider>
          {viewingEntries ? <EntryList /> : <ConferenceForm />}
        </NotifyProvider>
      </EntryListProvider>
    </>
  );

  if (!showTermsGate) {
    return content;
  }

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
