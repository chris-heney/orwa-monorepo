import React from 'react';
import { BooleanInput, NumberInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import { styles } from '../styles';

const ReviewSettings = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <RateReviewIcon sx={styles.icon} />
                <Typography variant="h6">Review Settings</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure how reviews are handled and published on your Google Business Profile.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <RateReviewIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Review Publishing</Typography>
                        </Box>
                        <BooleanInput
                            source="publishReviews"
                            label="Publish Reviews as Posts"
                            helperText="Automatically publish reviews as posts on your profile"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <StarIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Minimum Rating</Typography>
                        </Box>
                        <NumberInput
                            source="minimumRating"
                            label="Minimum Rating for Auto-Approval"
                            fullWidth
                            helperText="Minimum star rating for automatic approval (1-5)"
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

export default React.memo(ReviewSettings);
