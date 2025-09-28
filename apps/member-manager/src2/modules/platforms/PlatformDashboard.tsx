import {
    Avatar,
    Box,
    Container,
    Fade,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { ResourcePermissionGuard, useUserPermissions } from '../../rbac';
import PlatformContextProvider from './PlatformContext';
import CreatePlatformGroupModal from './models/platform-groups/CreatePlatformGroupModal';
import EditPlatformGroupModal from './models/platform-groups/EditPlatformGroupModal';
import PlatformGroupsList from './models/platform-groups/PlatformGroupsList';
import CreatePlatformModal from './models/platforms/CreatePlatformModal';
import EditPlatformModal from './models/platforms/EditPlatformModal';
import PlatformsList from './models/platforms/PlatformsList';

// Icons
import CodeIcon from '@mui/icons-material/Code';
import LayersIcon from '@mui/icons-material/Layers';

const PlatformDashboard = () => {
    const { hasResourcePermission } = useUserPermissions();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Check if user has any permissions for platforms
    const hasAnyPlatformPermissions = ['platformGroups', 'platforms'].some(
        resource =>
            ['view', 'create', 'edit', 'delete'].some(action =>
                hasResourcePermission(resource as any, action)
            )
    );

    if (!hasAnyPlatformPermissions) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: 'warning.main',
                            width: 64,
                            height: 64,
                            mx: 'auto',
                            mb: 2,
                        }}
                    >
                        <LayersIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                        You don't have permission to access Platform
                        management.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <PlatformContextProvider>
            <Container
                maxWidth={false}
                sx={{
                    width: '100%',
                    px: { xs: 1, sm: 2, md: 3 },
                    py: { xs: 1, md: 2 },
                }}
            >
                <Fade in timeout={600}>
                    <Box sx={{ width: '100%' }}>
                        {/* Header Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2, md: 3 },
                                mb: 3,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                width: '100%',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.main',
                                        width: { xs: 48, md: 56 },
                                        height: { xs: 48, md: 56 },
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        boxShadow: theme.shadows[3],
                                    }}
                                >
                                    <LayersIcon
                                        fontSize={isMobile ? 'medium' : 'large'}
                                    />
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant={isMobile ? 'h5' : 'h4'}
                                        fontWeight={600}
                                        gutterBottom
                                        sx={{ color: 'text.primary' }}
                                    >
                                        Platform Management
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        Organize and manage platforms by
                                        groups and individual components
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Main Content - Vertical Layout (Original Structure) */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                width: '100%',
                            }}
                        >
                            {/* Platform Groups - Full Width at Top */}
                            <ResourcePermissionGuard
                                resource={"platformGroups" as any}
                                action="view"
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        width: '100%',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        backgroundColor:
                                            theme.palette.background.paper,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: { xs: 2, md: 3 },
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            backgroundColor:
                                                theme.palette.background
                                                    .default,
                                        }}
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1.5}
                                        >
                                            <CodeIcon color="primary" />
                                            <Typography
                                                variant="h6"
                                                fontWeight={600}
                                                sx={{ color: 'text.primary' }}
                                            >
                                                Platform Groups
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 0.5 }}
                                        >
                                            Organize platforms into
                                            logical groups
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: { xs: 1, md: 2 } }}>
                                        <PlatformGroupsList />
                                    </Box>
                                </Paper>
                            </ResourcePermissionGuard>

                            {/* Platforms - Full Width Below Groups */}
                            <ResourcePermissionGuard
                                resource={"platforms" as any}
                                action="view"
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        width: '100%',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        backgroundColor:
                                            theme.palette.background.paper,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: { xs: 2, md: 3 },
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            backgroundColor:
                                                theme.palette.background
                                                    .default,
                                        }}
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1.5}
                                        >
                                            <LayersIcon color="primary" />
                                            <Typography
                                                variant="h6"
                                                fontWeight={600}
                                                sx={{ color: 'text.primary' }}
                                            >
                                                Platforms
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 0.5 }}
                                        >
                                            Individual platform components and
                                            tools
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: { xs: 1, md: 2 } }}>
                                        <PlatformsList />
                                    </Box>
                                </Paper>
                            </ResourcePermissionGuard>
                        </Box>

                        {/* Modals */}
                        <CreatePlatformGroupModal />
                        <EditPlatformGroupModal />
                        <CreatePlatformModal />
                        <EditPlatformModal />
                    </Box>
                </Fade>
            </Container>
        </PlatformContextProvider>
    );
};

export default PlatformDashboard;
