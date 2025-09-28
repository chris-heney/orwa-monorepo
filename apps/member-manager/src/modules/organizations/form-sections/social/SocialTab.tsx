import { Box, Grid2, Typography, alpha } from '@mui/material';
import {
    GoogleBusinessProfile,
    PostingFrequency,
    ReputationManagement,
    SocialPlatforms,
    SocialStrategy,
} from './components';

const highlight = {
    bgcolor: alpha('#2196f3', 0.08),
    p: 2,
    borderRadius: 1,
    borderLeft: '4px solid #2196f3',
    mb: 3,
};

const SocialTab = () => {
    return (
        <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
                <Box sx={highlight}>
                    <Typography variant="body1">
                        Build your social media presence to connect with
                        customers, share updates, and increase brand awareness.
                    </Typography>
                </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <ReputationManagement />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <PostingFrequency />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <GoogleBusinessProfile />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <SocialPlatforms />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <SocialStrategy />
            </Grid2>
        </Grid2>
    );
};

export default SocialTab;
