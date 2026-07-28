import React from "react";
import ActivityFeed from "../activity/ActivityFeed";
import { Grid, Box } from "@mui/material";
import NextConferencsCard from "./_components/ConferencesCard";
import PeopleCard from "./_components/PeopleCard";
import AssetsCard from "./_components/AssetsCard";
import MembershipCard from "./_components/MembershipsCard";

export interface DashboardStateFilter {
  entity: string;
  entity_id: string;
}

/**
 * Home dashboard — tall People directory on the left; glance cards in a 2×2
 * on the right (Memberships + Conference / Activity + Assets).
 */
const Dashboard = () => {
  return (
    <Grid container spacing={2} mt={2} alignItems="stretch">
      {/* Tall people directory — spans both visual rows on md+ */}
      <Grid item xs={12} md={5} lg={4}>
        <Box sx={{ height: { xs: 480, md: 812 } }}>
          <PeopleCard />
        </Box>
      </Grid>

      <Grid item xs={12} md={7} lg={8}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} height={400}>
            <MembershipCard />
          </Grid>
          <Grid item xs={12} sm={6} height={400}>
            <NextConferencsCard />
          </Grid>
          <Grid item xs={12} sm={6} height={390}>
            <ActivityFeed
              admin={true}
              sx={{ height: "100%", width: "100%", borderRadius: "10px" }}
              title="Admin Dashboard"
            />
          </Grid>
          <Grid item xs={12} sm={6} height={390}>
            <AssetsCard />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
