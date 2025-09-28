import React from 'react';
import {
    Typography,
    Box,
    Card,
    CardContent,
    CardActionArea,
    SxProps,
    Theme,
    Grid2,
} from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { predefinedPalettes } from '../utils';
import { ColorPaletteProps } from '../types';

const BrandColors: React.FC<ColorPaletteProps> = ({
    styles,
    selectedPaletteIndex,
    handlePaletteSelect,
}) => {
    return (
        <Grid2 size={{ xs: 12 }} sx={{ mb: 2 }}>
            <Box sx={styles.sectionTitle}>
                <ColorLensIcon sx={styles.icon} />
                <Typography variant="h6">Brand Colors</Typography>
            </Box>

            <Typography variant="body2" paragraph color="text.secondary">
                Choose a color palette that represents your brand personality
                and industry. Select one of our professional color palettes
                below.
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
                Select a Color Palette
            </Typography>

            <Grid2 container spacing={2} sx={{ mb: 3 }}>
                {predefinedPalettes.map((palette, index) => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={palette.name}>
                        <Card
                            sx={{
                                ...styles.paletteCard,
                                ...(selectedPaletteIndex === index
                                    ? styles.selectedPalette
                                    : {}),
                            } as SxProps<Theme>}
                            onClick={() => handlePaletteSelect(index)}
                        >
                            <CardActionArea>
                                <Box sx={styles.colorPalette}>
                                    {palette.colors.map((color, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                ...styles.colorBlock,
                                                bgcolor: color,
                                            }}
                                        />
                                    ))}
                                </Box>
                                <CardContent sx={{ p: 1, pt: 2 }}>
                                    <Typography variant="body2" align="center">
                                        {palette.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </Grid2>
    );
};

export default BrandColors;
