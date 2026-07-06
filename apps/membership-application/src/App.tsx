import Header from "./components/Header";
import MembershipForm from "./MembershipForm";
import "./index.css";
import LoginModal from "./components/LoginModal";
import { Route, Routes, HashRouter } from "react-router-dom";
import FormStepsContextProvider from "./providers/StepProvider";
import { useUserContext } from "./providers/MembershipContextProvider";
import { NotifyProvider } from "mj-react-form-builder";
import EntryListProvider from "./providers/EntryListProvider";
import EntryList from "./entries/EntryList";

const App = () => {
  const { isLoggedIn} = useUserContext();

  const MembershipForms = () => {
    return (
      <FormStepsContextProvider>
        <MembershipForm />
      </FormStepsContextProvider>
    );
  };

  return (
    <NotifyProvider>
      <EntryListProvider>
        <HashRouter>
          <Header />
          <Routes>
            {isLoggedIn && <Route path="/entries" element={<EntryList />} />}
            <Route path="/watersystem" element={<MembershipForms />} />
            <Route path="/watersystem-renewal" element={<MembershipForms />} />
            <Route path="/associate" element={<MembershipForms />} />
            <Route path="/associate-renewal" element={<MembershipForms />} />
            <Route
              path="/admin"
              element={
                <div className="h-screen flex justify-center items-center">
                  <LoginModal />
                </div>
              }
            />
            <Route
              path="*"
              element={
                <div className="h-screen flex justify-center items-center">
                  404 - Page Not Found
                </div>
              }
            />
          </Routes>
        </HashRouter>
      </EntryListProvider>
    </NotifyProvider>
  );
};

export default App;
