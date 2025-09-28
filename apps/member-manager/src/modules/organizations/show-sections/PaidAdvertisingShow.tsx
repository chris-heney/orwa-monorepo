import { Organization, OrganizationPaidAdvertising } from '@ci-connect/types';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CampaignIcon from '@mui/icons-material/Campaign';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PaidIcon from '@mui/icons-material/Paid';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import WebIcon from '@mui/icons-material/Web';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid2,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

// Field component for advertising attributes
const AdField = ({
    label,
    value,
}: {
    label: string;
    value?: string | number | boolean | null;
}) => (
    <ListItem disableGutters sx={{ mb: 1 }}>
        <ListItemText
            primary={label}
            secondary={
                typeof value === 'boolean'
                    ? value
                        ? 'Yes'
                        : 'No'
                    : value || '—'
            }
            primaryTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
            }}
            secondaryTypographyProps={{ variant: 'body1' }}
        />
    </ListItem>
);

export const PaidAdvertisingShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const paidAdvertising =
        (record as any).paidAdvertising || ({} as OrganizationPaidAdvertising);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CampaignIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Paid Advertising</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid2 container spacing={3}>
                {/* Current Campaigns */}
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
                                <CampaignIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Current Campaigns
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <AdField
                                    label="Current Ad Campaigns"
                                    value={paidAdvertising.currentAdCampaigns}
                                />

                                <AdField
                                    label="Ad Platforms"
                                    value={paidAdvertising.adPlatforms
                                        ?.map((platform: any) => platform.name)
                                        .join(', ')}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Budget & Goals */}
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
                                <PaidIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Budget & Goals
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <AdField
                                    label="Monthly Ad Spend"
                                    value={
                                        paidAdvertising.monthlyAdSpend
                                            ? `$${paidAdvertising.monthlyAdSpend}`
                                            : '—'
                                    }
                                />

                                <AdField
                                    label="Ad Primary Goals"
                                    value={paidAdvertising.adPrimaryGoals}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Competitor Ads */}
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
                                <CompareArrowsIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Competitor Ads
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <ListItem disableGutters>
                                    <ListItemText
                                        primary="Competitor Ads"
                                        secondary={
                                            paidAdvertising.competitorAds &&
                                            paidAdvertising.competitorAds
                                                .length > 0 ? (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 1,
                                                        mt: 1,
                                                    }}
                                                >
                                                    {paidAdvertising.competitorAds.map(
                                                        (
                                                            ad: string,
                                                            index: number
                                                        ) => (
                                                            <Chip
                                                                key={index}
                                                                label={ad}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        )
                                                    )}
                                                </Box>
                                            ) : (
                                                '—'
                                            )
                                        }
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            color: 'textSecondary',
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Landing Pages & Retargeting */}
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
                                <WebIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Landing Pages & Retargeting
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <AdField
                                    label="Has Landing Pages"
                                    value={paidAdvertising.hasLandingPages}
                                />

                                <AdField
                                    label="Need Retargeting"
                                    value={paidAdvertising.needRetargeting}
                                />

                                <AdField
                                    label="Ad Copy Needs"
                                    value={paidAdvertising.adCopyNeeds}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Ad Credentials */}
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
                                <VpnKeyIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Ad Account Credentials
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <AdField
                                    label="Google Ads Credentials"
                                    value={paidAdvertising.googleAdsCredentials}
                                />

                                <AdField
                                    label="Meta Business Manager Credentials"
                                    value={
                                        paidAdvertising.metaBusinessManagerCredentials
                                    }
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Performance Metrics */}
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
                                    Performance Metrics
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <AdField
                                    label="Performance KPIs"
                                    value={paidAdvertising.performanceKpis}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default PaidAdvertisingShow;
