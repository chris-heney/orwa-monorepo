import { Card, CardContent, Box, Avatar, Typography, useTheme } from '@mui/material';
import { Web as WebIcon } from '@mui/icons-material';
import { Chip, IconButton } from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const WebsiteTemplateMobileCard = ({ record }: { record: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Card
            variant="outlined"
            onClick={() => navigate(`/website-template/${record.id}`)}
            sx={{
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.main,
                },
                '&:active': {
                    transform: 'translateY(0px)',
                },
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: record.isActive
                                ? 'primary.main'
                                : 'grey.500',
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: theme.shadows[2],
                        }}
                    >
                        <WebIcon />
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="h6"
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
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            flexWrap="wrap"
                        >
                            <Chip
                                label={record.style}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{
                                    height: 24,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                }}
                            />
                            {record.industry && (
                                <Chip
                                    label={record.industry.name}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Description and Actions */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box flex={1} minWidth={0} mr={2}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {record.description || 'No description'}
                        </Typography>
                    </Box>

                    <Box display="flex" gap={0.5}>
                        <IconButton
                            size="small"
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/website-template/${record.id}/show`);
                            }}
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
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/website-template/${record.id}`);
                            }}
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

export default WebsiteTemplateMobileCard;
