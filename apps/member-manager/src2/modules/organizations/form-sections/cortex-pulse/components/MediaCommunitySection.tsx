import React from 'react';
import { TextInput, BooleanInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import { styles } from '../styles';

const MediaCommunitySection = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <PeopleIcon sx={styles.icon} />
                <Typography variant="h6">Media & Community</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Share your community involvement and media experience for enhanced credibility.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PeopleIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Community Work</Typography>
                        </Box>
                        <TextInput 
                            source="authorCommunityWork" 
                            label="Community Involvement" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="Community service, volunteer work, or local involvement"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CampaignIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Personal Story</Typography>
                        </Box>
                        <TextInput 
                            source="authorPersonalStory" 
                            label="Personal Story" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="A personal story that connects to your work or industry"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CampaignIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Topics to Avoid</Typography>
                        </Box>
                        <TextInput 
                            source="authorAvoidTopics" 
                            label="Topics to Avoid" 
                            fullWidth 
                            multiline
                            rows={2}
                            helperText="Topics you prefer not to discuss in content"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="authorMediaFeatures"
                            label="Has Media Features"
                            helperText="Have you been featured in media before?"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="authorMediaPermission"
                            label="Media Permission"
                            helperText="Permission to use your information in media outreach"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(MediaCommunitySection);
