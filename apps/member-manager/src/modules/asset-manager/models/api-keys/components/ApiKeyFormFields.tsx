import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { BooleanInput, regex, required, TextInput } from 'react-admin';

interface ApiKeyFormFieldsProps {
    isEdit?: boolean;
}

export const ApiKeyFormFields: React.FC<ApiKeyFormFieldsProps> = ({
    isEdit = false,
}) => {
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
                            helperText="Enter a descriptive name for the API key"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            source="owner"
                            validate={required()}
                            fullWidth
                            helperText="Person or team responsible for this API key"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextInput
                            source="description"
                            multiline
                            rows={3}
                            fullWidth
                            helperText="Detailed description of the API key usage"
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
                    API Configuration
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            source="key"
                            validate={required()}
                            fullWidth
                            helperText="The API key or access token"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            source="url"
                            fullWidth
                            validate={[
                                regex(/^https?:\/\/.+/, 'Must be a valid URL'),
                            ]}
                            helperText="URL to API documentation or endpoint"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <BooleanInput
                            source="active"
                            defaultValue={!isEdit ? true : undefined}
                            helperText="Whether this API key is currently active"
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
