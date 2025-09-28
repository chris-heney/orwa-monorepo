import React from 'react';
import { TextInput, BooleanInput } from 'react-admin';
import { Typography, Box, Grid2 } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { StyleProps } from '../types';

const BrandVoice: React.FC<StyleProps> = ({ styles }) => {
    return (
        <Grid2 size={{ xs: 12 }} sx={{ mb: 2 }}>
            <Box sx={styles.sectionTitle}>
                <VolumeUpIcon sx={styles.icon} />
                <Typography variant="h6">
                    Brand Voice & Messaging
                </Typography>
            </Box>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="brand.brandVoiceTone"
                            label="Brand Voice & Tone"
                            helperText="Describe the tone of your brand communications"
                            multiline
                            rows={3}
                            fullWidth
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="brand.wordsToAvoid"
                            label="Words to Avoid"
                            helperText="List words or phrases to avoid in communications"
                            multiline
                            rows={3}
                            fullWidth
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="brand.taglineDevelopmentNeeds"
                            label="Tagline Development"
                            helperText="Describe any tagline development needs"
                            fullWidth
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Grid2>
    );
};

export default BrandVoice; 