import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    useTheme,
} from '@mui/material';
import {
    Business as BusinessIcon,
} from '@mui/icons-material';

export const OrganizationMobileHeader: React.FC = () => {
    const theme = useTheme();

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                borderBottom: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Toolbar sx={{ px: 2, py: 1 }}>
                <Avatar
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        width: 40,
                        height: 40,
                        mr: 2,
                    }}
                >
                    <BusinessIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={700} color="inherit">
                    Organizations
                </Typography>
            </Toolbar>
        </AppBar>
    );
};
