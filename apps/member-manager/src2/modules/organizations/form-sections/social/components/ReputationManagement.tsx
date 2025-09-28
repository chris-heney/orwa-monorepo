import StarIcon from '@mui/icons-material/Star';
import { Box, Grid2, Paper, Typography } from '@mui/material';
import { BooleanInput, TextInput } from 'react-admin';
import { styles } from '../styles';

const ReputationManagement = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <StarIcon sx={styles.icon} />
                <Typography variant="h6">
                    Online Reputation & Citations
                </Typography>
            </Box>

            <Typography variant="body2" paragraph color="text.secondary">
                Manage your online reputation and business citations across the
                web.
            </Typography>

            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="social.citationsChecked"
                            label="Have you checked your business citations?"
                            helperText="Citations are mentions of your business name, address, and phone number on other websites"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="social.needReputationManagement"
                            label="Do you need reputation management?"
                            helperText="Help with managing online reviews and maintaining a positive brand image"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="social.crmForLeads"
                            label="CRM for Social Media Leads"
                            fullWidth
                            helperText="What system do you use to track and manage leads from social media?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default ReputationManagement;
