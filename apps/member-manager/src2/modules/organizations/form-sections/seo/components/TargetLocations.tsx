import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import {
    Box,
    Button,
    Chip,
    Grid2,
    IconButton,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import {
    ArrayInput,
    SimpleFormIterator,
    TextInput,
    useInput,
} from 'react-admin';
import { styles } from '../styles';

// Popular cities for targeting
const popularCities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Francisco',
];

const TargetLocations = () => {
    const [newCity, setNewCity] = useState<string>('');

    // Use useInput hook for form integration
    const { field: citiesField } = useInput({ source: 'seo.targetCities' });

    // Current cities from form state
    const cities = Array.isArray(citiesField.value) ? citiesField.value : [];

    // Handle city selection
    const handleCityToggle = (city: string) => {
        let updatedCities: string[];

        if (cities.includes(city)) {
            updatedCities = cities.filter(c => c !== city);
        } else {
            updatedCities = [...cities, city];
        }

        citiesField.onChange(updatedCities);
    };

    // Add custom city
    const handleAddCity = () => {
        if (newCity && !cities.includes(newCity)) {
            citiesField.onChange([...cities, newCity]);
            setNewCity('');
        }
    };

    // Remove city
    const handleRemoveCity = (city: string) => {
        citiesField.onChange(cities.filter(c => c !== city));
    };

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <LocationCityIcon sx={styles.icon} />
                <Typography variant="h6">Target Locations</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                Which cities or regions do you want to target with your SEO
                efforts? This is especially important for local businesses.
            </Typography>

            <Box sx={styles.inputWrapper}>
                <TextInput
                    source="seo.localSeoFocus"
                    label="Local SEO Focus"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., 5-mile radius around store, Downtown area only"
                    helperText="Describe your local service area"
                    sx={{ mb: 3 }}
                />
            </Box>

            <Box sx={styles.chipContainer}>
                {popularCities.map((city, index) => (
                    <Chip
                        key={index}
                        label={city}
                        variant="outlined"
                        sx={{
                            ...styles.keywordChip,
                            ...styles.cityChip,
                            ...(cities.includes(city)
                                ? styles.selectedChip
                                : {}),
                        }}
                        onClick={() => handleCityToggle(city)}
                    />
                ))}
            </Box>

            <Grid2
                container
                spacing={2}
                alignItems="center"
                sx={{ mt: 2, mb: 3 }}
            >
                <Grid2 size={{ xs: 12, sm: 9 }}>
                    <TextField
                        label="Add Custom City"
                        value={newCity}
                        onChange={e => setNewCity(e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="e.g., Miami, Seattle"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddCity}
                        fullWidth
                        disabled={!newCity}
                    >
                        Add City
                    </Button>
                </Grid2>
            </Grid2>

            {cities.length > 0 && (
                <Box sx={styles.selectedItems}>
                    <Typography variant="subtitle2" gutterBottom>
                        Selected Cities:
                    </Typography>
                    {cities.map((city, index) => (
                        <Box key={index} sx={styles.selectedItemRow}>
                            <Typography variant="body2">{city}</Typography>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveCity(city)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}

            {/* React Admin ArrayInput */}
            <Box sx={{ display: 'none' }}>
                <ArrayInput source="seo.targetCities">
                    <SimpleFormIterator>
                        {/* This is just for form binding, actual UI is handled above */}
                    </SimpleFormIterator>
                </ArrayInput>
            </Box>
        </Paper>
    );
};

export default TargetLocations;
