import React from 'react';
import CIWebModal from './CIModal';
import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
    TextInput,
    required
} from 'react-admin';
import { createRecord } from '../_utils/createRecord';
import CustomHeader from './CustomHeader';
import { Grid2 } from '@mui/material';

interface CreateHostingProviderModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}

const CreateHostingProviderModal: React.FC<CreateHostingProviderModalProps> = ({
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
                resource="hosting-provider"
            >
                <SimpleForm
                    onSubmit={(data: any) =>
                        createRecord(
                            data,
                            dataProvider,
                            notify,            
                            refresh,
                            'hosting-provider',
                            () => setIsModalOpen(false),
                        )
                    }
                    sx={{
                        p: 0
                    }}
                >
                    <CustomHeader title="Create Hosting Provider" />
                    
                    <Grid container spacing={2} sx={{ p: 2 }}>
                        <Grid item xs={12}>
                            <TextInput
                                source="name"
                                validate={required()}
                                fullWidth
                                label="Provider Name"
                                helperText="The name of the hosting provider"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextInput
                                source="description"
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                helperText="A brief description of the hosting provider"
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <TextInput
                                source="url"
                                fullWidth
                                label="URL"
                                helperText="The website of the hosting provider"
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <TextInput
                                source="pointOfContact"
                                fullWidth
                                label="Point of Contact"
                                helperText="Name or contact information for the provider representative"
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <TextInput
                                source="login"
                                fullWidth
                                label="Login"
                                helperText="Login credentials for the hosting account"
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <TextInput
                                source="password"
                                fullWidth
                                type="password"
                                label="Password"
                                helperText="Password for the hosting account"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextInput
                                source="api"
                                fullWidth
                                label="API"
                                helperText="API credentials or endpoint for the hosting provider"
                            />
                        </Grid>
                    </Grid>
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default CreateHostingProviderModal; 