import React from "react";
import { Create } from "react-admin";
import AwardWinnerForm from "./AwardWinnerForm";
import { formPageSx } from "./FormHeadingBar";

const AwardWinnerCreate = () => (
  <Create
    title="ORWA Award Winner"
    component="div"
    actions={false}
    redirect="/orwa-awards/dashboard"
    sx={formPageSx}
  >
    <AwardWinnerForm />
  </Create>
);

export default AwardWinnerCreate;
