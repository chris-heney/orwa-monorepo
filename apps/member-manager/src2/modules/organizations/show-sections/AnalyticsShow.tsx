import { Organization, OrganizationAnalytics } from '@ci-connect/types';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid2,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import React from 'react';
import { useRecordContext } from 'react-admin';

interface FieldProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    emptyText?: string;
}

const Field: React.FC<FieldProps> = ({
    label,
    value,
    icon,
    emptyText = '—',
}) => (
    <ListItem disableGutters>
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText
            primary={label}
            secondary={value || emptyText}
            primaryTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
            }}
            secondaryTypographyProps={{ variant: 'body1' }}
        />
    </ListItem>
);

const BooleanField: React.FC<{
    label: string;
    value: boolean | null | undefined;
    icon: React.ReactNode;
}> = ({ label, value, icon }) => (
    <ListItem disableGutters>
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText
            primary={label}
            secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    {value ? (
                        <>
                            <CheckCircleIcon
                                color="success"
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />
                            <Typography variant="body1">Enabled</Typography>
                        </>
                    ) : (
                        <>
                            <CancelIcon
                                color="error"
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />
                            <Typography variant="body1">Disabled</Typography>
                        </>
                    )}
                </Box>
            }
            primaryTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
            }}
        />
    </ListItem>
);

export const AnalyticsShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const analytics = (record as any).analytics || ({} as OrganizationAnalytics);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Analytics Information</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid2 container spacing={3}>
                {/* Tracking Accounts Section */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                >
                    <Card variant="outlined">
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <BarChartIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Tracking Accounts
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <Field
                                    label="Google Analytics Account"
                                    value={analytics.googleAnalyticsAccount}
                                    icon={<BarChartIcon color="action" />}
                                    emptyText="No Google Analytics account configured"
                                />

                                <Field
                                    label="Tag Manager Account"
                                    value={analytics.tagManagerAccount}
                                    icon={<TrackChangesIcon color="action" />}
                                    emptyText="No Tag Manager account configured"
                                />

                                <Field
                                    label="MCC Paid Ads Account"
                                    value={analytics.mccPaidAdsAccount}
                                    icon={<MonetizationOnIcon color="action" />}
                                    emptyText="No MCC Paid Ads account configured"
                                />

                                <BooleanField
                                    label="What Converts Call Tracking"
                                    value={analytics.whatConvertsCallTracking}
                                    icon={<PhoneCallbackIcon color="action" />}
                                />

                                <Field
                                    label="Heatmap Tracking System"
                                    value={analytics.heatmapTrackingSystem}
                                    icon={<WhatshotIcon color="action" />}
                                    emptyText="No heatmap tracking system configured"
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Conversion Tracking Section */}
                <Grid2
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    {/* <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrackChangesIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Conversion Tracking</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            
                            <List disablePadding>
                                <BooleanField 
                                    label="Form Submissions" 
                                    value={analytics.trackFormSubmissions} 
                                    icon={<TrackChangesIcon color="action" />}
                                />
                                
                                <BooleanField 
                                    label="Phone Calls" 
                                    value={analytics.trackPhoneCalls} 
                                    icon={<PhoneCallbackIcon color="action" />}
                                />
                                
                                <BooleanField 
                                    label="Ecommerce Transactions" 
                                    value={analytics.trackEcommerce} 
                                    icon={<MonetizationOnIcon color="action" />}
                                />
                            </List>
                        </CardContent>
                    </Card> */}
                </Grid2>

                {/* Reporting Preferences Section */}
                <Grid2
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <AssessmentIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Reporting Preferences
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            {/* <List disablePadding>
                                <Field 
                                    label="Reporting Frequency" 
                                    value={analytics.reportingFrequency} 
                                    icon={<AssessmentIcon color="action" />}
                                    emptyText="No reporting frequency set"
                                />
                                
                                <Field 
                                    label="Email Recipients" 
                                    value={analytics.reportingEmails} 
                                    icon={<AssessmentIcon color="action" />}
                                    emptyText="No email recipients configured"
                                />
                                
                                <Field 
                                    label="Key Metrics" 
                                    value={
                                        analytics.keyMetrics ? (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                {analytics.keyMetrics.split(',').map((metric, index) => (
                                                    <Chip key={index} label={metric.trim()} size="small" />
                                                ))}
                                            </Box>
                                        ) : null
                                    } 
                                    icon={<BarChartIcon color="action" />}
                                    emptyText="No key metrics configured"
                                />
                            </List> */}
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default AnalyticsShow;
