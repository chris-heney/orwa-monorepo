import React from 'react';
import { Grid2 } from '@mui/material';
import {
    TextInput,
    useRecordContext,
} from 'react-admin';
import { validateModelField } from '../../../../_utils/validateModelName';
import { useDataProvider } from 'react-admin';

const IndustryFormFields = () => {

    const dataProvider = useDataProvider();
    const  record  = useRecordContext();

    return (
        <Grid2 container spacing={2} sx={{ p: 1, width: '100%' }} >
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <TextInput 
                    validate={(value: string) =>
                        validateModelField(
                            value,
                            'industry',
                            'name',
                            dataProvider,
                            record
                        )}
                        label="Name" name="name" source="name" helperText="Enter the name of the industry" />
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <TextInput
                    label="Description"
                    name="description"
                    source="description"
                    multiline
                    rows={4}
                    helperText="Enter the description of the industry"
                />
            </Grid2>
        </Grid2>
    );
};

export default IndustryFormFields;
