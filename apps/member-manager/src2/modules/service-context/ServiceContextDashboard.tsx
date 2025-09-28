import ServiceContextProvider, { useServiceContext } from './ServiceContextProvider';
import {
    Card,
    CardContent,
    Grid2,
    Box,
    Typography,
} from '@mui/material';
import CIWebHeader from '../../_components/CIWebHeader';
import { Logo } from '../../layout/Logo';
import CustomHeader from '../../_components/CustomHeader';
import { ResourcePermissionGuard, useUserPermissions } from '../../rbac';

import TradeList from './models/trades/TradeList';
import CreateServiceContextModal from './models/service-contexts/CreateServiceContextModal';
import CreateServiceModal from './models/services/CreateServiceModal';
import ServiceContextList from './models/service-contexts/ServiceContextList';
import IndustryList from './models/industries/IndustryList';
import ServiceList from './models/services/ServiceList';
import CreateIndustryModal from './models/industries/CreateIndustryModal';
import CreateTradeModal from './models/trades/CreateTradeModal';
import EditServiceContextModal from './models/service-contexts/EditServiceContextModal';
import EditServiceModal from './models/services/EditServiceModal';
import EditIndustryModal from './models/industries/EditIndustryModal';
import EditTradeModal from './models/trades/EditTradeModal';

const ServiceContextDashboardContent = () => {
    const { 
        isServiceContextModalOpen,
        isServiceModalOpen,
        isIndustryModalOpen,
        isTradeModalOpen,
    } = useServiceContext();

    const { hasResourcePermission } = useUserPermissions();

    // Check if user has access to any service context resources
    const hasAnyAccess = [
        'industry',
        'trade', 
        'serviceContext',
        'service'
    ].some(resource => 
        hasResourcePermission(resource as any, 'view')
    );

    if (!hasAnyAccess) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    You don't have permission to access the Service Context dashboard.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <CIWebHeader 
                title="SERVICE CONTEXT" 
                icon={<Logo />}
            />
            <Grid2 container spacing={2} py={2}>
                {/* Industries Section */}
                <ResourcePermissionGuard resource="industry" action="view">
                    <Grid2
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <Card sx={{ p: 0, pb: 0 }}>
                            <CardContent sx={{ p: 0 }}>
                                <CustomHeader 
                                    textSx={{ fontWeight: '500', fontSize: '18px' }} 
                                    title="Industries" 
                                />
                                <IndustryList />
                            </CardContent>
                        </Card>
                    </Grid2>
                </ResourcePermissionGuard>

                {/* Trades Section */}
                <ResourcePermissionGuard resource="trade" action="view">
                    <Grid2
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <Card sx={{ p: 0, pb: 0 }}>
                            <CardContent sx={{ p: 0 }}>
                                <CustomHeader 
                                    textSx={{ fontWeight: '500', fontSize: '18px' }} 
                                    title="Trades" 
                                />
                                <TradeList />
                            </CardContent>
                        </Card>
                    </Grid2>
                </ResourcePermissionGuard>

                {/* Service Contexts Section */}
                <ResourcePermissionGuard resource="serviceContext" action="view">
                    <Grid2
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <Card sx={{ p: 0, pb: 0 }}>
                            <CardContent sx={{ p: 0 }}>
                                <CustomHeader 
                                    textSx={{ fontWeight: '500', fontSize: '18px' }} 
                                    title="Service Contexts" 
                                />
                                <ServiceContextList />
                            </CardContent>
                        </Card>
                    </Grid2>
                </ResourcePermissionGuard>

                {/* Services Section */}
                <ResourcePermissionGuard resource="service" action="view">
                    <Grid2
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <Card sx={{ p: 0, pb: 0 }}>
                            <CardContent sx={{ p: 0 }}>
                                <CustomHeader 
                                    textSx={{ fontWeight: '500', fontSize: '18px' }} 
                                    title="Services" 
                                />
                                <ServiceList/>
                            </CardContent>
                        </Card>
                    </Grid2>
                </ResourcePermissionGuard>
            </Grid2>
            
            {/* Modals - Protected by individual component permissions */}
            {!isServiceContextModalOpen.record ? (
                <CreateServiceContextModal />
            ) : (
                <EditServiceContextModal />
            )}
            {!isServiceModalOpen.record ? (
                <CreateServiceModal />
            ) : (
                <EditServiceModal />
            )}
            {!isIndustryModalOpen.record ? (
                <CreateIndustryModal />
            ) : (
                <EditIndustryModal />
            )}
            {!isTradeModalOpen.record ? (
                <CreateTradeModal />
            ) : (
                <EditTradeModal />
            )}
        </>
    );
};

const ServiceContextDashboard = () => {
    return (
        <ServiceContextProvider>
            <ServiceContextDashboardContent />
        </ServiceContextProvider>
    );
};

export default ServiceContextDashboard;
