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
    OpenInNew as ExternalLinkIcon,
    Edit as EditIcon,
    MoreVert as MoreIcon,
} from '@mui/icons-material';
import { useListContext, RecordContextProvider } from 'react-admin';
import { DomainStatusField } from './DomainStatusField';
import { DnsRecordsSummary } from './DnsRecordsSummary';

const DomainMobileCard = ({ record }: { record: any }) => {
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
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                mb: 0.5,
                                wordBreak: 'break-word',
                                fontSize: '1rem',
                            }}
                        >
                            {record.domain}
                        </Typography>
                        {record.url && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    display: 'block',
                                    wordBreak: 'break-word',
                                    fontSize: '0.75rem',
                                }}
                            >
                                {record.url}
                            </Typography>
                        )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        {record.url && (
                            <IconButton
                                size="small"
                                onClick={handleOpenUrl}
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': { color: 'primary.main' },
                                    p: 0.5,
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
                        <DomainStatusField />
                        <DnsRecordsSummary />
                    </RecordContextProvider>
                </Box>

                {/* Technology Row */}
                {record.technology && (
                    <Box sx={{ mb: 1.5 }}>
                        <Chip
                            label={record.technology}
                            color={getTechnologyColor(record.technology) as any}
                            size="small"
                            variant="outlined"
                            sx={{
                                fontWeight: 500,
                                fontSize: '0.7rem',
                                height: 24,
                            }}
                        />
                    </Box>
                )}

                {/* Organization & Provider Row */}
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {record.organization && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Avatar
                                sx={{
                                    width: 16,
                                    height: 16,
                                    fontSize: '0.6rem',
                                    bgcolor: 'primary.main',
                                }}
                            >
                                {record.organization.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                {record.organization.name}
                            </Typography>
                        </Box>
                    )}
                    
                    {record.hostingProvider && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Avatar
                                sx={{
                                    width: 16,
                                    height: 16,
                                    fontSize: '0.6rem',
                                    bgcolor: 'secondary.main',
                                }}
                            >
                                {record.hostingProvider.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                {record.hostingProvider.name}
                            </Typography>
                        </Box>
                    )}
                </Stack>

                {/* Footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Updated {new Date(record.updatedAt).toLocaleDateString()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export const DomainMobileGrid: React.FC = () => {
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
        <Box sx={{ p: 2 }}>
            {data.map((record: any) => (
                <DomainMobileCard key={record.id} record={record} />
            ))}
        </Box>
    );
};
