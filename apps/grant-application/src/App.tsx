import "./App.css";
import GrantApplicationForm from "./components/GrantApplicationForm";
import Header from "./components/Header";
import { NotifyProvider } from "./NotificationProvider";
import EntryListProvider from "./providers/EntryListProvider";
import { useUserContext } from "./providers/UserContextProvider";
import EntryList from "./entries/EntryList";
import LoginModal from "./components/LoginModal";
import LandingView from "./components/LandingView";
import EmailVerificationView from "./components/EmailVerificationView";
import { useEditSession } from "./providers/EditSessionProvider";

// Admins arriving with ?admin skip the landing/verify flow entirely.
const isAdminRoute = new URLSearchParams(window.location.search).has("admin");

function App() {
  const { viewingEntries, isLoggedIn } = useUserContext();
  const { view } = useEditSession();

  const showForm = isAdminRoute || view === "form";

  return (
    <>
      {!isLoggedIn && <LoginModal />}
      <Header />
      {showForm ? (
        <EntryListProvider>
          <NotifyProvider>
            {viewingEntries ? <EntryList /> : <GrantApplicationForm />}
          </NotifyProvider>
        </EntryListProvider>
      ) : view === "verify" ? (
        <EmailVerificationView />
      ) : (
        <LandingView />
      )}
    </>
  );
}

export default App;
