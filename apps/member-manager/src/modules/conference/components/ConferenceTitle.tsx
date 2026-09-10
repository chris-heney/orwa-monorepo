import React from "react";
import { useConferenceContext, useConferenceSelection } from "../ConferenceContext";
import { getConferenceFilterId } from "../helpers/mergeConferenceAcrossTabFilters";

/**
 * Bar title for the Conference Manager: the selected conference's name
 * ("Annual Conference"); the framework appends " : <tab label>".
 */
const ConferenceTitle = () => {
  const { conferences } = useConferenceContext();
  const selection = useConferenceSelection();
  const name = conferences.find(
    (c) => getConferenceFilterId(c) === selection.conference
  )?.name;
  return <>{name ?? "Conference Manager"}</>;
};

export default ConferenceTitle;
