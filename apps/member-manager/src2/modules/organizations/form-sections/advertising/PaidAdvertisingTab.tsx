import { Box, Grid2, Typography } from '@mui/material';
import { NumberInput } from 'react-admin';
import { styles } from './styles';

// Import modularized components
import {
    AdCredentials,
    AdPerformance,
    AdvertisingGoals,
    AdvertisingPlatforms,
    CompetitorAds,
    CurrentCampaigns,
    LandingPages,
    MonthlyBudget,
} from './components';

const PaidAdvertisingTab = () => {
    return (
        <Box>
            <Box sx={styles.highlight}>
                <Typography variant="body1">
                    Plan your paid advertising strategy to reach your target
                    audience and achieve your marketing goals.
                </Typography>
            </Box>

            <Grid2 container spacing={3}>
                {/* First Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <CurrentCampaigns />
                    <MonthlyBudget />
                    <AdvertisingGoals />
                    <AdPerformance />
                </Grid2>

                {/* Second Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <AdvertisingPlatforms />
                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <LandingPages />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <CompetitorAds />
                        </Grid2>
                    </Grid2>
                    <AdCredentials />
                </Grid2>
            </Grid2>

            {/* Additional Budget Allocation Section */}
            <Grid2 container spacing={3} sx={{ mt: 2 }}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.highlight}>
                        <Typography variant="body1">
                            Additional budget allocation for advertising-related services.
                        </Typography>
                    </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.section}>
                        <Typography variant="h6" gutterBottom>
                            Social Media Advertising Budget
                        </Typography>
                        <NumberInput
                            source="budgetSocialMediaAds"
                            label="Social Media Ads Budget"
                            fullWidth
                            helperText="Monthly budget for social media advertising"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.section}>
                        <Typography variant="h6" gutterBottom>
                            Local Service Ads Budget
                        </Typography>
                        <NumberInput
                            source="budgetLsa"
                            label="LSA Budget"
                            fullWidth
                            helperText="Monthly budget for Local Service Ads"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default PaidAdvertisingTab;
