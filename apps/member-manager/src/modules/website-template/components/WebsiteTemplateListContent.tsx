import ResponsiveWebsiteTemplateList from './ResponsiveTemplateList';
import { Web as WebIcon } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Container,
    Fade,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';

const WebsiteTemplateListContent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Container
            maxWidth={false}
            sx={{
                width: '100%',
                paddingLeft: 0,
                paddingRight: 0,
                py: { xs: 1, md: 2 },
            }}
        >
            <Fade in timeout={600}>
                <Box sx={{ width: '100%' }}>
                    {/* Header Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, md: 3 },
                            mb: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            width: '100%',
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    width: { xs: 48, md: 56 },
                                    height: { xs: 48, md: 56 },
                                }}
                            >
                                <WebIcon
                                    fontSize={isMobile ? 'medium' : 'large'}
                                />
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h4"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Website Templates
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Manage website templates for your onboarding
                                    flow
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Main Content */}
                    <Paper
                        elevation={0}
                        sx={{
                            overflow: 'hidden',
                            width: '100%',
                            border: 0,
                        }}
                    >
                        <ResponsiveWebsiteTemplateList />
                    </Paper>
                </Box>
            </Fade>
        </Container>
    );
};

export default WebsiteTemplateListContent;
