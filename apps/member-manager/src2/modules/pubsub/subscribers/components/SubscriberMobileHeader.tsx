import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    useTheme,
    Paper,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

export const SubscriberMobileHeader: React.FC = () => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 0,
            }}
        >
            <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                    }}
                >
                    <NotificationsIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box flex={1} minWidth={0}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: '1.5rem',
                            lineHeight: 1.2,
                        }}
                    >
                        Subscriber Management
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ 
                            fontWeight: 500,
                            display: 'block',
                            mt: 0.5,
                        }}
                    >
                        Manage topic subscribers
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};
