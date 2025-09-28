import { Box, Fade, useMediaQuery, useTheme } from '@mui/material';
import { ResizableSidebar } from '../../_components/ResizableSidebar';
import DomainHeader from './components/DomainHeader';
import { DomainFilters } from './components/DomainFilters';
import { DomainListToolbar } from './components/DomainListToolbar';
import { DomainListContent } from './components/DomainListContent';
import { DomainMobileLayout } from './components/DomainMobileLayout';
import { DomainProvider, useDomainProvider } from './context/DomainProvider';
import { DomainBulkActions } from './components';
import { List } from 'react-admin';

const DomainListInner = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {
        sidebarOpen,
        setSidebarOpen,
        sidebarWidth,
        setSidebarWidth,
        filters,
    } = useDomainProvider();

    const buildReactAdminFilters = () => {
        const reactAdminFilters: Record<string, any> = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value && (Array.isArray(value) ? value.length > 0 : true)) {
                if (key === 'technology' && Array.isArray(value)) {
                    // For array filters, use $in operator
                    reactAdminFilters[key] = { $in: value };
                } else if (
                    key === 'hostingProviderId' &&
                    Array.isArray(value)
                ) {
                    reactAdminFilters[key] = { $in: value };
                } else {
                    reactAdminFilters[key] = value;
                }
            }
        });

        return reactAdminFilters;
    };

    const listProps = {
        filter: buildReactAdminFilters(),
        actions: false as const,
        perPage: 25,
        sort: { field: 'domain', order: 'ASC' as const },
        resource: 'domain',
        component: 'div' as const,
        disableSyncWithLocation: true,
        bulkActionButtons: <DomainBulkActions />,
    };

    // Use mobile layout on mobile devices
    if (isMobile) {
        return <DomainMobileLayout listProps={listProps} />;
    }

    // Desktop layout
    return (
        <Fade in timeout={600}>
            <Box>
                <DomainHeader />

                <Box
                    sx={{
                        display: 'flex',
                        height: 'calc(100vh - 64px)', // Full height minus header
                        overflow: 'hidden',
                        position: 'relative',
                        minHeight: 500, // Ensure minimum height to show pagination
                    }}
                >
                    {/* Sidebar */}
                    <ResizableSidebar
                        isOpen={sidebarOpen}
                        onOpenChange={setSidebarOpen}
                        width={sidebarWidth}
                        onWidthChange={setSidebarWidth}
                        minWidth={0}
                        maxWidth={500}
                        defaultWidth={280}
                    >
                        <DomainFilters />
                    </ResizableSidebar>

                    {/* Main Content with fixed margins to account for sidebar */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
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
                                    minHeight: '56px', // Ensure pagination has a minimum height
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: '0 -2px 4px rgba(0,0,0,0.05)', // Add subtle shadow to stand out
                                },
                            }}
                        >
                            <DomainListToolbar />
                            <Box
                                sx={{
                                    flex: 1,
                                    overflow: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <DomainListContent />
                            </Box>
                        </List>
                    </Box>
                </Box>
            </Box>
        </Fade>
    );
};

const DomainList = () => (
    <DomainProvider>
        <DomainListInner />
    </DomainProvider>
);

export default DomainList;
