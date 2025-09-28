import StoreIcon from '@mui/icons-material/Store';
import { Box, Grid2, Paper, Typography } from '@mui/material';
import { BooleanInput, TextInput, SelectInput } from 'react-admin';
import { styles } from '../styles';

const GoogleBusinessProfile = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <StoreIcon sx={styles.icon} />
                <Typography variant="h6">Google Business Profile</Typography>
            </Box>

            <Typography variant="body2" paragraph color="text.secondary">
                Managing your Google Business Profile is essential for local
                visibility and customer reviews.
            </Typography>

            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="social.gbpClaimed"
                            label="Have you claimed your Google Business Profile?"
                            helperText="Whether you have ownership of your business listing on Google"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="social.needGbpOptimization"
                            label="Does your Google Business Profile need optimization?"
                            helperText="Updating photos, business info, categories, etc."
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="social.googleReviews"
                            label="Google Reviews Status"
                            fullWidth
                            helperText="Describe your current Google reviews (quantity, rating, how you respond)"
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="social.gbpPostStrategy"
                            label="Google Business Posts Strategy"
                            fullWidth
                            helperText="How do you use or plan to use Google Business posts?"
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Box>
                </Grid2>

                {/* Enhanced GBP Fields */}
                <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                        Enhanced GBP Configuration
                    </Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="accessGbp"
                            label="Has Google Business Profile Access"
                            helperText="Do you have access to your Google Business Profile?"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="publishNewPosts"
                            label="Publish New Posts Automatically"
                            helperText="Enable automatic publishing of new posts"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="postFrequency"
                            label="Posting Frequency"
                            choices={[
                                { id: 'daily', name: 'Daily' },
                                { id: 'weekly', name: 'Weekly' },
                                { id: 'bi-weekly', name: 'Bi-weekly' },
                                { id: 'monthly', name: 'Monthly' }
                            ]}
                            fullWidth
                            helperText="How often should posts be published?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="imageSource"
                            label="Image Source Preference"
                            choices={[
                                { id: 'AI_GENERATED', name: 'AI Generated' },
                                { id: 'STOCK_PHOTOS', name: 'Stock Photos' },
                                { id: 'CUSTOM_UPLOADS', name: 'Custom Uploads' }
                            ]}
                            fullWidth
                            helperText="Preferred source for images in posts"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="brandImages"
                            label="Use Brand Images"
                            helperText="Include brand images in posts"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="approvals"
                            label="Approval Mode"
                            choices={[
                                { id: 'NO', name: 'No Approval Required' },
                                { id: 'MANUAL', name: 'Manual Approval' },
                                { id: 'AUTO', name: 'Automatic Approval' }
                            ]}
                            fullWidth
                            helperText="How should posts be approved?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="callToActions"
                            label="Call to Actions"
                            fullWidth
                            multiline
                            rows={2}
                            helperText="Available call-to-action options (comma-separated)"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default GoogleBusinessProfile;
