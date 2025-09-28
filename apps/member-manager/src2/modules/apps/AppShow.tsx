import {
    QueryStats as AnalyticsIcon,
    Settings as ConfigIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    OpenInNew as ExternalLinkIcon,
    Visibility as OverviewIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import {
    BooleanField,
    DateField,
    Show,
    SimpleShowLayout,
    useRecordContext,
    useRedirect,
} from 'react-admin';
import { AppCategoryField } from './components/AppCategoryField';
import { AppIconField } from './components/AppIconField';
import { AppStatusField } from './components/AppStatusField';
import { AppUrlField } from './components/AppUrlField';
import MobileTabNavigation from './components/MobileTabNavigation';

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
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const [currentTab, setCurrentTab] = useState(0);

    // Calculate how many tabs can be displayed based on screen size
    const visibleTabCount = isSmall ? 2 : TabConfig.length;

    // Sort tabs by priority
    const sortedTabs = [...TabConfig].sort((a, b) => a.priority - b.priority);

    // Get visible tabs
    const visibleTabs = sortedTabs.slice(0, visibleTabCount);

    return {
        currentTab,
        setCurrentTab,
        visibleTabs,
        isSmall,
        visibleTabCount,
        allTabs: sortedTabs,
    };
};

// App Header Component
const AppHeader = () => {
    const record = useRecordContext();
    const theme = useTheme();
    const redirect = useRedirect();

    if (!record) return null;

    return (
        <Card sx={{ mb: 3, overflow: 'visible' }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor:
                                        record.color ||
                                        theme.palette.primary.main,
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: { xs: 40, sm: 56 },
                                    height: { xs: 40, sm: 56 },
                                    fontSize: { xs: '24px', sm: '32px' },
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                }}
                            >
                                <AppIconField record={record} size="large" />
                            </Box>

                            <Stack>
                                <Typography variant="h5" component="h1">
                                    {record.name}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 0.5,
                                        gap: 1,
                                    }}
                                >
                                    <AppCategoryField />
                                    {record.isActive ? (
                                        <Chip
                                            size="small"
                                            color="success"
                                            label="Active"
                                        />
                                    ) : (
                                        <Chip
                                            size="small"
                                            color="default"
                                            label="Inactive"
                                        />
                                    )}
                                </Box>
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Stack
                            direction={{ xs: 'row', sm: 'column' }}
                            spacing={1}
                            justifyContent={{ xs: 'flex-start', sm: 'center' }}
                            alignItems={{ xs: 'center', sm: 'flex-end' }}
                            height="100%"
                        >
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() =>
                                    redirect('edit', 'app', record.id)
                                }
                                size="small"
                            >
                                Edit
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<ExternalLinkIcon />}
                                href={record.url}
                                target="_blank"
                                size="small"
                            >
                                Open App
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

