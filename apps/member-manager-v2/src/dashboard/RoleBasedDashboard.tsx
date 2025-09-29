import { useUserPermissions } from '../rbac';
import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { useGetList } from 'react-admin';

import { useNavigate } from 'react-router-dom';
import ButtonBase from '@mui/material/ButtonBase';
// Real data widgets using react-admin data provider
const OrganizationsWidget = () => {
    const { total, isLoading, error } = useGetList('organization', {
        pagination: { page: 1, perPage: 1 },
        sort: { field: 'id', order: 'ASC' },
    });
    const navigate = useNavigate();
    return (
        <ButtonBase
            onClick={() => navigate('/organization')}
            sx={{
                width: '100%',
                borderRadius: 2,
                textAlign: 'left',
                display: 'block',
            }}
        >
            <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Typography variant="h6">Organizations</Typography>
                {isLoading ? (
                    <CircularProgress size={28} />
                ) : error ? (
                    <Typography color="error">Error</Typography>
                ) : (
                    <Typography variant="h4">{total ?? 0}</Typography>
                )}
                <Typography color="text.secondary">
                    Total Organizations
                </Typography>
            </Paper>
        </ButtonBase>
    );
};

const DomainsWidget = () => {
    const { total, isLoading, error } = useGetList('domain', {
        pagination: { page: 1, perPage: 1 },
        sort: { field: 'id', order: 'ASC' },
    });
    const navigate = useNavigate();
    return (
        <ButtonBase
            onClick={() => navigate('/domain')}
            sx={{
                width: '100%',
                borderRadius: 2,
                textAlign: 'left',
                display: 'block',
            }}
        >
            <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Typography variant="h6">Domains</Typography>
                {isLoading ? (
                    <CircularProgress size={28} />
                ) : error ? (
                    <Typography color="error">Error</Typography>
                ) : (
                    <Typography variant="h4">{total ?? 0}</Typography>
                )}
                <Typography color="text.secondary">Total Domains</Typography>
            </Paper>
        </ButtonBase>
    );
};

const TechStacksWidget = () => {
    const { total, isLoading, error } = useGetList('techStack', {
        pagination: { page: 1, perPage: 1 },
        sort: { field: 'id', order: 'ASC' },
    });
    const navigate = useNavigate();
    return (
        <ButtonBase
            onClick={() => navigate("/platform")}
            sx={{
                width: '100%',
                borderRadius: 2,
                textAlign: 'left',
                display: 'block',
            }}
        >
            <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Typography variant="h6">Tech Stacks</Typography>
                {isLoading ? (
                    <CircularProgress size={28} />
                ) : error ? (
                    <Typography color="error">Error</Typography>
                ) : (
                    <Typography variant="h4">{total ?? 0}</Typography>
                )}
                <Typography color="text.secondary">
                    Available Tech Stacks
                </Typography>
            </Paper>
        </ButtonBase>
    );
};

const RoleBasedDashboard = () => {
    const { hasResourcePermission } = useUserPermissions();

    const canViewOrganizations = hasResourcePermission('organization', 'view');
    const canViewDomains = hasResourcePermission('domains', 'view');
    const canViewTechStacks = hasResourcePermission("techStacks", 'view');

    const anyAccess = canViewOrganizations || canViewDomains || canViewTechStacks;

    if (anyAccess) {
        return (
            <Grid container spacing={3}>
                {canViewOrganizations && (
                    <Grid item xs={12} md={4}>
                        <OrganizationsWidget />
                    </Grid>
                )}
                {canViewDomains && (
                    <Grid item xs={12} md={4}>
                        <DomainsWidget />
                    </Grid>
                )}
                {canViewTechStacks && (
                    <Grid item xs={12} md={4}>
                        <TechStacksWidget />
                    </Grid>
                )}
            </Grid>
        );
    }

    // Default: show a welcome message
    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5">Welcome to the Dashboard</Typography>
            <Typography color="text.secondary">
                You do not have access to dashboard widgets.
            </Typography>
        </Box>
    );
};

export default RoleBasedDashboard;
