import React from 'react';
import { NumberInput, BooleanInput, SelectInput, TextInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TuneIcon from '@mui/icons-material/Tune';
import { styles } from '../styles';

const ImageConfiguration = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <ImageIcon sx={styles.icon} />
                <Typography variant="h6">Image Configuration</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure image settings, sources, and generation preferences for content.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhotoLibraryIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Custom Images</Typography>
                        </Box>
                        <NumberInput 
                            source="imageCustomUploaded" 
                            label="Custom Uploaded Images Count" 
                            fullWidth 
                            min={0}
                            helperText="Number of custom UPLOADed images"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TuneIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Image Quantity</Typography>
                        </Box>
                        <SelectInput
                            source="imageQuantity"
                            label="Image Quantity"
                            choices={[
                                { id: 'AI_DECIDE', name: 'AI Decide - Let AI determine optimal image count' },
                                { id: 'ONE', name: 'One - 1 image per article' },
                                { id: 'TWO', name: 'Two - 2 images per article' },
                                { id: 'THREE', name: 'Three - 3 images per article' },
                                { id: 'CUSTOM', name: 'Custom - Custom count' }
                            ]}
                            fullWidth
                            helperText="How many images per article?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="imageCustomInfographics"
                            label="Custom Infographics"
                            helperText="Enable custom infographic generation"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="imageStockEnabled"
                            label="Stock Images"
                            helperText="Allow use of stock images"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="aiImagesEnabled"
                            label="AI Generated Images"
                            helperText="Enable AI-generated images"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="imageLogoInclusion"
                            label="Logo Inclusion"
                            choices={[
                                { id: 'None', name: 'None - No logo in images' },
                                { id: 'SELECTED', name: 'Selected - Logo in selected images' },
                                { id: 'ALL', name: 'All - Logo in all images' }
                            ]}
                            fullWidth
                            helperText="How should your logo be included in images?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="infographicsAccuracySetting"
                            label="Infographics Accuracy"
                            choices={[
                                { id: 'PRIORITIZE_VARIETY', name: 'Prioritize Variety - Emphasize visual variety' },
                                { id: 'PRIORITIZE_ACCURACY', name: 'Prioritize Accuracy - Emphasize data ACCURACY' }
                            ]}
                            fullWidth
                            helperText="Focus for infographic generation"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AutoAwesomeIcon sx={{ color: '#9C27B0', mr: 1 }} />
                            <Typography variant="subtitle1">Custom Image Instructions</Typography>
                        </Box>
                        <TextInput 
                            source="customImageInstructions" 
                            label="Custom Image Instructions" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="Special instructions for image generation and selection"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(ImageConfiguration);




