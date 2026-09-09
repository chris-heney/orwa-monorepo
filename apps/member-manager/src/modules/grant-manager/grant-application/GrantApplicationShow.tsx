import React from "react";
import { ShowBase, Title } from "react-admin";
import { Box, Card } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import GrantApplicationDetails from "./components/GrantApplicationDetails";
import CustomShowHeader from "../../memberships_v2/componenets/CustomShowHeader";
import ActivityFeed from "../../activity/ActivityFeed";
import EmailSidebar from "../../emails-magement/EmailSidebar";
import {
  RightDrawer,
  useCurrentRecordDrawerContext,
  useDrawerGroup,
} from "../../_components/drawer";
import {
  ActivityAction,
  NotificationsAction,
} from "../../_components/heading/HeadingActions";

type ShowDrawer = "notifications" | "activity";

/** Heading + drawers need the loaded record, so they live inside ShowBase. */
const GrantApplicationShowContent = () => {
  const drawers = useDrawerGroup<ShowDrawer>("grant-application-show-drawer");
  const context = useCurrentRecordDrawerContext();

  return (
    <>
      <Card sx={{ borderRadius: 0, boxShadow: "none" }}>
        <Title title="Grant Application Details" />
        <CustomShowHeader
          displayField="legal_entity_name"
          redirectTo="/grant/dashboard"
          customActions={
            <>
              <NotificationsAction
                active={drawers.isOpen("notifications")}
                onClick={() => drawers.toggle("notifications")}
              />
              <ActivityAction
                active={drawers.isOpen("activity")}
                onClick={() => drawers.toggle("activity")}
              />
            </>
          }
        />
        <GrantApplicationDetails />
      </Card>

      <RightDrawer
        open={drawers.isOpen("notifications")}
        onClose={drawers.close}
        title="Notifications"
        icon={<EmailIcon fontSize="small" />}
        context={context}
      >
        <EmailSidebar module="Grant Management" />
      </RightDrawer>

      <RightDrawer
        open={drawers.isOpen("activity")}
        onClose={drawers.close}
        title="Activity Feed"
        icon={<MarkunreadMailboxIcon fontSize="small" />}
        context={context}
      >
        {/* Wait for the record: without its numeric id the feed would widen
            to every grant application's activity. */}
        {context ? (
          <ActivityFeed
            entity="grant-application"
            entityId={context.entityId}
            title=" "
            frame="plain"
          />
        ) : null}
      </RightDrawer>
    </>
  );
};

const GrantApplicationShow = () => (
  <Box sx={{ m: 0, p: 0 }}>
    <ShowBase queryOptions={{ meta: { raw: true, populate: true } }}>
      <GrantApplicationShowContent />
    </ShowBase>
  </Box>
);

export default GrantApplicationShow;
