import React from 'react';
import { BooleanInput, SelectInput, NumberInput, TextInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ImageIcon from '@mui/icons-material/Image';
import StarIcon from '@mui/icons-material/Star';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { styles } from '../styles';

const GoogleBusinessProfile = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <BusinessIcon sx={styles.icon} />
                <Typography variant="h6">Google Business Profile & Local Posting</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure Google Business Profile posting, social media integration, and review management.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="accessGbp"
                            label="Access Google Business Profile"
                            helperText="Enable Google Business Profile management"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="publishNewPosts"
                            label="Publish New Posts"
                            helperText="Automatically publish new posts to GBP"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="postFrequency"
                            label="Post Frequency"
                            choices={[
                                { id: 'daily', name: 'Daily' },
                                { id: 'weekly', name: 'Weekly' },
                                { id: 'bi-weekly', name: 'Bi-Weekly' },
                                { id: 'monthly', name: 'Monthly' }
                            ]}
                            fullWidth
                            helperText="How often to post to Google Business Profile"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="imageSource"
                            label="Image Source"
                            choices={[
                                { id: 'UPLOAD', name: 'Upload Only - Only use UPLOADed images' },
                                { id: 'ABOVE', name: 'Above - Use UPLOADed + existing GBP/review images' },
                                { id: 'AI_GENERATED', name: 'AI Generated - All ABOVE + AI generated images' }
                            ]}
                            fullWidth
                            helperText="Source for post images"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="brandImages"
                            label="Brand Images"
                            helperText="Use branded images in posts"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="publishReviews"
                            label="Publish Reviews"
                            helperText="Automatically publish review responses"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                    <Box sx={styles.inputWrapper}>
                        <NumberInput
                            source="minimumRating"
                            label="Minimum Rating"
                            min={1}
                            max={5}
                            fullWidth
                            helperText="Minimum star rating for AUTO-approval"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PostAddIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Call to Actions</Typography>
                        </Box>
                        <TextInput 
                            source="callToActions" 
                            label="Call to Actions" 
                            fullWidth 
                            multiline
                            rows={2}
                            helperText="Call-to-action phrases (comma-separated)"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="approvals"
                            label="Approval Mode"
                            choices={[
                                { id: 'NO', name: 'No - No approval needed' },
                                { id: 'BRANDED_AI', name: 'Branded AI - Approve only branded/AI images' },
                                { id: 'YES', name: 'Yes - Approve all posts' }
                            ]}
                            fullWidth
                            helperText="What requires approval before posting?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="facebookEnabled"
                            label="Facebook Integration"
                            helperText="Enable Facebook page posting"
                        />
                        <TextInput 
                            source="facebookPageUrl" 
                            label="Facebook Page URL" 
                            fullWidth 
                            helperText="URL of your Facebook business page"
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="instagramEnabled"
                            label="Instagram Integration"
                            helperText="Enable Instagram posting"
                        />
                        <TextInput 
                            source="instagramPageUrl" 
                            label="Instagram Page URL" 
                            fullWidth 
                            helperText="URL of your Instagram business page"
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(GoogleBusinessProfile);




