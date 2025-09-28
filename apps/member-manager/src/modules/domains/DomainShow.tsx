import React, { useState } from 'react';
import {
    Show,
    TextField,
    DateField,
    ReferenceField,
    useRecordContext,
    TopToolbar,
    EditButton,
    DeleteButton,
} from 'react-admin';
import {
    Box,
    Container,
    Fade,
    Paper,
    Typography,
    Card,
    CardContent,
    Chip,
    Grid2,
    IconButton,
    Alert,
    Avatar,
    useMediaQuery,
    useTheme,
    Button,
    Divider,
    Menu,
    MenuItem,
    Tooltip,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    OpenInNew as ExternalLinkIcon,
    Dns as DnsIcon,
    Storage as ServerIcon,
    Business as OrgIcon,
    Code as TechIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    Dashboard as OverviewIcon,
    Settings as ConfigIcon,
    Analytics as AnalyticsIcon,
    MoreHoriz as MoreHorizIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';

// Import the existing section components (we'll reuse them as tab content)
import { DomainUrlField } from './components/DomainUrlField';

// Tab Configuration
const TabConfig = [
    {
        key: 'overview',
        label: 'Overview',
        shortLabel: 'Overview',
        icon: <OverviewIcon />,
        component: OverviewTab,
        priority: 1,
    },
    {
        key: 'dns',
        label: 'DNS Records',
        shortLabel: 'DNS',
        icon: <DnsIcon />,
        component: DnsRecordsTab,
        priority: 1,
    },
    {
        key: 'configuration',
        label: 'Configuration',
        shortLabel: 'Config',
        icon: <ConfigIcon />,
        component: ConfigurationTab,
        priority: 2,
    },
    {
        key: 'analytics',
        label: 'Analytics',
        shortLabel: 'Analytics',
        icon: <AnalyticsIcon />,
        component: AnalyticsTab,
        priority: 3,
    },
];

// Custom hook for responsive tab management
const useResponsiveTabs = () => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const isMd = useMediaQuery(theme.breakpoints.down('lg'));

    const getVisibleTabCount = () => {
        if (isXs) return 2; // Show only 2 tabs + overflow menu on extra small
        if (isSm) return 3; // Show 3 tabs + overflow menu on small
        if (isMd) return 4; // Show all 4 tabs on medium and up
        return 4; // Show all tabs on large screens
    };

    return { isXs, isSm, isMd, getVisibleTabCount };
};

// Overview Tab Component
function OverviewTab() {
    const record = useRecordContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        <Box>
            {/* Status Card */}
            <Card
                elevation={0}
                sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}
            >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        mb={2}
                        flexDirection={isMobile ? 'column' : 'row'}
                        textAlign={isMobile ? 'center' : 'left'}
                    >
                        <Avatar
                            sx={{
                                bgcolor: isFullyConfigured
                                    ? 'success.main'
                                    : 'warning.main',
                                width: { xs: 56, md: 72 },
                                height: { xs: 56, md: 72 },
                            }}
                        >
                            {isFullyConfigured ? (
                                <CheckIcon />
                            ) : (
                                <WarningIcon />
                            )}
                        </Avatar>
                        <Box flex={1}>
                            <Typography
                                variant={isMobile ? 'h5' : 'h4'}
                                gutterBottom
                                sx={{
                                    wordBreak: 'break-word',
                                    fontWeight: 600,
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
                                color={
                                    isFullyConfigured ? 'success' : 'warning'
                                }
                                variant="outlined"
                                size="medium"
                            />
                        </Box>
                        {record.url && (
                            <Button
                                variant="outlined"
                                startIcon={<ExternalLinkIcon />}
                                href={record.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ mt: { xs: 2, md: 0 } }}
                            >
                                Visit Site
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Configuration Grid */}
                    <Grid2 container spacing={2}>
                        {configurationItems.map((item, index) => (
                            <Grid2 size={{ xs: 6, sm: 3 }} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 2,
                                        borderRadius: 1,
                                        backgroundColor: item.value
                                            ? 'success.50'
                                            : 'grey.50',
                                        border: `1px solid ${
                                            item.value
                                                ? theme.palette.success.light
                                                : theme.palette.grey[300]
                                        }`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: item.value
                                                ? 'success.main'
                                                : 'grey.500',
                                            mb: 1,
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        textAlign="center"
                                        sx={{
                                            fontWeight: item.value ? 600 : 400,
                                            color: item.value
                                                ? 'success.dark'
                                                : 'grey.600',
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

            {/* Basic Information */}
            <Card
                elevation={0}
                sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}
            >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <TechIcon color="primary" />
                        Basic Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Domain Name
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, mb: 2 }}
                            >
                                {record.domain}
                            </Typography>

                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Website URL
                            </Typography>
                            <DomainUrlField />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Technology
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, mb: 2 }}
                            >
                                {record.technology || 'Not specified'}
                            </Typography>

                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Description
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {record.description ||
                                    'No description provided'}
                            </Typography>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>
        </Box>
    );
}

