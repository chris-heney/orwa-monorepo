import React from 'react';
import {
    TextInput,
    ReferenceInput,
    AutocompleteInput,
    required,
    ReferenceArrayInput,
    AutocompleteArrayInput,
} from 'react-admin';
import { Grid2 } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useValidateModelField } from '../../../../_utils/validateModelName';

const FeatureFormFields = () => {

    const { watch } = useFormContext();
    const coreServiceId = watch('coreServiceId');

    const validateName = useValidateModelField('feature', 'name');
    
    return (
        <Grid2 container spacing={2} p={2} width="100%">
            {/* Left Column */}
            <Grid2 size={12}>
                <TextInput
                    source="name"
                    fullWidth
                    label="Feature Name"
                    helperText="Enter the name of the feature"
                    validate={validateName}
                />
            </Grid2>
            <Grid2 size={12}>
                <TextInput
                    source="description"
                    fullWidth
                    multiline
                    rows={4}
                    label="Feature Description"
                    helperText="Provide a detailed description of the feature"
                    validate={required()}
                />
            </Grid2>
            <Grid2 size={12}>
                <ReferenceInput
                    source="coreServiceId"
                    perPage={1000}
                    reference="core-service"
                >
                    <AutocompleteInput
                        optionText="name"
                        fullWidth
                        label="Core Service"
                        helperText="Select the core service this feature belongs to"
                        validate={required()}
                    />
                </ReferenceInput>
            </Grid2>

            <Grid2 size={12}>
                <ReferenceArrayInput
                    source="packages"
                    perPage={1000}
                    reference="package"
                    filter={{
                        coreServiceId: {
                            $eq: coreServiceId,
                        }
                    }}
                >
                    <AutocompleteArrayInput
                        optionText="name"
                        fullWidth
                        label="Package"
                        helperText="Select the packages this feature belongs to"
                        validate={required()}
                    />
                </ReferenceArrayInput>
            </Grid2>
        </Grid2>
    );
};

export default FeatureFormFields;
