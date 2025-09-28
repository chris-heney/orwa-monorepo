import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { TextInput } from 'react-admin';
import { styles } from '../styles';

// Tone style options
const toneStyles = [
    'Professional, but approachable',
    'Formal and authoritative',
    'Casual and conversational',
    'Inspirational and motivating',
    'Technical and detailed',
    'Simple and clear',
    'Humorous and light-hearted',
];

const ToneStyle = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <TextFieldsIcon sx={styles.icon} />
                <Typography variant="h6">Tone and Style</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                Choose the tone and writing style that best reflects your brand
                personality.
            </Typography>

            <Box sx={styles.chipGrid}>
                {toneStyles.map((style, index) => (
                    <Chip
                        key={index}
                        label={style}
                        sx={styles.contentTypeChip}
                        onClick={() => {
                            // Set tone style
                        }}
                    />
                ))}
            </Box>

            <Box sx={styles.inputWrapper}>
                <TextInput
                    source="content.toneStylePreferences"
                    label="Tone Style Preferences"
                    fullWidth
                    helperText="How should your content sound and feel to readers?"
                    variant="outlined"
                />
            </Box>
        </Paper>
    );
};

export default ToneStyle;
