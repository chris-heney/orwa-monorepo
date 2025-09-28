import React from 'react';
import { ArrayInput, SimpleFormIterator, TextInput } from 'react-admin';
import { Typography, Box, Grid2 } from '@mui/material';
import { AnalyticsStyleProps } from '../types';

const ConversionTracking: React.FC<AnalyticsStyleProps> = ({ styles }) => {
    return (
        <Grid2 size={{ xs: 12 }}>
            <Box sx={styles.inputWrapper}>
                <Typography variant="subtitle1" gutterBottom>
                    Conversion Tracking Goals
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Define what actions on your website should be tracked as conversions.
                </Typography>
                <ArrayInput source="analytics.conversionTrackingGoals">
                                    <SimpleFormIterator inline>
                                        <TextInput 
                                            source="" 
                                            label="Conversion Goal" 
                                            helperText="e.g., Form Submission, Purchase" 
                                            variant="outlined"
                                            sx={{ mt: 1 }}
                                            fullWidth
                                        />
                                    </SimpleFormIterator>
                                </ArrayInput>
            </Box>
        </Grid2>
    );
};

export default ConversionTracking; 