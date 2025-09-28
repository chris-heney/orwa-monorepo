import React from 'react';
import { BooleanInput, NumberInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import StarIcon from '@mui/icons-material/Star';
import { styles } from '../styles';

const AutomationSettings = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <AutoModeIcon sx={styles.icon} />
                <Typography variant="h6">Automation Settings</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure automated review response and approval settings.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="reviewResponseAutomated"
                            label="Automated Review Responses"
                            helperText="Enable automated responses to customer reviews"
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
                            source="reviewResponseAutomaticMinRating"
                            label="Minimum Rating for Auto-Response"
                            fullWidth
                            helperText="Minimum star rating for automatic response (1-5)"
                            variant="outlined"
                            min={1}
                            max={5}
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AutoModeIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Automatic Approval</Typography>
                        </Box>
                        <BooleanInput
                            source="reviewResponseAutomaticApproval"
                            label="Automatic Approval"
                            helperText="Automatically approve responses above minimum rating"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(AutomationSettings);
