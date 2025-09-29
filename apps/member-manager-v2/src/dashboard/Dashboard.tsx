import {
    Divider,
    Grid,
    Theme,
    Typography,
    useMediaQuery,
} from '@mui/material';


import MonthlyRevenue from './MonthlyRevenue';
import OrderChart from './OrderChart';
import Welcome from './Welcome';

// Strategic KPIs
import MRRRatio from './MRRRatio';
import ProjectsCompleted from './ProjectsCompleted';
import ProjectsStarted from './ProjectsStarted';

// Sales & Marketing Performance
import Deals from './Deals';
import Leads from './Leads';

// API Calls
import AnthropicCalls from './AnthropicCalls';
import GoogleCalls from './GoogleCalls';
import OpenAICalls from './OpenAICalls';
import SEODataCalls from './SEODataCalls';

// New Dashboard Sections
import ActivityStream from './ActivityStream';
import AppsCards from './AppsCards';
import UpcomingAnnouncements from './UpcomingAnnouncements';

const Dashboard = () => {
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('lg')
    );

    const BLOCKS_SPACING = 2;

    // Mock data - would come from API calls in real implementation
    const mockData = {
        revenue: 3.22,
        mrrRatio: 1.2,
        projectsStarted: 45,
        projectsCompleted: 65,
        leads: 248,
        deals: 36,
        openAICalls: 248,
        googleCalls: 36,
        seoDataCalls: 45,
        anthropicCalls: 65,
        newOrders: 12,
    };

    if (isXSmall) {
        return (
            <Grid container spacing={1}>
         
                <Grid item xs={12}>
                    <Welcome />
                </Grid>

                {/* Strategic KPIs */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ px: 1 }}>
                        Strategic KPIs
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                    <MonthlyRevenue value={mockData.revenue} />
                </Grid>
                <Grid item xs={12}>
                    <MRRRatio value={mockData.mrrRatio} />
                </Grid>
                <Grid item xs={12}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid>
                <Grid item xs={12}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid>

                {/* Sales & Marketing Performance */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ px: 1, mt: 3 }}>
                        Sales & Marketing Performance
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                    <Leads value={mockData.leads} />
                </Grid>
                <Grid item xs={12}>
                    <Deals value={mockData.deals} />
                </Grid>
                <Grid item xs={12}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid>
                <Grid item xs={12}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid>

                {/* API Calls */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ px: 1, mt: 3 }}>
                        API Calls
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                    <OpenAICalls value={mockData.openAICalls} />
                </Grid>
                <Grid item xs={12}>
                    <GoogleCalls value={mockData.googleCalls} />
                </Grid>
                <Grid item xs={12}>
                    <SEODataCalls value={mockData.seoDataCalls} />
                </Grid>
                <Grid item xs={12}>
                    <AnthropicCalls value={mockData.anthropicCalls} />
                </Grid>

                {/* Announcements and Activity */}
                <Grid item xs={12}>
                    <UpcomingAnnouncements />
                </Grid>
                <Grid item xs={12}>
                    <ActivityStream />
                </Grid>

                {/* Apps */}
                <Grid item xs={12}>
                    <AppsCards />
                </Grid>
            </Grid>
        );
    } else if (isSmall) {
        return (
            <Grid container spacing={BLOCKS_SPACING} padding={1}>
                <Grid item xs={12}>
                    <Welcome />
                </Grid>

                {/* Strategic KPIs */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Strategic KPIs
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={6}>
                    <MonthlyRevenue value={mockData.revenue} />
                </Grid>
                <Grid item xs={6}>
                    <MRRRatio value={mockData.mrrRatio} />
                </Grid>
                <Grid item xs={6}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid>
                <Grid item xs={6}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid>

                {/* Sales & Marketing Performance */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Sales & Marketing Performance
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={6}>
                    <Leads value={mockData.leads} />
                </Grid>
                <Grid item xs={6}>
                    <Deals value={mockData.deals} />
                </Grid>
                <Grid item xs={6}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid>
                <Grid item xs={6}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid>

                {/* API Calls */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        API Calls
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={6}>
                    <OpenAICalls value={mockData.openAICalls} />
                </Grid>
                <Grid item xs={6}>
                    <GoogleCalls value={mockData.googleCalls} />
                </Grid>
                <Grid item xs={6}>
                    <SEODataCalls value={mockData.seoDataCalls} />
                </Grid>
                <Grid item xs={6}>
                    <AnthropicCalls value={mockData.anthropicCalls} />
                </Grid>

                {/* Chart */}
                <Grid item xs={12}>
                    <OrderChart orders={[]} />
                </Grid>

                {/* Announcements and Activity */}
                <Grid item xs={6}>
                    <UpcomingAnnouncements />
                </Grid>
                <Grid item xs={6}>
                    <ActivityStream />
                </Grid>

                {/* Apps */}
                <Grid item xs={12}>
                    <AppsCards />
                </Grid>
            </Grid>
        );
    } else {
        return (
            <Grid container spacing={BLOCKS_SPACING} padding={1}>
                <Grid item xs={12}>
                    <Welcome />
                </Grid>

                {/* Strategic KPIs */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Strategic KPIs
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <MonthlyRevenue value={mockData.revenue} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <MRRRatio value={mockData.mrrRatio} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid>

                {/* Sales & Marketing Performance */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Sales & Marketing Performance
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <Leads value={mockData.leads} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <Deals value={mockData.deals} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid>

                {/* API Calls */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        API Calls
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <OpenAICalls value={mockData.openAICalls} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <GoogleCalls value={mockData.googleCalls} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <SEODataCalls value={mockData.seoDataCalls} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <AnthropicCalls value={mockData.anthropicCalls} />
                </Grid>

                {/* Chart and Content Row */}
                <Grid item xs={6}>
                    <OrderChart orders={[]} />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <UpcomingAnnouncements />
                </Grid>
                <Grid size={{ xs: 3 }}>
                    <ActivityStream />
                </Grid>

                {/* Apps - Full Width */}
                <Grid item xs={12}>
                    <AppsCards />
                </Grid>
            </Grid>
        );
    }
};

export default Dashboard;
