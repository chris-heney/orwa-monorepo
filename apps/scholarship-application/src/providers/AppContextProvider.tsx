import { PropsWithChildren, createContext, useContext, useState } from "react";

// Removed grant-related API import
import {
  EntryPayloadContext,
  FormSubmittedContext,
  GrantApplicationPayloadContext,
  IGrantApplicationFormPayload,
  IScoringCriteria,
  ProjectOptionsContext,
} from "../types/types";
import DefaultScholarshipFormSteps, {
  IFormStep,
  IFormStepContext,
} from "../components/ScholarshipFormSteps";
import { defaultPayload } from "../helpers/defaultPayload";

export const FormSteps = createContext<IFormStepContext>({
  steps: DefaultScholarshipFormSteps(),
  setFormSteps: () => {},
  stepIndex: 0,
  setStepIndex: () => {},
});

export const PayloadProvider = createContext<GrantApplicationPayloadContext>(
  {} as GrantApplicationPayloadContext
);

interface ScoringCriteriasContext {
  scoringCriterias: IScoringCriteria[];
  isScoringCriteriasLoading: boolean;
}

export const ScoringCriteriasProvider = createContext<ScoringCriteriasContext>({
  scoringCriterias: [],
  isScoringCriteriasLoading: false,
});

export const FormSubbmited = createContext<FormSubmittedContext>({
  isFormSubmitted: false,
  setIsFormSubmitted: () => {},
});

export const useFormSubmittedContext = () => useContext(FormSubbmited);

export const ProjectOptions = createContext<ProjectOptionsContext>({
  drinkingWaterProjects: [],
  wastewaterProjects: [],
});

export const EntryPayload = createContext<EntryPayloadContext>({
  entryPayload: defaultPayload || null,
  setEntryPayload: () => {},
});

export const useScoringCriterias = () => useContext(ScoringCriteriasProvider);

export const useEntryPayload = () => useContext(EntryPayload);

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [grantApplicationFormPayload, setGrantApplicationFormPayload] =
    useState<IGrantApplicationFormPayload>(defaultPayload);

  const [formSteps, setFormSteps] = useState<IFormStep[]>(DefaultScholarshipFormSteps());
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const [entryPayload, setEntryPayload] =
    useState<IGrantApplicationFormPayload | null>(null);

  // Removed scoring criteria API call - not needed for scholarship application

  return (
    // Passed with Query Parameter:
    <FormSteps.Provider
      value={{ steps: formSteps, setFormSteps, stepIndex, setStepIndex }}
    >
      <ScoringCriteriasProvider.Provider
        value={{
          scoringCriterias: [],
          isScoringCriteriasLoading: false,
        }}
      >
        <PayloadProvider.Provider
          value={{
            grantApplicationFormPayload,
            setGrantApplicationFormPayload,
          }}
        >
          <EntryPayload.Provider value={{ entryPayload, setEntryPayload }}>
            <FormSubbmited.Provider
              value={{
                isFormSubmitted,
                setIsFormSubmitted,
              }}
            >
              {/* Provider Baby */}
              {children}
            </FormSubbmited.Provider>
          </EntryPayload.Provider>
        </PayloadProvider.Provider>
      </ScoringCriteriasProvider.Provider>
      {/* </ExtraDetails.Provider> */}
    </FormSteps.Provider>
  );
};

export default AppContextProvider;