// Overview Tab Component
function OverviewTab() {
    const record = useRecordContext();
    const theme = useTheme();

    if (!record) return null;

    return (
        <Box p={2}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Description
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {record.description || 'No description provided.'}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>
                            Details
                        </Typography>
                        <Stack spacing={2}>
                            <Box display="flex">
                                <Typography
                                    variant="body2"
                                    sx={{ minWidth: 120 }}
                                    color="textSecondary"
                                >
                                    URL:
                                </Typography>
                                <AppUrlField />
                            </Box>
                            <Box display="flex">
                                <Typography
                                    variant="body2"
                                    sx={{ minWidth: 120 }}
                                    color="textSecondary"
                                >
                                    Category:
                                </Typography>
                                <AppCategoryField />
                            </Box>
                            <Box display="flex">
                                <Typography
                                    variant="body2"
                                    sx={{ minWidth: 120 }}
                                    color="textSecondary"
                                >
                                    Created:
                                </Typography>
                                <DateField source="createdAt" showTime />
                            </Box>
                            <Box display="flex">
                                <Typography
                                    variant="body2"
                                    sx={{ minWidth: 120 }}
                                    color="textSecondary"
                                >
                                    Last Updated:
                                </Typography>
                                <DateField source="updatedAt" showTime />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Status
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    Active Status
                                </Typography>
                                <BooleanField
                                    source="isActive"
                                    valueLabelTrue="Active"
                                    valueLabelFalse="Inactive"
                                    color="success"
                                />
                            </Box>

                            <Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    Configuration Status
                                </Typography>
                                <AppStatusField showDetails />
                            </Box>

                            <Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    Display Order
                                </Typography>
                                <Typography>
                                    {record.order || 'Not set'}
                                </Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    Actions
                                </Typography>
                                <Stack spacing={1} mt={1}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        fullWidth
                                        size="small"
                                        sx={{ justifyContent: 'flex-start' }}
                                        onClick={() =>
                                            (window.location.href = `#/app/${record.id}`)
                                        }
                                    >
                                        Edit App
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        fullWidth
                                        size="small"
                                        sx={{ justifyContent: 'flex-start' }}
                                    >
                                        Delete App
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

// Configuration Tab Component
function ConfigurationTab() {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Box p={2}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            App Configuration
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    App Icon
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: record.color || 'primary.main',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        width: 48,
                                        height: 48,
                                    }}
                                >
                                    <AppIconField
                                        record={record}
                                        size="medium"
                                    />
                                </Box>
                            </Box>

                            <Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    App Color
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            bgcolor:
                                                record.color || 'primary.main',
                                            borderRadius: '4px',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    />
                                    <Typography>
                                        {record.color || 'Default'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Integration Settings
                        </Typography>
                        <Box>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                gutterBottom
                            >
                                API Key
                            </Typography>
                            <Typography>
                                {record.apiKey
                                    ? '••••••••••••••••'
                                    : 'Not configured'}
                            </Typography>
                        </Box>

                        <Box mt={2}>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Authentication Required
                            </Typography>
                            <BooleanField
                                source="requiresAuth"
                                valueLabelTrue="Yes"
                                valueLabelFalse="No"
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

// Analytics Tab Component
function AnalyticsTab() {
    return (
        <Box p={2}>
            <Paper
                variant="outlined"
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: 300,
                }}
            >
                <AnalyticsIcon
                    sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
                />
                <Typography variant="h6">Analytics Coming Soon</Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>
                    User activity, usage statistics and performance metrics will
                    be available in a future update.
                </Typography>
            </Paper>
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
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Tabs
            value={currentTab}
            onChange={(_, value) => onTabChange(value)}
            variant={isSmall ? 'fullWidth' : 'standard'}
            sx={{
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            {tabs.map((tab, index) => (
                <Tab
                    key={tab.key}
                    label={isSmall ? tab.shortLabel : tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                    sx={{
                        minHeight: isSmall ? 48 : 72,
                        display: index < visibleCount ? 'flex' : 'none',
                    }}
                />
            ))}
        </Tabs>
    );
};

// We're using MobileTabNavigation from a separate component file

// Main Show Component
const AppShow = () => {
    const {
        currentTab,
        setCurrentTab,
        visibleTabs,
        isSmall,
        visibleTabCount,
        allTabs,
    } = useResponsiveTabs();

    const TabContent = allTabs[currentTab].component;

    return (
        <Show
            sx={{
                width: '100%',
                maxWidth: '100%',
                p: 0,
            }}
            component={'div'}
            actions={false}
        >
            <SimpleShowLayout
                sx={{
                    width: '100%',
                    maxWidth: '100%',
                    p: 0,
                }}
            >
                <AppHeader />

                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {isSmall ? (
                        <MobileTabNavigation
                            tabs={allTabs}
                            currentTab={currentTab}
                            onTabChange={setCurrentTab}
                        />
                    ) : (
                        <ResponsiveTabMenu
                            tabs={allTabs}
                            currentTab={currentTab}
                            onTabChange={setCurrentTab}
                            visibleCount={visibleTabCount}
                        />
                    )}

                    <Box>
                        <TabContent />
                    </Box>
                </Box>
            </SimpleShowLayout>
        </Show>
    );
};

export default AppShow;
