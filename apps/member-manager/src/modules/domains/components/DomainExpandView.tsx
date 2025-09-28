import {
    CheckCircle as CheckIcon,
    Dns as DnsIcon,
    OpenInNew as ExternalLinkIcon,
    Business as OrgIcon,
    Storage as ServerIcon,
    Code as TechIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Grid2,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React from 'react';
import {
    DateField,
    ReferenceField,
    TextField,
    useRecordContext,
} from 'react-admin';
import { DomainUrlField } from './DomainUrlField';

// Domain status card for expand view
const DomainExpandStatusCard = () => {
    const record = useRecordContext();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    if (!record) return null;

    const hasUrl = Boolean(record.url);
    const hasTechnology = Boolean(record.technology);
    const hasServer = Boolean(record.serverId);
    const hasOrganization = Boolean(record.organizationId);

    const configurationItems = [
        { label: 'URL Configured', value: hasUrl, icon: <ExternalLinkIcon /> },
        { label: 'Technology Set', value: hasTechnology, icon: <TechIcon /> },
        { label: 'Server Assigned', value: hasServer, icon: <ServerIcon /> },
        {
            label: 'Organization Linked',
            value: hasOrganization,
            icon: <OrgIcon />,
        },
    ];

    const configuredCount = configurationItems.filter(
        item => item.value
    ).length;
    const isFullyConfigured = configuredCount === configurationItems.length;

    return (
        <Card elevation={1} sx={{ mb: 2 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={2}
                    flexDirection={isSmall ? 'column' : 'row'}
                    textAlign={isSmall ? 'center' : 'left'}
                >
                    <Avatar
                        sx={{
                            bgcolor: isFullyConfigured
                                ? 'success.main'
                                : 'warning.main',
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 },
                        }}
                    >
                        {isFullyConfigured ? <CheckIcon /> : <WarningIcon />}
                    </Avatar>
                    <Box flex={1}>
                        <Typography
                            variant={isSmall ? 'subtitle1' : 'h6'}
                            gutterBottom
                            sx={{
                                wordBreak: 'break-word',
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                            }}
                        >
                            {record.domain}
                        </Typography>
                        <Chip
                            label={
                                isFullyConfigured
                                    ? 'Fully Configured'
                                    : `${configuredCount}/4 Configured`
                            }
                            color={isFullyConfigured ? 'success' : 'warning'}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                    {record.url && (
                        <IconButton
                            onClick={() => window.open(record.url, '_blank')}
                            sx={{
                                ml: { xs: 0, sm: 'auto' },
                                mt: { xs: 1, sm: 0 },
                            }}
                            color="primary"
                            size="small"
                        >
                            <ExternalLinkIcon />
                        </IconButton>
                    )}
                </Box>

                <Grid2 container spacing={{ xs: 1, sm: 2 }}>
                    {configurationItems.map((item, index) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                p={1}
                                borderRadius={1}
                                sx={{
                                    bgcolor: item.value
                                        ? 'success.50'
                                        : 'grey.50',
                                    border: '1px solid',
                                    borderColor: item.value
                                        ? 'success.200'
                                        : 'grey.200',
                                }}
                            >
                                {React.cloneElement(item.icon, {
                                    color: item.value ? 'success' : 'disabled',
                                    fontSize: 'small',
                                })}
                                <Typography
                                    variant="body2"
                                    color={
                                        item.value
                                            ? 'text.primary'
                                            : 'text.disabled'
                                    }
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </Box>
                        </Grid2>
                    ))}
                </Grid2>
            </CardContent>
        </Card>
    );
};

// DNS Records section for expand view
const DomainExpandDnsSection = () => {
    const record = useRecordContext();

    if (!record) return null;

    const dnsRecordTypes = [
        {
            type: 'A Records',
            key: 'aRecords',
            description: 'IP Address mappings',
        },
        {
            type: 'CNAME Records',
            key: 'cnameRecords',
            description: 'Domain aliases',
        },
        {
            type: 'MX Records',
            key: 'mxRecords',
            description: 'Mail server routing',
        },
        {
            type: 'TXT Records',
            key: 'txtRecords',
            description: 'Text verification records',
        },
        {
            type: 'NS Records',
            key: 'nsRecords',
            description: 'Name server records',
        },
    ];

    const totalRecords = dnsRecordTypes.reduce((sum, type) => {
        return sum + (record[type.key]?.length || 0);
    }, 0);

    return (
        <Card elevation={1} sx={{ mb: 2 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <DnsIcon color="primary" fontSize="small" />
                    <Typography
                        variant="h6"
                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                        DNS Records ({totalRecords} total)
                    </Typography>
                </Box>

                {totalRecords === 0 ? (
                    <Alert
                        severity="info"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                        No DNS records configured for this domain.
                    </Alert>
                ) : (
                    <Grid2 container spacing={{ xs: 1, sm: 2 }}>
                        {dnsRecordTypes.map(type => {
                            const records = record[type.key] || [];

                            return (
                                <Grid2 size={{ xs: 12, md: 6 }} key={type.key}>
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                            sx={{
                                                fontSize: {
                                                    xs: '0.85rem',
                                                    sm: '0.875rem',
                                                },
                                                fontWeight: 'medium',
                                            }}
                                        >
                                            {type.type} ({records.length})
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            display="block"
                                            mb={1}
                                            sx={{
                                                fontSize: {
                                                    xs: '0.7rem',
                                                    sm: '0.75rem',
                                                },
                                            }}
                                        >
                                            {type.description}
                                        </Typography>

                                        {records.length > 0 ? (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 0.5,
                                                }}
                                            >
                                                {records.map(
                                                    (
                                                        record: string,
                                                        index: number
                                                    ) => (
                                                        <Chip
                                                            key={index}
                                                            label={record}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                fontSize: {
                                                                    xs: '0.65rem',
                                                                    sm: '0.75rem',
                                                                },
                                                                fontFamily:
                                                                    'monospace',
                                                            }}
                                                        />
                                                    )
                                                )}
                                            </Box>
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{
                                                    fontSize: {
                                                        xs: '0.75rem',
                                                        sm: '0.875rem',
                                                    },
                                                }}
                                            >
                                                No {type.type.toLowerCase()}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid2>
                            );
                        })}
                    </Grid2>
                )}
            </CardContent>
        </Card>
    );
};

