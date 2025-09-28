import { Box, Grid2, Typography } from '@mui/material';
import { styles } from './styles';

// Import modularized components
import {
    PromotionDetails,
    PromotionTargeting,
    CompanyContact,
} from './components';

const PromotionsTab = () => {
    return (
        <Box>
            <Box sx={styles.highlight}>
                <Typography variant="body1">
                    Manage year-round promotions and seasonal offers. Configure discount details, 
                    targeting options, and company contact information for promotion management.
                </Typography>
            </Box>

            <Grid2 container spacing={3}>
                {/* First Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <PromotionDetails />
                    <CompanyContact />
                </Grid2>

                {/* Second Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <PromotionTargeting />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default PromotionsTab;
