import React from "react";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import RosterPanel from "../../memberships_v2/summary/RosterPanel";
import { useMembershipMetrics } from "../../memberships_v2/summary/useMembershipMetrics";
import DashboardCard from "./DashboardCard";

/**
 * Home-dashboard membership widget — sunburst + legend inside the
 * standard DashboardCard shell.
 */
const MembershipsCard = () => {
  const metrics = useMembershipMetrics();

  return (
    <DashboardCard
      icon={<Groups2OutlinedIcon />}
      title="Memberships"
      count={metrics.isLoading ? undefined : metrics.total}
      loading={metrics.isLoading}
      disableBodyScroll
      bodySx={{ p: 1.25 }}
    >
      <RosterPanel compact hideTitle metrics={metrics} />
    </DashboardCard>
  );
};

export default MembershipsCard;
