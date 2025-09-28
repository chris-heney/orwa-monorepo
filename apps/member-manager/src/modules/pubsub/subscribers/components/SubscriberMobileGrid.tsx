import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    useTheme,
    Stack,
    Avatar,
} from '@mui/material';
import {
    Edit as EditIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useListContext, RecordContextProvider } from 'react-admin';
import { SubscriberStatusField } from './SubscriberStatusField';

const SubscriberMobileCard = ({ record }: { record: any }) => {
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
                mb: 2,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 16px ${theme.palette.primary.main}15`,
                    borderColor: theme.palette.primary.main,
                },
            }}
            onClick={handleView}
        >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {/* Header Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                                fontSize: '0.875rem',
                            }}
                        >
                            <NotificationsIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    mb: 0.5,
                                    wordBreak: 'break-word',
                                    fontSize: '0.95rem',
                                }}
                            >
                                {record.topic?.name || 'Unknown Topic'}
                            </Typography>
                            {record.endpoint && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        display: 'block',
                                        wordBreak: 'break-word',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    {record.endpoint}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        <IconButton
                            size="small"
                            onClick={handleView}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { color: 'primary.main' },
                                p: 0.5,
                            }}
                        >
                            <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleEdit}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { color: 'primary.main' },
                                p: 0.5,
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* Status Row */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
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
                            fontSize: '0.7rem',
                            height: 24,
                        }}
                    />
                </Box>

                {/* Topic Events Row */}
                {record.topic && (
                    <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                        {record.topic.onCreate && (
                            <Chip label="Create" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                        )}
                        {record.topic.onUpdate && (
                            <Chip label="Update" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                        )}
                        {record.topic.onDelete && (
                            <Chip label="Delete" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                        )}
                    </Stack>
                )}

                {/* Footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Updated {new Date(record.updatedAt).toLocaleDateString()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export const SubscriberMobileGrid: React.FC = () => {
    const { data, isLoading } = useListContext();

    if (isLoading) {
        return (
            <Box sx={{ p: 2 }}>
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
                    minHeight: 300,
                    textAlign: 'center',
                    p: 3,
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
        <Box sx={{ p: 2 }}>
            {data.map((record: any) => (
                <SubscriberMobileCard key={record.id} record={record} />
            ))}
        </Box>
    );
};
