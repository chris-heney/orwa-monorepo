import {
    Analytics as AnalyticsIcon,
    Settings as ConfigIcon,
    ViewModule as DeckIcon,
    Menu as MenuIcon,
    MoreHoriz as MoreHorizIcon,
    StarBorder as StarBorderIcon,
    Star as StarIcon,
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Drawer,
    Fade,
    Grid2,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import {
    DeleteButton,
    EditButton,
    Show,
    SimpleShowLayout,
    TopToolbar,
    useRecordContext,
} from 'react-admin';

// Tab Configuration
const TabConfig = [
    {
        key: 'overview',
        label: 'Overview',
        shortLabel: 'Overview',
        icon: <DeckIcon />,
        component: OverviewTab,
        priority: 1,
    },
    {
        key: 'configuration',
        label: 'Configuration',
        shortLabel: 'Config',
        icon: <ConfigIcon />,
        component: ConfigurationTab,
        priority: 1,
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
        if (isMd) return 3; // Show all 3 tabs on medium and up
        return 3; // Show all tabs on large screens
    };

    return { isXs, isSm, isMd, getVisibleTabCount };
};

// Overview Tab Component
function OverviewTab() {
    const record = useRecordContext();
    const theme = useTheme();

    if (!record) return null;

    return (
        <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
                Overview of the deck configuration and current status.
            </Alert>

            {/* Deck Status Card */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar
                            sx={{
                                bgcolor: record.isDefault
                                    ? 'warning.main'
                                    : 'primary.main',
                                width: 56,
                                height: 56,
                            }}
                        >
                            {record.isDefault ? <StarIcon /> : <DeckIcon />}
                        </Avatar>
                        <Box flex={1}>
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                gutterBottom
                            >
                                {record.name}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                {record.isDefault && (
                                    <Chip
                                        label="Default Deck"
                                        color="warning"
                                        size="small"
                                        icon={<StarIcon />}
                                    />
                                )}
                                <Chip
                                    label={`${record.steps?.length || 0} steps`}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        </Box>
                    </Box>

                    {record.description && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            {record.description}
                        </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Created
                            </Typography>
                            <Typography variant="body2">
                                {record.createdAt
                                    ? new Date(
                                          record.createdAt
                                      ).toLocaleString()
                                    : 'N/A'}
                            </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Last Updated
                            </Typography>
                            <Typography variant="body2">
                                {record.updatedAt
                                    ? new Date(
                                          record.updatedAt
                                      ).toLocaleString()
                                    : 'N/A'}
                            </Typography>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>

            {/* Steps Overview */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Workflow Steps
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        The steps in this onboarding workflow:
                    </Typography>

                    <Box>
                        {record.steps?.map((step: string, index: number) => (
                            <Box
                                key={index}
                                display="flex"
                                alignItems="center"
                                gap={2}
                                sx={{
                                    p: 1,
                                    mb: 1,
                                    borderRadius: 1,
                                    backgroundColor: theme.palette.action.hover,
                                }}
                            >
                                <Chip
                                    label={index + 1}
                                    size="small"
                                    color="primary"
                                    sx={{ minWidth: 32 }}
                                />
                                <Typography variant="body2" flex={1}>
                                    {step}
                                </Typography>
                                {(step === 'Welcome' || step === 'Terms') && (
                                    <Chip
                                        label="Fixed"
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

// Configuration Tab Component
function ConfigurationTab() {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
                Detailed configuration and settings for this deck.
            </Alert>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Deck Configuration
                    </Typography>

                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Deck Name
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {record.name}
                            </Typography>

                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Description
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {record.description ||
                                    'No description provided'}
                            </Typography>
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Default Status
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                {record.isDefault ? (
                                    <Chip
                                        label="Default Deck"
                                        color="warning"
                                        icon={<StarIcon />}
                                    />
                                ) : (
                                    <Chip
                                        label="Not Default"
                                        variant="outlined"
                                        icon={<StarBorderIcon />}
                                    />
                                )}
                            </Box>

                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Total Steps
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {record.steps?.length || 0} steps
                            </Typography>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>

            {/* Metadata */}
            {record.metadata && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Metadata
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontFamily: 'monospace' }}
                        >
                            {JSON.stringify(record.metadata, null, 2)}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

// Analytics Tab Component
function AnalyticsTab() {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
                Analytics and usage information for this deck.
            </Alert>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Deck Analytics
                    </Typography>

                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Deck ID
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontFamily: 'monospace', mb: 2 }}
                            >
                                {record.id}
                            </Typography>

                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Created At
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {record.createdAt
                                    ? new Date(
                                          record.createdAt
                                      ).toLocaleString()
                                    : 'N/A'}
                            </Typography>
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Last Updated
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {record.updatedAt
                                    ? new Date(
                                          record.updatedAt
                                      ).toLocaleString()
                                    : 'N/A'}
                            </Typography>

                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Status
                            </Typography>
                            <Typography variant="body2">
                                {record.isActive !== false
                                    ? 'Active'
                                    : 'Inactive'}
                            </Typography>
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
                        Deck Sections
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

// Show actions toolbar
const DeckShowActions = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <TopToolbar>
            <EditButton
                label={isMobile ? 'Edit' : 'Edit Deck'}
                size={isMobile ? 'small' : 'medium'}
            />
            <DeleteButton
                confirmTitle="Delete Deck"
                confirmContent="Are you sure you want to delete this deck? This action cannot be undone."
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

                    {/* Sticky Actions */}
                    <Box
                        sx={{
                            p: { xs: 2, sm: 3 },
                            borderTop: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                        }}
                    >
                        <DeckShowActions />
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

const DeckShow = () => {
    return (
        <Show
            sx={{
                width: '100%',
                maxWidth: '100%',
            }}
            component={'div'}
            actions={false}
        >
            <SimpleShowLayout>
                <ShowContext />
            </SimpleShowLayout>
        </Show>
    );
};

export default DeckShow;