// Basic information section for expand view
const DomainExpandBasicInfo = () => {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Card elevation={1} sx={{ mb: 2 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                    Basic Information
                </Typography>

                <Grid2 container spacing={{ xs: 1, sm: 2 }}>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                            Domain Name
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                wordBreak: 'break-word',
                                fontSize: { xs: '0.85rem', sm: '1rem' },
                            }}
                        >
                            {record.domain}
                        </Typography>
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                            Website URL
                        </Typography>
                        <DomainUrlField />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                            Technology
                        </Typography>
                        {record.technology ? (
                            <Chip
                                label={record.technology}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        ) : (
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                }}
                            >
                                Not specified
                            </Typography>
                        )}
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                            Last Updated
                        </Typography>
                        <DateField source="updatedAt" showTime={false} />
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );
};

// Relationships section for expand view
const DomainExpandRelationships = () => {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Card elevation={1}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                    Relationships
                </Typography>

                <Grid2 container spacing={{ xs: 1, sm: 2 }}>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                            Hosting Provider
                        </Typography>
                        <ReferenceField
                            source="hostingProviderId"
                            reference="hosting-provider"
                            link={false}
                        >
                            <TextField source="name" />
                        </ReferenceField>
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                            Organization
                        </Typography>
                        {record.organizationId ? (
                            <ReferenceField
                                source="organizationId"
                                reference="organization"
                                link={false}
                            >
                                <TextField source="name" />
                            </ReferenceField>
                        ) : (
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                }}
                            >
                                Not associated
                            </Typography>
                        )}
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );
};

export const DomainExpandView = () => {
    return (
        <Box
            sx={{
                p: { xs: 1, sm: 2 },
                width: '100%',
                maxWidth: '100%',
            }}
        >
            <DomainExpandStatusCard />
            <DomainExpandBasicInfo />
            <DomainExpandDnsSection />
            <DomainExpandRelationships />
        </Box>
    );
};
