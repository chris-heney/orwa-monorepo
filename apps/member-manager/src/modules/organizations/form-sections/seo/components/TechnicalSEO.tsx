import AddIcon from '@mui/icons-material/Add';
import CodeIcon from '@mui/icons-material/Code';
import SpeedIcon from '@mui/icons-material/Speed';
import {
    Box,
    Button,
    Chip,
    Grid2,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import {
    ArrayInput,
    BooleanInput,
    SimpleFormIterator,
    TextInput,
    useInput,
} from 'react-admin';
import { styles } from '../styles';

const TechnicalSEO = () => {
    const [newDirectory, setNewDirectory] = useState<string>('');

    // Use useInput hooks for form integration
    const { field: directoriesField } = useInput({
        source: 'seo.industryDirectories',
    });

    // Current directories from form state
    const directories = Array.isArray(directoriesField.value)
        ? directoriesField.value
        : [];

    // Add industry directory
    const handleAddDirectory = () => {
        if (newDirectory && !directories.includes(newDirectory)) {
            directoriesField.onChange([...directories, newDirectory]);
            setNewDirectory('');
        }
    };

    // Remove industry directory
    const handleRemoveDirectory = (directory: string) => {
        directoriesField.onChange(directories.filter(d => d !== directory));
    };

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <CodeIcon sx={styles.icon} />
                <Typography variant="h6">Technical SEO</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                Technical SEO elements that impact your search visibility and
                website performance.
            </Typography>

            <Box sx={styles.toggleGroup}>
                <BooleanInput
                    source="seo.googleSearchConsoleAccess"
                    label="Have access to Google Search Console"
                />

                <BooleanInput
                    source="seo.ga4Access"
                    label="Have Google Analytics 4 access"
                />

                <BooleanInput
                    source="seo.schemaMarkupNeeded"
                    label="Needs Schema.org markup implementation"
                />
            </Box>

            <Box sx={styles.inputWrapper}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SpeedIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="subtitle1">
                        Page Speed Review
                    </Typography>
                </Box>

                <TextInput
                    source="seo.pageSpeedReview"
                    label="Page Speed Notes"
                    fullWidth
                    multiline
                    rows={2}
                    helperText="Current loading speed issues and optimization needs"
                    variant="outlined"
                />
            </Box>

            <Box sx={styles.inputWrapper}>
                <Typography variant="subtitle1" gutterBottom>
                    Industry Directories
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    List industry-specific directories where your business
                    should be listed.
                </Typography>

                <Grid2 container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid2 size={{ xs: 12, sm: 9 }}>
                        <TextField
                            label="Add Industry Directory"
                            value={newDirectory}
                            onChange={e => setNewDirectory(e.target.value)}
                            fullWidth
                            variant="outlined"
                            placeholder="e.g., Yelp, TripAdvisor, Houzz"
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddDirectory}
                            fullWidth
                            disabled={!newDirectory}
                        >
                            Add
                        </Button>
                    </Grid2>
                </Grid2>

                {directories.length > 0 && (
                    <Box sx={styles.chipContainer}>
                        {directories.map((directory, index) => (
                            <Chip
                                key={index}
                                label={directory}
                                onDelete={() =>
                                    handleRemoveDirectory(directory)
                                }
                                sx={styles.keywordChip}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* Hidden input for industry directories */}
            <Box sx={{ display: 'none' }}>
                <ArrayInput source="seo.industryDirectories">
                    <SimpleFormIterator>
                        {/* This is just for form binding, actual UI is handled above */}
                    </SimpleFormIterator>
                </ArrayInput>
            </Box>
        </Paper>
    );
};

export default TechnicalSEO;
