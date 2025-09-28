import React from 'react';
import { SelectInput, TextInput, NumberInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { styles } from '../styles';

const PrivateEquitySection = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <AccountBalanceIcon sx={styles.icon} />
                <Typography variant="h6">Private Equity Information</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Provide information about your private equity firm and portfolio management needs.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccountBalanceIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Firm Name</Typography>
                        </Box>
                        <TextInput
                            source="organizationPrivateEquity.firmName"
                            label="PE Firm Name"
                            fullWidth
                            helperText="Name of your private equity firm"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TrendingUpIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Portfolio Count</Typography>
                        </Box>
                        <NumberInput
                            source="organizationPrivateEquity.portfolioCount"
                            label="Number of Portfolio Companies"
                            fullWidth
                            helperText="Number of companies in your portfolio"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="organizationPrivateEquity.ownershipRole"
                            label="Ownership Role"
                            choices={[
                                { id: 'A portfolio company', name: 'A portfolio company' }
                            ]}
                            fullWidth
                            helperText="Your role in the private equity structure"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Typography variant="h6" gutterBottom>
                            Services Needed
                        </Typography>
                        <TextInput
                            source="organizationPrivateEquity.servicesFor"
                            label="Services For"
                            fullWidth
                            multiline
                            rows={3}
                            helperText="Select all that apply to your service needs"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Typography variant="h6" gutterBottom>
                            Growth Goals
                        </Typography>
                        <TextInput
                            source="organizationPrivateEquity.growthGoals"
                            label="Growth Goals"
                            fullWidth
                            multiline
                            rows={3}
                            helperText="Select your primary growth objectives"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Typography variant="h6" gutterBottom>
                            Technology Integration Needs
                        </Typography>
                        <TextInput
                            source="organizationPrivateEquity.integrationNeeds"
                            label="Integration Needs"
                            fullWidth
                            multiline
                            rows={3}
                            helperText="Select technology integrations you're interested in"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(PrivateEquitySection);
