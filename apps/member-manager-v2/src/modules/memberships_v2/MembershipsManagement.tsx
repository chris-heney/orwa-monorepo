import React from "react";
import MembershipsContextProvider from "./MembershipsContextProvider";
import MembershipDashboard from "./MembershipDashboard";
import UserRoleContextProvider from "../../context/UserRoleContextProvider";

const MembershipsDashboard = () => {
  return (
    <MembershipsContextProvider>
      <UserRoleContextProvider>
        <MembershipDashboard />
      </UserRoleContextProvider>
    </MembershipsContextProvider>
  );
};

export default MembershipsDashboard;
