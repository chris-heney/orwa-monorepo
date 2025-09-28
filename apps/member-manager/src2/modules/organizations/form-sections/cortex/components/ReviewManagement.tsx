import React from 'react';
import { BooleanInput, NumberInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styles } from '../styles';

const ReviewManagement = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <RateReviewIcon sx={styles.icon} />
                <Typography variant="h6">Review Management</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure AUTOmated review response settings and approval workflows.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AutoModeIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Automated Responses</Typography>
                        </Box>
                        <BooleanInput
                            source="reviewResponseAutomated"
                            label="Automated Review Responses"
                            helperText="Enable AUTOmated responses to customer reviews"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Auto-Approval Settings</Typography>
                        </Box>
                        <BooleanInput
                            source="reviewResponseAutomaticApproval"
                            label="Automatic Approval"
                            helperText="Automatically approve review responses without MANUAL review"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <NumberInput
                            source="reviewResponseAutomaticMinRating"
                            label="Minimum Rating for Auto-Response"
                            min={1}
                            max={5}
                            fullWidth
                            helperText="Minimum star rating for AUTOmated responses"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(ReviewManagement);




