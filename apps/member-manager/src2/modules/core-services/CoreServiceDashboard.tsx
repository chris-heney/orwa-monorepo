import CoreServiceContextProvider, {
    useCoreServiceContext,
} from './CoreServiceContex';
import { Card, CardContent, Grid2, Box, Typography } from '@mui/material';
import PackageGroupList from './models/package-groups/PackageGroupList';
import PackagesList from './models/packages/PackageList';
import CIWebHeader from '../../_components/CIWebHeader';
import { Logo } from '../../layout/Logo';
import CreatePackageModal from './models/packages/CreatePackageModal';
import CreatePackageGroupModal from './models/package-groups/CreatePackageGroupModal';
import CustomHeader from '../../_components/CustomHeader';
import EditPackageModal from './models/packages/EditPackageModal';
import EditPackageGroupModal from './models/package-groups/EditPackageGroupModal';
import CoreListServices from './models/core-services/CoreServicesList';
import CreateCoreServiceModal from './models/core-services/CreateCoreServiceModal';
import EditCoreServiceModal from './models/core-services/EditCoreServiceModal';
import CreateAddonGroupModal from './models/addon-group/CreateAddonGroupModal';
import EditAddonGroupModal from './models/addon-group/EditAddonGroupModal';
import AddonList from './models/addons/AddonList';
import AddonGroupList from './models/addon-group/AddonGroupList';
import FeatureList from './models/feature/FeatureList';
import CreateFeatureModal from './models/feature/CreateFeatureModal';
import EditFeatureModal from './models/feature/EditFeatureModal';
import CreateAddonModal from './models/addons/CreateAddonModal';
import EditAddonModal from './models/addons/EditAddonModal';
import { ResourcePermissionGuard, useUserPermissions } from '../../rbac';

const CoreServiceDashboardContent = () => {
    const {
        isCoreServiceModalOpen,
        isPackageModalOpen,
        isFeatureModalOpen,
        isPackageGroupModalOpen,
        isAddonGroupModalOpen,
        isAddonModalOpen,
    } = useCoreServiceContext();

    const { hasResourcePermission } = useUserPermissions();

    // Check if user has access to any core service resources
    const hasAnyAccess = [
        'coreServices',
        'packageGroups',
        'packages',
        'features',
        'addonGroups',
        'addons'
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
                    You don't have permission to access the Core Services dashboard.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <CIWebHeader
                title="CONFIGURATION"
                // subtitle="CI Web Group Marketing Solutions"
                icon={<Logo />}
            />
            <Grid2 container spacing={2} py={2}>
                <ResourcePermissionGuard resource="coreServices" action="view">
                    <Grid2
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <Card
                            sx={{
                                p: 0,
                                pb: 0,
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: 0
                                }}
                            >
                                <CustomHeader
                                    textSx={{
                                        fontWeight: '500',
                                        fontSize: '18px',
                                    }}
                                    title="Core Services"
                                />
                                <CoreListServices />
                            </CardContent>
                        </Card>
                    </Grid2>
                </ResourcePermissionGuard>
                <ResourcePermissionGuard resource="packageGroups" action="view">
                    <Grid2
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <Card
                            sx={{
                                p: 0,
                                pb: 0,
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: 0,
                                }}
                            >
                                <CustomHeader
                                    textSx={{
                                        fontWeight: '500',
                                        fontSize: '18px',
                                    }}
                                    title="Package Groups"
                                />
                                <PackageGroupList />
                            </CardContent>
                        </Card>
                    </Grid2>
                </ResourcePermissionGuard>
                <ResourcePermissionGuard resource="packages" action="view">
                    <Grid2
                        size={{
                            xs: 6,
                            md: 12,
                        }}
                    >
                        <Card
                            sx={{
                                p: 0,
                                pb: 0,
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: 0,
                                }}
                            >
                                <CustomHeader
                                    textSx={{
                                        fontWeight: '500',
                                        fontSize: '18px',
                                    }}
                                    title="Packages"
                                />
                                <PackagesList />
                            </CardContent>
                        </Card>
                    </Grid2>
                </ResourcePermissionGuard>
                <ResourcePermissionGuard resource="features" action="view">
                    <Grid2
                        size={{
                            xs: 12,
                        }}
                    >
                        <Card
                            sx={{
                                p: 0,
                                pb: 0,
                            }}
                        >
                             <CardContent
                                sx={{
                                    p: 0,
                                }}
                            >
                                <CustomHeader
                                    textSx={{
                                        fontWeight: '500',
                                        fontSize: '18px',
                                    }}
                                    title="Features"
                                />
                                <FeatureList />
                            </CardContent>
                        </Card>
                    </Grid2>
                </ResourcePermissionGuard>
                <ResourcePermissionGuard resource="addonGroups" action="view">
                    <Grid2
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <Card
                            sx={{
                                p: 0,
                                pb: 0,
                            }}
                        >
                              <CardContent
                                sx={{
                                    p: 0,
                                }}
                            >
                                <CustomHeader
                                    textSx={{
                                        fontWeight: '500',
                                        fontSize: '18px',
                                    }}
                                    title="Addon Groups"
                                />
                                <AddonGroupList />
                            </CardContent>
                           
                        </Card>
                    </Grid2>
                </ResourcePermissionGuard>
                <ResourcePermissionGuard resource="addons" action="view">
                    <Grid2
                        size={{
                            xs: 6,
                        }}
                    >
                        <Card
                            sx={{
                                p: 0,
                                pb: 0,
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: 0,
                                }}
                            >
                                <CustomHeader
                                    textSx={{
                                        fontWeight: '500',
                                        fontSize: '18px',
                                    }}
                                    title="Addons"
                                />
                                <AddonList />
                            </CardContent>
                        </Card>
                    </Grid2>
                </ResourcePermissionGuard>
            </Grid2>

            {/* Modals */}
            {!isCoreServiceModalOpen.record ? (
                <CreateCoreServiceModal />
            ) : (
                <EditCoreServiceModal />
            )}
            {!isPackageModalOpen.record ? (
                <CreatePackageModal />
            ) : (
                <EditPackageModal />
            )}
            {!isPackageGroupModalOpen.record ? (
                <CreatePackageGroupModal />
            ) : (
                <EditPackageGroupModal />
            )}
            {!isAddonGroupModalOpen.record ? (
                <CreateAddonGroupModal />
            ) : (
                <EditAddonGroupModal />
            )}
            {!isFeatureModalOpen.record ? (
                <CreateFeatureModal />
            ) : (
                <EditFeatureModal />
            )}
            {/* check if record.name contains (Copy) */}
            {(!isAddonModalOpen.record || isAddonModalOpen.record.name.includes('(Copy)')) ? (
                <CreateAddonModal />
            ) : (
                <EditAddonModal />
            )}
            
        </>
    );
};

const CoreServiceDashboard = () => {
    return (
        <CoreServiceContextProvider>
            <CoreServiceDashboardContent />
        </CoreServiceContextProvider>
    );
};

export default CoreServiceDashboard;
