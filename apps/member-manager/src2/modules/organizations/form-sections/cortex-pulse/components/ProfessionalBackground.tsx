import React from 'react';
import { TextInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import { styles } from '../styles';

const ProfessionalBackground = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <WorkIcon sx={styles.icon} />
                <Typography variant="h6">Professional Background</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Provide professional background information for author credibility and expertise.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <WorkIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Short Bio</Typography>
                        </Box>
                        <TextInput 
                            source="authorShortBio" 
                            label="Short Biography" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="Brief professional biography (300 character limit)"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <SchoolIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Certifications</Typography>
                        </Box>
                        <TextInput 
                            source="authorCertifications" 
                            label="Professional Certifications" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="List professional certifications and credentials"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <WorkIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Trade Inspiration</Typography>
                        </Box>
                        <TextInput 
                            source="authorTradeInspiration" 
                            label="What inspired you to enter this trade?" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="Personal story about entering the trade"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <WorkIcon sx={{ color: '#9C27B0', mr: 1 }} />
                            <Typography variant="subtitle1">Work Passion</Typography>
                        </Box>
                        <TextInput 
                            source="authorWorkPassion" 
                            label="What do you love most about your work?" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="What drives your passion for this work"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(ProfessionalBackground);
