import React from 'react';
import { SelectInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import CallToActionIcon from '@mui/icons-material/CallToAction';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { styles } from '../styles';

const CtaPricing = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <CallToActionIcon sx={styles.icon} />
                <Typography variant="h6">CTA & Pricing</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure call-to-action frequency and pricing mention preferences in content.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CallToActionIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">CTA Quantity</Typography>
                        </Box>
                        <SelectInput
                            source="ctaQuantity"
                            label="CTA Quantity"
                            choices={[
                                { id: 'AI_DECIDE', name: 'AI Decide - Let AI determine optimal CTA frequency' },
                                { id: 'LOW', name: 'Low - Minimal CTAs' },
                                { id: 'MEDIUM', name: 'Medium - Moderate CTAs' },
                                { id: 'HIGH', name: 'High - Frequent CTAs' }
                            ]}
                            fullWidth
                            helperText="How many call-to-actions should be included?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <MonetizationOnIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Pricing Mentions</Typography>
                        </Box>
                        <SelectInput
                            source="mentionPricing"
                            label="Mention Pricing"
                            choices={[
                                { id: 'NEVER', name: 'Never - Never mention pricing' },
                                { id: 'SOMETIMES', name: 'Sometimes - Occasionally mention pricing' },
                                { id: 'ALWAYS', name: 'Always - Always include pricing' }
                            ]}
                            fullWidth
                            helperText="How often should pricing be mentioned in content?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(CtaPricing);




