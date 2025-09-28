import { Box, Grid2, Typography } from '@mui/material';
import { styles } from './styles';

// Import modularized components
import {
    CompetitorAnalysis,
    ContentStrategy,
    PrimaryServices,
    TargetKeywords,
    TargetLocations,
    TechnicalSEO,
} from './components';

const SeoTab = () => {
    return (
        <Box>
            <Box sx={styles.highlight}>
                <Typography variant="body1">
                    Set up your search engine optimization (SEO) strategy to
                    improve your website's visibility in search results and
                    attract more targeted traffic.
                </Typography>
            </Box>

            <Grid2 container spacing={3}>
                {/* First Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <PrimaryServices />
                    <TargetKeywords />
                    <ContentStrategy />
                </Grid2>

                {/* Second Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <TargetLocations />
                    <CompetitorAnalysis />
                    <TechnicalSEO />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default SeoTab;
