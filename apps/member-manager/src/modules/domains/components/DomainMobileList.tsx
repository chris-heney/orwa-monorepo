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
    OpenInNew as ExternalLinkIcon,
    Edit as EditIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useListContext, RecordContextProvider } from 'react-admin';
import { DomainStatusField } from './DomainStatusField';

const DomainMobileListItem = ({ record, isLast }: { record: any; isLast: boolean }) => {
    const theme = useTheme();

    const getTechnologyColor = (tech: string) => {
        const colors = {
            WordPress: 'error',
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

    const handleView = () => {
        window.location.href = `#/domain/${record.id}/show`;
    };

    const handleOpenUrl = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (record.url) {
            window.open(record.url, '_blank');
        }
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
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
                        {record.domain.charAt(0).toUpperCase()}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    flex: 1,
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {record.domain}
                            </Typography>
                            <RecordContextProvider value={record}>
                                <Box sx={{ flexShrink: 0 }}>
                                    <DomainStatusField />
                                </Box>
                            </RecordContextProvider>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            {record.technology && (
                                <Chip
                                    label={record.technology}
                                    color={getTechnologyColor(record.technology) as any}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        fontSize: '0.65rem',
                                        height: 20,
                                        '& .MuiChip-label': { px: 1 },
                                    }}
                                />
                            )}
                            {record.organization && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {record.organization.name}
                                </Typography>
                            )}
                        </Box>

                        {record.url && (
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
                                {record.url}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {record.url && (
                            <IconButton
                                size="small"
                                onClick={handleOpenUrl}
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': { color: 'primary.main' },
                                }}
                            >
                                <ExternalLinkIcon fontSize="small" />
                            </IconButton>
                        )}
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

export const DomainMobileList: React.FC = () => {
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
                    No domains found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or create a new domain.
                </Typography>
            </Box>
        );
    }

    return (
        <List sx={{ p: 0 }}>
            {data.map((record: any, index: number) => (
                <DomainMobileListItem 
                    key={record.id} 
                    record={record} 
                    isLast={index === data.length - 1}
                />
            ))}
        </List>
    );
};
