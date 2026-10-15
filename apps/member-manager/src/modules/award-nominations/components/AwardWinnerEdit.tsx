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
    // RA-formatted read: relations collapse to ids so the Reference inputs
    // (nomination, water system) get a value; `photo` becomes a bare upload
    // id, which the form re-fetches raw for display.
    queryOptions={{
      meta: { populate: { photo: true, award_nomination: true, watersystem: true } },
    }}
  >
    <AwardWinnerForm />
  </Edit>
);

export default AwardWinnerEdit;