// DNS Records Tab Component
function DnsRecordsTab() {
    const record = useRecordContext();
    const theme = useTheme();

    if (!record) return null;

    const dnsRecords = record.dnsRecords || {};
    const hasRecords = Object.values(dnsRecords).some(
        records => Array.isArray(records) && records.length > 0
    );

    return (
        <Box>
            <Card
                elevation={0}
                sx={{ border: `1px solid ${theme.palette.divider}` }}
            >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <DnsIcon color="primary" />
                        DNS Records
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    {!hasRecords ? (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            No DNS records have been configured for this domain
                            yet.
                        </Alert>
                    ) : (
                        <Grid2 container spacing={3}>
                            {/* A Records */}
                            {dnsRecords.aRecords &&
                                dnsRecords.aRecords.length > 0 && (
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            sx={{ fontWeight: 600 }}
                                        >
                                            A Records
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            {dnsRecords.aRecords.map(
                                                (
                                                    record: any,
                                                    index: number
                                                ) => (
                                                    <Chip
                                                        key={index}
                                                        label={`${record.name} → ${record.value}`}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )
                                            )}
                                        </Box>
                                    </Grid2>
                                )}

                            {/* CNAME Records */}
                            {dnsRecords.cnameRecords &&
                                dnsRecords.cnameRecords.length > 0 && (
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            sx={{ fontWeight: 600 }}
                                        >
                                            CNAME Records
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            {dnsRecords.cnameRecords.map(
                                                (
                                                    record: any,
                                                    index: number
                                                ) => (
                                                    <Chip
                                                        key={index}
                                                        label={`${record.name} → ${record.value}`}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )
                                            )}
                                        </Box>
                                    </Grid2>
                                )}

                            {/* MX Records */}
                            {dnsRecords.mxRecords &&
                                dnsRecords.mxRecords.length > 0 && (
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            sx={{ fontWeight: 600 }}
                                        >
                                            MX Records
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            {dnsRecords.mxRecords.map(
                                                (
                                                    record: any,
                                                    index: number
                                                ) => (
                                                    <Chip
                                                        key={index}
                                                        label={`${record.priority} ${record.value}`}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )
                                            )}
                                        </Box>
                                    </Grid2>
                                )}

                            {/* TXT Records */}
                            {dnsRecords.txtRecords &&
                                dnsRecords.txtRecords.length > 0 && (
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            sx={{ fontWeight: 600 }}
                                        >
                                            TXT Records
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            {dnsRecords.txtRecords.map(
                                                (
                                                    record: any,
                                                    index: number
                                                ) => (
                                                    <Chip
                                                        key={index}
                                                        label={record.value}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            maxWidth: '100%',
                                                            '& .MuiChip-label':
                                                                {
                                                                    overflow:
                                                                        'hidden',
                                                                    textOverflow:
                                                                        'ellipsis',
                                                                    maxWidth:
                                                                        '200px',
                                                                },
                                                        }}
                                                    />
                                                )
                                            )}
                                        </Box>
                                    </Grid2>
                                )}
                        </Grid2>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

// Configuration Tab Component
function ConfigurationTab() {
    const record = useRecordContext();
    const theme = useTheme();

    if (!record) return null;

    return (
        <Box>
            <Grid2 container spacing={3}>
                {/* Server Configuration */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: '100%',
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <ServerIcon color="primary" />
                                Server Configuration
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        Assigned Server
                                    </Typography>
                                    {record.serverId ? (
                                        <ReferenceField
                                            source="serverId"
                                            reference="server"
                                            link="show"
                                        >
                                            <TextField source="name" />
                                        </ReferenceField>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            No server assigned
                                        </Typography>
                                    )}
                                </Box>

                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        Hosting Provider
                                    </Typography>
                                    {record.hostingProviderId ? (
                                        <ReferenceField
                                            source="hostingProviderId"
                                            reference="hosting-provider"
                                            link="show"
                                        >
                                            <TextField source="name" />
                                        </ReferenceField>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            No hosting provider assigned
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Organization Configuration */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: '100%',
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <OrgIcon color="primary" />
                                Organization
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    Associated Organization
                                </Typography>
                                {record.organizationId ? (
                                    <ReferenceField
                                        source="organizationId"
                                        reference="organization"
                                        link="show"
                                    >
                                        <TextField source="name" />
                                    </ReferenceField>
                                ) : (
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        No organization associated
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Box>
    );
}

// Analytics Tab Component
function AnalyticsTab() {
    const record = useRecordContext();
    const theme = useTheme();

    if (!record) return null;

    return (
        <Box>
            <Card
                elevation={0}
                sx={{ border: `1px solid ${theme.palette.divider}` }}
            >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <AnalyticsIcon color="primary" />
                        Domain Analytics & Metadata
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="subtitle1"
                                gutterBottom
                                sx={{ fontWeight: 600 }}
                            >
                                Tracking Information
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        Domain ID
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontFamily: 'monospace' }}
                                    >
                                        {record.id}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        Created Date
                                    </Typography>
                                    <DateField source="createdAt" showTime />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        Last Updated
                                    </Typography>
                                    <DateField source="updatedAt" showTime />
                                </Box>
                            </Box>
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="subtitle1"
                                gutterBottom
                                sx={{ fontWeight: 600 }}
                            >
                                Configuration Status
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        SSL Configuration
                                    </Typography>
                                    <Chip
                                        label={
                                            record.url?.startsWith('https://')
                                                ? 'SSL Enabled'
                                                : 'SSL Not Configured'
                                        }
                                        color={
                                            record.url?.startsWith('https://')
                                                ? 'success'
                                                : 'warning'
                                        }
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        DNS Records Count
                                    </Typography>
                                    <Typography variant="body2">
                                        {Object.values(
                                            record.dnsRecords || {}
                                        ).flat().length || 0}{' '}
                                        records configured
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>
        </Box>
    );
}

// Responsive Tab Menu Component
const ResponsiveTabMenu = ({
    tabs,
    currentTab,
    onTabChange,
    visibleCount,
}: {
    tabs: typeof TabConfig;
    currentTab: number;
    onTabChange: (index: number) => void;
    visibleCount: number;
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();

    const hiddenTabs = tabs.slice(visibleCount);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTabSelect = (index: number) => {
        onTabChange(index);
        handleMenuClose();
    };

    return (
        <>
            {hiddenTabs.length > 0 && (
                <>
                    <IconButton
                        onClick={handleMenuOpen}
                        sx={{
                            ml: 1,
                            minWidth: 40,
                            minHeight: 40,
                            borderRadius: 1,
                            backgroundColor:
                                currentTab >= visibleCount
                                    ? theme.palette.primary.main
                                    : 'transparent',
                            color:
                                currentTab >= visibleCount
                                    ? theme.palette.primary.contrastText
                                    : theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor:
                                    currentTab >= visibleCount
                                        ? theme.palette.primary.dark
                                        : theme.palette.action.hover,
                            },
                        }}
                    >
                        <MoreHorizIcon />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                maxHeight: '60vh',
                                minWidth: 180,
                                boxShadow: theme.shadows[8],
                            },
                        }}
                        transformOrigin={{
                            horizontal: 'right',
                            vertical: 'top',
                        }}
                        anchorOrigin={{
                            horizontal: 'right',
                            vertical: 'bottom',
                        }}
                    >
                        {hiddenTabs.map((tab, index) => {
                            const tabIndex = visibleCount + index;
                            return (
                                <MenuItem
                                    key={tab.key}
                                    onClick={() => handleTabSelect(tabIndex)}
                                    selected={currentTab === tabIndex}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        py: 1.5,
                                        px: 2,
                                    }}
                                >
                                    {tab.icon}
                                    <Typography variant="body2">
                                        {tab.label}
                                    </Typography>
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </>
            )}
        </>
    );
};

// Mobile Tab Navigation Component
const MobileTabNavigation = ({
    tabs,
    currentTab,
    onTabChange,
}: {
    tabs: typeof TabConfig;
    currentTab: number;
    onTabChange: (index: number) => void;
}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();

    const handleTabSelect = (index: number) => {
        onTabChange(index);
        setDrawerOpen(false);
    };

    const currentTabInfo = tabs[currentTab];

    return (
        <>
            {/* Current Tab Display */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentTabInfo.icon}
                    <Typography variant="h6" fontWeight={600}>
                        {currentTabInfo.label}
                    </Typography>
                </Box>

                <IconButton
                    onClick={() => setDrawerOpen(true)}
                    sx={{
                        backgroundColor: theme.palette.action.hover,
                        '&:hover': {
                            backgroundColor: theme.palette.action.selected,
                        },
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>

            {/* Navigation Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        backgroundColor: theme.palette.background.default,
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Domain Sections
                    </Typography>
                </Box>

                <List dense>
                    {tabs.map((tab, index) => (
                        <ListItem key={tab.key} disablePadding>
                            <ListItemButton
                                selected={currentTab === index}
                                onClick={() => handleTabSelect(index)}
                                sx={{
                                    borderRadius: 1,
                                    mx: 1,
                                    mb: 0.5,
                                    '&.Mui-selected': {
                                        backgroundColor:
                                            theme.palette.primary.main,
                                        color: theme.palette.primary
                                            .contrastText,
                                        '&:hover': {
                                            backgroundColor:
                                                theme.palette.primary.dark,
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: theme.palette.primary
                                                .contrastText,
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    {tab.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={tab.label}
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

// Custom actions toolbar
const DomainShowActions = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <TopToolbar>
            <EditButton
                label={isMobile ? 'Edit' : 'Edit Domain'}
                size={isMobile ? 'small' : 'medium'}
            />
            <DeleteButton
                confirmTitle="Delete Domain"
                confirmContent="Are you sure you want to delete this domain? This action cannot be undone."
                size={isMobile ? 'small' : 'medium'}
            />
        </TopToolbar>
    );
};

// Main Show Context Component
const ShowContext = () => {
    const theme = useTheme();
    const { isXs, getVisibleTabCount } = useResponsiveTabs();
    const [currentTab, setCurrentTab] = useState(0);

    const visibleTabCount = getVisibleTabCount();

    const handleTabChange = (newValue: number) => {
        setCurrentTab(newValue);
    };

    if (isXs) {
        // Mobile: Use drawer navigation
        return (
            <Box
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <MobileTabNavigation
                    tabs={TabConfig}
                    currentTab={currentTab}
                    onTabChange={handleTabChange}
                />

                <Box sx={{ p: 2 }}>
                    <Fade in timeout={300} key={currentTab}>
                        <Box>
                            {(() => {
                                const Component =
                                    TabConfig[currentTab].component;
                                return <Component />;
                            })()}
                        </Box>
                    </Fade>
                </Box>
            </Box>
        );
    }

    // Desktop/Tablet: Use improved tab layout
    return (
        <Container
            maxWidth={false}
            sx={{
                width: '100%',
                maxWidth: '100vw',
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 1, md: 2 },
            }}
        >
            <Fade in timeout={600}>
                <Paper
                    elevation={0}
                    sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        overflow: 'hidden',
                        width: '100%',
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    {/* Custom Tab Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            overflowX: 'auto',
                            '&::-webkit-scrollbar': {
                                height: 4,
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: theme.palette.action.hover,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: 2,
                            },
                            scrollbarWidth: 'thin',
                            scrollbarColor: `${theme.palette.primary.main} ${theme.palette.action.hover}`,
                        }}
                    >
                        {/* Visible Tabs */}
                        <Box sx={{ display: 'flex', minWidth: 'max-content' }}>
                            {TabConfig.slice(0, visibleTabCount).map(
                                (tab, index) => (
                                    <Tooltip
                                        key={tab.key}
                                        title={tab.label}
                                        arrow
                                    >
                                        <Box
                                            onClick={() =>
                                                handleTabChange(index)
                                            }
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                px: { xs: 1, sm: 1.5, md: 2 },
                                                py: { xs: 1, sm: 1.5 },
                                                minHeight: 48,
                                                cursor: 'pointer',
                                                backgroundColor:
                                                    currentTab === index
                                                        ? theme.palette.action
                                                              .selected
                                                        : 'transparent',
                                                borderBottom:
                                                    currentTab === index
                                                        ? `2px solid ${theme.palette.primary.main}`
                                                        : '2px solid transparent',
                                                color:
                                                    currentTab === index
                                                        ? theme.palette.primary
                                                              .main
                                                        : theme.palette.text
                                                              .secondary,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor:
                                                        theme.palette.action
                                                            .hover,
                                                    color: theme.palette.primary
                                                        .main,
                                                },
                                                flexShrink: 0,
                                            }}
                                        >
                                            {tab.icon}
                                            <Typography
                                                variant="body2"
                                                fontWeight={
                                                    currentTab === index
                                                        ? 600
                                                        : 500
                                                }
                                                sx={{
                                                    display: {
                                                        xs: 'none',
                                                        md: 'block',
                                                    },
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {tab.shortLabel}
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                )
                            )}
                        </Box>

                        {/* Overflow Menu */}
                        <ResponsiveTabMenu
                            tabs={TabConfig}
                            currentTab={currentTab}
                            onTabChange={handleTabChange}
                            visibleCount={visibleTabCount}
                        />
                    </Box>

                    {/* Tab Content */}
                    <Box
                        sx={{
                            p: { xs: 2, sm: 3, md: 4 },
                            width: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <Fade in timeout={300} key={currentTab}>
                            <Box>
                                {(() => {
                                    const Component =
                                        TabConfig[currentTab].component;
                                    return <Component />;
                                })()}
                            </Box>
                        </Fade>
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

const DomainShow = () => {
    return (
        <Show
            actions={<DomainShowActions />}
            sx={{
                width: '100%',
                maxWidth: '100%',
                p: 0,
            }}
            component={'div'}
        >
            <ShowContext />
        </Show>
    );
};

export default DomainShow;
