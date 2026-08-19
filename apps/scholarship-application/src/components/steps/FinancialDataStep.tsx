import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TextInput } from "../_components/TextInput";
import { NumberInput } from "../_components/NumberInput";
import FormSection from "../_components/FormSection";
import {
  MAX_FINANCIAL_RESOURCES,
  hydrateFinancialResources,
} from "../../helpers/mapScholarshipPayload";

const emptyResource = { institution: "", amount: "" as const };

const FinancialDataStep = () => {
  const { control, getValues, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "financial_resources",
    keyName: "fieldId",
  });

  useEffect(() => {
    const current = getValues("financial_resources");
    if (!Array.isArray(current) || current.length === 0) {
      const hydrated = hydrateFinancialResources(
        getValues() as Record<string, unknown>
      );
      setValue(
        "financial_resources",
        hydrated.length > 0 ? hydrated : [emptyResource],
        { shouldDirty: false }
      );
      return;
    }
    if (current.length > MAX_FINANCIAL_RESOURCES) {
      setValue(
        "financial_resources",
        current.slice(0, MAX_FINANCIAL_RESOURCES),
        { shouldDirty: false }
      );
    }
  }, [fields.length, getValues, setValue]);

  const rowCount = () => {
    const current = getValues("financial_resources");
    return Array.isArray(current) ? current.length : fields.length;
  };

  const canAdd = fields.length < MAX_FINANCIAL_RESOURCES;

  const addResource = () => {
    if (rowCount() >= MAX_FINANCIAL_RESOURCES) return;
    append(emptyResource);
  };

  return (
    <FormSection
      title="Financial Data"
      description="If you are receiving other financial aid, including a current scholarship from ORWEF, please list the name of the institution and the amount (Scholarships, Grants, etc)."
    >
      <Grid container spacing={3}>
        {fields.map((field, index) => (
          <React.Fragment key={field.fieldId}>
            <Grid size={{ xs: 12 }}>
              <div
                className={`flex items-center justify-between ${
                  index > 0 ? "mt-6" : ""
                }`}
              >
                <h3 className="text-lg font-semibold">
                  Financial Aid #{index + 1}
                </h3>
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (rowCount() <= 1) return;
                      remove(index);
                    }}
                    className="bg-gray-300 px-3 py-1.5 rounded-md text-sm font-semibold text-gray-800 hover:bg-gray-400 cursor-pointer"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                name={`financial_resources.${index}.institution`}
                label="Institution"
                placeholder="Name of institution providing financial aid"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <NumberInput
                name={`financial_resources.${index}.amount`}
                label="Amount"
                min={0}
                step={0.01}
              />
            </Grid>
          </React.Fragment>
        ))}

        <Grid size={{ xs: 12 }}>
          <button
            type="button"
            disabled={!canAdd}
            onClick={addResource}
            className={`bg-gray-300 px-4 py-2 rounded-md text-sm font-semibold ${
              canAdd
                ? "text-gray-800 hover:bg-gray-400 cursor-pointer"
                : "text-gray-400 cursor-not-allowed opacity-60"
            }`}
          >
            Add Additional Financial Resource
          </button>
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default FinancialDataStep;
