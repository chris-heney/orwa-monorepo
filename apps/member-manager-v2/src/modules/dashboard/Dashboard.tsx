import React from 'react';
import ActivityFeed from '../activity/ActivityFeed';
import { Grid, Box } from '@mui/material';
import NextConferencsCard from './_components/ConferencesCard';
import StaffCard from './_components/StaffCard';
import InstructorsCard from './_components/TrainingInstructorCard';
import AssetsCard from './_components/AssetsCard';
import MembershipCard from './_components/MembershipsCard';
import DashboardHeader from './_components/DashboardHeader';
import FinancialMetricsCard from './_components/FinancialMetricsCard';
import TrainingAnalyticsCard from './_components/TrainingAnalyticsCard';
import ConferenceMetricsCard from './_components/ConferenceMetricsCard';
import GrantAnalyticsCard from './_components/GrantAnalyticsCard';
import EmailAnalyticsCard from './_components/EmailAnalyticsCard';
import OperationsOverviewCard from './_components/OperationsOverviewCard';

export interface DashboardStateFilter {
    entity: string;
    entity_id: string;
}

const Dashboard = () => {
    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
            <DashboardHeader />
            <Grid container spacing={3} sx={{ py: 3 }}>
                {/* Row 1: Financial Overview - Full Width */}
                <Grid item xs={12}>
                    <FinancialMetricsCard />
                </Grid>

                {/* Row 2: Training and Conference Side by Side */}
                <Grid item xs={12} lg={6}>
                    <TrainingAnalyticsCard />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <ConferenceMetricsCard />
                </Grid>

                {/* Row 3: Grant and Email Analytics */}
                <Grid item xs={12} lg={6}>
                    <GrantAnalyticsCard />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <EmailAnalyticsCard />
                </Grid>

                {/* Row 4: Operations and Activity Side by Side */}
                <Grid item xs={12} lg={8}>
                    <OperationsOverviewCard />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <ActivityFeed
                        admin={true}
                        sx={{ height: '100%', width: '100%', borderRadius: '10px' }}
                        title="System Activity"
                    />
                </Grid>

                {/* Row 5: Original Cards */}
                <Grid item xs={12} sm={6} lg={4}>
                    <StaffCard />
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <MembershipCard />
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <InstructorsCard />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <AssetsCard />
                </Grid>

                {/* Row 6: Conference Calendar */}
                <Grid item xs={6}>
                    <NextConferencsCard />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
