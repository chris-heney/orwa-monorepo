import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Grid,
    useTheme,
    Stack,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Language as LanguageIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Launch as LaunchIcon,
} from '@mui/icons-material';
import { useListContext } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { Organization } from '@ci-connect/types';
import { formatPhoneNumber } from '../form-sections/organization-contact/utils';

const OrganizationGridCard = ({ record }: { record: Organization }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const hasWebsite = Boolean(record.projectDetails?.currentWebsiteUrl);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/organization/${record.id}`);
    };

    const handleView = () => {
        navigate(`/organization/${record.id}/show`);
    };

    const handleOpenUrl = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (record.projectDetails?.currentWebsiteUrl) {
            window.open(`https://${record.projectDetails.currentWebsiteUrl}`, '_blank');
        }
    };

    return (
        <Card
            onClick={handleView}
            sx={{
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 16px 40px ${theme.palette.primary.main}20`,
                    borderColor: theme.palette.primary.main,
                },
                '&:active': {
                    transform: 'translateY(-4px)',
                },
            }}
        >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        src={typeof (record as any).logo === 'string' ? (record as any).logo : undefined}
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.main',
                            mr: 2,
                            boxShadow: theme.shadows[3],
                        }}
                    >
                        <BusinessIcon fontSize="large" />
                    </Avatar>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                lineHeight: 1.2,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '2.4rem',
                            }}
                        >
                            {record.name}
                        </Typography>
                        
                        <Chip
                            label={record.organizationType}
                            size="small"
                            sx={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                bgcolor: `${theme.palette.primary.main}10`,
                                color: theme.palette.primary.main,
                                border: `1px solid ${theme.palette.primary.main}30`,
                            }}
                        />
                    </Box>
                </Box>

                {/* Contact info */}
                <Box sx={{ flex: 1, mb: 2 }}>
                    <Stack spacing={1.5}>
                        {record.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1,
                                    }}
                                >
                                    {record.email}
                                </Typography>
                            </Box>
                        )}
                        
                        {record.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                    {formatPhoneNumber(record.phone)}
                                </Typography>
                            </Box>
                        )}
                        
                        {hasWebsite && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LanguageIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1,
                                        cursor: 'pointer',
                                        color: 'primary.main',
                                        textDecoration: 'underline',
                                    }}
                                    onClick={handleOpenUrl}
                                >
                                    {record.projectDetails?.currentWebsiteUrl}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={handleOpenUrl}
                                    sx={{ ml: 0.5 }}
                                >
                                    <LaunchIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                    </Stack>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        ID: {record.id}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            size="small"
                            onClick={handleView}
                            sx={{
                                bgcolor: `${theme.palette.primary.main}08`,
                                '&:hover': {
                                    bgcolor: `${theme.palette.primary.main}15`,
                                },
                            }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                        
                        <IconButton
                            size="small"
                            onClick={handleEdit}
                            sx={{
                                bgcolor: `${theme.palette.primary.main}08`,
                                '&:hover': {
                                    bgcolor: `${theme.palette.primary.main}15`,
                                },
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export const OrganizationGridView: React.FC = () => {
    const { data, isLoading } = useListContext();

    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Loading organizations...
                </Typography>
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No organizations found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or create a new organization
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {data.map((record: Organization) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={record.id}>
                        <OrganizationGridCard record={record} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
