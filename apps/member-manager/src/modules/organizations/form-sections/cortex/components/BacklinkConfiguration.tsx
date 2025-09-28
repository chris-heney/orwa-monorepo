import React from 'react';
import { TextInput, BooleanInput, SelectInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TopicIcon from '@mui/icons-material/Topic';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { styles } from '../styles';

const BacklinkConfiguration = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <LinkIcon sx={styles.icon} />
                <Typography variant="h6">Backlink & PR Configuration</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure backlink building and PR outreach settings for enhanced SEO PERFORMANCE.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="backlinkBuildingEnabled"
                            label="Enable Backlink Building"
                            helperText="Enable AUTOmated backlink building campaigns"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="backlinkBuildingType"
                            label="Backlink Building Type"
                            choices={[
                                { id: 'PR_GUEST_POSTS', name: 'PR & Guest Posts' },
                                { id: 'GUEST_POSTS_ONLY', name: 'Guest Posts Only' }
                            ]}
                            fullWidth
                            helperText="Type of backlink building strategy"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Author Information</Typography>
                        </Box>
                        <TextInput 
                            source="backlinkAuthorName" 
                            label="Backlink Author Name" 
                            fullWidth 
                            helperText="Name for PR and guest post bylines"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LinkedInIcon sx={{ color: '#0A66C2', mr: 1 }} />
                            <Typography variant="subtitle1">LinkedIn Profile</Typography>
                        </Box>
                        <TextInput 
                            source="backlinkAuthorLinkedin" 
                            label="Author LinkedIn URL" 
                            fullWidth 
                            helperText="LinkedIn profile URL for author credibility"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Author Biography</Typography>
                        </Box>
                        <TextInput 
                            source="backlinkBio" 
                            label="Author Bio" 
                            fullWidth 
                            multiline
                            rows={4}
                            helperText="AI-generated professional biography for PR outreach"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TopicIcon sx={{ color: '#9C27B0', mr: 1 }} />
                            <Typography variant="subtitle1">PR Outreach Topics</Typography>
                        </Box>
                        <TextInput 
                            source="prOutreachTopics" 
                            label="PR Outreach Topics" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="Topics for PR outreach (comma-separated)"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AutoAwesomeIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">AI Topic Discovery</Typography>
                        </Box>
                        <BooleanInput
                            source="findMoreTopicsAi"
                            label="Find More Topics with AI"
                            helperText="Let AI discover additional relevant topics for outreach"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(BacklinkConfiguration);




