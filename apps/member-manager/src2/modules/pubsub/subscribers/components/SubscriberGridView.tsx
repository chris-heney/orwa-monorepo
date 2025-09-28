import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    useTheme,
    Grid2,
    Tooltip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { useListContext, RecordContextProvider } from 'react-admin';
import { SubscriberStatusField } from './SubscriberStatusField';

const SubscriberGridCard = ({ record }: { record: any }) => {
    const theme = useTheme();

    const getTypeColor = (type: string) => {
        const colors = {
            EMAIL: 'primary',
            ZOHO: 'secondary',
            ASANA: 'info',
        };
        return colors[type as keyof typeof colors] || 'default';
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `#/pub-sub-subscriber/${record.id}`;
    };

    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `#/pub-sub-subscriber/${record.id}/show`;
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
                {/* Header with Topic and Actions */}
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
                            {record.topic?.name || 'Unknown Topic'}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.palette.text.secondary,
                                display: 'block',
                                wordBreak: 'break-word',
                            }}
                        >
                            {record.endpoint || 'No endpoint configured'}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        <Tooltip title="View subscriber">
                            <IconButton
                                size="small"
                                onClick={handleView}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                    },
                                }}
                            >
                                <ViewIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit subscriber">
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

                {/* Status and Type */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <RecordContextProvider value={record}>
                        <SubscriberStatusField />
                    </RecordContextProvider>
                    <Chip
                        label={record.type}
                        color={getTypeColor(record.type) as any}
                        size="small"
                        variant="outlined"
                        sx={{
                            fontWeight: 500,
                            fontSize: '0.75rem',
                        }}
                    />
                </Box>

                {/* Topic Info */}
                {record.topic && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Topic Details
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {record.topic.onCreate && (
                                <Chip label="Create" size="small" variant="outlined" />
                            )}
                            {record.topic.onUpdate && (
                                <Chip label="Update" size="small" variant="outlined" />
                            )}
                            {record.topic.onDelete && (
                                <Chip label="Delete" size="small" variant="outlined" />
                            )}
                        </Box>
                    </Box>
                )}

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

export const SubscriberGridView: React.FC = () => {
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
                    No subscribers found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or create a new subscriber.
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
                        <SubscriberGridCard record={record} />
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};
