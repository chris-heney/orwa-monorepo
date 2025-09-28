import React from 'react';
import { SelectInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styles } from '../styles';

const ContentReview = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <RateReviewIcon sx={styles.icon} />
                <Typography variant="h6">Content Review & Approval</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure how customer articles are reviewed and approved before publishing.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Article Review Mode</Typography>
                        </Box>
                        <SelectInput
                            source="customerArticleReviewMode"
                            label="Customer Article Review Mode"
                            choices={[
                                { id: 'COMMENTS_ONLY', name: 'Comments Only - Feedback only' },
                                { id: 'APPROVAL_REQUIRED', name: 'Approval Required - Full approval required before publishing' }
                            ]}
                            fullWidth
                            helperText="How should customer articles be reviewed?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(ContentReview);




