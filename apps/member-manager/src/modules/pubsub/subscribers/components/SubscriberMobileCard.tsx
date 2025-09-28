import React from 'react';
import { 
    Avatar, 
    Box, 
    Card, 
    CardContent, 
    Chip, 
    Typography, 
    useTheme 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { SubscriberStatusField } from './SubscriberStatusField';

export const SubscriberMobileCard = ({ record }: { record: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    if (!record) return null;

    const getTypeColor = (type: string) => {
        const colors = {
            EMAIL: 'primary',
            ZOHO: 'secondary',
            ASANA: 'info',
        };
        return colors[type as keyof typeof colors] || 'default';
    };

    return (
        <Card
            variant="outlined"
            onClick={() => navigate(`/pub-sub-subscriber/${record.id}/show`)}
            sx={{
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: `1px solid ${theme.palette.divider}`,
                width: '100%',
                overflow: 'visible',
                '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.main,
                },
                '&:active': { transform: 'translateY(0px)' },
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', flexShrink: 0 }}>
                        <NotificationsIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ overflow: 'hidden', flex: 1 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ 
                                fontSize: '1rem', 
                                lineHeight: 1.2, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {record.topic?.name || 'Unknown Topic'}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ 
                                fontSize: '0.75rem',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {record.endpoint || 'No endpoint'}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                    <SubscriberStatusField />
                    <Chip
                        label={record.type}
                        size="small"
                        color={getTypeColor(record.type) as any}
                        variant="outlined"
                        sx={{ height: 24, fontSize: '0.7rem', '& .MuiChip-label': { px: 1 } }}
                    />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Typography variant="caption" color="text.secondary">
                        Updated {new Date(record.updatedAt).toLocaleDateString()}
                    </Typography>

                    <Box display="flex" gap={0.5}>
                        <Chip
                            icon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                            label="View"
                            size="small"
                            variant="outlined"
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/pub-sub-subscriber/${record.id}/show`);
                            }}
                        />
                        <Chip
                            icon={<EditIcon sx={{ fontSize: 16 }} />}
                            label="Edit"
                            size="small"
                            variant="outlined"
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/pub-sub-subscriber/${record.id}`);
                            }}
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SubscriberMobileCard;
