import { Organization } from '@ci-connect/types';
import BuildIcon from '@mui/icons-material/Build';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HandymanIcon from '@mui/icons-material/Handyman';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid2,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetList, useRecordContext } from 'react-admin';

export const TradeServicesShow = () => {
    const record = useRecordContext<Organization>();
    const [serviceData, setServiceData] = useState<Record<string, any>>({});
    const [serviceContextData, setServiceContextData] = useState<
        Record<string, any>
    >({});
    const [loading, setLoading] = useState(true);

    // Fetch services data
    const { data: services } = useGetList('service', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'name', order: 'ASC' },
    });

    // Fetch service contexts data
    const { data: serviceContexts } = useGetList('serviceContext', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'name', order: 'ASC' },
    });

    // Process data when it's loaded
    useEffect(() => {
        if (services && serviceContexts) {
            // Create lookup maps for quick access
            const servicesMap = services.reduce((acc, service) => {
                acc[service.id] = service;
                return acc;
            }, {} as Record<string, any>);

            const serviceContextsMap = serviceContexts.reduce(
                (acc, context) => {
                    acc[context.id] = context;
                    return acc;
                },
                {} as Record<string, any>
            );

            setServiceData(servicesMap);
            setServiceContextData(serviceContextsMap);
            setLoading(false);
        }
    }, [services, serviceContexts]);

    if (!record) return null;

    const trades = record.trades || [];
    const orgServices = record.services || [];

    // Group services by service context
    const servicesByContext = orgServices.reduce(
        (acc: Record<string, any[]>, service) => {
            // Find the service context
            const serviceContext = serviceContextData[service.serviceContextId];
            const contextName = serviceContext?.name || 'Unknown Context';

            if (!acc[contextName]) {
                acc[contextName] = [];
            }

            acc[contextName].push({
                ...service,
                serviceName:
                    serviceData[service.serviceId]?.name || 'Unknown Service',
                contextName: serviceContext?.name || 'Unknown Context',
            });

            return acc;
        },
        {}
    );

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <HandymanIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Services</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {loading ? (
                <Box sx={{ width: '100%' }}>
                    <Skeleton
                        variant="rectangular"
                        height={100}
                        sx={{ mb: 2 }}
                    />
                    <Skeleton variant="rectangular" height={200} />
                </Box>
            ) : orgServices.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    No services have been added for this organization.
                </Typography>
            ) : (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Trades
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {trades.map(trade => (
                                <Chip
                                    key={trade.id}
                                    label={trade.name}
                                    icon={<HandymanIcon />}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>

                    <Typography variant="h6" gutterBottom>
                        Services by Context
                    </Typography>
                    <Grid2 container spacing={2}>
                        {Object.entries(servicesByContext).map(
                            ([contextName, contextServices], index) => (
                                <Grid2 size={{ xs: 6, sm: 4 }} key={index}>
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                color="primary"
                                                gutterBottom
                                            >
                                                {contextName}
                                            </Typography>
                                            <List dense>
                                                {contextServices.map(
                                                    (service, serviceIndex) => (
                                                        <ListItem
                                                            key={serviceIndex}
                                                            sx={{ px: 0 }}
                                                        >
                                                            <ListItemIcon
                                                                sx={{
                                                                    minWidth: 28,
                                                                }}
                                                            >
                                                                {service.isActive ? (
                                                                    <CheckCircleIcon
                                                                        color="success"
                                                                        fontSize="small"
                                                                    />
                                                                ) : (
                                                                    <CancelIcon
                                                                        color="error"
                                                                        fontSize="small"
                                                                    />
                                                                )}
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Box
                                                                        sx={{
                                                                            display:
                                                                                'flex',
                                                                            alignItems:
                                                                                'center',
                                                                        }}
                                                                    >
                                                                        <BuildIcon
                                                                            fontSize="small"
                                                                            sx={{
                                                                                mr: 0.5,
                                                                            }}
                                                                        />
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                fontSize:
                                                                                    '0.875rem',
                                                                            }}
                                                                        >
                                                                            {
                                                                                service.serviceName
                                                                            }
                                                                        </Typography>
                                                                    </Box>
                                                                }
                                                                secondary={
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="textSecondary"
                                                                    >
                                                                        {
                                                                            service.contextName
                                                                        }
                                                                    </Typography>
                                                                }
                                                            />
                                                        </ListItem>
                                                    )
                                                )}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            )
                        )}
                    </Grid2>
                </>
            )}
        </Paper>
    );
};

export default TradeServicesShow;
