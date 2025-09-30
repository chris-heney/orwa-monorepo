import { PropsWithChildren, createContext, useContext, useState } from 'react';
import {
  EntryPayloadContext,
  IAwardNominationPayload,
  FormSubmittedContext,
  IAwardNominationFormPayload,
  IStep,
} from '../types/types';
import AwardFormSteps from '../components/AwardFormSteps';
import { awardDefaultPayload } from '../helpers/awardDefaultPayload';

export interface IFormStepContext {
  steps: IStep[];
  setFormSteps: React.Dispatch<React.SetStateAction<IStep[]>>;
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const FormSteps = createContext<IFormStepContext>({
  steps: AwardFormSteps,
  setFormSteps: () => {
    return; 
  },
  stepIndex: 0,
  setStepIndex: () => {
    return;
  },
});

export const useFormSteps = () => useContext(FormSteps);

export const FormContext = createContext<IAwardNominationFormPayload>(
  {} as IAwardNominationFormPayload
);

export const useFormContext = () => useContext(FormContext);

export const FormSubmitted = createContext<FormSubmittedContext>({
  isFormSubmitted: false,
  setIsFormSubmitted: () => {
    return;
  },
});

export const useFormSubmittedContext = () => useContext(FormSubmitted);

export const EntryPayload = createContext<EntryPayloadContext>({
  entryPayload: awardDefaultPayload || null,
  setEntryPayload: () => {
    return;
  },
});

export const useEntryPayload = () => useContext(EntryPayload);

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [
    awardNominationFormPayload,
    setAwardNominationFormPayload,
  ] = useState<IAwardNominationPayload>(awardDefaultPayload);

  const [formSteps, setFormSteps] = useState<IStep[]>(AwardFormSteps);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const [entryPayload, setEntryPayload] =
    useState<IAwardNominationPayload | null>(null);

  return (
    <FormSteps.Provider
      value={{ steps: formSteps, setFormSteps, stepIndex, setStepIndex }}
    >
      <FormContext.Provider
        value={{
          awardNominationFormPayload,
          setAwardNominationFormPayload,
        }}
      >
        <EntryPayload.Provider value={{ entryPayload, setEntryPayload }}>
          <FormSubmitted.Provider
            value={{
              isFormSubmitted,
              setIsFormSubmitted,
            }}
          >
            {children}
          </FormSubmitted.Provider>
        </EntryPayload.Provider>
      </FormContext.Provider>
    </FormSteps.Provider>
  );
};

export default AppContextProvider;