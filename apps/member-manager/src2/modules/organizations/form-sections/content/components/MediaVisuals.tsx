import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Box, Paper, Typography } from '@mui/material';
import { BooleanInput } from 'react-admin';
import { styles } from '../styles';

const MediaVisuals = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <PhotoCameraIcon sx={styles.icon} />
                <Typography variant="h6">Media and Visuals</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                High-quality images and media help make your website more
                engaging and professional.
            </Typography>

            <Box sx={styles.booleanInput}>
                <BooleanInput
                    source="content.hasProfessionalMedia"
                    label="I have professional photos/videos to use"
                />
            </Box>

            <Box sx={styles.booleanInput}>
                <BooleanInput
                    source="content.stockPhotographyPreferences"
                    label="I'd like to use stock photography"
                />
            </Box>
        </Paper>
    );
};

export default MediaVisuals;
