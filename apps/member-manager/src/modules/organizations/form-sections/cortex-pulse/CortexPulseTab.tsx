import { Box, Grid2, Typography } from '@mui/material';
import { styles } from './styles';

// Import modularized components
import {
    BacklinkStrategy,
    BasicInfoSection,
    ProfessionalBackground,
    ExpertiseSection,
    MediaCommunitySection,
} from './components';

const CortexPulseTab = () => {
    return (
        <Box>
            <Box sx={styles.highlight}>
                <Typography variant="body1">
                    Configure Cortex Pulse for PR & media outreach. This includes backlink building, 
                    author profile management, and comprehensive PR strategy configuration.
                </Typography>
            </Box>

            <Grid2 container spacing={3}>
                {/* First Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <BacklinkStrategy />
                    <BasicInfoSection />
                    <ProfessionalBackground />
                </Grid2>

                {/* Second Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <ExpertiseSection />
                    <MediaCommunitySection />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default CortexPulseTab;
