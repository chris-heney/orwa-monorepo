import { Box, Grid2, Typography } from '@mui/material';
import { styles } from './styles';

// Import modularized components
import {
    BlogSection,
    CaseStudiesFAQ,
    ContentCreationHelp,
    ContentNeeded,
    CustomerQuestions,
    CustomerTestimonials,
    MediaVisuals,
    ToneStyle,
} from './components';

const ContentTab = () => {
    return (
        <Box>
            <Box sx={styles.highlight}>
                <Typography variant="body1">
                    Plan your website content strategy. High-quality, relevant
                    content is essential for engaging visitors and improving
                    your search engine rankings.
                </Typography>
            </Box>

            <Grid2 container spacing={3}>
                {/* First Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <ContentNeeded />
                    <CustomerQuestions />
                    <ContentCreationHelp />
                </Grid2>

                {/* Second Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <ToneStyle />
                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <BlogSection />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <CaseStudiesFAQ />
                        </Grid2>
                    </Grid2>
                    <MediaVisuals />
                    <CustomerTestimonials />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default ContentTab;
