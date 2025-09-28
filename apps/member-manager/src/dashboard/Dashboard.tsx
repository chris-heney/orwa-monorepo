import {
    Divider,
    Grid2,
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
            <Grid2 container spacing={1}>
         
                <Grid2 size={{ xs: 12 }}>
                    <Welcome />
                </Grid2>

                {/* Strategic KPIs */}
                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom sx={{ px: 1 }}>
                        Strategic KPIs
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <MonthlyRevenue value={mockData.revenue} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <MRRRatio value={mockData.mrrRatio} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid2>

                {/* Sales & Marketing Performance */}
                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom sx={{ px: 1, mt: 3 }}>
                        Sales & Marketing Performance
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <Leads value={mockData.leads} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <Deals value={mockData.deals} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid2>

                {/* API Calls */}
                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom sx={{ px: 1, mt: 3 }}>
                        API Calls
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <OpenAICalls value={mockData.openAICalls} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <GoogleCalls value={mockData.googleCalls} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <SEODataCalls value={mockData.seoDataCalls} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <AnthropicCalls value={mockData.anthropicCalls} />
                </Grid2>

                {/* Announcements and Activity */}
                <Grid2 size={{ xs: 12 }}>
                    <UpcomingAnnouncements />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <ActivityStream />
                </Grid2>

                {/* Apps */}
                <Grid2 size={{ xs: 12 }}>
                    <AppsCards />
                </Grid2>
            </Grid2>
        );
    } else if (isSmall) {
        return (
            <Grid2 container spacing={BLOCKS_SPACING} padding={1}>
                <Grid2 size={{ xs: 12 }}>
                    <Welcome />
                </Grid2>

                {/* Strategic KPIs */}
                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom>
                        Strategic KPIs
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <MonthlyRevenue value={mockData.revenue} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <MRRRatio value={mockData.mrrRatio} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid2>

                {/* Sales & Marketing Performance */}
                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Sales & Marketing Performance
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <Leads value={mockData.leads} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <Deals value={mockData.deals} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid2>

                {/* API Calls */}
                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        API Calls
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <OpenAICalls value={mockData.openAICalls} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <GoogleCalls value={mockData.googleCalls} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <SEODataCalls value={mockData.seoDataCalls} />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <AnthropicCalls value={mockData.anthropicCalls} />
                </Grid2>

                {/* Chart */}
                <Grid2 size={{ xs: 12 }}>
                    <OrderChart orders={[]} />
                </Grid2>

                {/* Announcements and Activity */}
                <Grid2 size={{ xs: 6 }}>
                    <UpcomingAnnouncements />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <ActivityStream />
                </Grid2>

                {/* Apps */}
                <Grid2 size={{ xs: 12 }}>
                    <AppsCards />
                </Grid2>
            </Grid2>
        );
    } else {
        return (
            <Grid2 container spacing={BLOCKS_SPACING} padding={1}>
                <Grid2 size={{ xs: 12 }}>
                    <Welcome />
                </Grid2>

                {/* Strategic KPIs */}
                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom>
                        Strategic KPIs
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <MonthlyRevenue value={mockData.revenue} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <MRRRatio value={mockData.mrrRatio} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid2>

                {/* Sales & Marketing Performance */}
                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Sales & Marketing Performance
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <Leads value={mockData.leads} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <Deals value={mockData.deals} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <ProjectsStarted value={mockData.projectsStarted} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <ProjectsCompleted value={mockData.projectsCompleted} />
                </Grid2>

                {/* API Calls */}
                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        API Calls
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <OpenAICalls value={mockData.openAICalls} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <GoogleCalls value={mockData.googleCalls} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <SEODataCalls value={mockData.seoDataCalls} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <AnthropicCalls value={mockData.anthropicCalls} />
                </Grid2>

                {/* Chart and Content Row */}
                <Grid2 size={{ xs: 6 }}>
                    <OrderChart orders={[]} />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <UpcomingAnnouncements />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
                    <ActivityStream />
                </Grid2>

                {/* Apps - Full Width */}
                <Grid2 size={{ xs: 12 }}>
                    <AppsCards />
                </Grid2>
            </Grid2>
        );
    }
};

export default Dashboard;
