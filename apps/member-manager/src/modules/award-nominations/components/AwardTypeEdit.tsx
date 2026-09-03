import React from "react";
import { Edit, useStore } from "react-admin";
import AwardTypeForm from "./AwardTypeForm";
import { reviewResourceSx } from "../../_components/review-packet";

const SETTINGS_TAB = "settings" as const;

const AwardTypeEdit = () => {
  const [, setTab] = useStore("orwa-awards-tab-value", SETTINGS_TAB);

  return (
    <Edit
      title="Award Type"
      component="div"
      actions={false}
      redirect={() => {
        setTab(SETTINGS_TAB);
        return "/orwa-awards/dashboard";
      }}
      mutationMode="pessimistic"
      sx={reviewResourceSx}
    >
      <AwardTypeForm />
    </Edit>
  );
};

export default AwardTypeEdit;
