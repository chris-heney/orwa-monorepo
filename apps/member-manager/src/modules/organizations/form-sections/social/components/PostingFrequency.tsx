import ScheduleIcon from '@mui/icons-material/Schedule';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { TextInput, useInput } from 'react-admin';
import { styles } from '../styles';

// Posting frequency options
const frequencyOptions = [
    'Daily',
    '2-3 times a week',
    'Weekly',
    'Biweekly',
    'Monthly',
];

const PostingFrequency = () => {
    // Use useInput hook for form integration
    const { field: frequencyField } = useInput({
        source: 'social.postingFrequency',
    });

    // Handle frequency selection
    const handleFrequencySelect = (frequency: string) => {
        frequencyField.onChange(frequency);
    };

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <ScheduleIcon sx={styles.icon} />
                <Typography variant="h6">Posting Schedule</Typography>
            </Box>

            <Typography variant="body2" paragraph color="text.secondary">
                How often do you post on your social media platforms? A
                consistent posting schedule helps maintain audience engagement.
            </Typography>

            <Box sx={styles.chipContainer}>
                {frequencyOptions.map((frequency, index) => (
                    <Chip
                        key={index}
                        label={frequency}
                        onClick={() => handleFrequencySelect(frequency)}
                        sx={{
                            m: 0.5,
                            padding: '15px 5px',
                            height: 'auto',
                            ...(frequencyField.value === frequency
                                ? styles.selectedChip
                                : {}),
                        }}
                    />
                ))}
            </Box>

            <Box sx={styles.inputWrapper}>
                <TextInput
                    source="social.postingFrequency"
                    label="Custom Posting Frequency"
                    fullWidth
                    helperText="If not listed above, specify your posting frequency (e.g., 3 times a week, daily, etc.)"
                    variant="outlined"
                />
            </Box>
        </Paper>
    );
};

export default PostingFrequency;
