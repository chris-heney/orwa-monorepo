import { Organization, OrganizationSEO } from '@ci-connect/types';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

// Field component for SEO attributes
const SEOField = ({
    label,
    value,
}: {
    label: string;
    value?: string | null | boolean;
}) => (
    <ListItem disableGutters sx={{ mb: 1 }}>
        <ListItemText
            primary={label}
            secondary={
                typeof value === 'boolean'
                    ? value
                        ? 'Yes'
                        : 'No'
                    : value || '—'
            }
            primaryTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
            }}
            secondaryTypographyProps={{ variant: 'body1' }}
        />
    </ListItem>
);

export const SEOShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const seo = (record as any).seo || ({} as OrganizationSEO);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SearchIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Search Engine Optimization</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                {/* Primary Services */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <SearchIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Services & Keywords
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <SEOField
                                    label="Primary Services"
                                    value={seo.primaryServices}
                                />

                                <SEOField
                                    label="Secondary Services"
                                    value={seo.secondaryServices}
                                />

                                {seo.targetKeywords?.map((keyword: any) => (
                                    <SEOField
                                        label="Target Keywords"
                                        value={keyword}
                                    />
                                ))}

                                <SEOField
                                    label="Keyword Research Needed"
                                    value={seo.keywordResearchNeeded}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Target Locations */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <LocationOnIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Target Locations
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <ListItem disableGutters>
                                    <ListItemText
                                        primary="Target Cities"
                                        secondary={
                                            seo.targetCities &&
                                            seo.targetCities.length > 0 ? (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 1,
                                                        mt: 1,
                                                    }}
                                                >
                                                    {seo.targetCities.map(
                                                        (
                                                            city: string,
                                                            index: number
                                                        ) => (
                                                            <Chip
                                                                key={index}
                                                                label={city}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        )
                                                    )}
                                                </Box>
                                            ) : (
                                                '—'
                                            )
                                        }
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            color: 'textSecondary',
                                        }}
                                    />
                                </ListItem>

                                <SEOField
                                    label="Local SEO Focus"
                                    value={seo.localSeoFocus}
                                />

                                {seo.industryDirectories?.map(
                                    (directory: any) => (
                                        <SEOField
                                            label="Industry Directories"
                                            value={directory}
                                        />
                                    )
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Competitor Analysis */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <CompareArrowsIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Competitor Analysis
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                {seo.competitorSeoAnalysis?.map(
                                    (analysis: any) => (
                                        <SEOField
                                            label="Competitor SEO Analysis"
                                            value={analysis}
                                        />
                                    )
                                )}

                                <SEOField
                                    label="Backlinks & Domain Authority"
                                    value={seo.backlinksDomainAuthority}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Technical SEO */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <CodeIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Technical SEO
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <SEOField
                                    label="Google Search Console Access"
                                    value={seo.googleSearchConsoleAccess}
                                />

                                <SEOField
                                    label="GA4 Access"
                                    value={seo.ga4Access}
                                />

                                <SEOField
                                    label="Schema Markup Needed"
                                    value={seo.schemaMarkupNeeded}
                                />

                                <SEOField
                                    label="Page Speed Review"
                                    value={seo.pageSpeedReview}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Content Strategy */}
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <ArticleIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Content Strategy
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <SEOField
                                        label="Has Blog"
                                        value={seo.hasBlog}
                                    />

                                    <SEOField
                                        label="Content Audit"
                                        value={seo.contentAudit}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <SEOField
                                        label="Internal Linking Strategy"
                                        value={seo.internalLinkingStrategy}
                                    />

                                    <SEOField
                                        label="Has SEO Strategy"
                                        value={seo.hasSeoStrategy}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default SEOShow;
