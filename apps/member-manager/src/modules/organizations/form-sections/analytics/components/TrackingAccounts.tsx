import BarChartIcon from '@mui/icons-material/BarChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Box, Grid2 } from '@mui/material';
import React from 'react';
import { BooleanInput, TextInput } from 'react-admin';
import { AnalyticsStyleProps } from '../types';

const TrackingAccounts: React.FC<AnalyticsStyleProps> = ({ styles }) => {
    return (
        <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={styles.inputWrapper}>
                    <Box sx={styles.inputWithIcon}>
                        <BarChartIcon sx={styles.inputIcon} />
                        <Box sx={{ flexGrow: 1 }}>
                            <TextInput
                                source="analytics.googleAnalyticsAccount"
                                label="Google Analytics Account"
                                fullWidth
                                helperText="e.g., UA-12345678-9 or GA4 tracking ID"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={styles.inputWrapper}>
                    <Box sx={styles.inputWithIcon}>
                        <TrackChangesIcon sx={styles.inputIcon} />
                        <Box sx={{ flexGrow: 1 }}>
                            <TextInput
                                source="analytics.tagManagerAccount"
                                label="Tag Manager Account"
                                fullWidth
                                helperText="e.g., GTM-ABC1234"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={styles.inputWrapper}>
                    <Box sx={styles.inputWithIcon}>
                        <MonetizationOnIcon sx={styles.inputIcon} />
                        <Box sx={{ flexGrow: 1 }}>
                            <TextInput
                                source="analytics.mccPaidAdsAccount"
                                label="MCC Paid Ads Account"
                                fullWidth
                                helperText="Google Ads account ID"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={styles.inputWrapper}>
                    <Box sx={styles.inputWithIcon}>
                        <PhoneCallbackIcon sx={styles.inputIcon} />
                        <Box sx={{ flexGrow: 1 }}>
                            <BooleanInput
                                source="analytics.whatConvertsCallTracking"
                                label="What Converts Call Tracking?"
                                helperText="Enable call tracking to measure call conversions"
                            />
                        </Box>
                    </Box>
                </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={styles.inputWrapper}>
                    <Box sx={styles.inputWithIcon}>
                        <WhatshotIcon sx={styles.inputIcon} />
                        <Box sx={{ flexGrow: 1 }}>
                            <TextInput
                                source="analytics.heatmapTrackingSystem"
                                label="Heatmap Tracking System"
                                fullWidth
                                helperText="e.g., Hotjar, Crazy Egg"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </Box>
            </Grid2>
        </Grid2>
    );
};

export default TrackingAccounts;
