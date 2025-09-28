import React from 'react';
import { SelectInput, TextInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import TargetIcon from '@mui/icons-material/GpsFixed';
import CategoryIcon from '@mui/icons-material/Category';
import { styles } from '../styles';

const PromotionTargeting = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <TargetIcon sx={styles.icon} />
                <Typography variant="h6">Promotion Targeting</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure who this promotion is valid for and which services it applies to.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TargetIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Valid For</Typography>
                        </Box>
                        <TextInput
                            source="promotions[0].validFor"
                            label="Valid For"
                            fullWidth
                            multiline
                            rows={2}
                            helperText="Who this promotion is valid for (NEW_CUSTOMERS, EXISTING_CUSTOMERS, etc.)"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CategoryIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Service Categories</Typography>
                        </Box>
                        <TextInput
                            source="promotions[0].serviceCategories"
                            label="Service Categories"
                            fullWidth
                            multiline
                            rows={2}
                            helperText="Which services this promotion applies to (HEATING, COOLING, etc.)"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TargetIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Seasonal Tag</Typography>
                        </Box>
                        <SelectInput
                            source="promotions[0].seasonalTag"
                            label="Seasonal Tag"
                            choices={[
                                { id: 'SPRING', name: 'Spring' },
                                { id: 'SUMMER', name: 'Summer' },
                                { id: 'FALL', name: 'Fall' },
                                { id: 'WINTER', name: 'Winter' },
                                { id: 'YEAR_ROUND', name: 'Year-Round' }
                            ]}
                            fullWidth
                            helperText="Seasonal classification for the promotion"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(PromotionTargeting);
