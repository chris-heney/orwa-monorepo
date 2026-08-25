import React from "react";
import { Edit } from "react-admin";
import AwardWinnerForm from "./AwardWinnerForm";
import { reviewResourceSx } from "../../_components/review-packet";

const AwardWinnerEdit = () => (
  <Edit
    title="ORWA Award Winner"
    component="div"
    actions={false}
    redirect={false}
    mutationMode="pessimistic"
    sx={reviewResourceSx}
    queryOptions={{ meta: { populate: { photo: true } } }}
  >
    <AwardWinnerForm />
  </Edit>
);

export default AwardWinnerEdit;
