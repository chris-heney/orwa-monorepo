import React from 'react';
import { BooleanInput } from 'react-admin';
import { Typography, Box, Paper } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import { styles } from '../styles';

const CurrentCampaigns = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <CampaignIcon sx={{ ...styles.icon, color: '#E91E63' }} />
                <Typography variant="h6">Current Campaigns</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Do you have active advertising campaigns running? This helps us understand your current advertising status.
            </Typography>
            
            <BooleanInput 
                source="paidAdvertising.currentAdCampaigns" 
                label="Do you have active advertising campaigns running?" 
                helperText="Check if you're currently running any paid ads"
            />
        </Paper>
    );
};

export default React.memo(CurrentCampaigns); 