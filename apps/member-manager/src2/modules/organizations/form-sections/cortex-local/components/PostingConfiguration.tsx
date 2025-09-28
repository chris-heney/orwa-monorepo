import React from 'react';
import { SelectInput, BooleanInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { styles } from '../styles';

const PostingConfiguration = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <PostAddIcon sx={styles.icon} />
                <Typography variant="h6">Posting Configuration</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure automated posting settings for your Google Business Profile.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ScheduleIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Posting Frequency</Typography>
                        </Box>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PostAddIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Automated Posting</Typography>
                        </Box>
                        <BooleanInput
                            source="publishNewPosts"
                            label="Publish New Posts Automatically"
                            helperText="Enable automatic publishing of new posts"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(PostingConfiguration);
