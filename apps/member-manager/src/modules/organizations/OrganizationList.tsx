import { Box, Fade, useMediaQuery, useTheme } from '@mui/material';
import { ResizableSidebar, UniversalMobileLayout } from '../../_components';
import {
    OrganizationProvider,
    useOrganizationProvider,
} from './context/OrganizationProvider';
import { OrganizationFilters } from './components/OrganizationFilters';
import { OrganizationListToolbar } from './components/OrganizationListToolbar';
import { OrganizationListContent } from './components/OrganizationListContent';
import { OrganizationMobileHeader } from './components/OrganizationMobileHeader';
import { OrganizationMobileToolbar } from './components/OrganizationMobileToolbar';
import { OrganizationHeader } from './components/OrganizationHeader';
import { List } from 'react-admin';

const OrganizationListInner = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {
        sidebarOpen,
        setSidebarOpen,
        sidebarWidth,
        setSidebarWidth,
        filters,
    } = useOrganizationProvider();

    const buildReactAdminFilters = () => {
        const reactAdminFilters: Record<string, any> = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value && (Array.isArray(value) ? value.length > 0 : true)) {
                if (key === 'organizationType' && Array.isArray(value)) {
                    // For array filters, use $in operator
                    reactAdminFilters[key] = { $in: value };
                } else if (key === 'q') {
                    // Handle search differently - search in name field
                    reactAdminFilters.name = {
                        $contains: value.$contains || value,
                    };
                } else {
                    reactAdminFilters[key] = value;
                }
            }
        });

        return reactAdminFilters;
    };

    const listProps = {
        queryOptions: {
            meta: {
                populate: [
                    'projectDetails',
                    'organizationLocations.location',
                    'organizationContact',
                    'domains',
                    'industry',
                    'organizationBrand',
                    'organizationAssets.asset',
                    'organizationServiceContract',
                    'services',
                    'trades',
                    'targetCities',
                    'organizationPrivateEquity',
                    'organizationFranchise',
                    'websiteTemplate',
                    'primaryLogo',
                ],
                raw: true,
            },
        },
        filter: buildReactAdminFilters(),
        actions: false as const,
        perPage: 25,
        sort: { field: 'name', order: 'ASC' as const },
        resource: 'organization',
        component: 'div' as const,
        disableSyncWithLocation: true,
    };

    // Use mobile layout on mobile devices
    if (isMobile) {
        return (
            <UniversalMobileLayout
                listProps={listProps}
                headerComponent={OrganizationMobileHeader}
                toolbarComponent={OrganizationMobileToolbar}
                filtersComponent={OrganizationFilters}
                listContentComponent={OrganizationListContent}
                title="Filters"
            />
        );
    }

    // Desktop layout
    return (
        <Fade in timeout={600}>
            <Box sx={{ maxWidth: '95vw', height: '100%', overflow: 'hidden' }}>
                <OrganizationHeader />

                <Box
                    sx={{
                        display: 'flex',
                        overflow: 'hidden',
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <ResizableSidebar
                        isOpen={sidebarOpen}
                        onOpenChange={setSidebarOpen}
                        width={sidebarWidth}
                        onWidthChange={setSidebarWidth}
                        minWidth={0}
                        maxWidth={500}
                        defaultWidth={280}
                    >
                        <OrganizationFilters />
                    </ResizableSidebar>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                            overflow: 'hidden',
                            marginLeft: sidebarOpen ? `${sidebarWidth}px` : 0,
                            transition: theme.transitions.create('margin', {
                                easing: theme.transitions.easing.sharp,
                                duration:
                                    theme.transitions.duration.leavingScreen,
                            }),
                        }}
                    >
                        <List
                            {...listProps}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '& .RaList-main': {
                                    flex: 1,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                },
                                '& .RaList-content': {
                                    flex: 1,
                                    overflow: 'hidden',
                                },
                                '& .MuiTablePagination-root': {
                                    position: 'sticky',
                                    bottom: 0,
                                    backgroundColor:
                                        theme.palette.background.paper,
                                    borderTop: `1px solid ${theme.palette.divider}`,
                                    zIndex: 5,
                                    minHeight: '56px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
                                },
                            }}
                        >
                            <OrganizationListToolbar />
                            <Box
                                sx={{
                                    flex: 1,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <OrganizationListContent />
                            </Box>
                        </List>
                    </Box>
                </Box>
            </Box>
        </Fade>
    );
};

const OrganizationList = () => (
    <OrganizationProvider>
        <OrganizationListInner />
    </OrganizationProvider>
);

export default OrganizationList;
