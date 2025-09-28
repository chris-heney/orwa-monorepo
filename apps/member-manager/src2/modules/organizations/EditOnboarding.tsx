import { Organization } from '@ci-connect/types';
import {
    Avatar,
    Box,
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
import {
    Edit,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRecordContext,
    useRefresh,
} from 'react-admin';
import { FieldValues } from 'react-hook-form';

// Import tab components
import PaidAdvertisingTab from './form-sections/advertising/PaidAdvertisingTab';
import AnalyticsTab from './form-sections/analytics/AnalyticsTab';
import BasicDetailsTab from './form-sections/basic-details/BasicDetailsTab';
import BrandTab from './form-sections/brand/BrandTab';
import ContentTab from './form-sections/content/ContentTab';
import DomainsTab from './form-sections/domains/DomainsTab';
import OrganizationLocationsTab from './form-sections/location/OrganizationLocationsTab';
import OrganizationContactsTab from './form-sections/organization-contact/OrganizationContactsTab';
import ProjectDetailsTab from './form-sections/project-details/ProjectDetailsTab';
import SeoTab from './form-sections/seo/SeoTab';
import ServiceContractsTab from './form-sections/service-contracts/ServiceContractsTab';
import SocialTab from './form-sections/social/SocialTab';
import TechStacksTab from './form-sections/tech-stacks/TechStacksTab';
import TradeServicesTab from './form-sections/trade-service/TradeServicesTab';
import CortexTab from './form-sections/cortex/CortexTab';
import CortexLocalTab from './form-sections/cortex-local/CortexLocalTab';
import ReviewManagementTab from './form-sections/review-management/ReviewManagementTab';
import PromotionsTab from './form-sections/promotions/PromotionsTab';
import OwnershipQuestionsTab from './form-sections/ownership-questions/OwnershipQuestionsTab';

// Import utilities
import { updateRecord } from '../../_utils';
import { cleanRecord, removeNullValues } from './utils';

// Icons
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BrushIcon from '@mui/icons-material/Brush';
import BusinessIcon from '@mui/icons-material/Business';
import CampaignIcon from '@mui/icons-material/Campaign';
import ContactsIcon from '@mui/icons-material/Contacts';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import EditIcon from '@mui/icons-material/Edit';
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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RateReviewIcon from '@mui/icons-material/RateReview';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CortexPulseTab from './form-sections/cortex-pulse/CortexPulseTab';

const TabConfig = [
    {
        key: 'basic',
        label: 'Basic Details',
        shortLabel: 'Basic',
        icon: <BusinessIcon />,
        component: BasicDetailsTab,
        priority: 1,
    },
    {
        key: 'locations',
        label: 'Locations',
        shortLabel: 'Locations',
        icon: <LocationOnIcon />,
        component: OrganizationLocationsTab,
        priority: 1,
    },
    {
        key: 'contacts',
        label: 'Contacts',
        shortLabel: 'Contacts',
        icon: <ContactsIcon />,
        component: OrganizationContactsTab,
        priority: 1,
    },
    {
        key: 'analytics',
        label: 'Analytics',
        shortLabel: 'Analytics',
        icon: <AnalyticsIcon />,
        component: AnalyticsTab,
        priority: 2,
    },
    {
        key: 'brand',
        label: 'Brand',
        shortLabel: 'Brand',
        icon: <BrushIcon />,
        component: BrandTab,
        priority: 2,
    },
    {
        key: 'content',
        label: 'Content',
        shortLabel: 'Content',
        icon: <ArticleIcon />,
        component: ContentTab,
        priority: 2,
    },
    {
        key: 'advertising',
        label: 'Paid Advertising',
        shortLabel: 'Ads',
        icon: <CampaignIcon />,
        component: PaidAdvertisingTab,
        priority: 3,
    },
    {
        key: 'seo',
        label: 'SEO',
        shortLabel: 'SEO',
        icon: <SearchIcon />,
        component: SeoTab,
        priority: 3,
    },
    {
        key: 'social',
        label: 'Social',
        shortLabel: 'Social',
        icon: <ShareIcon />,
        component: SocialTab,
        priority: 3,
    },
    {
        key: 'project',
        label: 'Project Details',
        shortLabel: 'Project',
        icon: <AssignmentIcon />,
        component: ProjectDetailsTab,
        priority: 3,
    },
    {
        key: 'domains',
        label: 'Domains',
        shortLabel: 'Domains',
        icon: <LanguageIcon />,
        component: DomainsTab,
        priority: 3,
    },
    {
        key: 'trades',
        label: 'Trade Services',
        shortLabel: 'Trades',
        icon: <HandymanIcon />,
        component: TradeServicesTab,
        priority: 3,
    },
    {
        key: 'contracts',
        label: 'Service Contracts',
        shortLabel: 'Contracts',
        icon: <ReceiptLongIcon />,
        component: ServiceContractsTab,
        priority: 3,
    },
    {
        key: 'techStacks',
        label: 'Tech Stacks',
        shortLabel: 'Tech',
        icon: <DeveloperModeIcon />,
        component: TechStacksTab,
        priority: 3,
    },
    {
        key: 'cortex',
        label: 'Cortex AI',
        shortLabel: 'Cortex',
        icon: <AutoAwesomeIcon />,
        component: CortexTab,
        priority: 3,
    },
    {
        key: 'cortexLocal',
        label: 'Cortex Local',
        shortLabel: 'Local',
        icon: <LocationOnIcon />,
        component: CortexLocalTab,
        priority: 3,
    },
    {
        key: 'cortexPulse',
        label: 'Cortex Pulse',
        shortLabel: 'Pulse',
        icon: <TrendingUpIcon />,
        component: CortexPulseTab,
        priority: 3,
    },
    {
        key: 'reviewManagement',
        label: 'Review Management',
        shortLabel: 'Reviews',
        icon: <RateReviewIcon />,
        component: ReviewManagementTab,
        priority: 3,
    },
    {
        key: 'promotions',
        label: 'Promotions',
        shortLabel: 'Promos',
        icon: <LocalOfferIcon />,
        component: PromotionsTab,
        priority: 3,
    },
    {
        key: 'ownershipQuestions',
        label: 'Ownership Questions',
        shortLabel: 'Ownership',
        icon: <BusinessIcon />,
        component: OwnershipQuestionsTab,
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
        return 12; // Show 12 tabs + overflow menu on extra large
    };

    return { isXs, isSm, isMd, isLg, getVisibleTabCount };
};

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

                                <Box
                                    sx={{
                                        maxHeight: expandedGroups[
                                            Number(priority)
                                        ]
                                            ? '500px'
                                            : '0px',
                                        overflow: 'hidden',
                                        transition: 'max-height 0.3s ease',
                                    }}
                                >
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
                                </Box>
                            </Box>
                        )
                    )}
                </List>
            </Drawer>
        </>
    );
};

