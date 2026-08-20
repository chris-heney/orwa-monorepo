import React from "react";
import { Create } from "react-admin";
import AwardWinnerForm from "./AwardWinnerForm";
import { reviewResourceSx } from "../../_components/review-packet";

const AwardWinnerCreate = () => (
  <Create
    title="ORWA Award Winner"
    component="div"
    actions={false}
    redirect="list"
    sx={reviewResourceSx}
  >
    <AwardWinnerForm />
  </Create>
);

export default AwardWinnerCreate;
