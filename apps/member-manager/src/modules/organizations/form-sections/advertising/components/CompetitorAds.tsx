import React from 'react';
import { TextInput, ArrayInput, SimpleFormIterator } from 'react-admin';
import { Typography, Box, Paper } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { styles } from '../styles';

const CompetitorAds = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <CompareArrowsIcon sx={styles.icon} />
                <Typography variant="h6">Competitor Ads</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                List competitors whose ads you'd like to monitor. Understanding competitor advertising helps refine your strategy.
            </Typography>
            
            <Box sx={styles.inputWrapper}>
                <ArrayInput source="paidAdvertising.competitorAds">
                    <SimpleFormIterator>
                        <TextInput 
                            source="name" 
                            label="Competitor Name" 
                            fullWidth 
                            helperText="Name of the competitor" 
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                        <TextInput 
                            source="website" 
                            label="Website URL" 
                            fullWidth
                            helperText="Competitor's website URL" 
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                        <TextInput 
                            source="notes" 
                            label="Notes" 
                            fullWidth
                            multiline
                            rows={2}
                            helperText="Any specific aspects of their ads you want to monitor" 
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                    </SimpleFormIterator>
                </ArrayInput>
            </Box>
        </Paper>
    );
};

export default React.memo(CompetitorAds); 