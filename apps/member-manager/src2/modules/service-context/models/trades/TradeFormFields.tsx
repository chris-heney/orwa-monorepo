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


const TradeFormFields = () => {

    const { selectedIndustryIds } = useServiceContext();
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
                    helperText="Enter the name of the trade"
                    validate={(value: string) =>
                        validateModelField(value, 'trade', 'name', dataProvider, record)
                    }
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
                    source="industries"
                    reference="industry"
                    perPage={1000}
                    sort={{ field: 'name', order: 'ASC' }}
                >
                    <AutocompleteArrayInput
                        defaultValue={selectedIndustryIds}
                        optionText="name"
                        helperText="Select the industries that are associated with the trade"
                    />
                </ReferenceArrayInput>
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <TextInput
                    helperText="Enter the description of the trade"
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
                <ReferenceArrayInput
                    perPage={100}
                    sort={{ field: 'name', order: 'ASC' }}
                    source="serviceContexts"
                    reference="service-context"
                >
                    <AutocompleteArrayInput
                        optionText="name"
                        defaultValue={selectedServiceContextIds}
                    />
                </ReferenceArrayInput>
            </Grid2> */}
            {/* <Grid2 size={{
                xs: 12,
                md: 6,
            }}>
                <ReferenceArrayInput
                    perPage={100}
                    sort={{ field: 'name', order: 'ASC' }}
                    source="organizations"
                    reference="organization"
                >
                    <AutocompleteArrayInput optionText="name" />
                </ReferenceArrayInput>
            </Grid2>
            <Grid2 size={{
                xs: 12,
                md: 6,
            }}>
                <ReferenceArrayInput
                    perPage={100}
                    sort={{ field: 'name', order: 'ASC' }}
                    source="locationExclusions"
                    reference="locationExclusion"
                >
                    <AutocompleteArrayInput optionText="name" />
                </ReferenceArrayInput>
            </Grid2> */}
        </Grid2>
    );
};

export default TradeFormFields;
