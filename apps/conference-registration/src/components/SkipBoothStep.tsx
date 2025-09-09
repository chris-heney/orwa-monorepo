import { useState } from "react";
import { useStepContext } from "../AppContextProvider";

const SkipBoothStep = () => {
  const [previousRegistrationChange, setPreviousRegistrationChange] = useState<
    string | null
  >(null);
  const { setFormSteps } = useStepContext();

  const handleChange = (value: string) => {
    setPreviousRegistrationChange(value);
    setFormSteps((steps) =>
      steps.map((step) =>
        step.key === "booth_registration"
          ? { ...step, active: value === "No" }
          : step
      )
    );
  };

  return previousRegistrationChange === "No" ? (
    <></>
  ) : (
    <div className="flex flex-col sm:flex-row items-center justify-center my-8">
      <h2 className="text-lg font-semibold text-gray-800 sm:mr-4">
        Are you making changes to a previous registration?
      </h2>
      <div className="flex items-center space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="previousRegistrationChange"
            value="Yes"
            checked={previousRegistrationChange === "Yes"}
            onChange={(e) => handleChange(e.target.value)}
            className="form-radio text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Yes</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="previousRegistrationChange"
            value="No"
            checked={previousRegistrationChange === "No"}
            onChange={(e) => handleChange(e.target.value)}
            className="form-radio text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">No</span>
        </label>
      </div>
    </div>
  );
};

export default SkipBoothStep;
