import React from 'react';
import { SelectInput, BooleanInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import { styles } from '../styles';

const ArticleConfiguration = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <ArticleIcon sx={styles.icon} />
                <Typography variant="h6">Article Configuration</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure article length and AUTOmated posting preferences.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ArticleIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Article Length Mode</Typography>
                        </Box>
                        <SelectInput
                            source="articleLengthMode"
                            label="Article Length Mode"
                            choices={[
                                { id: 'SMART', name: 'Smart - AI optimizes length' },
                                { id: 'MANUAL', name: 'Manual - Fixed custom length' }
                            ]}
                            fullWidth
                            helperText="How should article length be determined?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AutoModeIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Automated Posting</Typography>
                        </Box>
                        <BooleanInput
                            source="automatedBlogPosting"
                            label="Automated Blog Posting"
                            helperText="Enable automatic blog post publishing"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(ArticleConfiguration);
