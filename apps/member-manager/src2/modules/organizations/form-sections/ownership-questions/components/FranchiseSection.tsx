import React from 'react';
import { SelectInput, TextInput, NumberInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import { styles } from '../styles';

const FranchiseSection = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <BusinessIcon sx={styles.icon} />
                <Typography variant="h6">Franchise Information</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Provide information about your franchise structure and marketing needs.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <StoreIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Network Scope</Typography>
                        </Box>
                        <NumberInput
                            source="organizationFranchise.networkScope"
                            label="Number of Locations"
                            fullWidth
                            helperText="Total number of locations in your franchise network"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Owned Locations</Typography>
                        </Box>
                        <NumberInput
                            source="organizationFranchise.ownedLocations"
                            label="Locations You Own"
                            fullWidth
                            helperText="Number of locations you personally own"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="organizationFranchise.systemType"
                            label="Franchise System Type"
                            choices={[
                                { id: 'Corporate-owned', name: 'Corporate-owned' },
                                { id: 'Franchisee-owned', name: 'Franchisee-owned' },
                                { id: 'Hybrid', name: 'Hybrid' }
                            ]}
                            fullWidth
                            helperText="Type of franchise system"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="organizationFranchise.marketingDecision"
                            label="Marketing Decision Authority"
                            choices={[
                                { id: 'Corporate', name: 'Corporate' },
                                { id: 'Franchisee', name: 'Franchisee' },
                                { id: 'Shared responsibility', name: 'Shared responsibility' }
                            ]}
                            fullWidth
                            helperText="Who makes marketing decisions"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Typography variant="h6" gutterBottom>
                            Brand Guidelines
                        </Typography>
                        <SelectInput
                            source="organizationFranchise.brandGuidelines"
                            label="Brand Guidelines for Marketing and Websites?"
                            choices={[
                                { id: 'Yes (please upload or link)', name: 'Yes (please upload or link)' },
                                { id: 'No', name: 'No' }
                            ]}
                            fullWidth
                            helperText="Do you have established brand guidelines for your franchise?"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="organizationFranchise.brandGuidelinesLink"
                            label="Guidelines Link (optional)"
                            fullWidth
                            helperText="Link to your brand guidelines document or website"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Typography variant="h6" gutterBottom>
                            Marketing Needs
                        </Typography>
                        <TextInput
                            source="organizationFranchise.marketingNeeds"
                            label="Marketing Needs"
                            fullWidth
                            multiline
                            rows={3}
                            helperText="Select all that apply to your franchise marketing needs"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="organizationFranchise.servicesInterested"
                            label="Services You're Interested In"
                            fullWidth
                            multiline
                            rows={2}
                            helperText="Services you're interested in exploring"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(FranchiseSection);
