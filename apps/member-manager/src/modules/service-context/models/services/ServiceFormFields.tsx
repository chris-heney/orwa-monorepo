import React from 'react';
import { Grid2 } from '@mui/material';
import {
    ReferenceArrayInput,
    TextInput,
    AutocompleteArrayInput,
    useDataProvider,
    useRecordContext,
} from 'react-admin';
import { useServiceContext } from '../../ServiceContextProvider';
import { validateModelField } from '../../../../_utils/validateModelName';
const ServiceFormFields = () => {
    const { selectedServiceContextIds } = useServiceContext();
    const dataProvider = useDataProvider();
    const record = useRecordContext();

    return (
        <Grid2 container spacing={2} sx={{ p: 1, width: '100%' }}>
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <TextInput
                    helperText="Enter the name of the service"
                    validate={(value: string) =>
                        validateModelField(
                            value,
                            'service',
                            'name',
                            dataProvider,
                            record
                        )
                    }
                    required
                    label="Name"
                    name="name"
                    source="name"
                />
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <ReferenceArrayInput
                    source="serviceContexts"
                    reference="service-context"
                >
                    <AutocompleteArrayInput
                        defaultValue={selectedServiceContextIds}
                        optionText="name"
                        helperText="Select the service context that is associated with the service"
                    />
                </ReferenceArrayInput>
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <TextInput
                    helperText="Enter the description of the service"
                    label="Description"
                    name="description"
                    source="description"
                    multiline
                    rows={4}
                />
            </Grid2>
            {/* <Grid2 size={{
                xs: 12,
                md: 6,
            }}>
                <ReferenceArrayInput source="locationExclusions" reference="locationExclusion">
                    <AutocompleteArrayInput optionText="name" />
                </ReferenceArrayInput>
            </Grid2>
            <Grid2 size={{
                xs: 12,
                md: 6,
            }}>
                <ReferenceArrayInput source="organizationServices" reference="organizationService">
                    <AutocompleteArrayInput optionText="name" />
                </ReferenceArrayInput>
            </Grid2> */}
        </Grid2>
    );
};

export default ServiceFormFields;
