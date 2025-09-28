import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Avatar,
    IconButton,
    useTheme,
    Grid2,
    Tooltip,
} from '@mui/material';
import {
    OpenInNew as ExternalLinkIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { useListContext, RecordContextProvider } from 'react-admin';
import { DomainStatusField } from './DomainStatusField';
import { DnsRecordsSummary } from './DnsRecordsSummary';

const DomainGridCard = ({ record }: { record: any }) => {
    const theme = useTheme();

    const getTechnologyColor = (tech: string) => {
        const colors = {
            WordPress: 'primary',
            Webflow: 'secondary',
            React: 'info',
            Vue: 'success',
            Angular: 'error',
            Static: 'warning',
        };
        return colors[tech as keyof typeof colors] || 'default';
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `#/domain/${record.id}`;
    };

    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `#/domain/${record.id}/show`;
    };

    const handleOpenUrl = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (record.url) {
            window.open(record.url, '_blank');
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    borderColor: theme.palette.primary.main,
                },
            }}
            onClick={handleView}
        >
            <CardContent sx={{ flex: 1, p: 3 }}>
                {/* Header with Domain and Actions */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 0.5,
                                wordBreak: 'break-word',
                                color: theme.palette.text.primary,
                            }}
                        >
                            {record.domain}
                        </Typography>
                        {record.url && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    display: 'block',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {record.url}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        {record.url && (
                            <Tooltip title="Open website">
                                <IconButton
                                    size="small"
                                    onClick={handleOpenUrl}
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        '&:hover': {
                                            color: theme.palette.primary.main,
                                        },
                                    }}
                                >
                                    <ExternalLinkIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Edit domain">
                            <IconButton
                                size="small"
                                onClick={handleEdit}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                    },
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Status and DNS */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <RecordContextProvider value={record}>
                        <DomainStatusField />
                        <DnsRecordsSummary />
                    </RecordContextProvider>
                </Box>

                {/* Technology */}
                {record.technology && (
                    <Box sx={{ mb: 2 }}>
                        <Chip
                            label={record.technology}
                            color={getTechnologyColor(record.technology) as any}
                            size="small"
                            variant="outlined"
                            sx={{
                                fontWeight: 500,
                                fontSize: '0.75rem',
                            }}
                        />
                    </Box>
                )}

                {/* Organization and Hosting Provider */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {record.organization && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 20,
                                    height: 20,
                                    fontSize: '0.7rem',
                                    bgcolor: 'primary.main',
                                }}
                            >
                                {record.organization.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </Avatar>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {record.organization.name}
                            </Typography>
                        </Box>
                    )}

                    {record.hostingProvider && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 20,
                                    height: 20,
                                    fontSize: '0.7rem',
                                    bgcolor: 'secondary.main',
                                }}
                            >
                                {record.hostingProvider.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </Avatar>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {record.hostingProvider.name}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Updated Date */}
                <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Updated{' '}
                        {new Date(record.updatedAt).toLocaleDateString()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export const DomainGridView: React.FC = () => {
    const { data, isLoading } = useListContext();

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400,
                    textAlign: 'center',
                    p: 4,
                }}
            >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No domains found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or create a new domain.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 }, maxHeight: '100vh' }}>
            <Grid2 container spacing={{ xs: 2, sm: 3 }}>
                {data.map((record: any) => (
                    <Grid2
                        key={record.id}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                        }}
                    >
                        <DomainGridCard record={record} />
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};
