import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { Box, Grid2, Typography } from '@mui/material';
import {
    ConversionTracking,
    ReportingPreferences,
    TrackingAccounts,
} from './components';
import { styles } from './utils';

const AnalyticsTab = () => {
    return (
        <Grid2 container spacing={3} p={2}>
            <Grid2 size={{ xs: 12 }}>
                <Box sx={styles.highlight}>
                    <Typography variant="body1">
                        Set up tracking and analytics to understand how visitors
                        interact with your website. This information helps
                        improve your user experience and marketing strategies.
                    </Typography>
                </Box>
            </Grid2>

            {/* Analytics Accounts Section */}
            <Grid2 size={{ xs: 12 }}>
                <Box sx={styles.sectionTitle}>
                    <AnalyticsIcon sx={styles.icon} />
                    <Typography variant="h6">Analytics Information</Typography>
                </Box>

                {/* Tracking Accounts */}
                <TrackingAccounts styles={styles} />
            </Grid2>

            {/* Conversion Tracking Goals Section */}
            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={styles.sectionTitle}>
                    <TrackChangesIcon sx={styles.icon} />
                    <Typography variant="h6">Conversion Tracking</Typography>
                </Box>
                <ConversionTracking styles={styles} />
            </Grid2>

            {/* Reporting Preferences Section */}
            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={styles.sectionTitle}>
                    <AssessmentIcon sx={styles.icon} />
                    <Typography variant="h6">Reporting Preferences</Typography>
                </Box>
                <ReportingPreferences styles={styles} />
            </Grid2>
        </Grid2>
    );
};

export default AnalyticsTab;
