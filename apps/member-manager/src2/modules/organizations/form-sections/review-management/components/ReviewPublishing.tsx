import React from 'react';
import { BooleanInput, NumberInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import { styles } from '../styles';

const ReviewPublishing = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <RateReviewIcon sx={styles.icon} />
                <Typography variant="h6">Review Publishing</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure how reviews are published and displayed on your platforms.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="publishReviews"
                            label="Publish Reviews"
                            helperText="Automatically publish reviews to your website and social media"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <StarIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Minimum Rating Threshold</Typography>
                        </Box>
                        <NumberInput
                            source="minimumRating"
                            label="Minimum Rating for Publishing"
                            fullWidth
                            helperText="Only publish reviews with this rating or higher (1-5)"
                            variant="outlined"
                            min={1}
                            max={5}
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(ReviewPublishing);
