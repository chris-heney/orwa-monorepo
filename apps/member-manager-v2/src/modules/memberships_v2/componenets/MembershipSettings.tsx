import { Card } from "@mui/material";
import React from "react";
import EmailInterface from "../../emails-magement/emails-templates/EmailInterface";
// import ScheduledEmailTaskInterface from "../../email-taks/ScheduledTaskList";

const MembershipSettings = () => {
  return (
    <Card>
      <EmailInterface module="Memberships" />
      {/* <ScheduledEmailTaskInterface/> */}
    </Card>
  );
};

export default MembershipSettings;
