import React from 'react';
import { BooleanInput } from 'react-admin';
import { Typography, Box, Paper, Stack, Divider } from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import RepeatIcon from '@mui/icons-material/Repeat';
import { styles } from '../styles';

const LandingPages = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <WebIcon sx={styles.icon} />
                <Typography variant="h6">Landing Pages & Retargeting</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Dedicated landing pages can dramatically improve ad conversion rates by providing a focused experience for visitors.
            </Typography>
            
            <Stack spacing={3}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ScreenshotMonitorIcon sx={{ color: '#4CAF50', mr: 1 }} />
                        <Typography variant="subtitle1">Landing Pages</Typography>
                    </Box>
                    <BooleanInput 
                        source="paidAdvertising.hasLandingPages" 
                        label="Do you have dedicated landing pages for your ads?" 
                        helperText="Pages specifically designed for converting ad visitors"
                    />
                </Box>
                
                <Divider />
                
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <RepeatIcon sx={{ color: '#FF9800', mr: 1 }} />
                        <Typography variant="subtitle1">Retargeting</Typography>
                    </Box>
                    <BooleanInput 
                        source="paidAdvertising.needRetargeting" 
                        label="Are you interested in retargeting campaigns?" 
                        helperText="Ads that follow visitors who have shown interest but didn't convert"
                    />
                </Box>
            </Stack>
        </Paper>
    );
};

export default React.memo(LandingPages); 