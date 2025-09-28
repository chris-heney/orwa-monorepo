import { Box, Grid2, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { FranchiseSection, PrivateEquitySection } from './components';
import { styles } from '../domains';

// Import modularized components


const OwnershipQuestionsTab = () => {
    const { watch } = useFormContext();
    const ownershipType = watch('ownershipType');

    return (
        <Box>
            <Box sx={styles.highlight}>
                <Typography variant="body1">
                    Ownership-specific questions and configuration. These questions help tailor 
                    our services to your specific business structure and needs.
                </Typography>
            </Box>

            <Grid2 container spacing={3}>
                {/* Franchise Section */}
                {ownershipType === 'FRANCHISE' && (
                    <Grid2 size={{ xs: 12 }}>
                        <FranchiseSection />
                    </Grid2>
                )}

                {/* Private Equity Section */}
                {ownershipType === 'PRIVATE_EQUITY' && (
                    <Grid2 size={{ xs: 12 }}>
                        <PrivateEquitySection />
                    </Grid2>
                )}

                {/* Default message for other ownership types */}
                {!['FRANCHISE', 'PRIVATE_EQUITY'].includes(ownershipType) && (
                    <Grid2 size={{ xs: 12 }}>
                        <Box sx={styles.section}>
                            <Typography variant="h6" gutterBottom>
                                Ownership-Specific Questions
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This section contains questions specific to Franchise and Private Equity ownership types. 
                                Please select the appropriate ownership type in the Basic Details tab to see relevant questions.
                            </Typography>
                        </Box>
                    </Grid2>
                )}
            </Grid2>
        </Box>
    );
};

export default OwnershipQuestionsTab;