const EditContext = (props: any) => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const theme = useTheme();
    const { isXs, getVisibleTabCount } = useResponsiveTabs();
    const [currentTab, setCurrentTab] = useState(0);

    const visibleTabCount = getVisibleTabCount();

    if (!record) {
        return null;
    }

    const handleSubmit = (formData: FieldValues) => {
        // Remove specific fields we don't want to send
        const { industry, ...dataWithoutExcluded } = formData;

        // Remove all null values and clean the data
        const dataToSubmit = removeNullValues(
            cleanRecord(dataWithoutExcluded as Organization)
        );

        return updateRecord(
            dataToSubmit,
            record,
            dataProvider,
            notify,
            refresh,
            'organization'
        );
    };

    const handleTabChange = (newValue: number) => {
        setCurrentTab(newValue);
    };

    const CurrentTabComponent = TabConfig[currentTab]?.component;

    if (isXs) {
        // Mobile: Use drawer navigation with form fields
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

                <SimpleForm
                    onSubmit={handleSubmit}
                    sx={{
                        '& .RaSimpleForm-content': {
                            p: 2,
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    <Fade in timeout={300}>
                        <Box sx={{ width: '100%' }}>
                            {CurrentTabComponent && <CurrentTabComponent />}
                        </Box>
                    </Fade>
                </SimpleForm>
            </Box>
        );
    }

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
                    {/* Organization Header */}
                    <Box
                        sx={{
                            p: { xs: 2, md: 3 },
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    width: { xs: 48, md: 56 },
                                    height: { xs: 48, md: 56 },
                                }}
                            >
                                <EditIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight={600}>
                                    Edit {record.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    Manage your organization's information and
                                    settings
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Custom Tab Header with Overflow Menu */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
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
                        <Box
                            sx={{
                                display: 'flex',
                                minWidth: 'max-content',
                            }}
                        >
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
                                                px: {
                                                    xs: 1,
                                                    sm: 1.5,
                                                    md: 2,
                                                },
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

                    {/* Form Content */}
                    <SimpleForm
                        onSubmit={handleSubmit}
                        sx={{
                            width: '100%',
                            maxWidth: '100%',
                            '& .RaSimpleForm-content': {
                                p: { xs: 2, sm: 3, md: 4 },
                                backgroundColor: 'transparent',
                                borderRadius: 0,
                                boxShadow: 'none',
                                minHeight: 'calc(100vh - 300px)',
                                '& .MuiBox-root': {
                                    maxWidth: '100%',
                                },
                            },
                        }}
                    >
                        <Fade in timeout={300}>
                            <Box sx={{ width: '100%' }}>
                                {CurrentTabComponent && <CurrentTabComponent />}
                            </Box>
                        </Fade>
                    </SimpleForm>
                </Paper>
            </Fade>
        </Container>
    );
};

const OrganizationEdit = (props: any) => (
    <Edit
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
                    'organizationAssets',
                    'organizationPrivateEquity',
                    'organizationFranchise',
                    'platforms',
                    'organizationBrand',
                ],
                raw: true,
            },
        }}
        sx={{
            width: '100%',
            maxWidth: '100%',
        }}
        {...props}
    >
        <EditContext />
    </Edit>
);

export default OrganizationEdit;
