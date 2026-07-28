import React from "react";
import { Box } from "@mui/material";
import NextConferencsCard from "./_components/ConferencesCard";
import PeopleCard from "./_components/PeopleCard";
import AssetsCard from "./_components/AssetsCard";
import MembershipCard from "./_components/MembershipsCard";
import DashboardActivityCard from "./_components/DashboardActivityCard";

export interface DashboardStateFilter {
  entity: string;
  entity_id: string;
}

const COL_H = { xs: "auto", md: 820 };

/**
 * Home dashboard — 25% | 50% | 25%:
 * People + Assets | Memberships | Conference + Activity.
 */
const Dashboard = () => {
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "stretch",
        gap: 2,
        height: COL_H,
        maxHeight: COL_H,
      }}
    >
      {/* Left 25% — People over Assets */}
      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
          minHeight: 0,
          height: { xs: 560, md: "100%" },
        }}
      >
        <Box sx={{ flex: "1 1 62%", minHeight: 0, overflow: "hidden" }}>
          <PeopleCard />
        </Box>
        <Box sx={{ flex: "0 0 32%", minHeight: 0, overflow: "hidden" }}>
          <AssetsCard />
        </Box>
      </Box>

      {/* Center 50% — Memberships */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          minWidth: 0,
          minHeight: 0,
          height: { xs: 420, md: "100%" },
          overflow: "hidden",
        }}
      >
        <MembershipCard />
      </Box>

      {/* Right 25% — Conference over Activity */}
      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
          minHeight: 0,
          height: { xs: 640, md: "100%" },
        }}
      >
        <Box sx={{ flex: "1 1 48%", minHeight: 0, overflow: "hidden" }}>
          <NextConferencsCard />
        </Box>
        <Box sx={{ flex: "1 1 48%", minHeight: 0, overflow: "hidden" }}>
          <DashboardActivityCard />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
