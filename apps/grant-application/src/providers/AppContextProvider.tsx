import { PropsWithChildren, createContext, useContext, useState } from "react";

import { useGetCriterias } from "../data/API";
import {
  EntryPayloadContext,
  FormSubmittedContext,
  GrantApplicationPayloadContext,
  IGrantApplicationFormPayload,
  IScoringCriteria,
  ProjectOptionsContext,
} from "../types/types";
import DefualtFormSteps, {
  IFormStep,
  IFormStepContext,
} from "../components/FormSteps";
import { defaultPayload } from "../helpers/defaultPayload";

export const FormSteps = createContext<IFormStepContext>({
  steps: DefualtFormSteps(),
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

  const [formSteps, setFormSteps] = useState<IFormStep[]>(DefualtFormSteps());
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const [entryPayload, setEntryPayload] =
    useState<IGrantApplicationFormPayload | null>(null);

  const { data: scoringCriterias, isFetched: isScoringCriteriasLoading } =
    useGetCriterias();

  return (
    // Passed with Query Parameter:
    <FormSteps.Provider
      value={{ steps: formSteps, setFormSteps, stepIndex, setStepIndex }}
    >
      <ScoringCriteriasProvider.Provider
        value={{
          scoringCriterias: scoringCriterias as unknown as IScoringCriteria[],
          isScoringCriteriasLoading: isScoringCriteriasLoading,
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
