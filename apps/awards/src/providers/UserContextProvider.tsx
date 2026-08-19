import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import authProvider from "./authProvider";
import { loadAdminView, saveAdminView } from "../helpers/adminViewPersistence";

interface UserContext {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  isAdminView: boolean;
  setIsAdminView: Dispatch<SetStateAction<boolean>>;
  viewingEntries: boolean;
  setViewingEntries: Dispatch<SetStateAction<boolean>>;
}

export const User = createContext<UserContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  isAdminView: false,
  setIsAdminView: () => {},
  viewingEntries: false,
  setViewingEntries: () => {},
});

export const useUserContext = () => useContext(User);

const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(() => loadAdminView());
  const [viewingEntries, setViewingEntries] = useState<boolean>(false);

  useEffect(() => {
    saveAdminView(isAdminView);
  }, [isAdminView]);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        await authProvider.checkAuth();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        setIsAdminView(false);
      }
    };
    checkUserAuth();
  }, []);

  return (
    // Passed with Query Parameter:
    <User.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isAdminView,
        setIsAdminView,
        viewingEntries,
        setViewingEntries,
      }}
    >
      {children}
    </User.Provider>
  );
};

export default UserContextProvider;
