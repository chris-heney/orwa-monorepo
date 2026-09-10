import React from "react";
import { Edit } from "react-admin";
import AwardWinnerForm from "./AwardWinnerForm";
import { formPageSx } from "./FormHeadingBar";

const AwardWinnerEdit = () => (
  <Edit
    title="ORWA Award Winner"
    component="div"
    actions={false}
    redirect={false}
    mutationMode="pessimistic"
    sx={formPageSx}
    queryOptions={{ meta: { populate: { photo: true } } }}
  >
    <AwardWinnerForm />
  </Edit>
);

export default AwardWinnerEdit;
