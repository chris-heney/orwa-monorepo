import {
    Box,
    Collapse,
    Container,
    Drawer,
    Fade,
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
import { Show } from 'react-admin';

// Import show section components
import { SEOShow, SocialShow } from './show-sections';
import { AnalyticsShow } from './show-sections/AnalyticsShow';
import { BasicDetailsShow } from './show-sections/BasicDetailsShow';
import { BrandShow } from './show-sections/BrandShow';
import { ContactsShow } from './show-sections/ContactsShow';
import ContentShow from './show-sections/ContentShow';
import DomainsShow from './show-sections/DomainsShow';
import { LocationsShow } from './show-sections/LocationsShow';
import PaidAdvertisingShow from './show-sections/PaidAdvertisingShow';
import ProjectDetailsShow from './show-sections/ProjectDetailsShow';
import { ServiceContractsShow } from './show-sections/ServiceContractsShow';
import { TradeServicesShow } from './show-sections/TradeServicesShow';
import { TechStacksShow } from './show-sections/TechStacksShow';
import { CortexShow } from './show-sections/CortexShow';

// Icons
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import BrushIcon from '@mui/icons-material/Brush';
import BusinessIcon from '@mui/icons-material/Business';
import CampaignIcon from '@mui/icons-material/Campaign';
import ContactsIcon from '@mui/icons-material/Contacts';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HandymanIcon from '@mui/icons-material/Handyman';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuIcon from '@mui/icons-material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import LayersIcon from '@mui/icons-material/Layers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const TabConfig = [
    {
        key: 'basic',
        label: 'Basic Details',
        shortLabel: 'Basic',
        icon: <BusinessIcon />,
        component: BasicDetailsShow,
        priority: 1,
    },
    {
        key: 'locations',
        label: 'Locations',
        shortLabel: 'Locations',
        icon: <LocationOnIcon />,
        component: LocationsShow,
        priority: 1,
    },
    {
        key: 'contacts',
        label: 'Contacts',
        shortLabel: 'Contacts',
        icon: <ContactsIcon />,
        component: ContactsShow,
        priority: 1,
    },
    {
        key: 'trades',
        label: 'Trade Services',
        shortLabel: 'Trades',
        icon: <HandymanIcon />,
        component: TradeServicesShow,
        priority: 2,
    },
    {
        key: 'techStacks',
        label: 'Tech Stacks',
        shortLabel: 'Tech',
        icon: <LayersIcon />,
        component: TechStacksShow,
        priority: 2,
    },
    {
        key: 'contracts',
        label: 'Service Contracts',
        shortLabel: 'Contracts',
        icon: <ReceiptLongIcon />,
        component: ServiceContractsShow,
        priority: 2,
    },
    {
        key: 'analytics',
        label: 'Analytics',
        shortLabel: 'Analytics',
        icon: <BarChartIcon />,
        component: AnalyticsShow,
        priority: 2,
    },
    {
        key: 'brand',
        label: 'Brand',
        shortLabel: 'Brand',
        icon: <BrushIcon />,
        component: BrandShow,
        priority: 3,
    },
    {
        key: 'content',
        label: 'Content',
        shortLabel: 'Content',
        icon: <ArticleIcon />,
        component: ContentShow,
        priority: 3,
    },
    {
        key: 'domains',
        label: 'Domains',
        shortLabel: 'Domains',
        icon: <LanguageIcon />,
        component: DomainsShow,
        priority: 3,
    },
    {
        key: 'advertising',
        label: 'Paid Advertising',
        shortLabel: 'Ads',
        icon: <CampaignIcon />,
        component: PaidAdvertisingShow,
        priority: 3,
    },
    {
        key: 'project',
        label: 'Project Details',
        shortLabel: 'Project',
        icon: <AssignmentIcon />,
        component: ProjectDetailsShow,
        priority: 3,
    },
    {
        key: 'seo',
        label: 'SEO',
        shortLabel: 'SEO',
        icon: <SearchIcon />,
        component: SEOShow,
        priority: 3,
    },
    {
        key: 'social',
        label: 'Social',
        shortLabel: 'Social',
        icon: <ShareIcon />,
        component: SocialShow,
        priority: 3,
    },
    {
        key: 'cortex',
        label: 'Cortex AI',
        shortLabel: 'Cortex',
        icon: <AutoAwesomeIcon />,
        component: CortexShow,
        priority: 3,
    },
];

// Custom hook for responsive tab management
const useResponsiveTabs = () => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const isMd = useMediaQuery(theme.breakpoints.down('lg'));
    const isLg = useMediaQuery(theme.breakpoints.down('xl'));

    // Determine how many tabs to show based on screen size
    const getVisibleTabCount = () => {
        if (isXs) return 3; // Show only 3 tabs + overflow menu on extra small
        if (isSm) return 5; // Show 5 tabs + overflow menu on small
        if (isMd) return 7; // Show 7 tabs + overflow menu on medium
        if (isLg) return 9; // Show 9 tabs + overflow menu on large
        return 11; // Show 11 tabs + overflow menu on extra large
    };

    return { isXs, isSm, isMd, isLg, getVisibleTabCount };
};

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
            {/* Overflow Menu Button */}
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
                                minWidth: 200,
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
    const [expandedGroups, setExpandedGroups] = useState<{
        [key: number]: boolean;
    }>({
        1: true, // Keep essential tabs expanded by default
    });
    const theme = useTheme();

    const groupedTabs = tabs.reduce((acc, tab, index) => {
        const priority = tab.priority;
        if (!acc[priority]) acc[priority] = [];
        acc[priority].push({ ...tab, index });
        return acc;
    }, {} as { [key: number]: Array<(typeof TabConfig)[0] & { index: number }> });

    const priorityLabels = {
        1: 'Essential',
        2: 'Business',
        3: 'Marketing',
    };

    const toggleGroup = (priority: number) => {
        setExpandedGroups(prev => ({
            ...prev,
            [priority]: !prev[priority],
        }));
    };

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
                        width: 300,
                        backgroundColor: theme.palette.background.default,
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Organization Sections
                    </Typography>
                </Box>

                <List dense>
                    {Object.entries(groupedTabs).map(
                        ([priority, groupTabs]) => (
                            <Box key={priority}>
                                <ListItemButton
                                    onClick={() =>
                                        toggleGroup(Number(priority))
                                    }
                                    sx={{
                                        backgroundColor:
                                            theme.palette.action.hover,
                                        mb: 0.5,
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            priorityLabels[
                                                Number(
                                                    priority
                                                ) as keyof typeof priorityLabels
                                            ]
                                        }
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                            variant: 'body2',
                                        }}
                                    />
                                    {expandedGroups[Number(priority)] ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )}
                                </ListItemButton>

                                <Collapse in={expandedGroups[Number(priority)]}>
                                    {groupTabs.map(tab => (
                                        <ListItem
                                            key={tab.key}
                                            disablePadding
                                            sx={{ pl: 2 }}
                                        >
                                            <ListItemButton
                                                selected={
                                                    currentTab === tab.index
                                                }
                                                onClick={() =>
                                                    handleTabSelect(tab.index)
                                                }
                                                sx={{
                                                    borderRadius: 1,
                                                    mb: 0.5,
                                                    '&.Mui-selected': {
                                                        backgroundColor:
                                                            theme.palette
                                                                .primary.main,
                                                        color: theme.palette
                                                            .primary
                                                            .contrastText,
                                                        '&:hover': {
                                                            backgroundColor:
                                                                theme.palette
                                                                    .primary
                                                                    .dark,
                                                        },
                                                        '& .MuiListItemIcon-root':
                                                            {
                                                                color: theme
                                                                    .palette
                                                                    .primary
                                                                    .contrastText,
                                                            },
                                                    },
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{ minWidth: 36 }}
                                                >
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
                                </Collapse>
                            </Box>
                        )
                    )}
                </List>
            </Drawer>
        </>
    );
};

const ShowContext = () => {
    const theme = useTheme();
    const { isXs, getVisibleTabCount } = useResponsiveTabs();
    const [currentTab, setCurrentTab] = useState(0);

    const visibleTabCount = getVisibleTabCount();

    // Custom tab change handler for our responsive system
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

const OrganizationShow = (props: any) => (
    <Show
        component="div"
        queryOptions={{
            meta: {
                populate: [
                    'organizationContact.contact',
                    'projectDetails',
                    'organizationLocations.location.city',
                    'trades',
                    'services',
                    'industry',
                    'organizationServiceContract.items',
                    'organizationAssets.asset',
                    'primaryLogo',
                    'secondaryLogo',
                    'authorHeadshot',
                ],
                raw: true,
            },
        }}
        {...props}
    >
        <ShowContext />
    </Show>
);

export default OrganizationShow;
