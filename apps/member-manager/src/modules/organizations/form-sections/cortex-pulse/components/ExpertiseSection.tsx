import React from 'react';
import { TextInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { styles } from '../styles';

const ExpertiseSection = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <PsychologyIcon sx={styles.icon} />
                <Typography variant="h6">Expertise & Industry Knowledge</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Share your expertise and industry insights for thought leadership content.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PsychologyIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Expert Topics</Typography>
                        </Box>
                        <TextInput 
                            source="authorExpertTopics" 
                            label="Areas of Expertise" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="Topics you're an expert in and can write about"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LightbulbIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Industry Myth</Typography>
                        </Box>
                        <TextInput 
                            source="authorIndustryMyth" 
                            label="Common Industry Myth to Debunk" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="A common misconception in your industry that you'd like to address"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LightbulbIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Fun Fact</Typography>
                        </Box>
                        <TextInput 
                            source="authorFunFact" 
                            label="Fun Fact About Your Industry" 
                            fullWidth 
                            multiline
                            rows={2}
                            helperText="An interesting or surprising fact about your industry"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(ExpertiseSection);
