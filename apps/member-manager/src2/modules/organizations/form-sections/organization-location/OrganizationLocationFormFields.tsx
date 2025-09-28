import ExploreIcon from '@mui/icons-material/Explore';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PlaceIcon from '@mui/icons-material/Place';
import { Box, Divider, Paper, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useEffect } from 'react';
import { TextInput, useRecordContext } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { AutofillAddressInput } from '../../../../_components/AutofillAddressInput';

export const OrganizationLocationFormFields = ({
    index,
}: {
    index: number;
}) => {
    const record = useRecordContext();
    const form = useFormContext();

    // Register all necessary fields when component mounts
    useEffect(() => {
        // Register all fields that will be used
        form.register(`organizationLocations.${index}.id`);
        form.register(`organizationLocations.${index}.address`);
        form.register(`organizationLocations.${index}.longitude`);
        form.register(`organizationLocations.${index}.latitude`);
        form.register(`organizationLocations.${index}.organizationId`);
        form.register(`organizationLocations.${index}.city`);
    }, [form, index]);

    const handleAddressSelected = (place: any) => {
        if (!place || !place.geometry || !place.address_components) return;

        const latitude = place.geometry.location?.lat() || 0;
        const longitude = place.geometry.location?.lng() || 0;

        let cityName = '';
        let stateName = '';

        place.address_components.forEach((component: any) => {
            if (component.types.includes('locality')) {
                cityName = component.long_name;
            } else if (
                component.types.includes('administrative_area_level_1')
            ) {
                stateName = component.long_name;
            }
        });

        // Set values for the location
        form.setValue(
            `organizationLocations.${index}.id`,
            record?.id || crypto.randomUUID()
        );
        form.setValue(
            `organizationLocations.${index}.address`,
            place.formatted_address || ''
        );
        form.setValue(`organizationLocations.${index}.longitude`, longitude);
        form.setValue(`organizationLocations.${index}.latitude`, latitude);
        form.setValue(
            `organizationLocations.${index}.organizationId`,
            record?.id
        );
        form.setValue(`organizationLocations.${index}.city`, {
            id: crypto.randomUUID(),
            name: cityName,
            state: stateName,
            latitude: latitude,
            longitude: longitude,
        });

        // For display in the form, set the parent fields as well
        form.setValue('address', place.formatted_address || '');
        form.setValue('latitude', latitude);
        form.setValue('longitude', longitude);
        form.setValue('city.name', cityName);
        form.setValue('city.state', stateName);
    };

    return (
        <Box>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Location Information</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                    Search for an address below. The system will automatically
                    fill in location details.
                </Typography>

                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12 }}>
                        <Box sx={{ mb: 2 }}>
                            <AutofillAddressInput
                                source="address"
                                onPlaceSelected={handleAddressSelected}
                            />
                        </Box>
                    </Grid2>
                </Grid2>

                <Divider sx={{ my: 3 }} />

                <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: 'medium', mb: 2 }}
                >
                    Location Details
                </Typography>

                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                            }}
                        >
                            <PlaceIcon
                                sx={{
                                    mr: 1,
                                    color: 'primary.main',
                                    fontSize: '1.2rem',
                                }}
                            />
                            <Typography variant="subtitle2">
                                Full Address
                            </Typography>
                        </Box>
                        <TextInput
                            source="address"
                            fullWidth
                            disabled
                            variant="outlined"
                            label="Address"
                            helperText="Full formatted address"
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                            }}
                        >
                            <LocationCityIcon
                                sx={{
                                    mr: 1,
                                    color: 'primary.main',
                                    fontSize: '1.2rem',
                                }}
                            />
                            <Typography variant="subtitle2">City</Typography>
                        </Box>
                        <TextInput
                            source="city.name"
                            fullWidth
                            disabled
                            variant="outlined"
                            label="City"
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                            }}
                        >
                            <LocationCityIcon
                                sx={{
                                    mr: 1,
                                    color: 'primary.main',
                                    fontSize: '1.2rem',
                                }}
                            />
                            <Typography variant="subtitle2">State</Typography>
                        </Box>
                        <TextInput
                            source="city.state"
                            fullWidth
                            disabled
                            variant="outlined"
                            label="State"
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                            }}
                        >
                            <ExploreIcon
                                sx={{
                                    mr: 1,
                                    color: 'primary.main',
                                    fontSize: '1.2rem',
                                }}
                            />
                            <Typography variant="subtitle2">
                                Latitude
                            </Typography>
                        </Box>
                        <TextInput
                            source="latitude"
                            fullWidth
                            disabled
                            variant="outlined"
                            label="Latitude"
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                            }}
                        >
                            <ExploreIcon
                                sx={{
                                    mr: 1,
                                    color: 'primary.main',
                                    fontSize: '1.2rem',
                                }}
                            />
                            <Typography variant="subtitle2">
                                Longitude
                            </Typography>
                        </Box>
                        <TextInput
                            source="longitude"
                            fullWidth
                            disabled
                            variant="outlined"
                            label="Longitude"
                        />
                    </Grid2>
                </Grid2>
            </Paper>
        </Box>
    );
};

export default OrganizationLocationFormFields;
