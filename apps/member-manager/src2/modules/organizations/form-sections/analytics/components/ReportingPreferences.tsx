import AssessmentIcon from '@mui/icons-material/Assessment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Box, Grid2 } from '@mui/material';
import React from 'react';
import { SelectInput, TextInput } from 'react-admin';
import { AnalyticsStyleProps } from '../types';

const ReportingPreferences: React.FC<AnalyticsStyleProps> = ({ styles }) => {
    return (
        <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={styles.inputWrapper}>
                    <Box sx={styles.inputWithIcon}>
                        <AssessmentIcon sx={styles.inputIcon} />
                        <Box sx={{ flexGrow: 1 }}>
                            <TextInput
                                source="analytics.marketingDashboardPreferences"
                                label="Marketing Dashboard Preferences"
                                fullWidth
                                helperText="Preferred metrics and KPIs to display"
                                variant="outlined"
                                multiline
                                rows={2}
                            />
                        </Box>
                    </Box>
                </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={styles.inputWrapper}>
                    <Box sx={styles.inputWithIcon}>
                        <ScheduleIcon sx={styles.inputIcon} />
                        <Box sx={{ flexGrow: 1 }}>
                            <SelectInput
                                source="analytics.reportingFrequency"
                                label="Reporting Frequency"
                                choices={[
                                    { id: 'Daily', name: 'Daily' },
                                    { id: 'Weekly', name: 'Weekly' },
                                    { id: 'Bi-Weekly', name: 'Bi-Weekly' },
                                    { id: 'Monthly', name: 'Monthly' },
                                    { id: 'Quarterly', name: 'Quarterly' },
                                ]}
                                fullWidth
                                helperText="How often would you like to receive analytics reports?"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </Box>
            </Grid2>
        </Grid2>
    );
};

export default ReportingPreferences;
