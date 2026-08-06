import { TextAreaInput } from "./_components/TextAreaInput";
import { NumberInput } from "./_components/NumberInput";
import FormSection from "./_components/FormSection";
import StepShell from "./_components/StepShell";
import FileInput from "./_components/FileInput";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { ValidationHighlight } from "../helpers/validationHighlight";
import { useGetProjects } from "../data/API";
import { IProject } from "../types/types";
import {
  ProjectCostsMap,
  sumProjectCosts,
} from "../helpers/projectCosts";

const ProjectStep = () => {
  const { watch, setValue, getValues } = useFormContext();
  const { data: projects } = useGetProjects();
  const selectedProjects: string[] = watch("selected_projects") ?? [];
  const projectCosts: ProjectCostsMap = watch("project_costs") ?? {};

  const combinedCost = sumProjectCosts(projectCosts, selectedProjects);

  // Keep combined cost + grant/contribution formulas in sync with per-type amounts.
  useEffect(() => {
    setValue("combined_cost_of_projects", combinedCost, {
      shouldDirty: true,
    });

    const grantCapHit = combinedCost * 0.8 > 100000;
    setValue(
      "minimum_utility_financial_contribution",
      Math.round(grantCapHit ? combinedCost - 100000 : combinedCost * 0.2)
    );
    setValue(
      "requested_grant_amount",
      Math.round(grantCapHit ? 100000 : combinedCost * 0.8)
    );
  }, [combinedCost, setValue]);

  // Drop cost entries for deselected project types (keep amounts for still-selected).
  useEffect(() => {
    const current = (getValues("project_costs") ?? {}) as ProjectCostsMap;
    const selected = new Set(selectedProjects);
    let changed = false;
    const next: ProjectCostsMap = {};
    for (const [id, amount] of Object.entries(current)) {
      if (selected.has(id)) {
        next[id] = amount;
      } else {
        changed = true;
      }
    }
    if (changed) {
      setValue("project_costs", next, { shouldDirty: true });
    }
  }, [selectedProjects, getValues, setValue]);

  const projectList = (projects as unknown as IProject[]) ?? [];
  const selectedWithNames = selectedProjects.map((id) => {
    const project = projectList.find((p) => p.id.toString() === id);
    const name =
      project?.name === "Other Describe (1)"
        ? "Other"
        : project?.name ?? `Project ${id}`;
    return { id, name };
  });

  return (
    <StepShell
      title="Project Details"
      description="Describe each selected project, upload proposals/bids with total costs, and confirm funding amounts."
    >
      <ValidationHighlight field="projects">
        <FormSection title="Description & proposals">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextAreaInput
              maxCharCount={650}
              label="Project/Justification/Estimated Cost Description"
              name="description_justification_estimated_cost"
              required
              maxRows={8}
              helperText="Describe each selected project in detail. If multiple, itemize estimated cost for each."
            />
            <FileInput
              label="Upload Project Proposals"
              name="proposals"
              multiple
              required
              helperText="Upload proposals/bids that list total expected project costs. Missing totals will place the application on hold."
            />
          </div>
        </FormSection>

        <FormSection title="Costs">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {selectedWithNames.length === 0 ? (
              <p className="col-span-full text-sm text-slate-600 text-left">
                Select at least one project on the Funding Request step to enter
                estimated costs.
              </p>
            ) : (
              selectedWithNames.map(({ id, name }) => (
                <NumberInput
                  key={id}
                  label={`Estimated Cost — ${name}`}
                  name={`project_costs.${id}`}
                  mask="currency"
                  required
                  min={1}
                  wholeNumber
                  helperText="Supported by submitted proposals/bids including in-kind contributions."
                />
              ))
            )}
            <NumberInput
              label="Combined Cost of Projects"
              name="combined_cost_of_projects"
              mask="currency"
              disabled
              wholeNumber
              helperText="Sum of the estimated costs above (rounded)."
            />
            <NumberInput
              label="Requested Grant Amount"
              name="requested_grant_amount"
              max={100000}
              mask="currency"
              disabled
              wholeNumber
              helperText="The maximum grant amount is $100,000."
            />
            <NumberInput
              label="Minimum Utility Financial Contribution"
              name="minimum_utility_financial_contribution"
              mask="currency"
              disabled
              wholeNumber
              helperText="Minimum utility contribution based on total project cost."
            />
          </div>
        </FormSection>
      </ValidationHighlight>
    </StepShell>
  );
};

export default ProjectStep;
