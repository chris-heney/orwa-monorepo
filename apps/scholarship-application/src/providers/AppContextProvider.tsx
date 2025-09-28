import { PropsWithChildren, createContext, useContext, useState } from 'react';

// Removed grant-related API import
import {
  EntryPayloadContext,
  IScholarshipApplicationPayload,
  FormSubmittedContext,
  IScholarshipApplicationFormPayload,
} from '../types/types';
import DefaultScholarshipFormSteps, {
  IFormStep,
  IFormStepContext, 
} from '../components/ScholarshipFormSteps';
import { defaultPayload } from '../helpers/defaultPayload';

export const FormSteps = createContext<IFormStepContext>({
  steps: DefaultScholarshipFormSteps(),
  setFormSteps: () => {},
  stepIndex: 0,
  setStepIndex: () => {},
});

export const useFormSteps = () => useContext(FormSteps);

export const PayloadProvider =
  createContext<IScholarshipApplicationFormPayload>(
    {} as IScholarshipApplicationFormPayload
  );

export const usePayload = () => useContext(PayloadProvider);

export const FormSubbmited = createContext<FormSubmittedContext>({
  isFormSubmitted: false,
  setIsFormSubmitted: () => {},
});

export const useFormSubmittedContext = () => useContext(FormSubbmited);

export const EntryPayload = createContext<EntryPayloadContext>({
  entryPayload: defaultPayload || null,
  setEntryPayload: () => {},
});

export const useEntryPayload = () => useContext(EntryPayload);

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [
    scholarshipApplicationFormPayload,
    setScholarshipApplicationFormPayload,
  ] = useState<IScholarshipApplicationPayload>(defaultPayload);

  const [formSteps, setFormSteps] = useState<IFormStep[]>(
    DefaultScholarshipFormSteps()
  );
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const [entryPayload, setEntryPayload] =
    useState<IScholarshipApplicationPayload | null>(null);

  // Removed scoring criteria API call - not needed for scholarship application

  return (
    // Passed with Query Parameter:
    <FormSteps.Provider
      value={{ steps: formSteps, setFormSteps, stepIndex, setStepIndex }}
    >
      <PayloadProvider.Provider
        value={{
          scholarshipApplicationFormPayload,
          setScholarshipApplicationFormPayload,
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

      {/* </ExtraDetails.Provider> */}
    </FormSteps.Provider>
  );
};

export default AppContextProvider;
