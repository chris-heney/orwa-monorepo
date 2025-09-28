import {
    Analytics as AnalyticsIcon,
    VpnKey as ApiKeyIcon,
    Assignment as AssignmentIcon,
    Article as LicenseIcon,
    Storage as ServerIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    Paper,
    Snackbar,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Error, Loading, useGetList } from 'react-admin';
import {
    AssetManagerProvider,
    useAssetManagerContext,
} from './AssetManagerContext';

// Stats Card Component
interface StatsCardProps {
    title: string;
    value: number;
    total: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    total,
    icon,
    color,
    onClick,
}) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
        <Card
            sx={{
                height: '100%',
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': onClick
                    ? {
                          transform: 'scale(1.02)',
                          transition: 'transform 0.2s ease-in-out',
                      }
                    : {},
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color, mr: 1 }}>{icon}</Box>
                    <Typography variant="h6" component="h2">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                    {value}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    of {total} total
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: color,
                        },
                    }}
                />
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    {percentage.toFixed(1)}% active
                </Typography>
            </CardContent>
        </Card>
    );
};

// Recent Assets Component
interface RecentAssetsProps {
    assets: any[];
    loading: boolean;
    error: any;
}

const RecentAssets: React.FC<RecentAssetsProps> = ({
    assets,
    loading,
    error,
}) => {
    if (loading) return <Loading />;
    if (error) return <Error error={error} resetErrorBoundary={() => {}} />;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Recent Assets
                </Typography>
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {assets.length === 0 ? (
                        <Typography color="text.secondary">
                            No recent assets
                        </Typography>
                    ) : (
                        assets.map((asset, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    py: 1,
                                    borderBottom:
                                        index < assets.length - 1
                                            ? '1px solid rgba(0,0,0,0.1)'
                                            : 'none',
                                }}
                            >
                                <Box sx={{ mr: 2 }}>
                                    {asset.type === 'api-key' && (
                                        <ApiKeyIcon color="primary" />
                                    )}
                                    {asset.type === 'software-license' && (
                                        <LicenseIcon color="secondary" />
                                    )}
                                    {asset.type === 'server' && (
                                        <ServerIcon color="success" />
                                    )}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                    >
                                        {asset.name || asset.hostname}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {asset.type === 'api-key' && 'API Key'}
                                        {asset.type === 'software-license' &&
                                            'Software License'}
                                        {asset.type === 'server' && 'Server'}
                                        {asset.owner && ` • ${asset.owner}`}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

// Cost Analysis Component
interface CostAnalysisProps {
    totalCost: number;
    softwareLicenseCost: number;
    serverCost: number;
}

const CostAnalysis: React.FC<CostAnalysisProps> = ({
    totalCost,
    softwareLicenseCost,
    serverCost,
}) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Cost Analysis
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" color="primary">
                        ${totalCost.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total Monthly Cost
                    </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                        Software Licenses: $
                        {softwareLicenseCost.toLocaleString()}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={
                            totalCost > 0
                                ? (softwareLicenseCost / totalCost) * 100
                                : 0
                        }
                        sx={{ mt: 1, mb: 1 }}
                        color="secondary"
                    />
                </Box>
                <Box>
                    <Typography variant="body1">
                        Server Costs: ${serverCost.toLocaleString()}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={
                            totalCost > 0 ? (serverCost / totalCost) * 100 : 0
                        }
                        sx={{ mt: 1 }}
                        color="success"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

// Dashboard Content Component
const DashboardContent: React.FC = () => {
    const { copySuccess, setCopySuccess } = useAssetManagerContext();
    const [tabValue, setTabValue] = useState(0);

    // Data fetching
    const {
        data: apiKeysData,
        isLoading: apiKeysLoading,
        error: apiKeysError,
    } = useGetList('api-key', { pagination: { page: 1, perPage: 1000 } });

    const {
        data: softwareLicensesData,
        isLoading: softwareLicensesLoading,
        error: softwareLicensesError,
    } = useGetList('software-license', {
        pagination: { page: 1, perPage: 1000 },
    });

    const {
        data: serversData,
        isLoading: serversLoading,
        error: serversError,
    } = useGetList('server', { pagination: { page: 1, perPage: 1000 } });

    // Calculate stats
    const totalApiKeys = apiKeysData?.length || 0;
    const activeApiKeys = apiKeysData?.filter(item => item.active).length || 0;

    const totalSoftwareLicenses = softwareLicensesData?.length || 0;
    const activeSoftwareLicenses =
        softwareLicensesData?.filter(item => item.active).length || 0;

    const totalServers = serversData?.length || 0;
    const activeServers = serversData?.filter(item => item.active).length || 0;

    // Cost calculations
    const softwareLicenseCost =
        softwareLicensesData?.reduce(
            (sum, license) => sum + (license.cost || 0),
            0
        ) || 0;
    const serverCost =
        serversData?.reduce((sum, server) => sum + (server.cost || 0), 0) || 0;
    const totalCost = softwareLicenseCost + serverCost;

    // Recent assets (last 10 created)
    const recentAssets = [
        ...(apiKeysData || [])
            .slice(-5)
            .map(item => ({ ...item, type: 'api-key' })),
        ...(softwareLicensesData || [])
            .slice(-5)
            .map(item => ({ ...item, type: 'software-license' })),
        ...(serversData || [])
            .slice(-5)
            .map(item => ({ ...item, type: 'server' })),
    ]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 10);

    const isLoading =
        apiKeysLoading || softwareLicensesLoading || serversLoading;
    const hasError = apiKeysError || softwareLicensesError || serversError;

    if (isLoading) return <Loading />;
    if (hasError)
        return <Error error={hasError} resetErrorBoundary={() => {}} />;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Asset Manager Dashboard
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <StatsCard
                        title="API Keys"
                        value={activeApiKeys}
                        total={totalApiKeys}
                        icon={<ApiKeyIcon />}
                        color="#1976d2"
                        onClick={() => (window.location.href = '/#/api-key')}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatsCard
                        title="Software Licenses"
                        value={activeSoftwareLicenses}
                        total={totalSoftwareLicenses}
                        icon={<LicenseIcon />}
                        color="#9c27b0"
                        onClick={() =>
                            (window.location.href = '/#/software-license')
                        }
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatsCard
                        title="Servers"
                        value={activeServers}
                        total={totalServers}
                        icon={<ServerIcon />}
                        color="#2e7d32"
                        onClick={() => (window.location.href = '/#/server')}
                    />
                </Grid>
            </Grid>

            {/* Tabs for different views */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                >
                    <Tab label="Overview" icon={<AnalyticsIcon />} />
                    <Tab label="Recent Activity" icon={<TrendingUpIcon />} />
                    <Tab label="Cost Analysis" icon={<AssignmentIcon />} />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            <Grid container spacing={3}>
                {tabValue === 0 && (
                    <>
                        <Grid item xs={12} md={8}>
                            <RecentAssets
                                assets={recentAssets}
                                loading={isLoading}
                                error={hasError}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CostAnalysis
                                totalCost={totalCost}
                                softwareLicenseCost={softwareLicenseCost}
                                serverCost={serverCost}
                            />
                        </Grid>
                    </>
                )}

                {tabValue === 1 && (
                    <Grid item xs={12}>
                        <RecentAssets
                            assets={recentAssets}
                            loading={isLoading}
                            error={hasError}
                        />
                    </Grid>
                )}

                {tabValue === 2 && (
                    <Grid item xs={12}>
                        <CostAnalysis
                            totalCost={totalCost}
                            softwareLicenseCost={softwareLicenseCost}
                            serverCost={serverCost}
                        />
                    </Grid>
                )}
            </Grid>

            {/* Copy Success Notification */}
            <Snackbar
                open={!!copySuccess}
                autoHideDuration={2000}
                onClose={() => setCopySuccess('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setCopySuccess('')} severity="success">
                    {copySuccess}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Main Dashboard Component with Provider
const AssetManagerDashboard: React.FC = () => {
    return (
        <AssetManagerProvider>
            <DashboardContent />
        </AssetManagerProvider>
    );
};

export default AssetManagerDashboard;
