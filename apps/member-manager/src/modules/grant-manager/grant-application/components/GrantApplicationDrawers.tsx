import React from "react";
import ActivityFeed from "../../../activity/ActivityFeed";
import EmailSidebar from "../../../emails-magement/EmailSidebar";
import { useRecordDrawerContext } from "../../../_components/drawer";

/** Notifications drawer body of the grant-application show page. */
export const GrantApplicationNotificationsBody = () => (
  <EmailSidebar module="Grant Management" />
);

/**
 * Activity drawer body of the grant-application show page. Waits for the
 * record: without its numeric id the feed would widen to every grant
 * application's activity.
 */
export const GrantApplicationActivityBody = () => {
  const context = useRecordDrawerContext();
  return context ? (
    <ActivityFeed
      entity="grant-application"
      entityId={context.entityId}
      title=" "
      frame="plain"
    />
  ) : null;
};
