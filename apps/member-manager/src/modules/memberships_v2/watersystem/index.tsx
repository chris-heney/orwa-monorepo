import React from "react";
import GradingIcon from "@mui/icons-material/Grading";
import MembershipsContextProvider from "../MembershipsContextProvider";
import WatersystemCreate from "./WatersystemCreate";
import WatersystemList from "./WatersystemList";
import WatersystemShow from "./WatersystemShow";
import WatersystemEdit from "./WaterSystemEdit";

const WatersystemShowWithMembershipContext = () => (
  <MembershipsContextProvider>
    <WatersystemShow />
  </MembershipsContextProvider>
);

export default {
  list: WatersystemList,
  create: WatersystemCreate,
  show: WatersystemShowWithMembershipContext,
  edit: WatersystemEdit,
  icon: GradingIcon,
  recordRepresentation: "title",
};
