import { Organization } from '@ci-connect/types';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import LinkIcon from '@mui/icons-material/Link';
import RateReviewIcon from '@mui/icons-material/RateReview';
import BusinessIcon from '@mui/icons-material/Business';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid2,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

interface FieldProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    emptyText?: string;
}

const Field: React.FC<FieldProps> = ({
    label,
    value,
    icon,
    emptyText = '—',
}) => (
    <ListItem disableGutters>
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText
            primary={label}
            secondary={value || emptyText}
            primaryTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
            }}
            secondaryTypographyProps={{ variant: 'body1' }}
        />
    </ListItem>
);

const BooleanField: React.FC<{
    label: string;
    value: boolean | null | undefined;
    icon: React.ReactNode;
}> = ({ label, value, icon }) => (
    <ListItem disableGutters>
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText
            primary={label}
            secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    {value ? (
                        <>
                            <CheckCircleIcon
                                color="success"
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />
                            <Typography variant="body1">Enabled</Typography>
                        </>
                    ) : (
                        <>
                            <CancelIcon
                                color="error"
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />
                            <Typography variant="body1">Disabled</Typography>
                        </>
                    )}
                </Box>
            }
            primaryTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
            }}
        />
    </ListItem>
);

const EnumField: React.FC<{
    label: string;
    value: string | null | undefined;
    icon: React.ReactNode;
    enumLabels: Record<string, string>;
}> = ({ label, value, icon, enumLabels }) => (
    <ListItem disableGutters>
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText
            primary={label}
            secondary={
                value ? (
                    <Chip
                        label={enumLabels[value] || value}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
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
);

export const CortexShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    // Cortex fields are now flattened directly on the Organization model
    const cortex = record;

    // Enum label mappings
    const seoObjectiveLabels = {
        ACCURACY: 'Accuracy - Strict relevance',
        BALANCED: 'Balanced - Mixed approach',
        PERFORMANCE: 'Performance - Fast growth'
    };

    const publishModeLabels = {
        AUTO: 'Auto - Automatic publishing',
        MANUAL: 'Manual - Requires approval'
    };

    const reviewModeLabels = {
        COMMENTS_ONLY: 'Comments Only - Feedback only',
        APPROVAL_REQUIRED: 'Approval Required - Full approval required'
    };

    const authorPovLabels = {
        FIRST_PERSON: 'First Person - "I" perspective',
        THIRD_PERSON: 'Third Person - "They/The company" perspective'
    };

    const ctaQuantityLabels = {
        AI_DECIDE: 'AI Decide - Let AI determine optimal frequency',
        low: 'Low - Minimal CTAs',
        medium: 'Medium - Moderate CTAs',
        high: 'High - Frequent CTAs'
    };

    const pricingMentionLabels = {
        never: 'Never - Never mention pricing',
        sometimes: 'Sometimes - Occasionally mention pricing',
        always: 'Always - Always include pricing'
    };

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Cortex AI Configuration</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid2 container spacing={3}>
                {/* Company Strategy & Positioning */}
                <Grid2 size={{ xs: 12 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <BusinessCenterIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Company Strategy & Positioning</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <Field
                                    label="Company Strategy"
                                    value={cortex.companyStrategy}
                                    icon={<BusinessCenterIcon color="action" />}
                                    emptyText="No company strategy defined"
                                />
                                
                                <Field
                                    label="Customer Avatar"
                                    value={cortex.customerAvatar}
                                    icon={<PersonIcon color="action" />}
                                    emptyText="No customer avatar defined"
                                />
                                
                                <Field
                                    label="Short Description"
                                    value={cortex.descriptionShort}
                                    icon={<BusinessCenterIcon color="action" />}
                                    emptyText="No short description defined"
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* SEO Configuration */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SearchIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">SEO Configuration</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <EnumField
                                    label="SEO Objective"
                                    value={(cortex as any).seoObjective}
                                    icon={<SearchIcon color="action" />}
                                    enumLabels={seoObjectiveLabels}
                                />
                                
                                <EnumField
                                    label="Publish Content Mode"
                                    value={cortex.publishContentMode}
                                    icon={<SearchIcon color="action" />}
                                    enumLabels={publishModeLabels}
                                />
                                
                                <BooleanField
                                    label="Local SEO Enabled"
                                    value={cortex.localSeoEnabled}
                                    icon={<SearchIcon color="action" />}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Author Configuration */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PersonIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Author Configuration</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <Field
                                    label="Author Name & Title"
                                    value={cortex.authorNameAndTitle}
                                    icon={<PersonIcon color="action" />}
                                    emptyText="No author configured"
                                />
                                
                                <EnumField
                                    label="Author Point of View"
                                    value={(cortex as any).authorPointOfView}
                                    icon={<PersonIcon color="action" />}
                                    enumLabels={authorPovLabels}
                                />
                                
                                <BooleanField
                                    label="Mention Author in Articles"
                                    value={cortex.mentionAuthorInArticles}
                                    icon={<PersonIcon color="action" />}
                                />
                                
                                <Field
                                    label="Author Override"
                                    value={cortex.authorOverride}
                                    icon={<PersonIcon color="action" />}
                                    emptyText="No author override set"
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Content & Review */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <RateReviewIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Content & Review</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <EnumField
                                    label="Article Review Mode"
                                    value={cortex.customerArticleReviewMode}
                                    icon={<RateReviewIcon color="action" />}
                                    enumLabels={reviewModeLabels}
                                />
                                
                                <EnumField
                                    label="CTA Quantity"
                                    value={(cortex as any).ctaQuantity}
                                    icon={<RateReviewIcon color="action" />}
                                    enumLabels={ctaQuantityLabels}
                                />
                                
                                <EnumField
                                    label="Pricing Mentions"
                                    value={(cortex as any).mentionPricing}
                                    icon={<RateReviewIcon color="action" />}
                                    enumLabels={pricingMentionLabels}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Link Management */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LinkIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Link Management</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <Field
                                    label="Internal Link Targets"
                                    value={
                                        cortex.internalLinkTargets && cortex.internalLinkTargets.length > 0 ? (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                {cortex.internalLinkTargets.map((target: string, index: number) => (
                                                    <Chip key={index} label={target} size="small" />
                                                ))}
                                            </Box>
                                        ) : null
                                    }
                                    icon={<LinkIcon color="action" />}
                                    emptyText="No internal link targets configured"
                                />
                                
                                <BooleanField
                                    label="External Links Enabled"
                                    value={(cortex as any).enableExternalLinks}
                                    icon={<LinkIcon color="action" />}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Image Configuration */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ImageIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Image Configuration</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <Field
                                    label="Custom Uploaded Images"
                                    value={cortex.imageCustomUploaded || 0}
                                    icon={<ImageIcon color="action" />}
                                />
                                
                                <BooleanField
                                    label="Custom Infographics"
                                    value={cortex.imageCustomInfographics}
                                    icon={<ImageIcon color="action" />}
                                />
                                
                                <BooleanField
                                    label="Stock Images Enabled"
                                    value={cortex.imageStockEnabled}
                                    icon={<ImageIcon color="action" />}
                                />
                                
                                <BooleanField
                                    label="AI Images Enabled"
                                    value={cortex.aiImagesEnabled}
                                    icon={<ImageIcon color="action" />}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Article & Blog Configuration */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ArticleIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Article Configuration</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <Field
                                    label="Article Length Mode"
                                    value={cortex.articleLengthMode === 'SMART' ? 'Smart - AI optimizes length' : 'Manual - Fixed custom length'}
                                    icon={<ArticleIcon color="action" />}
                                />
                                
                                <BooleanField
                                    label="Automated Blog Posting"
                                    value={cortex.automatedBlogPosting}
                                    icon={<ArticleIcon color="action" />}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Backlink & PR Configuration */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LinkIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Backlink & PR</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <BooleanField
                                    label="Backlink Building Enabled"
                                    value={cortex.backlinkBuildingEnabled}
                                    icon={<LinkIcon color="action" />}
                                />
                                
                                <Field
                                    label="Author Name"
                                    value={(cortex as any).backlinkAuthorName}
                                    icon={<PersonIcon color="action" />}
                                    emptyText="No author name configured"
                                />
                                
                                <Field
                                    label="Author LinkedIn"
                                    value={(cortex as any).backlinkAuthorLinkedin}
                                    icon={<PersonIcon color="action" />}
                                    emptyText="No LinkedIn profile configured"
                                />
                                
                                <BooleanField
                                    label="Find More Topics with AI"
                                    value={(cortex as any).findMoreTopicsAi}
                                    icon={<AutoAwesomeIcon color="action" />}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Google Business Profile */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Google Business Profile</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <BooleanField
                                    label="Access GBP"
                                    value={cortex.accessGbp}
                                    icon={<BusinessIcon color="action" />}
                                />
                                
                                <BooleanField
                                    label="Publish New Posts"
                                    value={cortex.publishNewPosts}
                                    icon={<BusinessIcon color="action" />}
                                />
                                
                                <Field
                                    label="Post Frequency"
                                    value={cortex.postFrequency}
                                    icon={<BusinessIcon color="action" />}
                                    emptyText="No frequency set"
                                />
                                
                                <Field
                                    label="Minimum Rating"
                                    value={cortex.minimumRating}
                                    icon={<BusinessIcon color="action" />}
                                />
                                
                                <BooleanField
                                    label="Facebook Enabled"
                                    value={(cortex as any).facebookEnabled}
                                    icon={<BusinessIcon color="action" />}
                                />
                                
                                <BooleanField
                                    label="Instagram Enabled"
                                    value={(cortex as any).instagramEnabled}
                                    icon={<BusinessIcon color="action" />}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Review Management */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <RateReviewIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Review Management</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <BooleanField
                                    label="Automated Review Responses"
                                    value={cortex.reviewResponseAutomated}
                                    icon={<RateReviewIcon color="action" />}
                                />
                                
                                <Field
                                    label="Auto Response Min Rating"
                                    value={cortex.reviewResponseAutomaticMinRating}
                                    icon={<RateReviewIcon color="action" />}
                                />
                                
                                <BooleanField
                                    label="Automatic Approval"
                                    value={cortex.reviewResponseAutomaticApproval}
                                    icon={<RateReviewIcon color="action" />}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default CortexShow;



