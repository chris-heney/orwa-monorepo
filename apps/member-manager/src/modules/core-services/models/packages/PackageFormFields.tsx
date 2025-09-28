import React from 'react'
import { 
    TextInput, 
    NumberInput, 
    SelectInput, 
    ReferenceInput, 
    AutocompleteInput,
    required,
    minValue,
    useGetList,
    useRecordContext,
    ReferenceArrayInput,
    AutocompleteArrayInput
} from 'react-admin'
import { Typography, Box, Grid2 } from '@mui/material'
import { useCoreServiceContext } from '../../CoreServiceContex'

const PackageFormFields = () => {
    const { packageGroupIds, coreServiceIds } = useCoreServiceContext()
    const record = useRecordContext();
    
    // Fetch all packages to check for duplicate names
    const { data: packages } = useGetList('package', {
        pagination: { page: 1, perPage: 1000 },
    });

    // Create validator for package name uniqueness
    const validatePackageName = (value: string) => {
        if (!value) return 'Name is required';
        
        if (packages) {
            const existingPackage = packages.find(
                (pkg: any) => pkg.name.toLowerCase() === value.toLowerCase() && pkg.id !== record?.id
            );

            if (existingPackage) {
                // Reset the input to trigger a re-render
                return 'A package with this name already exists';
            }
        }
        
        return undefined;
    };
    
    return (
            <Grid2 container spacing={2} sx={{ width: '100%' }}>
                {/* Left Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={{ p: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 500, mb: 1 }}>
                            Basic Information
                        </Typography>
                        <Grid2 container spacing={1}>
                            <Grid2 size={12}>
                                <TextInput 
                                    source="name" 
                                    fullWidth 
                                    label="Package Name"
                                    helperText="Enter the name of the package"
                                    validate={validatePackageName}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <TextInput 
                                    source="description" 
                                    fullWidth 
                                    multiline 
                                    rows={3}
                                    label="Package Description"
                                    helperText="Provide a detailed description of the package"
                                    validate={required()}
                                />
                            </Grid2>
                        </Grid2>

                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 500, mt: 2, mb: 1 }}>
                            Investment Details
                        </Typography>
                        <Grid2 container spacing={1}>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <NumberInput 
                                    source="investmentSetup" 
                                    label="Setup Cost"
                                    helperText="One-time setup cost"
                                    fullWidth
                                    validate={[required(), minValue(0)]}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <NumberInput 
                                    source="investmentRecurring" 
                                    label="Recurring Cost"
                                    helperText="Regular recurring cost"
                                    fullWidth
                                    validate={[required(), minValue(0)]}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <SelectInput 
                                    source="investmentFrequency" 
                                    choices={[
                                        { id: 'MONTHLY', name: 'Monthly' },
                                        { id: 'ANNUALLY', name: 'Annually' }
                                    ]}
                                    label="Billing Frequency"
                                    helperText="How often the recurring cost is billed"
                                    fullWidth
                                    defaultValue="MONTHLY"
                                    validate={required()}
                                />
                            </Grid2>
                        </Grid2>
                    </Box>
                </Grid2>

                {/* Right Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={{ p: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 500, mb: 1 }}>
                            Related Information
                        </Typography>
                        <Grid2 container spacing={1}>
                        <Grid2 size={12}>
                                <ReferenceInput 
                                    source="coreServiceId" 
                                    reference="core-service"
                                    perPage={1000}
                                >
                                    <AutocompleteInput 
                                        optionText="name" 
                                        fullWidth
                                        label="Core Service"
                                        helperText="Select the core service that the package belongs to"
                                        validate={required()}
                                        defaultValue={coreServiceIds[0]}
                                    />
                                </ReferenceInput>
                            </Grid2>
                            <Grid2 size={12}>
                                <ReferenceInput 
                                    source="packageGroupId" 
                                    reference="package-group"
                                    perPage={1000}
                                >
                                    <AutocompleteInput 
                                        optionText="name" 
                                        fullWidth
                                        label="Package Group"
                                        helperText="Select the package group that the package belongs to"
                                        defaultValue={packageGroupIds[0]}
                                    />
                                </ReferenceInput>
                            </Grid2>
                            <Grid2 size={12}>
                                <ReferenceArrayInput 
                                    source="addons" 
                                    reference="addon"
                                    perPage={1000}
                                >
                                    <AutocompleteArrayInput 
                                        optionText="name" 
                                        fullWidth
                                        label="Addons"
                                        helperText="Select the addons that are available in the package"
                                    />
                                </ReferenceArrayInput>
                            </Grid2>
                            <Grid2 size={12}>
                                <ReferenceArrayInput 
                                    source="features" 
                                    reference="feature"
                                    perPage={1000}
                                >
                                    <AutocompleteArrayInput 
                                        optionText="name" 
                                        fullWidth
                                        label="Features"
                                        helperText="Select the features that are included in the package"
                                        validate={required()}
                                    />
                                </ReferenceArrayInput>
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
                                        helperText="Select the decks that use this package"
                                    />
                                </ReferenceArrayInput>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Grid2>
            </Grid2>
    )
}

export default PackageFormFields 