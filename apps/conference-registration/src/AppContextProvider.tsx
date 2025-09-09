import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  useGetAssociates,
  useGetConferences,
  useGetExtras,
  useGetRegistrationAddons,
  useGetSponsorships,
  useGetTickets,
  useGetWatersystems,
} from "./data/API";

import IWatersystemOption, {
  IConference,
  IAssociateOption,
  IExtraOption,
  IRegistrationOptions,
  ISponsorshipOption,
  ITicketOption,
  TicketIndexContext,
  BoothIndexContext,
  ExtraDetailsContext,
  UserContext,
  IRegistrationPayload,
  EntryPayloadContext,
  defaultPayload,
} from "./types/types";
import DefualtFormSteps, {
  IFormStep,
  IFormStepContext,
} from "./components/FormSteps";
import authProvider from "./providers/authProvider";

export const ConferenceId = createContext<string | null>(null);
export const PassportId = createContext<string | null>(null);
export const RegistrationSource = createContext<string>("online");
export const RegistrationOptions = createContext<IRegistrationOptions>({
  AllConferenceOptions: [],
  ConferenceOptions: {} as IConference,
  AssociateOptions: [],
  ExtraOptions: [],
  SponsorshipOptions: [],
  TicketOptions: [],
  WatersystemOptions: [],
  RegistrationAddons: [],
  isLoading: true,
});

const FormSubmitted = createContext<{
  submitted: boolean;
  setSubmitted: (submitted: boolean) => void;
}>({
  submitted: false,
  setSubmitted: () => {},
});

export const FormSteps = createContext<IFormStepContext>({
  steps: DefualtFormSteps(),
  setFormSteps: () => {},
  stepIndex: 0,
  setStepIndex: () => {},
});

export const TicketIndex = createContext<TicketIndexContext>({
  ticketIndex: -1,
  setTicketIndex: () => {},
});
export const BoothIndex = createContext<BoothIndexContext>({
  boothIndex: -1,
  setBoothIndex: () => {},
});
export const ExtraDetails = createContext<ExtraDetailsContext>({
  extraDetails: "",
  setExtraDetails: () => {},
  isOpen: false,
  setIsOpen: () => {},
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
  entryPayload: defaultPayload || null,
  setEntryPayload: () => {},
});

