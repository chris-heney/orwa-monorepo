import { useFormContext } from "react-hook-form";
import { useGetProjects } from "../data/API";
import { MultiSelect } from "./_components/MultiSelectInput";
import { IProject } from "../types/types";
import { TextAreaInput } from "./_components/TextAreaInput";
import { SelectInput } from "./_components/SelectInput";
import FormSection from "./_components/FormSection";
import Loading from "./Loading";

const FundingRequestStep = () => {
  const { data: wastewaterProjects, isLoading } = useGetProjects();
  const { watch } = useFormContext();
  const drinking_or_wastewater = watch("drinking_or_wastewater") ?? "Drinking Water";
  const selectedProjects = watch("selected_projects") ?? [];

  // Check if "Other" is selected
  const isOtherSelected = selectedProjects.some((projectId: string) => {
    const project = (wastewaterProjects as unknown as IProject[])?.find(
      (project) => project.id.toString() === projectId
    );
    return project && project.name === "Other Describe (1)";
  });

  return isLoading ? <Loading/> : (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <FormSection title="Funding Request">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <SelectInput
              source="drinking_or_wastewater"
              label="Type of System"
              options={[
                { value: "Drinking Water", label: "Drinking Water" },
                { value: "Wastewater", label: "Wastewater" },
              ]}
              required
              helperText="Utilities applying for both drinking water and wastewater projects must submit separate applications for each."
            />
          </div>
          <div className="col-span-1">
            {isLoading && (
              <div className="mb-6">
                <label className="block mb-1 text-left text-sm font-bold">
                  Loading projects...
                </label>
                <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
              </div>
            )}
            {drinking_or_wastewater === "Drinking Water" && !isLoading && (
              <MultiSelect
                key="drinkingWaterProjects" // Added unique key based on the type
                name="selected_projects"
                label="Select Drinking Water Projects"
                options={
                  (wastewaterProjects as unknown as IProject[])?.filter(
                    (project) =>
                      project.classification === "Drinking Water" &&
                      project.name !== "Other Describe (5)" &&
                      project.name !== "Other Describe (10)"
                  )?.sort((a,b) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                  })?.map((project: IProject) => ({
                    value: project.id.toString(),
                    label: project.name === "Other Describe (1)" ? "Other" : project.name,
                  })) ?? []
                }
                required
                helperText="Select all drinking water projects that apply. Each project must be accompanied by bid proposals showing the total project cost."
              />
            )}
            {drinking_or_wastewater === "Wastewater" && !isLoading && (
              <MultiSelect
                key="wastewaterProjects" // Added unique key based on the type
                name="selected_projects"
                label="Select Wastewater Projects"
                options={
                  (wastewaterProjects as unknown as IProject[])?.filter(
                    (project) =>
                      project.classification === "Wastewater" &&
                      project.name !== "Other Describe (5)" &&
                      project.name !== "Other Describe (10)"
                  )?.sort((a,b) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                  })?.map((project: IProject) => ({
                    value: project.id.toString(),
                    label: project.name === "Other Describe (1)" ? "Other" : project.name,
                  })) ?? []
                }
                required
                helperText="Select all wastewater projects that apply. Each project must be accompanied by bid proposals showing the total project cost."
              />
            )}
          </div>
          {isOtherSelected && (
            <div className="col-span-full">
              <TextAreaInput
                name="other_describe"
                label="Describe"
                helperText="Describe the proposed project"
                required
                maxCharCount={650}
              />
            </div>
          )}
        </div>
      </FormSection>
    </div>
  )
};

export default FundingRequestStep;