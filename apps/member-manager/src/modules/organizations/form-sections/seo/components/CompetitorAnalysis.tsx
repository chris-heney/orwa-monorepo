import BarChartIcon from '@mui/icons-material/BarChart';
import { Box, Paper, Rating, Typography } from '@mui/material';
import React from 'react';
import { TextInput, useInput } from 'react-admin';
import { styles } from '../styles';

const CompetitorAnalysis = () => {
    // Use useInput hook for domain authority rating
    const { field: domainAuthorityField } = useInput({
        source: 'seo.backlinksDomainAuthority',
    });

    // Current rating value
    const domainAuthority = domainAuthorityField.value || '0';

    // Update rating
    const handleRatingChange = (
        event: React.SyntheticEvent,
        newValue: number | null
    ) => {
        if (newValue !== null) {
            domainAuthorityField.onChange(newValue.toString());
        }
    };

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <BarChartIcon sx={styles.icon} />
                <Typography variant="h6">Competitor SEO Analysis</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                Provide information about your competitors' SEO performance to
                benchmark your strategy.
            </Typography>

            <Box sx={styles.inputWrapper}>
                <TextInput
                    source="seo.competitorSeoAnalysis"
                    label="Competitor SEO Analysis"
                    fullWidth
                    multiline
                    rows={3}
                    helperText="List competitors and their SEO strengths/weaknesses"
                    variant="outlined"
                />
            </Box>

            <Box sx={styles.ratingContainer}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                    Current Backlinks & Domain Authority:
                </Typography>
                <Rating
                    name="domain-authority"
                    value={parseInt(domainAuthority) || 0}
                    max={10}
                    onChange={handleRatingChange}
                />
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                >
                    ({domainAuthority}/10)
                </Typography>
            </Box>

            <TextInput
                source="seo.backlinksDomainAuthority"
                label="Domain Authority Notes"
                helperText="How strong is your domain authority compared to competitors? Higher is better."
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
            />
        </Paper>
    );
};

export default CompetitorAnalysis;
