import React from 'react';
import { useRecordContext } from 'react-admin';
import {
    Typography,
    Paper,
    Box,
    Grid2,
    Divider,
    Chip,
    Avatar,
    Card,
    CardContent,
    Stack,
    useTheme,
    useMediaQuery,
    Fade,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { formatPhoneNumber } from '../form-sections/organization-contact/utils';
import { Organization } from '@ci-connect/types';

interface FieldProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, value, icon }) => {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 2 }}>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 0.5 }}
            >
                {icon && (
                    <Box sx={{ color: theme.palette.text.secondary }}>
                        {icon}
                    </Box>
                )}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    textTransform="uppercase"
                >
                    {label}
                </Typography>
            </Stack>
            <Typography variant="body1" fontWeight={500} color="text.primary">
                {value || '—'}
            </Typography>
        </Box>
    );
};

const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    color?: string;
}> = ({ icon, label, value, color = 'primary' }) => {
    const theme = useTheme();

    return (
        <Card
            variant="outlined"
            sx={{
                p: 2,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: `${color}.main`,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1,
                    boxShadow: theme.shadows[2],
                }}
            >
                {icon}
            </Box>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
        </Card>
    );
};

export const BasicDetailsShow = () => {
    const record = useRecordContext<Organization>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (!record) return null;

    // Format currency values
    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return '—';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    console.log(record);

    return (
        <Fade in timeout={600}>
            <Box>
                {/* Hero Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 4 },
                        mb: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems={{ xs: 'center', md: 'flex-start' }}
                        spacing={3}
                        textAlign={{ xs: 'center', md: 'left' }}
                    >
                        {record?.primaryLogo?.fileUrl ? (
                            <Avatar
                                src={record?.primaryLogo?.fileUrl}
                                alt={record.name}
                                sx={{
                                    width: { xs: 80, md: 120 },
                                    height: { xs: 80, md: 120 },
                                    boxShadow: theme.shadows[4],
                                    border: `3px solid ${theme.palette.background.paper}`,
                                }}
                            />
                        ) : (
                            <Avatar
                                src={record.name}
                                sx={{
                                    width: { xs: 80, md: 120 },
                                    height: { xs: 80, md: 120 },
                                    bgcolor: theme.palette.primary.main,
                                    boxShadow: theme.shadows[4],
                                    border: `3px solid ${theme.palette.background.paper}`,
                                }}
                            />
                        
                        )}
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant={isMobile ? 'h4' : 'h3'}
                                fontWeight="bold"
                                gutterBottom
                                color="text.primary"
                            >
                                {record.name}
                            </Typography>
                            <Stack
                                direction="row"
                                justifyContent={{
                                    xs: 'center',
                                    md: 'flex-start',
                                }}
                                spacing={1}
                                sx={{ mb: 2 }}
                            >
                                <Chip
                                    icon={<BusinessIcon />}
                                    label={record.organizationType}
                                    color="primary"
                                    variant="filled"
                                    sx={{
                                        fontWeight: 600,
                                        boxShadow: theme.shadows[1],
                                    }}
                                />
                                {record.industry?.name && (
                                    <Chip
                                        icon={<CategoryIcon />}
                                        label={record.industry.name}
                                        color="secondary"
                                        variant="outlined"
                                    />
                                )}
                            </Stack>
                            {record.description && (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ maxWidth: 600, mb: 1 }}
                                >
                                    {record.description}
                                </Typography>
                            )}
                            {record.tagline && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ 
                                        maxWidth: 600,
                                        fontStyle: 'italic',
                                        opacity: 0.8
                                    }}
                                >
                                    "{record.tagline}"
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                </Paper>

                {/* Stats Cards */}
                <Grid2 container spacing={2} sx={{ mb: 3 }}>
                    <Grid2 size={{ xs: 6, sm: 3 }}>
                        <StatCard
                            icon={<BusinessIcon />}
                            label="Ownership Type"
                            value={record.ownershipType || 'N/A'}
                            color="warning"
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 6, sm: 3 }}>
                        <StatCard
                            icon={<CategoryIcon />}
                            label="Lead Source"
                            value={record.leadSource || 'N/A'}
                            color="secondary"
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 6, sm: 3 }}>
                        <StatCard
                            icon={<MonetizationOnIcon />}
                            label="Annual Revenue"
                            value={formatCurrency(record.revenue)}
                            color="success"
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 6, sm: 3 }}>
                        <StatCard
                            icon={<TrendingUpIcon />}
                            label="Marketing Budget"
                            value={formatCurrency(record.marketingBudget)}
                            color="info"
                        />
                    </Grid2>
                </Grid2>

                {/* Details Grid */}
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{ mb: 3 }}
                                >
                                    <BusinessIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Organization Details
                                    </Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />

                                <Field
                                    label="Organization Type"
                                    value={record.organizationType}
                                    icon={<BusinessIcon fontSize="small" />}
                                />

                                <Field
                                    label="Ownership Type"
                                    value={record.ownershipType}
                                    icon={<BusinessIcon fontSize="small" />}
                                />

                                <Field
                                    label="Industry"
                                    value={record.industry?.name}
                                    icon={<CategoryIcon fontSize="small" />}
                                />

                                <Field
                                    label="Description"
                                    value={record.description}
                                    icon={<DescriptionIcon fontSize="small" />}
                                />

                                <Field
                                    label="Tagline"
                                    value={record.tagline}
                                    icon={<DescriptionIcon fontSize="small" />}
                                />
                            </CardContent>
                        </Card>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{ mb: 3 }}
                                >
                                    <PhoneIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Contact Information
                                    </Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />

                                <Field
                                    label="Phone"
                                    value={
                                        record.phone
                                            ? formatPhoneNumber(record.phone)
                                            : '—'
                                    }
                                    icon={<PhoneIcon fontSize="small" />}
                                />

                                <Field
                                    label="Email"
                                    value={record.email}
                                    icon={<EmailIcon fontSize="small" />}
                                />

                                <Field
                                    label="Lead Source"
                                    value={record.leadSource}
                                    icon={<BusinessIcon fontSize="small" />}
                                />
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>

                {/* Financial Data Section */}
                <Grid2 container spacing={3} sx={{ mt: 1 }}>
                    <Grid2 size={{ xs: 12 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{ mb: 3 }}
                                >
                                    <MonetizationOnIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Financial Data
                                    </Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />

                                <Grid2 container spacing={3}>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="Annual Revenue"
                                            value={formatCurrency(record.revenue)}
                                            icon={<MonetizationOnIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="Marketing Budget"
                                            value={formatCurrency(record.marketingBudget)}
                                            icon={<TrendingUpIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="SEO/AI Search Budget"
                                            value={formatCurrency(record.budgetSeoAiSearch)}
                                            icon={<TrendingUpIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="AI Conversion Tools Budget"
                                            value={formatCurrency(record.budgetAiConversionTools)}
                                            icon={<TrendingUpIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="Local Marketing Budget"
                                            value={formatCurrency(record.budgetLocalMarketing)}
                                            icon={<TrendingUpIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="Paid Advertising Budget"
                                            value={formatCurrency(record.budgetPaidAdvertising)}
                                            icon={<TrendingUpIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="LSA Budget"
                                            value={formatCurrency(record.budgetLsa)}
                                            icon={<TrendingUpIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="Social Media Organic Budget"
                                            value={formatCurrency(record.budgetSocialMediaOrganic)}
                                            icon={<TrendingUpIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="Social Media Ads Budget"
                                            value={formatCurrency(record.budgetSocialMediaAds)}
                                            icon={<TrendingUpIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="Aggregator Directory Budget"
                                            value={formatCurrency(record.budgetAggregatorDirectory)}
                                            icon={<TrendingUpIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Field
                                            label="Traditional/Other Budget"
                                            value={formatCurrency(record.budgetTraditionalOther)}
                                            icon={<TrendingUpIcon fontSize="small" />}
                                        />
                                    </Grid2>
                                </Grid2>
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
            </Box>
        </Fade>
    );
};

export default BasicDetailsShow;
