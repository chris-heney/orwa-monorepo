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

const ServiceContextFormFields = () => {
    const { selectedServiceIds, selectedTradeIds } = useServiceContext();
    const dataProvider = useDataProvider();
    const record = useRecordContext();

    return (
        <Grid2 container spacing={2} p={1} sx={{ width: '100%' }}>
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <TextInput 
                validate={(value: string) => validateModelField(value, 'service-context', 'name', dataProvider, record)}
                helperText="Enter the name of the service context"
                label="Name" name="name" source="name" />
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <TextInput
                    helperText="Enter the description of the service context"
                    label="Description"
                    name="description"
                    source="description"
                    multiline
                    rows={4}
                />
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <ReferenceArrayInput
                    perPage={1000}
                    sort={{ field: 'name', order: 'ASC' }}
                    source="trades"
                    reference="trade"
                >
                    <AutocompleteArrayInput
                        defaultValue={selectedTradeIds}
                        optionText="name"
                    />
                </ReferenceArrayInput>
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <ReferenceArrayInput
                    perPage={1000}
                    sort={{ field: 'name', order: 'ASC' }}
                    source="services"
                    reference="service"
                >
                    <AutocompleteArrayInput
                        defaultValue={selectedServiceIds}
                        optionText="name"
                    />
                </ReferenceArrayInput>
            </Grid2>
            {/* <Grid2
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <ReferenceArrayInput
                    source="locationExclusions"
                    reference="locationExclusion"
                >
                    <AutocompleteArrayInput optionText="name" />
                </ReferenceArrayInput>
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <ReferenceArrayInput
                    source="organizationServices"
                    reference="organizationService"
                >
                    <AutocompleteArrayInput optionText="name" />
                </ReferenceArrayInput>
            </Grid2> */}
        </Grid2>
    );
};

export default ServiceContextFormFields;