export const useConferenceId = () => useContext(ConferenceId);
export const useRegistrationOptions = () => useContext(RegistrationOptions);
export const useRegistrationSource = () => useContext(RegistrationSource);
export const useExtraDetails = () => useContext(ExtraDetails);
export const useStepContext = () => useContext(FormSteps);
export const useBoothIndex = () => useContext(BoothIndex);
export const useTicketIndex = () => useContext(TicketIndex);
export const useUserContext = () => useContext(User);
export const useFormSubmitted = () => useContext(FormSubmitted);
export const useEntryPayload = () => useContext(EntryPayload);

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const conferenceId =
    new URLSearchParams(window.location.search).get("conference_id") ?? "2";
  const passportId =
    new URLSearchParams(window.location.search).get("passport_id") ?? null;
  const registrationSource =
    new URLSearchParams(window.location.search).get("source") ?? "online"; // online or kiosk

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [registrationOptions, setRegistrationOptions] =
    useState<IRegistrationOptions>({
      AllConferenceOptions: [],
      ConferenceOptions: {} as IConference,
      AssociateOptions: [],
      ExtraOptions: [],
      SponsorshipOptions: [],
      TicketOptions: [],
      WatersystemOptions: [],
      isLoading: true,
      RegistrationAddons: [],
    });

  const [formSteps, setFormSteps] = useState<IFormStep[]>(DefualtFormSteps());
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [ticketIndex, setTicketIndex] = useState<number>(0);
  const [boothIndex, setBoothIndex] = useState<number>(0);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [viewingEntries, setViewingEntries] = useState<boolean>(false);

  // Sets the context for the extra details modal

  const [extraDetails, setExtraDetails] = useState<string>("");
  const [isExtraDetailsOpen, setIsExtraDetailsOpen] = useState<boolean>(false);

  const [entryPayload, setEntryPayload] = useState<IRegistrationPayload | null>(
    null
  );

  const { data: conferenceData, status: conferenceStatus } =
    useGetConferences();

  const { data: ticketsData, status: ticketsStatus } =
    useGetTickets(conferenceId);

  const { data: extrasData, status: extrasStatus } = useGetExtras(conferenceId);

  const { data: sponsorshipData, status: sponsorshipStatus } =
    useGetSponsorships(conferenceId);

  const { data: associatesData, status: associatesStatus } = useGetAssociates();

  const { data: watersystemsData, status: watersystemsStatus } =
    useGetWatersystems();

  const { data: registrationAddonsData, status: registrationAddonsStatus } =
    useGetRegistrationAddons(parseInt(conferenceId));

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

  useEffect(() => {
    if (
      conferenceStatus === "success" &&
      ticketsStatus === "success" &&
      extrasStatus === "success" &&
      sponsorshipStatus === "success" &&
      associatesStatus === "success" &&
      watersystemsStatus === "success" &&
      registrationAddonsStatus === "success"
    ) {
      setRegistrationOptions({
        ConferenceOptions: (conferenceData as unknown as IConference[]).find(
          (conference: IConference) => conference.id === parseInt(conferenceId)
        ) as IConference,
        AllConferenceOptions: conferenceData as unknown as IConference[],
        TicketOptions: ticketsData as unknown as ITicketOption[],
        ExtraOptions: extrasData as unknown as IExtraOption[],
        SponsorshipOptions: sponsorshipData as unknown as ISponsorshipOption[],
        AssociateOptions: associatesData as unknown as IAssociateOption[],
        WatersystemOptions: watersystemsData as unknown as IWatersystemOption[],
        RegistrationAddons: registrationAddonsData as unknown as IExtraOption[],
        isLoading: false,
      });
    }
  }, [
    conferenceStatus,
    ticketsStatus,
    extrasStatus,
    sponsorshipStatus,
    associatesStatus,
    watersystemsStatus,
  ]);

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
      <EntryPayload.Provider value={{ entryPayload, setEntryPayload }}>
        <ConferenceId.Provider value={conferenceId}>
          {/* // Passed with Query Parameter: */}
          <PassportId.Provider value={passportId}>
            {/* // Passed with Query Parameter: */}
            <RegistrationSource.Provider value={registrationSource}>
              <RegistrationOptions.Provider
                value={{
                  ...(registrationOptions as IRegistrationOptions),
                  setRegistrationOptions,
                }}
              >
                <TicketIndex.Provider value={{ ticketIndex, setTicketIndex }}>
                  <BoothIndex.Provider value={{ boothIndex, setBoothIndex }}>
                    <FormSteps.Provider
                      value={{
                        steps: formSteps,
                        setFormSteps,
                        stepIndex,
                        setStepIndex,
                      }}
                    >
                      <ExtraDetails.Provider
                        value={{
                          extraDetails: extraDetails,
                          setExtraDetails: setExtraDetails,
                          isOpen: isExtraDetailsOpen,
                          setIsOpen: setIsExtraDetailsOpen,
                        }}
                      >
                        {/* Provider Baby */}
                        <FormSubmitted.Provider
                          value={{
                            submitted,
                            setSubmitted,
                          }}
                        >
                          {children}
                        </FormSubmitted.Provider>
                      </ExtraDetails.Provider>
                    </FormSteps.Provider>
                  </BoothIndex.Provider>
                </TicketIndex.Provider>
              </RegistrationOptions.Provider>
            </RegistrationSource.Provider>
          </PassportId.Provider>
        </ConferenceId.Provider>
      </EntryPayload.Provider>
    </User.Provider>
  );
};

export default AppContextProvider;
