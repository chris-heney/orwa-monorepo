import React from 'react';
import { TextInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import { styles } from '../styles';

const CompanyContact = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <BusinessIcon sx={styles.icon} />
                <Typography variant="h6">Company Contact (Internal Use)</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Internal contact information for promotion management and tracking.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Submitted By</Typography>
                        </Box>
                        <TextInput
                            source="promotions[0].submittedBy"
                            label="Submitted By"
                            fullWidth
                            helperText="Who submitted this promotion"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Contact Email</Typography>
                        </Box>
                        <TextInput
                            source="promotions[0].submitterContactEmail"
                            label="Contact Email"
                            fullWidth
                            type="email"
                            helperText="Contact email for this promotion"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="promotions[0].branchLocation"
                            label="Branch or Location (if applicable)"
                            fullWidth
                            helperText="Optional branch or location information"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(CompanyContact);
