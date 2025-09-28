import React from 'react';
import { TextInput } from 'react-admin';
import { Typography, Box, Chip, Grid2 } from '@mui/material';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import { fontCombinations } from '../utils';
import { FontSelectionProps } from '../types';

const TypographyAndLogo: React.FC<FontSelectionProps> = ({
    styles,
    selectedFontName,
    handleFontSelect
}) => {
    return (
        <Grid2 size={{ xs: 12 }} sx={{ mb: 2 }}>
            <Box sx={styles.sectionTitle}>
                <TextFormatIcon sx={styles.icon} />
                <Typography variant="h6">Typography & Logo</Typography>
            </Box>

            <Typography
                variant="body2"
                paragraph
                color="text.secondary"
            >
                Choose fonts that are readable and match your brand's
                personality.
            </Typography>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Select Font Style
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        {fontCombinations
                            .slice(0, 6)
                            .map((font, index) => (
                                <Chip
                                    key={index}
                                    label={font.name}
                                    onClick={() =>
                                        handleFontSelect(font)
                                    }
                                    sx={{
                                        m: 0.5,
                                        padding: '16px 8px',
                                        fontFamily:
                                            font.value.split(',')[0],
                                        fontSize: '14px',
                                        height: 'auto',
                                        ...(selectedFontName ===
                                        font.name
                                            ? styles.selectedFont
                                            : {}),
                                    }}
                                />
                            ))}
                    </Box>

                    {/* Hidden input for preferred fonts */}
                    <TextInput
                        source="brand.preferredFonts"
                        sx={{ display: 'none' }}
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Logo Files
                    </Typography>

                    <TextInput
                        source="brand.logoFiles"
                        label="Logo File URLs"
                        helperText="Enter URLs separated by commas"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />

                    <TextInput
                        source="brand.subBrands"
                        label="Sub-brands"
                        helperText="List any sub-brands"
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
            </Grid2>
        </Grid2>
    );
};

export default TypographyAndLogo; 