import {
    Add as AddIcon,
    Settings as ConfigIcon,
    Dns as DnsIcon,
    Domain as DomainIcon,
    Info as InfoIcon,
    Menu as MenuIcon,
    MoreHoriz as MoreHorizIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
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
    ArrayInput,
    AutocompleteInput,
    DeleteButton,
    ReferenceInput,
    SaveButton,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    Toolbar,
    useDataProvider,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';

import { CreateHostingProviderModal, CreateServerModal } from '../../../_components';
import { FormSection } from '../../../_components/FormSection';
import { validateModelField } from '../../../_utils/validateModelName';
import { DnsHelpDialog } from './DnsHelpDialog';
import { validateUrl } from '../utils/utils';
import { required } from 'react-admin';

// Tab Configuration
const TabConfig = [
    {
        key: 'basic',
        label: 'Basic Information',
        shortLabel: 'Basic',
        icon: <DomainIcon />,
        component: BasicInformationTab,
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
        key: 'dns',
        label: 'DNS Records',
        shortLabel: 'DNS',
        icon: <DnsIcon />,
        component: DnsRecordsTab,
        priority: 2,
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

// Basic Information Tab Component
function BasicInformationTab() {
    const { getValues } = useFormContext();

    const dataProvider = useDataProvider();

    return (
        <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
                Configure the basic domain information and website details.
            </Alert>

            <FormSection title="Domain Details" icon={<DomainIcon />}>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextInput
                            source="domain"
                            label="Domain Name"
                            fullWidth
                            helperText="Enter the domain name without protocol (e.g., example.com)"
                            sx={{ mb: 2 }}
                            validate={(value: string) =>
                                validateModelField(
                                    value,
                                    'domain',
                                    'domain',
                                    dataProvider,
                                    getValues() as any
                                )
                            }
                            required
                        />

                        <TextInput
                            source="url"
                            label="Website URL"
                            validate={validateUrl}
                            fullWidth
                            helperText="Full URL to the website (optional)"
                            sx={{ mb: 2 }}
                            defaultValue={`https://`}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <SelectInput
                            source="technology"
                            label="Technology Stack"
                            choices={[
                                { id: 'WordPress', name: 'WordPress' },
                                { id: 'Webflow', name: 'Webflow' },
                                { id: 'Static', name: 'Static HTML' },
                                { id: 'React', name: 'React' },
                                { id: 'Vue', name: 'Vue.js' },
                                { id: 'Angular', name: 'Angular' },
                                { id: 'NextJS', name: 'Next.js' },
                                { id: 'Gatsby', name: 'Gatsby' },
                                { id: 'Other', name: 'Other' },
                            ]}
                            fullWidth
                            helperText="Select the primary technology used for this website"
                            sx={{ mb: 2 }}
                        />
                    </Grid2>
                </Grid2>
            </FormSection>
        </Box>
    );
}

// Configuration Tab Component
function ConfigurationTab() {
    const [hostingProviderModalOpen, setHostingProviderModalOpen] =
        useState(false);
    const [serverModalOpen, setServerModalOpen] = useState(false);

    return (
        <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
                Configure hosting, server, and organization relationships for
                this domain.
            </Alert>

            <FormSection title="Hosting & Infrastructure" icon={<ConfigIcon />}>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="subtitle1" sx={{ flex: 1 }}>
                                Hosting Provider
                            </Typography>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                    setHostingProviderModalOpen(true)
                                }
                                aria-label="Add Hosting Provider"
                            >
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <ReferenceInput
                            source="hostingProviderId"
                            reference="hosting-provider"
                            label=""
                        >
                            <SelectInput
                                optionText="name"
                                fullWidth
                                helperText="Select the hosting provider for this domain"
                                sx={{ mb: 2 }}
                                validate={required("Hosting Provider is required")}
                            />
                        </ReferenceInput>

                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="subtitle1" sx={{ flex: 1 }}>
                                Server (Optional)
                            </Typography>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => setServerModalOpen(true)}
                                aria-label="Add Server"
                            >
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <ReferenceInput
                            source="serverId"
                            reference="server"
                            label=""
                        >
                            <AutocompleteInput
                                optionText="hostname"
                                fullWidth
                                emptyText="No specific server"
                                helperText="Assign to a specific server if applicable"
                                sx={{ mb: 2 }}
                            />
                        </ReferenceInput>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <ReferenceInput
                            source="organizationId"
                            reference="organization"
                            label="Organization (Optional)"
                        >
                            <AutocompleteInput      
                                optionText="name"
                                fullWidth
                                emptyText="No organization"
                                helperText="Associate with an organization if applicable"
                                sx={{  mt: 5 }}
                                // validate={required("Organization is required")}
                            />
                        </ReferenceInput>
                    </Grid2>
                </Grid2>
            </FormSection>

            {/* Modals */}
            <CreateHostingProviderModal
                isModalOpen={hostingProviderModalOpen}
                setIsModalOpen={setHostingProviderModalOpen}
            />
            <CreateServerModal
                isModalOpen={serverModalOpen}
                setIsModalOpen={setServerModalOpen}
            />
        </Box>
    );
}

// DNS Records Tab Component
function DnsRecordsTab() {
    const [dnsHelpOpen, setDnsHelpOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
            >
                <Alert severity="info" sx={{ flex: 1, mr: 2 }}>
                    Configure DNS records for this domain. Changes may take time
                    to propagate.
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<InfoIcon />}
                    onClick={() => setDnsHelpOpen(true)}
                    size={isMobile ? 'small' : 'medium'}
                >
                    DNS Help
                </Button>
            </Box>

            <FormSection title="DNS Configuration" icon={<DnsIcon />}>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                        >
                            A Records
                        </Typography>
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            mb={1}
                        >
                            IP address mappings
                        </Typography>
                        <ArrayInput source="aRecords" label="">
                            <SimpleFormIterator inline>
                                <TextInput
                                    source=""
                                    label="IP Address"
                                    placeholder="192.168.1.1"
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                        >
                            CNAME Records
                        </Typography>
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            mb={1}
                        >
                            Domain aliases
                        </Typography>
                        <ArrayInput source="cnameRecords" label="">
                            <SimpleFormIterator inline>
                                <TextInput
                                    source=""
                                    label="Domain"
                                    placeholder="example.com"
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                        >
                            MX Records
                        </Typography>
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            mb={1}
                        >
                            Mail server routing
                        </Typography>
                        <ArrayInput source="mxRecords" label="">
                            <SimpleFormIterator inline>
                                <TextInput
                                    source=""
                                    label="Mail Server"
                                    placeholder="10 mail.example.com"
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                        >
                            TXT Records
                        </Typography>
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            mb={1}
                        >
                            Text verification records
                        </Typography>
                        <ArrayInput source="txtRecords" label="">
                            <SimpleFormIterator inline>
                                <TextInput
                                    source=""
                                    label="Text Value"
                                    placeholder="v=spf1 ..."
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </Grid2>

                    <Grid2 size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                        >
                            NS Records
                        </Typography>
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            mb={1}
                        >
                            Name server records
                        </Typography>
                        <ArrayInput source="nsRecords" label="">
                            <SimpleFormIterator inline>
                                <TextInput
                                    source=""
                                    label="Name Server"
                                    placeholder="ns1.example.com"
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </Grid2>
                </Grid2>
            </FormSection>

            <DnsHelpDialog
                open={dnsHelpOpen}
                onClose={() => setDnsHelpOpen(false)}
            />
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

// Custom toolbar with save and delete buttons
const DomainEditToolbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Toolbar
            sx={{
                justifyContent: 'space-between',
                p: { xs: 2, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <SaveButton
                label={isMobile ? 'Save' : 'Save Changes'}
                icon={<SaveIcon />}
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
                sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    width: { xs: '100%', sm: 'auto' },
                }}
            />
            <DeleteButton
                confirmTitle="Delete Domain"
                confirmContent="Are you sure you want to delete this domain? This action cannot be undone."
                size={isMobile ? 'medium' : 'large'}
                sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    width: { xs: '100%', sm: 'auto' },
                }}
            />
        </Toolbar>
    );
};

