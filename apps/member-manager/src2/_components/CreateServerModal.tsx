import React from 'react';
import CIWebModal from './CIModal';
import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
    TextInput,
    ReferenceInput,
    AutocompleteInput,
    ArrayInput,
    SimpleFormIterator,
    required
} from 'react-admin';
import { createRecord } from '../_utils/createRecord';
import CustomHeader from './CustomHeader';
import { Grid2 } from '@mui/material';

interface CreateServerModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}

const CreateServerModal: React.FC<CreateServerModalProps> = ({
    isModalOpen,
    setIsModalOpen
}) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    return (
        <CIWebModal
            isModalOpen={isModalOpen}
            setIsModalOpen={() => setIsModalOpen(false)}
        >
            <Create
                resource="server"
            >
                <SimpleForm
                    onSubmit={(data: any) =>
                        createRecord(
                            data,
                            dataProvider,
                            notify,
                            refresh,
                            'server',
                            () => setIsModalOpen(false),
                        )
                    }
                    sx={{
                        p: 0
                    }}
                >
                    <CustomHeader title="Create Server" />
                    
                    <Grid2 container spacing={2} sx={{ p: 2 }}>
                        <Grid2 size={{ xs: 12 }}>
                            <TextInput
                                source="hostname"
                                validate={required()}
                                fullWidth
                                label="Hostname"
                                helperText="The hostname of the server"
                            />
                        </Grid2>
                        
                        <Grid2 size={{ xs: 12 }}>
                            <ReferenceInput
                                source="hostingProviderId"
                                reference="hosting-provider"
                            >
                                <AutocompleteInput
                                    optionText="name"
                                    fullWidth
                                    label="Hosting Provider"
                                    helperText="Select the hosting provider for this server"
                                    validate={required()}
                                />
                            </ReferenceInput>
                        </Grid2>
                        
                        <Grid2 size={{ xs: 12 }}>
                            <ArrayInput source="ips" label="IP Addresses">
                                <SimpleFormIterator>
                                    <TextInput
                                        source=""
                                        label="IP Address"
                                        fullWidth
                                        helperText="Enter an IP address"
                                        placeholder="192.168.1.1"
                                    />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </Grid2>
                        
                        <Grid2 size={{ xs: 12 }}>
                            <ArrayInput source="tags" label="Tags">
                                <SimpleFormIterator>
                                    <TextInput
                                        source=""
                                        label="Tag"
                                        fullWidth
                                        helperText="Enter a tag for categorization"
                                        placeholder="production"
                                    />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </Grid2>
                    </Grid2>
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default CreateServerModal; 