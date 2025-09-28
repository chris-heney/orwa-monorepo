import { Box, Fade, useMediaQuery, useTheme } from '@mui/material';
import { ResizableSidebar } from '../../../_components/ResizableSidebar';
import { SubscriberProvider, useSubscriberProvider } from './context/SubscriberProvider';
import {
    SubscriberHeader,
    SubscriberFilters,
    SubscriberListToolbar,
    SubscriberListContent,
    SubscriberMobileLayout,
} from './components';
import { List } from 'react-admin';

const SubscriberListInner = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {
        sidebarOpen,
        setSidebarOpen,
        sidebarWidth,
        setSidebarWidth,
        filters,
    } = useSubscriberProvider();

    const buildReactAdminFilters = () => {
        const reactAdminFilters: Record<string, any> = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value && (Array.isArray(value) ? value.length > 0 : true)) {
                if (key === 'topicId' && Array.isArray(value)) {
                    // For array filters, use $in operator
                    reactAdminFilters[key] = { $in: value };
                } else if (key === 'isActive' && Array.isArray(value)) {
                    // Convert string values to boolean for isActive filter
                    const booleanValues = value.map(v => v === 'true');
                    reactAdminFilters[key] = { $eq: booleanValues };
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
        sort: { field: 'updatedAt', order: 'DESC' as const },
        resource: 'pub-sub-subscriber',
        component: 'div' as const,
        disableSyncWithLocation: true,
        queryOptions: {
          meta: {
              populate: "topic,deliveries",
              raw: true,
          },
      }
    };

    // Use mobile layout on mobile devices
    if (isMobile) {
        return <SubscriberMobileLayout listProps={listProps} />;
    }

    // Desktop layout
    return (
        <Fade in timeout={600}>
            <Box>
                <SubscriberHeader />

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
                        <SubscriberFilters />
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
                            <SubscriberListToolbar />
                            <Box
                                sx={{
                                    flex: 1,
                                    overflow: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <SubscriberListContent />
                            </Box>
                        </List>
                    </Box>
                </Box>
            </Box>
        </Fade>
    );
};

const SubscriberList = () => (
    <SubscriberProvider>
        <SubscriberListInner />
    </SubscriberProvider>
);

export default SubscriberList;