// Main Edit Context Component
const DomainFormFields = () => {
    const theme = useTheme();
    const { isXs, getVisibleTabCount } = useResponsiveTabs();
    const [currentTab, setCurrentTab] = useState(0);

    const visibleTabCount = getVisibleTabCount();

    const handleTabChange = (newValue: number) => {
        setCurrentTab(newValue);
    };

    if (isXs) {
        // Mobile: Use drawer navigation with all fields rendered but hidden
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

                {/* Render all tabs but hide non-active ones */}
                {TabConfig.map((tab, index) => (
                    <Box
                        key={tab.key}
                        sx={{
                            display: currentTab === index ? 'block' : 'none',
                        }}
                    >
                        <Fade in={currentTab === index} timeout={300}>
                            <Box>
                                {(() => {
                                    const Component = tab.component;
                                    return <Component />;
                                })()}
                            </Box>
                        </Fade>
                    </Box>
                ))}
            </Box>
        );
    }

    // Desktop/Tablet: Use improved tab layout with all fields rendered but hidden
    return (
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
                                <Tooltip key={tab.key} title={tab.label} arrow>
                                    <Box
                                        onClick={() => handleTabChange(index)}
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
                                                    ? theme.palette.primary.main
                                                    : theme.palette.text
                                                          .secondary,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor:
                                                    theme.palette.action.hover,
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
                                                currentTab === index ? 600 : 500
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

                {/* Tab Content - Render all tabs but hide non-active ones */}
                <Box
                    sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        width: '100%',
                        overflow: 'hidden',
                    }}
                >
                    {TabConfig.map((tab, index) => (
                        <Box
                            key={tab.key}
                            sx={{
                                display: currentTab === index ? 'block' : 'none',
                            }}
                        >
                            <Fade in={currentTab === index} timeout={300}>
                                <Box>
                                    {(() => {
                                        const Component = tab.component;
                                        return <Component />;
                                    })()}
                                </Box>
                            </Fade>
                        </Box>
                    ))}
                </Box>

                {/* Sticky Toolbar */}
                <DomainEditToolbar />
            </Paper>
        </Fade>
    );
};

export default DomainFormFields;
