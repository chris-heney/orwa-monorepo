import React, { useState } from "react";
import { Box } from "@mui/material";
import { InfiniteList } from "react-admin";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import ActivityListCardGird from "../../activity/ActivityFeedGrid";
import CustomActivityFeedToolbar from "../../activity/components/customActivityFeedToolbar";
import DashboardCard from "./DashboardCard";
import { useSummaryTokens } from "../../memberships_v2/summary/tokens";

/**
 * Activity feed wrapped in the standard DashboardCard header
 * (search + filter affordances when admin tools apply).
 */
const DashboardActivityCard = () => {
  const T = useSummaryTokens();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [filter, setFilter] = useState<object>({});

  const toggleTools = () => setToolsOpen((prev) => !prev);

  return (
    <DashboardCard
      icon={<DynamicFeedOutlinedIcon />}
      title="Activity Feed"
      onSearch={toggleTools}
      searchActive={toolsOpen}
      onFilter={toggleTools}
      filterActive={toolsOpen}
      disableBodyScroll
      bodySx={{ bgcolor: T.panel }}
    >
      <Box sx={{ height: "100%", minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <InfiniteList
          sx={{
            flex: 1,
            minHeight: 0,
            maxHeight: "100%",
            overflowY: "auto",
            bgcolor: "transparent",
            color: "text.primary",
            "& .RaList-main": {
              height: "100%",
              overflow: "hidden",
            },
            "& .RaList-content": {
              bgcolor: "transparent",
              boxShadow: "none",
              maxHeight: "100%",
              overflowY: "auto",
            },
            "& .RaList-actions": {
              bgcolor: "transparent",
              flexShrink: 0,
            },
          }}
          filter={Object.keys(filter).length > 0 ? filter : undefined}
          disableSyncWithLocation
          resource={
            Object.keys(filter).length > 0 ? "activity-relations" : "activities"
          }
          sort={{ field: "id", order: "DESC" }}
          title=" "
          component="div"
          exporter={false}
          perPage={40}
          pagination={false}
          actions={
            toolsOpen ? (
              <CustomActivityFeedToolbar setFilter={setFilter} />
            ) : (
              false
            )
          }
        >
          <Box sx={{ px: 0.5 }}>
            <ActivityListCardGird />
          </Box>
        </InfiniteList>
      </Box>
    </DashboardCard>
  );
};

export default DashboardActivityCard;
