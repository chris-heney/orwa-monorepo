import "./App.css";
import GrantApplicationForm from "./components/GrantApplicationForm";
import Header from "./components/Header";
import { NotifyProvider } from "./NotificationProvider";
import EntryListProvider from "./providers/EntryListProvider";
import { useUserContext } from "./providers/UserContextProvider";
import EntryList from "./entries/EntryList";
import LoginModal from "./components/LoginModal";

function App() {
  const { viewingEntries, isLoggedIn} = useUserContext();

  return (
    <>
      {!isLoggedIn && <LoginModal />}
      <Header />
      <EntryListProvider>
        <NotifyProvider>
          {viewingEntries ? <EntryList /> : <GrantApplicationForm />}
        </NotifyProvider>
      </EntryListProvider>
    </>
  );
}

export default App;
