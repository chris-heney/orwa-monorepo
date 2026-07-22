import { useMemo } from "react";
import { NotifyProvider } from "mj-react-form-builder";
import { TermsGate } from "@orwa/terms-gate";
import "./App.css";
import { useConferenceId, useUserContext } from "./AppContextProvider";
import ConferenceForm from "./components/ConferenceForm";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import EntryList from "./entries/EntryList";
import EntryListProvider from "./providers/EntryListProvider";

function App() {
  const { viewingEntries } = useUserContext();
  const conferenceId = useConferenceId() ?? "2";

  const terms = useMemo(
    () => [`ORWA Conference ID #${conferenceId}`, "All Conferences"],
    [conferenceId]
  );

  return (
    <TermsGate
      terms={terms}
      apiEndpoint={import.meta.env.VITE_API_ENDPOINT}
      apiKey={import.meta.env.VITE_API_KEY}
    >
      <LoginModal />
      <Header />

      <EntryListProvider>
        <NotifyProvider>
          {viewingEntries ? <EntryList /> : <ConferenceForm />}
        </NotifyProvider>
      </EntryListProvider>
    </TermsGate>
  );
}

export default App;
