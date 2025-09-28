import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import {
    BooleanInput,
    maxValue,
    minValue,
    NumberInput,
    required,
    TextInput,
} from 'react-admin';

interface SoftwareLicenseFormFieldsProps {
    isEdit?: boolean;
}

export const SoftwareLicenseFormFields: React.FC<
    SoftwareLicenseFormFieldsProps
> = ({ isEdit = false }) => {
    return (
        <>
            <Box
                sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                }}
            >
                <Typography variant="h6" gutterBottom color="primary">
                    Basic Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            source="name"
                            validate={required()}
                            fullWidth
                            helperText="Enter a descriptive name for the license"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            source="owner"
                            validate={required()}
                            fullWidth
                            helperText="Person or team responsible for this license"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextInput
                            source="description"
                            multiline
                            rows={3}
                            fullWidth
                            helperText="Detailed description of the software license"
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box
                sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                }}
            >
                <Typography variant="h6" gutterBottom color="primary">
                    License Details
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            source="licenseKey"
                            validate={required()}
                            fullWidth
                            helperText="The license key or activation code"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            source="url"
                            fullWidth
                            helperText="URL to license portal or documentation"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <NumberInput
                            source="cost"
                            fullWidth
                            validate={[minValue(0), maxValue(999999)]}
                            helperText="Annual cost in USD"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <BooleanInput
                            source="active"
                            defaultValue={!isEdit ? true : undefined}
                            helperText="Whether this license is currently active"
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
