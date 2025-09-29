import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useTranslate } from 'react-admin';
import { Logo } from '../layout/Logo';

const DashboardBanner = () => {
    const theme = useTheme();
    const translate = useTranslate();

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
                   
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography
                            variant="h4"
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
                            {translate('pos.dashboard.banner.title', 'Welcome to Synapse')}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                        >
                            {translate('pos.dashboard.banner.subtitle', 'Manage your client organizations and their information')}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                    <Logo />
                </Box>
            </Box>
        </Paper>
    );
};

export default DashboardBanner;
