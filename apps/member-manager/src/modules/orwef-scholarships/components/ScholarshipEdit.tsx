import React from "react";
import { Edit } from "react-admin";
import ScholarshipForm from "./ScholarshipForm";
import { asDateString, reviewResourceSx } from "../../_components/review-packet";
import {
  MAX_FINANCIAL_RESOURCES,
  listFinancialResources,
} from "../helpers/financialResources";

const asAmountNumber = (value: unknown): number | null => {
  if (value == null || value === "") return null;
  if (value instanceof Date) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const transformScholarship = (data: Record<string, unknown>) => ({
  ...data,
  submission_date: asDateString(data.submission_date) || null,
  graduation_date: asDateString(data.graduation_date) || null,
  applicant_certification_date:
    asDateString(data.applicant_certification_date) || null,
  guardian_certification_date:
    asDateString(data.guardian_certification_date) || null,
  financial_resources: listFinancialResources(data)
    .slice(0, MAX_FINANCIAL_RESOURCES)
    .map((row) => ({
      institution: row.institution || undefined,
      amount: asAmountNumber(row.amount),
    })),
});

const ScholarshipEdit = () => (
  <Edit
    title="ORWEF Scholarship"
    component="div"
    actions={false}
    redirect={false}
    mutationMode="pessimistic"
    transform={transformScholarship}
    sx={reviewResourceSx}
    queryOptions={{
      meta: { populate: "*" },
    }}
  >
    <ScholarshipForm />
  </Edit>
);

export default ScholarshipEdit;
