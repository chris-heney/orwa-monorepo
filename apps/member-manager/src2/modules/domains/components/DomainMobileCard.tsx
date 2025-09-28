import React from 'react';
import { Avatar, Box, Card, CardContent, Chip, Typography, useTheme } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { DomainStatusField } from './DomainStatusField';

export const DomainMobileCard = ({ record }: { record: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    if (!record) return null;

    const hasUrl = Boolean(record.url);
    const hasTechnology = Boolean(record.technology);

    return (
        <Card
            variant="outlined"
            onClick={() => navigate(`/domain/${record.id}/show`)}
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
                        <PublicIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ fontSize: '1rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}
                        >
                            {record.domain}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                    <DomainStatusField />
                    {hasTechnology && (
                        <Chip
                            label={record.technology}
                            size="small"
                            sx={{ height: 24, fontSize: '0.7rem', '& .MuiChip-label': { px: 1 } }}
                        />
                    )}
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    {hasUrl ? (
                        <Chip
                            icon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                            label="URL"
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={e => {
                                e.stopPropagation();
                                window.open(record.url.startsWith('http') ? record.url : `https://${record.url}`, '_blank');
                            }}
                            sx={{ height: 28, fontSize: '0.7rem', '& .MuiChip-icon': { width: 14, height: 14 }, '& .MuiChip-label': { px: 1 } }}
                        />
                    ) : null}

                    <Box display="flex" gap={0.5} ml="auto">
                        <Chip
                            icon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                            label="View"
                            size="small"
                            variant="outlined"
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/domain/${record.id}/show`);
                            }}
                        />
                        <Chip
                            icon={<EditIcon sx={{ fontSize: 16 }} />}
                            label="Edit"
                            size="small"
                            variant="outlined"
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/domain/${record.id}`);
                            }}
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DomainMobileCard;


