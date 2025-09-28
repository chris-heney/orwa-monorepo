import React from 'react';
import { TextInput } from 'react-admin';
import { Typography, Box, Grid2 } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import { StyleProps } from '../types';

const VisualStyle: React.FC<StyleProps> = ({ styles }) => {
    return (
        <>
            <Box sx={styles.sectionTitle}>
                <CollectionsIcon sx={styles.icon} />
                <Typography variant="h6">Visual Style</Typography>
            </Box>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="brand.iconography"
                            label="Iconography Style"
                            helperText="Describe your preferred icon style"
                            multiline
                            rows={2}
                            fullWidth
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="brand.imageStylePreferences"
                            label="Image Style Preferences"
                            helperText="Describe your preferred photography/imagery style"
                            multiline
                            rows={3}
                            fullWidth
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="brand.moodBoardLinks"
                            label="Mood Board Links"
                            helperText="Enter URLs to any mood boards (Pinterest, etc.)"
                            multiline
                            rows={2}
                            fullWidth
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </>
    );
};

export default VisualStyle; 