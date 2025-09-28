import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { TextInput, useInput } from 'react-admin';
import { styles } from '../styles';

// Common SEO services
const serviceOptions = [
    'Web Development',
    'SEO Optimization',
    'Content Marketing',
    'Social Media Management',
    'PPC Advertising',
    'Email Marketing',
    'Local SEO',
    'E-commerce Solutions',
    'Web Design',
    'Analytics & Reporting',
];

const PrimaryServices = () => {
    // Use useInput hook for form integration
    const { field: primaryServicesField } = useInput({
        source: 'seo.primaryServices',
    });

    // Handle service selection
    const handleServiceToggle = (service: string) => {
        const currentServices = primaryServicesField.value
            ? primaryServicesField.value.split(',').map((s: string) => s.trim())
            : [];

        let updatedServices: string[];

        if (currentServices.includes(service)) {
            updatedServices = currentServices.filter(
                (s: string) => s !== service
            );
        } else {
            updatedServices = [...currentServices, service];
        }

        primaryServicesField.onChange(updatedServices.join(', '));
    };

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <AccountTreeIcon sx={styles.icon} />
                <Typography variant="h6">Services</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                What are the main services or products your business offers?
                These will be the focus of your SEO strategy.
            </Typography>

            <Box sx={styles.chipContainer}>
                {serviceOptions.map((service, index) => {
                    const isSelected = primaryServicesField.value
                        ? primaryServicesField.value
                              .split(',')
                              .map((s: string) => s.trim())
                              .includes(service)
                        : false;

                    return (
                        <Chip
                            key={index}
                            label={service}
                            variant="outlined"
                            sx={{
                                ...styles.keywordChip,
                                ...(isSelected ? styles.selectedChip : {}),
                            }}
                            onClick={() => handleServiceToggle(service)}
                        />
                    );
                })}
            </Box>

            <Box sx={styles.inputWrapper}>
                <TextInput
                    source="seo.primaryServices"
                    label="Primary Services"
                    fullWidth
                    helperText="List your main services, separated by commas"
                    variant="outlined"
                />

                <TextInput
                    source="seo.secondaryServices"
                    label="Secondary Services"
                    fullWidth
                    helperText="Additional services you offer that are not your main focus"
                    variant="outlined"
                    sx={{ mt: 2 }}
                />
            </Box>
        </Paper>
    );
};

export default PrimaryServices;
