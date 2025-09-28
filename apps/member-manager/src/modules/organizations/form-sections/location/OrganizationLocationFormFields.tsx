import { Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { TextInput, useRecordContext } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { AutofillAddressInput } from '../../../../_components/AutofillAddressInput';

export const OrganizationLocationFormFields = () => {
    const record = useRecordContext();
    const form = useFormContext();

    console.log('form', form.getValues());

    return (
        <Box sx={{ pt: 2 }}>
            <Grid2 container spacing={2} sx={{ p: 2 }}>
                <Grid2 size={{ xs: 12 }}>
                    <AutofillAddressInput
                        source="address"
                        onPlaceSelected={place => {
                            if (
                                !place ||
                                !place.geometry ||
                                !place.address_components
                            )
                                return;

                            const latitude =
                                place.geometry.location?.lat() || 0;
                            const longitude =
                                place.geometry.location?.lng() || 0;

                            let cityName = '';
                            let stateName = '';

                            place.address_components.forEach(component => {
                                if (component.types.includes('locality')) {
                                    cityName = component.long_name;
                                } else if (
                                    component.types.includes(
                                        'administrative_area_level_1'
                                    )
                                ) {
                                    stateName = component.long_name;
                                }
                            });

                            // Register and set all form fields
                            form.register('id');
                            form.register('address');
                            form.register('longitude');
                            form.register('latitude');
                            form.register('organizationId');
                            form.register('organizationLocations');
                            form.register('city.name');
                            form.register('city.state');
                            form.register('city.latitude');
                            form.register('city.longitude');

                            form.setValue('id', record?.id);
                            form.setValue(
                                'address',
                                place.formatted_address || ''
                            );
                            form.setValue('longitude', longitude);
                            form.setValue('latitude', latitude);
                            form.setValue('organizationId', record?.id);
                            form.setValue('organizationLocations', {
                                organizationId: record?.id,
                            });
                            form.setValue('city.name', cityName);
                            form.setValue('city.state', stateName);
                            form.setValue('city.latitude', latitude);
                            form.setValue('city.longitude', longitude);
                        }}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextInput
                        source="city.name"
                        fullWidth
                        disabled
                        variant="outlined"
                        label="City"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextInput
                        source="city.state"
                        fullWidth
                        disabled
                        variant="outlined"
                        label="State"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextInput
                        source="city.latitude"
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Latitude"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextInput
                        source="city.longitude"
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Longitude"
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default OrganizationLocationFormFields;
