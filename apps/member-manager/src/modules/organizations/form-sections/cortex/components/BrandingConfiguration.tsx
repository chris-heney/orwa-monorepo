import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-admin';
import { Typography, Box, Paper, Grid2, Popover } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import BusinessIcon from '@mui/icons-material/Business';
import { styles } from '../styles';
import FileUploadField from '../../../../../_components/FileUploadField';
import { useFormContext } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';

const BrandingConfiguration = () => {
    const { getValues, setValue } = useFormContext();
    const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
    const [currentColor, setCurrentColor] = useState(getValues('brandColor') || '#2196F3');
    
    // Predefined color palette
    const colorPresets = [
        '#2196F3', // Blue
        '#4CAF50', // Green
        '#F44336', // Red
        '#FF9800', // Orange
        '#9C27B0', // Purple
        '#607D8B', // Blue Grey
        '#E91E63', // Pink
        '#00BCD4', // Cyan
        '#FFEB3B', // Yellow
        '#795548', // Brown
        '#000000', // Black
        '#FFFFFF', // White
    ];
    
    // Update the color when form value changes
    useEffect(() => {
        const formColor = getValues('brandColor');
        if (formColor && formColor !== currentColor) {
            setCurrentColor(formColor);
        }
    }, [getValues, currentColor]);

    const handleColorPickerOpen = (event) => {
        setColorPickerAnchor(event.currentTarget);
    };

    const handleColorPickerClose = () => {
        setColorPickerAnchor(null);
    };

    const handleColorChange = (color) => {
        setCurrentColor(color);
        setValue('brandColor', color);
    };

    const handlePresetSelect = (color) => {
        handleColorChange(color);
    };

    const colorPickerOpen = Boolean(colorPickerAnchor);

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <PaletteIcon sx={styles.icon} />
                <Typography variant="h6">Branding</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure your company's visual branding elements for AI-generated content.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PaletteIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Brand Color</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center'     }}>
                            <TextInput 
                                source="brandColor" 
                                label="Primary Brand Color" 
                                fullWidth 
                                helperText="Hex color code (e.g., #2196F3)"
                                variant="outlined"
                                placeholder="#2196F3"
                                value={currentColor}
                                onChange={(e) => handleColorChange(e.target.value)}
                            />
                                <Box 
                                    sx={{ 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: 1,
                                        mb: 2, 
                                        border: '1px solid #ccc',
                                        backgroundColor: currentColor,
                                        flexShrink: 0,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: '0 0 8px rgba(0,0,0,0.2)'
                                        }
                                    }}
                                    onClick={handleColorPickerOpen}
                                    title="Click to open color picker"
                                />  
                            <Popover
                                open={colorPickerOpen}
                                anchorEl={colorPickerAnchor}
                                onClose={handleColorPickerClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Box sx={{ 
                                    p: 2, 
                                    width: 240,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Select Brand Color
                                    </Typography>
                                    <HexColorPicker 
                                        color={currentColor} 
                                        onChange={handleColorChange}
                                        style={{ width: '100%', height: 200 }}
                                    />
                                    <Box sx={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        width: '100%'
                                    }}>
                                        <Box 
                                            sx={{ 
                                                width: 32, 
                                                height: 32, 
                                                borderRadius: 1, 
                                                border: '1px solid #ccc',
                                                backgroundColor: currentColor
                                            }} 
                                        />
                                        <Box sx={{ 
                                            textAlign: 'center', 
                                            fontSize: '0.875rem',
                                            fontFamily: 'monospace',
                                            fontWeight: 'bold',
                                            padding: '4px 8px',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: 1,
                                            flexGrow: 1
                                        }}>
                                            {currentColor}
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ width: '100%', mt: 1 }}>
                                        <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                                            Preset Colors
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(6, 1fr)',
                                            gap: 1
                                        }}>
                                            {colorPresets.map((color) => (
                                                <Box 
                                                    key={color}
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: 1,
                                                        backgroundColor: color,
                                                        cursor: 'pointer',
                                                        border: currentColor === color ? '2px solid #000' : '1px solid #ccc',
                                                        transition: 'transform 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                    onClick={() => handlePresetSelect(color)}
                                                    title={color}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </Popover>
                        </Box>
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Company Icon</Typography>
                        </Box>
                        <FileUploadField 
                            source="companyIconId"
                            label="Company Icon"
                            folderPath={`org-${getValues('name') || 'temp'}`}
                            accept="image/*"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(BrandingConfiguration);
