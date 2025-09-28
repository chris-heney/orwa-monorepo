import React from 'react';
import { BooleanInput, TextInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { styles } from '../styles';

const BacklinkStrategy = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <LinkIcon sx={styles.icon} />
                <Typography variant="h6">Backlink Building Strategy</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure backlink building and PR outreach settings for enhanced SEO performance.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="backlinkBuildingEnabled"
                            label="Enable Backlink Building"
                            helperText="Enable automated backlink building campaigns"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AutoAwesomeIcon sx={{ color: '#4CAF50', mr: 1 }} />
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
            </Grid2>
        </Paper>
    );
};

export default React.memo(BacklinkStrategy);
