import { Box, Grid2, Typography } from '@mui/material';
import { styles } from './styles';

// Import modularized components
import {
    AutomationSettings,
    ReviewPublishing,
} from './components';

const ReviewManagementTab = () => {
    return (
        <Box>
            <Box sx={styles.highlight}>
                <Typography variant="body1">
                    Configure automated review management settings. This includes automated responses, 
                    review publishing, and approval workflows for customer reviews.
                </Typography>
            </Box>

            <Grid2 container spacing={3}>
                {/* First Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <AutomationSettings />
                </Grid2>

                {/* Second Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <ReviewPublishing />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default ReviewManagementTab;
