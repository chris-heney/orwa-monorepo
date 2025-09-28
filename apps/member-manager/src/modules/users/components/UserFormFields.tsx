import React from 'react';
import { TextInput, ReferenceInput, AutocompleteInput } from 'react-admin';
import PersonIcon from '@mui/icons-material/Person';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import FileUploadField from '../../../_components/FileUploadField'

const UserFormFields = () => {
    const { getValues } = useFormContext();
    const record = getValues();

    return (
        <Grid container spacing={3}>
            {/* Profile Information */}
            <Grid item xs={12} md={6}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <PersonIcon />
                            Profile Information
                        </Typography>

                        <TextInput
                            source="displayName"
                            label="Display Name"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextInput
                            source="username"
                            label="Username"
                            fullWidth
                            sx={{ mb: 2 }}
                        />

                            <FileUploadField
                                source="profilePictureId"
                                label="Profile Picture"
                                accept="image/*"
                                folderPath={`${
                                    record?.username || 'user'
                                }/profile`}
                                fullWidth
                            />

                    </CardContent>
            </Grid>

            {/* Account Information */}
            <Grid item xs={12} md={6}>
                <Card sx={{ border: 'none'}}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Account Information
                        </Typography>

                        <ReferenceInput
                            source="contactId"
                            reference="contact"
                            label="Contact"
                        >
                            <AutocompleteInput
                                optionText={(choice: any) =>
                                    choice
                                        ? `${choice.first} ${choice.last} (${choice.email})`
                                        : ''
                                }
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </ReferenceInput>

                        <TextInput
                            source="authProvider"
                            label="Authentication Provider"
                            fullWidth
                            disabled
                            sx={{ mb: 2 }}
                        />
                        <TextInput
                            source="authExternalId"
                            label="External ID"
                            fullWidth
                            disabled
                            sx={{ mb: 2 }}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default UserFormFields;
