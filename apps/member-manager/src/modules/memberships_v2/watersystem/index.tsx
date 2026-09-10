import React from "react";
import GradingIcon from "@mui/icons-material/Grading";
import MembershipsContextProvider from "../MembershipsContextProvider";
import WatersystemCreate from "./WatersystemCreate";
import WatersystemShow from "./WatersystemShow";
import WatersystemEdit from "./WaterSystemEdit";
import { tabRedirect } from "../../../framework/registry";

/** The show page opens the shared contact create / edit modals, so it needs the provider. */
const WatersystemShowWithMembershipContext = () => (
  <MembershipsContextProvider>
    <WatersystemShow />
  </MembershipsContextProvider>
);

export default {
  list: tabRedirect("memberships.dashboard", "watersystems"),
  create: WatersystemCreate,
  show: WatersystemShowWithMembershipContext,
  edit: WatersystemEdit,
  icon: GradingIcon,
  recordRepresentation: "title",
};
