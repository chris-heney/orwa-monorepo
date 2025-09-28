import { Organization, OrganizationContent } from '@ci-connect/types';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

// Field component for content attributes
const ContentField = ({
    label,
    value,
}: {
    label: string;
    value?: string | boolean | null;
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

export const ContentShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const content = (record as any).content || ({} as OrganizationContent);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Content Strategy</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                {/* Content Needs */}
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
                                <DescriptionIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Content Needs
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <ContentField
                                    label="Content Needed"
                                    value={content.contentNeeded}
                                />

                                <ContentField
                                    label="Most Visible Services"
                                    value={content.mostVisibleServices}
                                />

                                <ContentField
                                    label="Need Help Writing Pages"
                                    value={content.needHelpWritingPages}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tone & Style */}
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
                                <TextFormatIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Tone & Style
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <ContentField
                                    label="Tone & Style Preferences"
                                    value={content.toneStylePreferences}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Customer Questions & Blog */}
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
                                <QuestionAnswerIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Customer Questions & Blog
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <ListItem disableGutters>
                                    <ListItemText
                                        primary="Top Customer Questions"
                                        secondary={
                                            content.topCustomerQuestions &&
                                            content.topCustomerQuestions
                                                .length > 0 ? (
                                                <Box sx={{ mt: 1 }}>
                                                    {content.topCustomerQuestions.map(
                                                        (
                                                            question: any,
                                                            index: number
                                                        ) => (
                                                            <Typography
                                                                key={index}
                                                                variant="body2"
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                • {question}
                                                            </Typography>
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

                                <ContentField
                                    label="Blog Content Needed"
                                    value={content.blogContentNeeded}
                                />

                                <ContentField
                                    label="FAQ Section Needed"
                                    value={content.faqSectionNeeded}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Media & Testimonials */}
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
                                <ImageIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Media & Testimonials
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <ContentField
                                    label="Has Professional Media"
                                    value={content.hasProfessionalMedia}
                                />

                                <ContentField
                                    label="Stock Photography Preferences"
                                    value={content.stockPhotographyPreferences}
                                />

                                <ListItem disableGutters sx={{ mt: 2 }}>
                                    <ListItemText
                                        primary="Customer Testimonials"
                                        secondary={
                                            content.customerTestimonials &&
                                            content.customerTestimonials
                                                .length > 0 ? (
                                                <Box sx={{ mt: 1 }}>
                                                    {content.customerTestimonials.map(
                                                        (
                                                            testimonial: any,
                                                            index: number
                                                        ) => (
                                                            <Box
                                                                key={index}
                                                                sx={{
                                                                    mb: 2,
                                                                    p: 1,
                                                                    bgcolor:
                                                                        'background.paper',
                                                                    borderRadius: 1,
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontStyle:
                                                                            'italic',
                                                                    }}
                                                                >
                                                                    "
                                                                    {
                                                                        testimonial.text
                                                                    }
                                                                    "
                                                                </Typography>
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        mt: 0.5,
                                                                        display:
                                                                            'block',
                                                                    }}
                                                                >
                                                                    —{' '}
                                                                    {testimonial.author ||
                                                                        'Anonymous'}
                                                                </Typography>
                                                            </Box>
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

                                <ContentField
                                    label="Case Studies Available"
                                    value={content.caseStudiesAvailable}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ContentShow;
