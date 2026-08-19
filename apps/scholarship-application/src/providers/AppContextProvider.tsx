import { PropsWithChildren, createContext, useContext, useState } from "react";
import {
  EntryPayloadContext,
  FormSubmittedContext,
  IScholarshipApplicationPayload,
  ScholarshipApplicationPayloadContext,
} from "../types/types";
import DefaultScholarshipFormSteps, {
  IFormStep,
  IFormStepContext,
} from "../components/ScholarshipFormSteps";
import { scholarshipDefaultPayload } from "../helpers/scholarshipDefaultPayload";

export const FormSteps = createContext<IFormStepContext>({
  steps: DefaultScholarshipFormSteps(),
  setFormSteps: () => {},
  stepIndex: 0,
  setStepIndex: () => {},
});

export const PayloadProvider =
  createContext<ScholarshipApplicationPayloadContext>(
    {} as ScholarshipApplicationPayloadContext
  );

export const FormSubbmited = createContext<FormSubmittedContext>({
  isFormSubmitted: false,
  setIsFormSubmitted: () => {},
});

export const useFormSubmittedContext = () => useContext(FormSubbmited);

export const EntryPayload = createContext<EntryPayloadContext>({
  entryPayload: null,
  setEntryPayload: () => {},
});

export const useEntryPayload = () => useContext(EntryPayload);

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [scholarshipApplicationFormPayload, setScholarshipApplicationFormPayload] =
    useState<IScholarshipApplicationPayload>(scholarshipDefaultPayload);
  const [formSteps, setFormSteps] = useState<IFormStep[]>(
    DefaultScholarshipFormSteps()
  );
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [entryPayload, setEntryPayload] =
    useState<IScholarshipApplicationPayload | null>(null);

  return (
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
            {children}
          </FormSubbmited.Provider>
        </EntryPayload.Provider>
      </PayloadProvider.Provider>
    </FormSteps.Provider>
  );
};

export default AppContextProvider;
