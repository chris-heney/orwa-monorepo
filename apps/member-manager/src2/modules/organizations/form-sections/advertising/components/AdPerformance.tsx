import React from 'react';
import { TextInput } from 'react-admin';
import { Typography, Box, Paper, Stack, Divider } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import InsightsIcon from '@mui/icons-material/Insights';
import { styles } from '../styles';

const AdPerformance = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <AssessmentIcon sx={styles.icon} />
                <Typography variant="h6">Ad Copy & Performance</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Let us know your ad content needs and what metrics matter most to your business.
            </Typography>
            
            <Stack spacing={3}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DescriptionIcon sx={{ color: '#673AB7', mr: 1 }} />
                        <Typography variant="subtitle1">Ad Copy Needs</Typography>
                    </Box>
                    <TextInput 
                        source="paidAdvertising.adCopyNeeds" 
                        label="Ad Copy Requirements" 
                        fullWidth 
                        multiline
                        rows={3}
                        helperText="Describe what type of ad content you need (headlines, descriptions, etc.)"
                        variant="outlined"
                    />
                </Box>
                
                <Divider />
                
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <InsightsIcon sx={{ color: '#2196F3', mr: 1 }} />
                        <Typography variant="subtitle1">Performance Metrics</Typography>
                    </Box>
                    <TextInput 
                        source="paidAdvertising.performanceKpis" 
                        label="Key Performance Indicators" 
                        fullWidth 
                        multiline
                        rows={3}
                        helperText="What metrics matter most to your business? (CTR, conversion rate, cost per lead, etc.)"
                        variant="outlined"
                    />
                </Box>
            </Stack>
        </Paper>
    );
};

export default React.memo(AdPerformance); 