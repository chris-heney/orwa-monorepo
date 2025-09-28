import CreateIcon from '@mui/icons-material/Create';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { TextInput } from 'react-admin';
import { styles } from '../styles';

// Content type options
const contentTypes = [
    'New',
    'Update',
    'Rewrite',
    'Translation',
    'Expert Review',
    'SEO Optimization',
];

const ContentNeeded = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <CreateIcon sx={styles.icon} />
                <Typography variant="h6">Content Needs</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                What type of content creation or modification do you need?
                Select from common options or enter your specific needs.
            </Typography>

            <Box sx={styles.chipGrid}>
                {contentTypes.map((type, index) => (
                    <Chip
                        key={index}
                        label={type}
                        sx={styles.contentTypeChip}
                        onClick={() => {
                            // Set content type
                        }}
                    />
                ))}
            </Box>

            <Box sx={styles.inputWrapper}>
                <TextInput
                    source="content.contentNeeded"
                    label="Content Needed"
                    fullWidth
                    helperText="Describe what content you need for your website"
                    variant="outlined"
                />
            </Box>
        </Paper>
    );
};

export default ContentNeeded;
