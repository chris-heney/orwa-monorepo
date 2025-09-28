import React from 'react';
import { TextInput, BooleanInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import LaunchIcon from '@mui/icons-material/Launch';
import { styles } from '../styles';

const LinkManagement = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <LinkIcon sx={styles.icon} />
                <Typography variant="h6">Link Management</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure internal and external linking strategies for generated content.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LinkIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Internal Link Targets</Typography>
                        </Box>
                        <TextInput 
                            source="internalLinkTargets" 
                            label="Internal Link Targets" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="URLs prioritized for internal linking (comma-separated)"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LaunchIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">External Links</Typography>
                        </Box>
                        <BooleanInput
                            source="enableExternalLinks"
                            label="Enable External Links"
                            helperText="Allow linking to external websites in content"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(LinkManagement);




