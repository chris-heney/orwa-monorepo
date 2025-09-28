import React from 'react';
import { BooleanInput } from 'react-admin';
import { Typography, Box, Grid2 } from '@mui/material';
import StyleIcon from '@mui/icons-material/Style';

const BrandStyleGuide: React.FC<any> = ({ styles }) => {
    return (
        <Grid2 size={{ xs: 12 }} sx={{ mb: 2 }}>
            <Box sx={styles.sectionTitle}>
                <StyleIcon sx={styles.icon} />
                <Typography variant="h6">Brand Style Guide</Typography>
            </Box>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="brand.hasBrandStyleGuide"
                            label="Does your company have a brand style guide?"
                            helperText="A brand style guide ensures consistency"
                        />
                    </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="brand.needLogoRefresh"
                            label="Need a logo refresh?"
                            helperText="Indicate if you need to update your logo"
                        />
                    </Box>
                    </Grid2>
            </Grid2>
        </Grid2>
    );
};

export default BrandStyleGuide; 