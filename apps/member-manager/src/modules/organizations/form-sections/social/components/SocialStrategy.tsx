import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Chip, Grid2, Paper, Typography } from '@mui/material';
import { BooleanInput, TextInput, useInput } from 'react-admin';
import { styles } from '../styles';

// Content types for social media
const contentTypes = [
    'Text posts',
    'Images',
    'Videos',
    'Stories',
    'Reels/Short-form video',
    'Live streams',
    'Polls',
    'Infographics',
    'Testimonials',
    'Behind-the-scenes',
    'Product showcases',
    'Educational content',
    'User-generated content',
];

const SocialStrategy = () => {
    // Use useInput hook for form integration
    const { field: contentTypesField } = useInput({
        source: 'social.socialMediaContentTypes',
    });

    // Get current content types
    const selectedContentTypes: string[] = Array.isArray(
        contentTypesField.value
    )
        ? contentTypesField.value
        : typeof contentTypesField.value === 'string'
        ? JSON.parse(contentTypesField.value || '[]')
        : [];

    // Handle content type selection
    const handleContentTypeToggle = (contentType: string) => {
        let updatedTypes: string[];

        if (selectedContentTypes.includes(contentType)) {
            updatedTypes = selectedContentTypes.filter(
                type => type !== contentType
            );
        } else {
            updatedTypes = [...selectedContentTypes, contentType];
        }

        contentTypesField.onChange(updatedTypes);
    };

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <CheckCircleIcon sx={styles.icon} />
                <Typography variant="h6">Social Media Strategy</Typography>
            </Box>

            <Typography variant="body2" paragraph color="text.secondary">
                Details about your social media strategy and content approach.
            </Typography>

            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="social.hasSocialMediaStrategy"
                            label="Do you have a social media strategy in place?"
                            helperText="A documented plan for your social media activities"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Content Types
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                    >
                        What types of content do you currently use or plan to
                        use on social media?
                    </Typography>

                    <Box sx={styles.chipContainer}>
                        {contentTypes.map((type, index) => (
                            <Chip
                                key={index}
                                label={type}
                                variant="outlined"
                                sx={{
                                    ...styles.socialChip,
                                    ...(selectedContentTypes.includes(type)
                                        ? styles.selectedChip
                                        : {}),
                                }}
                                onClick={() => handleContentTypeToggle(type)}
                            />
                        ))}
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="social.idealSocialMediaAudience"
                            label="Target Audience"
                            fullWidth
                            multiline
                            rows={3}
                            helperText="Describe your ideal audience for social media content"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="social.socialMediaBrandVoice"
                            label="Brand Voice"
                            fullWidth
                            multiline
                            rows={3}
                            helperText="How would you describe your brand's voice on social media?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="social.needSocialMediaAdvertising"
                            label="Do you need social media advertising?"
                            helperText="Paid promotion of content on social platforms"
                        />
                    </Box>
                </Grid2>
            </Grid2>

            {/* Hidden input for content types */}
            <Box sx={{ display: 'none' }}>
                <TextInput source="social.socialMediaContentTypes" />
            </Box>
        </Paper>
    );
};

export default SocialStrategy;
