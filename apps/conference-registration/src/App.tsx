import { NotifyProvider } from "mj-react-form-builder";
import "./App.css";
import { useUserContext } from "./AppContextProvider";
import ConferenceForm from "./components/ConferenceForm";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import EntryList from "./entries/EntryList";
import EntryListProvider from "./providers/EntryListProvider";

function App() {
  const { viewingEntries } = useUserContext();

  return (
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
}

export default App;
