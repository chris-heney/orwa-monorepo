import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TextInput } from "../_components/TextInput";
import { NumberInput } from "../_components/NumberInput";
import FormSection from "../_components/FormSection";
import {
  MAX_FINANCIAL_RESOURCES,
  hydrateFinancialResources,
} from "../../helpers/mapScholarshipPayload";

const emptyResource = { institution: "", amount: "" as const };

const rowLabelClass =
  "block mb-2 text-left text-sm font-semibold text-gray-700";
const rowInputClass = "p-3 rounded-lg";

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
  const canRemove = fields.length > 1;

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
          <Grid key={field.fieldId} size={{ xs: 12 }}>
            <div className={index > 0 ? "mt-2" : ""}>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-lg font-semibold leading-none">
                  Financial Aid #{index + 1}
                </h3>
                {canRemove ? (
                  <button
                    type="button"
                    aria-label="Remove financial aid"
                    onClick={() => {
                      if (rowCount() <= 1) return;
                      remove(index);
                    }}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-600 text-white transition hover:bg-red-500 active:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 cursor-pointer"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </button>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <div className="min-w-0 flex-1">
                  <TextInput
                    name={`financial_resources.${index}.institution`}
                    label="Institution"
                    placeholder="Name of institution providing financial aid"
                    wrapperClassName="mb-0"
                  />
                </div>
                <div className="w-full shrink-0 sm:w-40">
                  <NumberInput
                    name={`financial_resources.${index}.amount`}
                    label="Amount"
                    min={0}
                    step={0.01}
                    wrapperClassName="mb-0"
                    labelClassName={rowLabelClass}
                    inputClassName={rowInputClass}
                  />
                </div>
              </div>
            </div>
          </Grid>
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
