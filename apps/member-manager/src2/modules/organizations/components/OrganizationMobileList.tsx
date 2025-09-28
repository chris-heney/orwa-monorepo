import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Stack,
    useTheme,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Language as LanguageIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { useListContext } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { Organization } from '@ci-connect/types';
import { formatPhoneNumber } from '../form-sections/organization-contact/utils';

const OrganizationMobileListItem = ({ record, isLast }: { record: Organization; isLast: boolean }) => {
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
                mb: isLast ? 0 : 1,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    borderColor: theme.palette.primary.main,
                },
                '&:active': {
                    transform: 'translateY(0)',
                },
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                {/* Header with avatar and name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                        src={typeof (record as any).logo === 'string' ? (record as any).logo : undefined}
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'primary.main',
                        }}
                    >
                        <BusinessIcon />
                    </Avatar>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{
                                fontSize: '1.1rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {record.name}
                        </Typography>
                        
                        <Chip
                            label={record.organizationType}
                            size="small"
                            sx={{
                                height: 24,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                bgcolor: `${theme.palette.primary.main}10`,
                                color: theme.palette.primary.main,
                                border: `1px solid ${theme.palette.primary.main}30`,
                            }}
                        />
                    </Box>
                </Box>

                {/* Contact information */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                    {record.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
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
                            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                {formatPhoneNumber(record.phone)}
                            </Typography>
                        </Box>
                    )}
                    
                    {hasWebsite && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LanguageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
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
                        </Box>
                    )}
                </Stack>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
            </CardContent>
        </Card>
    );
};

export const OrganizationMobileList: React.FC = () => {
    const { data, total, isLoading } = useListContext();

    if (isLoading) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
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
        <Box sx={{ p: 2 }}>
            {data.map((record: Organization, index: number) => (
                <OrganizationMobileListItem
                    key={record.id}
                    record={record}
                    isLast={index === data.length - 1}
                />
            ))}
        </Box>
    );
};
