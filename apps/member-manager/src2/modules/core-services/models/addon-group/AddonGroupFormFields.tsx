import React, { useEffect } from 'react';
import {
    TextInput,
    ReferenceInput,
    AutocompleteArrayInput,
    ReferenceArrayInput,
    AutocompleteInput,
    required,
    useGetList,
} from 'react-admin';
import { Box, Grid2 } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { Package } from '@ci-connect/types';

const AddonGroupFormFields = () => {
    const { watch, setValue } = useFormContext();
    const coreServiceId = watch('coreServiceId');

    const addons = watch('addons');

    const { data: packages } = useGetList('package', addons?.length > 0 ? {
        filter: {
            'addons.id': {
                $in: addons,
            },
        },
    } : {});

    const packageIds = packages?.map((pkg: Package) => pkg.id);

    useEffect(() => {
        if (addons?.length > 0) {
            setValue('packages', packageIds, { shouldDirty: true });
        }
    }, [addons?.length]);

    return (
        <Grid2 container spacing={2} width="100%">
            {/* Left Column */}
            <Grid2 size={12}>
                <Box sx={{ p: 2, height: '100%' }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextInput
                                source="name"
                                fullWidth
                                label="Addon Group Name"
                                helperText="Enter the name of the addon group"
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <ReferenceInput
                                source="coreServiceId"
                                reference="core-service"
                                label="Core Service"
                                perPage={1000}
                            >
                                <AutocompleteInput
                                    optionText="name"
                                    optionValue="id"
                                    fullWidth
                                    helperText="Select the core service this addon group belongs to"
                                    validate={required()}
                                />
                            </ReferenceInput>
                        </Grid2>
                        <Grid2 size={12}>
                            <TextInput
                                source="description"
                                fullWidth
                                multiline
                                rows={4}
                                label="Addon Group Description"
                                helperText="Provide a detailed description of the addon group"
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <ReferenceArrayInput
                                source="addons"
                                reference="addon"
                                label="Addons"
                                perPage={1000}
                                queryOptions={{
                                    meta: {
                                        populate: 'packages',
                                        raw: true,
                                    },
                                }}
                            >
                                <AutocompleteArrayInput
                                    optionText="name"
                                    optionValue="id"
                                />
                            </ReferenceArrayInput>
                        </Grid2>

                        <Grid2 size={12}>
                            <ReferenceArrayInput
                                source="packages"
                                reference="package"
                                label="Packages"
                                perPage={1000}
                                filter={
                                    coreServiceId
                                        ? {
                                              coreServiceId: {
                                                  $eq: coreServiceId,
                                              },
                                          }
                                        : {}
                                }
                            >
                                <AutocompleteArrayInput
                                    optionText="name"
                                    optionValue="id"
                                    fullWidth
                                    helperText="Select the packages this addon group belongs to"
                                    
                                />
                            </ReferenceArrayInput>
                        </Grid2>
                    </Grid2>
                </Box>
            </Grid2>
        </Grid2>
    );
};

export default AddonGroupFormFields;
