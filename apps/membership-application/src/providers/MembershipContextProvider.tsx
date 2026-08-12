import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import DefualtFormSteps, {
  IFormStepContext,
} from "../components/FormSteps";
import {
  EntryPayloadContext,
  FormSubmittedContext,
  IAssociateContext,
  IWatersystemContext,
  Membership,
  MembershipContext,
  submissionOptions,
  UserContext,
} from "../types";
import {
  useGetAssociates,
  useGetMemberships,
  useGetWatersystems,
} from "../data/API";
import { Watersystem } from "../types/WatersystemMebership";
import { Associate } from "../types/AssociateMembership";
import { emptyWatersystemPayload } from "../testPayloads/watersytemsTestPayload";
import { emptyAssociatePayload } from "../testPayloads/associateTestPayload";
import authProvider from "./authProvider";

export const FormSteps = createContext<IFormStepContext>({
  steps: DefualtFormSteps(),
  setFormSteps: () => {},
  stepIndex: 0,
  setStepIndex: () => {},
});

const FormSubmitted = createContext<FormSubmittedContext>({
  isFormSubmitted: false,
  setIsFormSubmitted: () => {},
});

const MembershipsContext = createContext<MembershipContext>({
  memberships: [],
  isMembershipsLoading: false,
});

const WatersystemContext = createContext<IWatersystemContext>({
  watersystems: [],
  isWatersystemsLoading: false,
});

const AssociateContext = createContext<IAssociateContext>({
  associates: [],
  isAssociatesLoading: false,
});

export const User = createContext<UserContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  isAdminView: false,
  setIsAdminView: () => {},
  viewingEntries: false,
  setViewingEntries: () => {},
});

export const EntryPayload = createContext<EntryPayloadContext>({
  entryPayload: emptyWatersystemPayload || emptyAssociatePayload,
  setEntryPayload: () => {},
});

export const useFormSubmittedContext = () => useContext(FormSubmitted);
export const useMembershipsContext = () => useContext(MembershipsContext);
export const useWatersystemContext = () => useContext(WatersystemContext);
export const useAssociateContext = () => useContext(AssociateContext);
export const useUserContext = () => useContext(User);
export const useFormSubmitted = () => useContext(FormSubmitted);
export const useEntryPayload = () => useContext(EntryPayload);

const MembershipContextProvider = ({ children }: PropsWithChildren) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  const [entryPayload, setEntryPayload] = useState<submissionOptions>(null);

  const [viewingEntries, setViewingEntries] = useState<boolean>(false);

  const path = window.location.hash.substring(2);

  const { data: memberships, isFetched: isMembershipsLoading } =
    useGetMemberships(
      path.includes("watersystem") ? "Watersystem" : "Associate"
    );

  const { data: watersystems, isFetched: isWatersystemsLoading } =
    useGetWatersystems();

  const { data: associates, isFetched: isAssociatesLoading } =
    useGetAssociates();

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        await authProvider.checkAuth();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkUserAuth();
  }, []);

  return (
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
      <EntryPayload.Provider value={{ entryPayload, setEntryPayload }}>
          <WatersystemContext.Provider
            value={{
              watersystems: watersystems as unknown as Watersystem[],
              isWatersystemsLoading,
            }}
          >
            <AssociateContext.Provider
              value={{
                associates: associates as unknown as Associate[],
                isAssociatesLoading,
              }}
            >
              <MembershipsContext.Provider
                value={{
                  memberships: (memberships ?? []) as unknown as Membership[],
                  isMembershipsLoading,
                }}
              >
                <FormSubmitted.Provider
                  value={{ isFormSubmitted, setIsFormSubmitted }}
                >
                  {children}
                </FormSubmitted.Provider>
              </MembershipsContext.Provider>
            </AssociateContext.Provider>
          </WatersystemContext.Provider>
      </EntryPayload.Provider>
    </User.Provider>
  );
};

export default MembershipContextProvider;
