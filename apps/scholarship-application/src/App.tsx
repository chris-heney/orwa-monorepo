import "./App.css";
import ScholarshipApplicationForm from "./components/ScholarshipApplicationForm";
import Header from "./components/Header";
import { NotifyProvider } from "./NotificationProvider";
import EntryListProvider from "./providers/EntryListProvider";
import { useUserContext } from "./providers/UserContextProvider";
import EntryList from "./entries/EntryList";
import LoginModal from "./components/LoginModal";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const { viewingEntries, isLoggedIn} = useUserContext();

  return (
    <ErrorBoundary>
      {!isLoggedIn && <LoginModal />}
      <Header />
      <EntryListProvider>
        <NotifyProvider>
          {viewingEntries ? <EntryList /> : <ScholarshipApplicationForm />}
        </NotifyProvider>
      </EntryListProvider>
    </ErrorBoundary>
  );
}

export default App;
