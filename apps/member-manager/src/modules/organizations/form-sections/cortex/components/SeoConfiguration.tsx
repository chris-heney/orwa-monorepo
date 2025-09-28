import React from 'react';
import { SelectInput, BooleanInput } from 'react-admin';
import { Typography, Box, Paper, Grid2, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PublishIcon from '@mui/icons-material/Publish';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { styles } from '../styles';

const SeoConfiguration = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <SearchIcon sx={styles.icon} />
                <Typography variant="h6">SEO Configuration</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure SEO objectives and publishing modes for AI content generation.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <SearchIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">SEO Objective</Typography>
                        </Box>
                        <SelectInput
                            source="seoObjective"
                            label="SEO Objective"
                            choices={[
                                { id: 'ACCURACY', name: 'Accuracy - Strict relevance' },
                                { id: 'BALANCED', name: 'Balanced - Mixed approach' },
                                { id: 'PERFORMANCE', name: 'Performance - Fast growth' }
                            ]}
                            fullWidth
                            helperText="Choose your SEO strategy approach"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PublishIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Publish Mode</Typography>
                        </Box>
                        <SelectInput
                            source="publishContentMode"
                            label="Publish Content Mode"
                            choices={[
                                { id: 'AUTO', name: 'Auto - Automatic publishing' },
                                { id: 'MANUAL', name: 'Manual - Requires approval' }
                            ]}
                            fullWidth
                            helperText="How should content be published?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Local SEO</Typography>
                        </Box>
                        <BooleanInput
                            source="localSeoEnabled"
                            label="Enable Local SEO"
                            helperText="Focus on location-based search optimization"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon sx={{ color: '#9C27B0', mr: 1 }} />
                            <Typography variant="subtitle1">Target Locations</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Configure local SEO locations (managed through array input)
                        </Typography>
                        {/* Note: localSeoLocations is a String[] field that would need array input handling */}
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(SeoConfiguration);



