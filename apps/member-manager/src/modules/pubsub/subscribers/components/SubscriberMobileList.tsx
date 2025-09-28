import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Chip,
    useTheme,
    Avatar,
    Divider,
} from '@mui/material';
import {
    Edit as EditIcon,
    ChevronRight as ChevronRightIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ReferenceField, TextField, useListContext } from 'react-admin';

const SubscriberMobileListItem = ({
    record,
    isLast,
}: {
    record: any;
    isLast: boolean;
}) => {
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

    const handleView = () => {
        window.location.href = `#/pub-sub-subscriber/${record.id}/show`;
    };

    return (
        <>
            <ListItem
                component="div"
                onClick={handleView}
                sx={{
                    py: 2,
                    px: 2,
                    '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}08`,
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    {/* Avatar */}
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        }}
                    >
                        <NotificationsIcon fontSize="small" />
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 0.5,
                            }}
                        >
                            <ReferenceField
                                source="topicId"
                                reference="pub-sub-topic"
                                label="Topic"
                                link="show"
                                sx={{
                                    display: { xs: 'none', sm: 'table-cell' },
                                }}
                            >
                                <TextField source="name" />
                            </ReferenceField>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 0.5,
                            }}
                        >
                            <Chip
                                label={record.type}
                                color={getTypeColor(record.type) as any}
                                size="small"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.65rem',
                                    height: 20,
                                    '& .MuiChip-label': { px: 1 },
                                }}
                            />
                            {record.topic && (
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {record.topic.onCreate && (
                                        <Chip
                                            label="C"
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                fontSize: '0.6rem',
                                                height: 18,
                                                minWidth: 18,
                                            }}
                                        />
                                    )}
                                    {record.topic.onUpdate && (
                                        <Chip
                                            label="U"
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                fontSize: '0.6rem',
                                                height: 18,
                                                minWidth: 18,
                                            }}
                                        />
                                    )}
                                    {record.topic.onDelete && (
                                        <Chip
                                            label="D"
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                fontSize: '0.6rem',
                                                height: 18,
                                                minWidth: 18,
                                            }}
                                        />
                                    )}
                                </Box>
                            )}
                        </Box>

                        {record.endpoint && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    fontSize: '0.7rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'block',
                                }}
                            >
                                {record.endpoint}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <ListItemSecondaryAction>
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                        <IconButton
                            size="small"
                            onClick={e => {
                                e.stopPropagation();
                                handleView();
                            }}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { color: 'primary.main' },
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
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <ChevronRightIcon
                            fontSize="small"
                            sx={{ color: 'text.disabled', ml: 0.5 }}
                        />
                    </Box>
                </ListItemSecondaryAction>
            </ListItem>
            {!isLast && <Divider variant="inset" component="li" />}
        </>
    );
};

export const SubscriberMobileList: React.FC = () => {
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
        <List sx={{ p: 0 }}>
            {data.map((record: any, index: number) => (
                <SubscriberMobileListItem
                    key={record.id}
                    record={record}
                    isLast={index === data.length - 1}
                />
            ))}
        </List>
    );
};
