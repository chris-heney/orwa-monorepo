import React from 'react';
import {
    Avatar,
    Box,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import { CreateButton } from 'react-admin';

export const SubscriberHeader: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    return (
        <Paper
            elevation={0}
            sx={{
                mb: 2,
                p: { xs: 2, md: 3 },
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                gap={2}
                justifyContent="space-between"
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: { xs: 48, md: 56 },
                            height: { xs: 48, md: 56 },
                            flexShrink: 0,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                        }}
                    >
                        <NotificationsIcon fontSize={isMobile ? 'medium' : 'large'} />
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography
                            variant={isMobile ? 'h5' : 'h4'}
                            fontWeight={700}
                            gutterBottom
                            sx={{
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: { xs: '1.75rem', md: '2.125rem' },
                            }}
                        >
                            Subscriber Management
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                        >
                            Manage topic subscribers and notification endpoints
                        </Typography>
                    </Box>
                </Box>

                {/* Add Subscriber Button */}
                {isMobile ? (
                    <CreateButton
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                            borderRadius: 8,
                            minWidth: 0,
                            width: 40,
                            height: 40,
                            p: 0,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                        }}
                    >
                        <AddIcon />
                    </CreateButton>
                ) : (
                    <CreateButton
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{
                            borderRadius: 2,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 6px 16px ${theme.palette.primary.main}40`,
                            },
                            transition: 'all 0.2s',
                            px: 3,
                        }}
                    >
                        Add Subscriber
                    </CreateButton>
                )}
            </Box>
        </Paper>
    );
};

export default SubscriberHeader;
