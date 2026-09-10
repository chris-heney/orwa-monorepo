import React from "react";
import { Show } from "react-admin";
import { useGrantContext } from "../../GrantContextProvider";
import GrantSummary from "./GrantSummary";

/** Summary tab panel: the selected grant's financial summary (`Show` by documentId). */
const GrantSummaryTab = () => {
  const { grantId } = useGrantContext();
  return (
    <Show
      title={" "}
      emptyWhileLoading
      component={"div"}
      id={grantId}
      resource="grants"
    >
      <GrantSummary />
    </Show>
  );
};

export default GrantSummaryTab;
