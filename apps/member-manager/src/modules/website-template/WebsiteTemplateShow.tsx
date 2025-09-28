import {
    Visibility as VisibilityIcon,
    Language as WebIcon,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Fade,
    Grid2,
    Link,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import {
    DeleteButton,
    EditButton,
    Show,
    SimpleShowLayout,
    TopToolbar,
    useRecordContext,
} from 'react-admin';

// Tab Configuration
const TabConfig = [
    {
        key: 'overview',
        label: 'Overview',
        shortLabel: 'Overview',
        icon: <WebIcon />,
        component: OverviewTab,
        priority: 1,
    },
    {
        key: 'preview',
        label: 'Preview',
        shortLabel: 'Preview',
        icon: <VisibilityIcon />,
        component: PreviewTab,
        priority: 1,
    },
];

// Overview Tab Component
function OverviewTab() {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Box>
            {/* Template Status Card */}
            <Card sx={{ borderRadius: 0 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar
                            sx={{
                                bgcolor: record.isActive
                                    ? 'primary.main'
                                    : 'grey.500',
                                width: 56,
                                height: 56,
                            }}
                        >
                            <WebIcon />
                        </Avatar>
                        <Box flex={1}>
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                gutterBottom
                            >
                                {record.name}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                {record.isActive ? (
                                    <Chip
                                        label="Active"
                                        color="success"
                                        size="small"
                                    />
                                ) : (
                                    <Chip
                                        label="Inactive"
                                        color="default"
                                        size="small"
                                    />
                                )}
                                <Chip
                                    label={record.style}
                                    variant="outlined"
                                    size="small"
                                />
                                {record.industry && (
                                    <Chip
                                        label={record.industry.name}
                                        variant="outlined"
                                        size="small"
                                        color="secondary"
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {record.description && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            {record.description}
                        </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Slug
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontFamily: 'monospace', mb: 2 }}
                            >
                                {record.slug}
                            </Typography>

                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Style
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {record.style}
                            </Typography>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Industry
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {record.industry?.name ||
                                    'No industry assigned'}
                            </Typography>

                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Sort Order
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {record.sortOrder || 0}
                            </Typography>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Created
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {record.createdAt
                                    ? new Date(
                                          record.createdAt
                                      ).toLocaleString()
                                    : 'N/A'}
                            </Typography>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Last Updated
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {record.updatedAt
                                    ? new Date(
                                          record.updatedAt
                                      ).toLocaleString()
                                    : 'N/A'}
                            </Typography>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>

            {/* Features */}
            <Card sx={{ borderRadius: 0 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Features
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Key features included in this template:
                    </Typography>

                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {record.features && Array.isArray(record.features) ? (
                            record.features.map(
                                (feature: string, index: number) => (
                                    <Chip
                                        key={index}
                                        label={feature}
                                        variant="outlined"
                                        size="small"
                                    />
                                )
                            )
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No features defined
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* URLs */}
            <Card sx={{ borderRadius: 0 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        URLs
                    </Typography>

                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Preview URL
                            </Typography>
                            <Link
                                href={record.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ wordBreak: 'break-all' }}
                            >
                                {record.websiteUrl}
                            </Link>
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                            >
                                Image URL
                            </Typography>
                            <Link
                                href={record.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ wordBreak: 'break-all' }}
                            >
                                {record.websiteUrl}
                            </Link>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>
        </Box>
    );
}

// Preview Tab Component
function PreviewTab() {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Box>
            {/* Template Preview iframe */}
            <Box
                sx={{
                    width: '100%',
                    height: '90vh',
                    overflow: 'hidden',
                }}
            >
                {record.websiteUrl ? (
                    <iframe
                        src={record.websiteUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}
                        title={`Preview of ${record.name}`}
                        loading="lazy"
                    />
                ) : (
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        bgcolor="grey.100"
                    >
                        <Typography variant="body2" color="text.secondary">
                            No preview URL available
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

// Show actions toolbar
const WebsiteTemplateShowActions = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <TopToolbar>
            <EditButton
                label={isMobile ? 'Edit' : 'Edit Template'}
                size={isMobile ? 'small' : 'medium'}
            />
            <DeleteButton
                confirmTitle="Delete Template"
                confirmContent="Are you sure you want to delete this website template? This action cannot be undone."
                size={isMobile ? 'small' : 'medium'}
            />
        </TopToolbar>
    );
};

// Main Show Context Component
const ShowContext = () => {
    const theme = useTheme();
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                width: '100%',
                maxWidth: '100vw',
            }}
        >
            <Fade in timeout={600}>
                <Paper
                    elevation={0}
                    sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        overflow: 'hidden',
                        width: '100%',
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    {/* Custom Tab Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                        }}
                    >
                        {TabConfig.map((tab, index) => (
                            <Box
                                key={tab.key}
                                onClick={() => handleTabChange(index)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: { xs: 1, sm: 1.5, md: 2 },
                                    py: { xs: 1, sm: 1.5 },
                                    minHeight: 48,
                                    cursor: 'pointer',
                                    backgroundColor:
                                        currentTab === index
                                            ? theme.palette.action.selected
                                            : 'transparent',
                                    borderBottom:
                                        currentTab === index
                                            ? `2px solid ${theme.palette.primary.main}`
                                            : '2px solid transparent',
                                    color:
                                        currentTab === index
                                            ? theme.palette.primary.main
                                            : theme.palette.text.secondary,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor:
                                            theme.palette.action.hover,
                                        color: theme.palette.primary.main,
                                    },
                                    flexShrink: 0,
                                }}
                            >
                                {tab.icon}
                                <Typography
                                    variant="body2"
                                    fontWeight={
                                        currentTab === index ? 600 : 500
                                    }
                                    sx={{
                                        display: {
                                            xs: 'none',
                                            md: 'block',
                                        },
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {tab.shortLabel}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Tab Content */}
                    <Box
                        sx={{
                            width: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <Fade in timeout={300} key={currentTab}>
                            <Box>
                                {(() => {
                                    const Component =
                                        TabConfig[currentTab].component;
                                    return <Component />;
                                })()}
                            </Box>
                        </Fade>
                    </Box>

                    {/* Sticky Actions */}
                    <Box
                        sx={{
                            p: { xs: 1 },
                            borderTop: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                        }}
                    >
                        <WebsiteTemplateShowActions />
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

const WebsiteTemplateShow = () => {
    return (
        <Show
            sx={{
                width: '100%',
                maxWidth: '100%',
                padding: 0,
                mt: 0,
            }}
            component={'div'}
            actions={false}
            queryOptions={{
                meta: {
                    populate: 'industry',
                    raw: true,
                },
            }}
        >
            <SimpleShowLayout
                sx={{
                    width: '100%',
                    maxWidth: '100%',
                    padding: 0,
                    mt: 0,
                }}
            >
                <ShowContext />
            </SimpleShowLayout>
        </Show>
    );
};

export default WebsiteTemplateShow;
