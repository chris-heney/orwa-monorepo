import React from 'react';
import {
    TextInput,
    SimpleForm,
    useRecordContext,
    ReferenceArrayInput,
    AutocompleteArrayInput,
    BooleanInput,
} from 'react-admin';
import { Typography, Box, Grid2 } from '@mui/material';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { createRecord } from '../../../../_utils/createRecord';
import { useNotify, useRefresh, useDataProvider } from 'react-admin';
import { updateRecord } from '../../../../_utils/updateRecord';
import { validateModelField } from '../../../../_utils/validateModelName';
import ModalHeader from '../../../../_components/ModalHeader';

const CoreServiceFormFields = ({ isEdit = false }: { isEdit?: boolean }) => {
    const {
        isCoreServiceModalOpen,
        setIsCoreServiceModalOpen,
    } = useCoreServiceContext();

    
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const record = useRecordContext();

    
    
    return (
        <SimpleForm
            onSubmit={(data: any) => {
                return isEdit
                    ? updateRecord(
                          data,
                          isCoreServiceModalOpen.record!,
                          dataProvider,
                          notify,
                          refresh,
                          'core-service',
                          () => setIsCoreServiceModalOpen({ open: false })
                      )
                    : createRecord(
                          data,
                          dataProvider,
                          notify,
                          refresh,
                          'core-service',
                          () =>
                              setIsCoreServiceModalOpen({
                                  open: false,
                              })
                      );
            }}
            sx={{
                p: 0,
            }}
        >
            <ModalHeader
                title={`${isEdit ? 'Edit' : 'Create'} Core Service`}
                onClose={() => setIsCoreServiceModalOpen({ open: false })}
            />
            <Grid2 container spacing={2} width="100%">
                {/* Left Column */}
                <Grid2 size={12}>
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
                                    label="Service Name"
                                    helperText="Enter the name of the core service"
                                    validate={(value: string) => validateModelField(value, 'core-service', 'name', dataProvider, record)}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <TextInput
                                    source="description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Service Description"
                                    helperText="Provide a detailed description of the service"
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <BooleanInput
                                    source="active"
                                    label="Active Service"
                                    helperText="Whether this service is currently active and available"
                                    defaultValue={true}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <ReferenceArrayInput 
                                    source="decks" 
                                    reference="deck"
                                    perPage={1000}
                                >
                                    <AutocompleteArrayInput 
                                        optionText="name" 
                                        fullWidth
                                        label="Associated Decks"
                                        helperText="Select the decks that use this core service"
                                    />
                                </ReferenceArrayInput>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Grid2>
            </Grid2>
        </SimpleForm>
    );
};

export default CoreServiceFormFields;
