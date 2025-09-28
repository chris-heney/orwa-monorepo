import { useValidateModelField } from '../../../../../_utils/validateModelName';
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import {
    ArrayInput,
    BooleanInput,
    maxValue,
    minValue,
    NumberInput,
    ReferenceInput,
    required,
    SelectInput,
    SimpleFormIterator,
    TextInput,
} from 'react-admin';

interface ServerFormFieldsProps {
    isEdit?: boolean;
}

// Enhanced IP Address validation
const validateIP = (value: string) => {
    const ipRegex =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(value)) {
        return 'Invalid IP address format';
    }
    return undefined;
};

export const ServerFormFields: React.FC<ServerFormFieldsProps> = ({
    isEdit = false,
}) => {
    const validateModelField = useValidateModelField('server', 'hostname');
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
                    Server Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            source="hostname"
                            validate={value => validateModelField(value)}
                            fullWidth
                            helperText="Enter the server hostname or FQDN"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ReferenceInput
                            source="hostingProviderId"
                            reference="hosting-provider"
                        >
                            <SelectInput
                                optionText="name"
                                validate={required()}
                                fullWidth
                                helperText="Select the hosting provider"
                            />
                        </ReferenceInput>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <NumberInput
                            source="cost"
                            fullWidth
                            validate={[minValue(0), maxValue(999999)]}
                            helperText="Monthly cost in USD"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <BooleanInput
                            source="active"
                            defaultValue={!isEdit ? true : undefined}
                            helperText="Whether this server is currently active"
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
                    Network Configuration
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                        >
                            IP Addresses
                        </Typography>
                        <ArrayInput source="ips" fullWidth>
                            <SimpleFormIterator>
                                <TextInput
                                    source=""
                                    helperText="IP Address (e.g., 192.168.1.100)"
                                    validate={validateIP}
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                        >
                            Tags
                        </Typography>
                        <ArrayInput source="tags" fullWidth>
                            <SimpleFormIterator>
                                <TextInput
                                    source=""
                                    helperText="Tag (e.g., production, web-server)"
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
