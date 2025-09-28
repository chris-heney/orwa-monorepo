import React from 'react';
import {
    TextInput,
    NumberInput,
    ReferenceArrayInput,
    AutocompleteArrayInput,
    required,
    minValue,
} from 'react-admin';
import { Typography, Box, Grid2 } from '@mui/material';
import { useCoreServiceContext } from '../../CoreServiceContex';

const PackageGroupFormFields = () => {
    const { coreServiceIds } = useCoreServiceContext();

    return (
        <Grid2 container spacing={2}>
            {/* Left Column */}
            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 2, height: '100%' }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: 'primary.main', fontWeight: 500 }}
                    >
                        Basic Information
                    </Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                            <TextInput
                                source="name"
                                fullWidth
                                label="Group Name"
                                helperText="Enter the name of the package group"
                                validate={required()}
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <TextInput
                                source="description"
                                fullWidth
                                multiline
                                rows={4}
                                label="Group Description"
                                helperText="Provide a detailed description of the package group"
                                validate={required()}
                            />
                        </Grid2>
                    </Grid2>
                </Box>
            </Grid2>

            {/* Right Column */}
            <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 2, height: '100%' }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: 'primary.main', fontWeight: 500 }}
                    >
                        Packages & Core Services
                    </Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                            <ReferenceArrayInput
                                source="coreServices"
                                reference="core-service"
                                defaultValue={coreServiceIds}
                            >
                                <AutocompleteArrayInput
                                    optionText="name"
                                    fullWidth
                                    label="Core Services"
                                    helperText="Select the core services associated with this group"
                                    defaultValue={coreServiceIds}
                                />
                            </ReferenceArrayInput>
                        </Grid2>

                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                color: 'primary.main',
                                fontWeight: 500,
                            }}
                        >
                            Revenue Range
                        </Typography>
                        <Grid2 size={{ xs: 12, sm: 12 }}>
                            <NumberInput
                                source="revenueMin"
                                label="Minimum Revenue"
                                helperText="Minimum annual revenue"
                                fullWidth
                                validate={[required(), minValue(0)]}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12 }}>
                            <NumberInput
                                source="revenueMax"
                                label="Maximum Revenue"
                                helperText="Maximum annual revenue"
                                fullWidth
                                validate={[required(), minValue(0)]}
                            />
                        </Grid2>
                    </Grid2>
                </Box>
            </Grid2>
        </Grid2>
    );
};

export default PackageGroupFormFields;
