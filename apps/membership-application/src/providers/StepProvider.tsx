import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import DefualtFormSteps, {
  IFormStep,
  IFormStepContext,
} from "../components/FormSteps";
import { useLocation } from "react-router";

export const FormSteps = createContext<IFormStepContext>({
  steps: DefualtFormSteps(),
  setFormSteps: () => {},
  stepIndex: 0,
  setStepIndex: () => {},
});



export const useFormStepsContext = () => useContext(FormSteps);

const FormStepsContextProvider = ({ children }: PropsWithChildren) => {
  const [formSteps, setFormSteps] = useState<IFormStep[]>(DefualtFormSteps());
  const [stepIndex, setStepIndex] = useState<number>(0);

  const location = useLocation();

  useEffect(() => {
    setFormSteps(DefualtFormSteps());
    setStepIndex(0);
  }, [location]);

  return (
    <FormSteps.Provider
      value={{ steps: formSteps, setFormSteps, stepIndex, setStepIndex }}
    >
      {children}
    </FormSteps.Provider>
  );
};

export default FormStepsContextProvider;
