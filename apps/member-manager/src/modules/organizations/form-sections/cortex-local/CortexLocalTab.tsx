import { Box, Grid2, Typography } from '@mui/material';
import { styles } from './styles';

// Import modularized components
import {
    PostingConfiguration,
    ReviewSettings,
} from './components';

const CortexLocalTab = () => {
    return (
        <Box>
            <Box sx={styles.highlight}>
                <Typography variant="body1">
                    Configure Cortex Local for automated Google Business Profile management. 
                    This includes automated posting, review management, and local SEO optimization.
                </Typography>
            </Box>

            <Grid2 container spacing={3}>
                {/* First Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <PostingConfiguration />
                </Grid2>

                {/* Second Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <ReviewSettings />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default CortexLocalTab;
