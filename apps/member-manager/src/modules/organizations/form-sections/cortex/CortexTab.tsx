import { Box, Grid2, Typography } from '@mui/material';
import { styles } from './styles';

// Import modularized components
import {
    BrandingConfiguration,
    CompanyStrategy,
    SeoConfiguration,
    AuthorConfiguration,
    ContentReview,
    LinkManagement,
    CtaPricing,
    ImageConfiguration,
    ArticleConfiguration,
    BacklinkConfiguration,
    GoogleBusinessProfile,
    ReviewManagement,
} from './components';

const CortexTab = () => {
    return (
        <Box>
            <Box sx={styles.highlight}>
                <Typography variant="body1">
                    Configure Cortex AI platform integration for automated content creation, 
                    SEO management, and digital marketing optimization. These settings control 
                    how AI generates and manages your content strategy.
                </Typography>
            </Box>

            <Grid2 container spacing={3}>
                {/* First Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <BrandingConfiguration />
                    <CompanyStrategy />
                    <SeoConfiguration />
                    <AuthorConfiguration />
                    <ContentReview />
                    <LinkManagement />
                    <CtaPricing />
                </Grid2>

                {/* Second Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <ImageConfiguration />
                    <ArticleConfiguration />
                    <BacklinkConfiguration />
                    <GoogleBusinessProfile />
                    <ReviewManagement />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default CortexTab;

