import React from "react";
import ConferenceExtrasEditor from "./ConferenceExtrasEditor";

const ContestantExtrasEditor = ({
  conferenceId,
}: {
  conferenceId?: number;
}) => (
  <ConferenceExtrasEditor conferenceId={conferenceId} context="Contestant" />
);

export default ContestantExtrasEditor;
