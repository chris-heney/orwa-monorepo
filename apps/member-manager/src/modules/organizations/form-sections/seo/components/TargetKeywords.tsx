import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Button,
    Grid2,
    IconButton,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import {
    ArrayInput,
    BooleanInput,
    SimpleFormIterator,
    useInput,
} from 'react-admin';
import { styles } from '../styles';

const TargetKeywords = () => {
    const [newKeyword, setNewKeyword] = useState<string>('');

    // Use useInput hook for form integration
    const { field: keywordsField } = useInput({ source: 'seo.targetKeywords' });

    // Current keywords from form state
    const keywords = Array.isArray(keywordsField.value)
        ? keywordsField.value
        : [];

    // Add custom keyword
    const handleAddKeyword = () => {
        if (newKeyword && !keywords.includes(newKeyword)) {
            keywordsField.onChange([...keywords, newKeyword]);
            setNewKeyword('');
        }
    };

    // Remove keyword
    const handleRemoveKeyword = (keyword: string) => {
        keywordsField.onChange(keywords.filter(k => k !== keyword));
    };

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <SearchIcon sx={styles.icon} />
                <Typography variant="h6">Target Keywords</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                What keywords or search phrases do you want to rank for? Choose
                terms that potential customers might use to find your services.
            </Typography>

            <BooleanInput
                source="seo.keywordResearchNeeded"
                label="Needs professional keyword research"
                sx={styles.switch}
            />

            <Grid2
                container
                spacing={2}
                alignItems="center"
                sx={{ mt: 2, mb: 3 }}
            >
                <Grid2 size={{ xs: 12, sm: 9 }}>
                    <TextField
                        label="Add Target Keyword"
                        value={newKeyword}
                        onChange={e => setNewKeyword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="e.g., affordable web design, SEO agency near me"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddKeyword}
                        fullWidth
                        disabled={!newKeyword}
                    >
                        Add Keyword
                    </Button>
                </Grid2>
            </Grid2>

            {keywords.length > 0 && (
                <Box sx={styles.selectedItems}>
                    <Typography variant="subtitle2" gutterBottom>
                        Selected Keywords:
                    </Typography>
                    {keywords.map((keyword, index) => (
                        <Box key={index} sx={styles.selectedItemRow}>
                            <Typography variant="body2">{keyword}</Typography>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveKeyword(keyword)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}

            {/* React Admin ArrayInput */}
            <Box sx={{ display: 'none' }}>
                <ArrayInput source="seo.targetKeywords">
                    <SimpleFormIterator>
                        {/* This is just for form binding, actual UI is handled above */}
                    </SimpleFormIterator>
                </ArrayInput>
            </Box>
        </Paper>
    );
};

export default TargetKeywords;
