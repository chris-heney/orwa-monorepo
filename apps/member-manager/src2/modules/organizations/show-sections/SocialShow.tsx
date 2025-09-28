import { Organization, OrganizationSocial } from '@ci-connect/types';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CampaignIcon from '@mui/icons-material/Campaign';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

// Field component for social media attributes
const SocialField = ({
    label,
    value,
}: {
    label: string;
    value?: string | boolean | null;
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

export const SocialShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const social = (record as any).social || ({} as OrganizationSocial);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShareIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Social Media</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                {/* Social Media Presence */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <ShareIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Social Media Platforms
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <SocialField
                                    label="Social Media Presence"
                                    value={social.socialMediaPresence
                                        ?.map((platform: any) => platform.name)
                                        .join(', ')}
                                />

                                <SocialField
                                    label="Social Media Content Types"
                                    value={social.socialMediaContentTypes
                                        ?.map(
                                            (contentType: any) =>
                                                contentType.name
                                        )
                                        .join(', ')}
                                />

                                <SocialField
                                    label="Ideal Social Media Audience"
                                    value={social.idealSocialMediaAudience}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Social Strategy */}
                <Grid item xs={12} md={6} lg={4}>
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
                                    Social Strategy
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <SocialField
                                    label="Has Social Media Strategy"
                                    value={social.hasSocialMediaStrategy}
                                />

                                <SocialField
                                    label="Social Media Brand Voice"
                                    value={social.socialMediaBrandVoice}
                                />

                                <SocialField
                                    label="Need Social Media Advertising"
                                    value={social.needSocialMediaAdvertising}
                                />

                                <SocialField
                                    label="CRM for Leads"
                                    value={social.crmForLeads}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Posting Frequency */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <CalendarMonthIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Posting Frequency
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <SocialField
                                    label="Posting Frequency"
                                    value={social.postingFrequency}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Google Business Profile */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Google Business Profile
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <SocialField
                                    label="GBP Claimed"
                                    value={social.gbpClaimed}
                                />

                                <SocialField
                                    label="Google Reviews"
                                    value={social.googleReviews}
                                />

                                <SocialField
                                    label="Need GBP Optimization"
                                    value={social.needGbpOptimization}
                                />

                                <SocialField
                                    label="GBP Post Strategy"
                                    value={social.gbpPostStrategy}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Reputation Management */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <StarIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Reputation Management
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <SocialField
                                    label="Citations Checked"
                                    value={social.citationsChecked}
                                />

                                <SocialField
                                    label="Need Reputation Management"
                                    value={social.needReputationManagement}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default SocialShow;
