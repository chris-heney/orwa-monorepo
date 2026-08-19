import React from "react";
import { Edit } from "react-admin";
import AwardForm from "./AwardForm";
import { asDateString, reviewResourceSx } from "../../_components/review-packet";

const transformAward = (data: Record<string, unknown>) => ({
  ...data,
  operation_start_date: asDateString(data.operation_start_date) || null,
  employment_date: asDateString(data.employment_date) || null,
});

const AwardEdit = () => (
  <Edit
    title="ORWA Award Nomination"
    component="div"
    actions={false}
    redirect={false}
    mutationMode="pessimistic"
    transform={transformAward}
    sx={reviewResourceSx}
    queryOptions={{ meta: { populate: "*", raw: true } }}
  >
    <AwardForm />
  </Edit>
);

export default AwardEdit;
