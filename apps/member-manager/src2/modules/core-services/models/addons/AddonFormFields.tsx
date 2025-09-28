import React, { useState } from 'react';
import {
    TextInput,
    NumberInput,
    SelectInput,
    ReferenceInput,
    AutocompleteInput,
    required,
    minValue,
    ReferenceArrayInput,
    AutocompleteArrayInput,
    useRecordContext,
    useDataProvider,
} from 'react-admin';
import { Typography, Box, Grid2, Divider, Checkbox } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { validateModelField } from '../../../../_utils/validateModelName';

const AddonFormFields = () => {
    const { watch, setValue } = useFormContext();
    const coreServiceId = watch('coreServiceId');
    const record = useRecordContext();

    const [isRecurring, setIsRecurring] = useState(
        record?.investmentRecurring > 0 ? true : false
    );
    const [enableQty, setEnableQty] = useState(
        record?.quantity > 0 || record?.min > 0 || record?.max > 0
            ? true
            : false
    );

    const dataProvider = useDataProvider();

    return (
        <Box sx={{ p: 2, width: '100%' }}>
            <Grid2 container spacing={2}>
                {/* Left Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
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
                                label="Addon Name"
                                helperText="Enter the name of the addon"
                                validate={(value: string) =>
                                    validateModelField(
                                        value,
                                        'addon',
                                        'name',
                                        dataProvider,
                                        record
                                    )
                                }
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <TextInput
                                source="description"
                                fullWidth
                                multiline
                                rows={4}
                                label="Addon Description"
                                helperText="Provide a detailed description of the addon"
                                validate={required()}
                            />
                        </Grid2>
                    </Grid2>

                    <Box sx={{ my: 2 }}>
                        <Divider />
                    </Box>

                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                    >
                        Configuration Options
                    </Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 size={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Checkbox
                                    checked={isRecurring}
                                    onChange={() => {
                                        setIsRecurring(!isRecurring);

                                        if (!isRecurring) {
                                            // Enabling recurring - set default values
                                            setValue('investmentRecurring', 1, {
                                                shouldDirty: true,
                                            });
                                            setValue(
                                                'investmentFrequency',
                                                'MONTHLY',
                                                {
                                                    shouldDirty: true,
                                                }
                                            );
                                            // Only clear per-unit cost if quantity is not enabled
                                            if (!enableQty) {
                                                setValue('investmentEa', 0, {
                                                    shouldDirty: true,
                                                });
                                            }
                                        } else {
                                            // Disabling recurring - clear recurring values
                                            setValue('investmentRecurring', 0, {
                                                shouldDirty: true,
                                            });
                                        }
                                    }}
                                />
                                <Typography>Recurring Billing</Typography>
                            </Box>
                        </Grid2>
                        <Grid2 size={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Checkbox
                                    checked={enableQty}
                                    onChange={() => {
                                        setEnableQty(!enableQty);

                                        if (enableQty) {
                                            // Disabling quantity - clear quantity fields
                                            setValue('quantity', 0, {
                                                shouldDirty: true,
                                            });
                                            setValue('min', 0, {
                                                shouldDirty: true,
                                            });
                                            setValue('max', 0, {
                                                shouldDirty: true,
                                            });
                                            // Only clear per-unit cost if not recurring
                                            if (!isRecurring) {
                                                setValue('investmentEa', 0, {
                                                    shouldDirty: true,
                                                });
                                            }
                                        } else {
                                            // Enabling quantity - set default values
                                            setValue('quantity', 1, {
                                                shouldDirty: true,
                                            });
                                            setValue('min', 1, {
                                                shouldDirty: true,
                                            });
                                            setValue('max', 2, {
                                                shouldDirty: true,
                                            });
                                            // Only set per-unit cost if not recurring
                                            if (!isRecurring) {
                                                setValue('investmentEa', 1, {
                                                    shouldDirty: true,
                                                });
                                            }
                                        }
                                    }}
                                />
                                <Typography>Enable Quantity</Typography>
                            </Box>
                        </Grid2>
                    </Grid2>

                    <Box sx={{ my: 2 }}>
                        <Divider />
                    </Box>

                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color: 'primary.main',
                            fontWeight: 500,
                        }}
                    >
                        Investment Details
                    </Typography>
                    <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <NumberInput
                                    defaultValue={0}
                                    source="investmentSetup"
                                    label="Setup Cost"
                                    fullWidth
                                    validate={[
                                        // Only required if there's no per-unit cost AND no recurring cost
                                        watch('investmentEa') === 0 && watch('investmentRecurring') === 0 ? required('Setup Cost is required when no other costs are set') : () => undefined,
                                        minValue(0),
                                    ]}
                                />
                            </Grid2>
                        {isRecurring && (
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <NumberInput
                                    defaultValue={0}
                                    source="investmentRecurring"
                                    label={`Recurring Cost ${enableQty ? 'Per Unit' : ''}`}
                                    fullWidth
                                    validate={[required(), minValue(0)]}
                                />
                            </Grid2>
                        )}
                        {enableQty && !isRecurring && (
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <NumberInput
                                    defaultValue={0}
                                    source="investmentEa"
                                    label="Per Unit Cost"
                                    fullWidth
                                    validate={[required(), minValue(0)]}
                                />
                            </Grid2>
                        )}

                        {isRecurring && (
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <SelectInput
                                    source="investmentFrequency"
                                    choices={[
                                        { id: 'MONTHLY', name: 'Monthly' },
                                        { id: 'ANNUALLY', name: 'Annually' },
                                    ]}
                                    label="Billing Frequency"
                                    fullWidth
                                    validate={required()}
                                />
                            </Grid2>
                        )}
                    </Grid2>
                </Grid2>

                {/* Right Column */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    {enableQty && (
                        <>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ color: 'primary.main', fontWeight: 500 }}
                            >
                                Quantity Settings
                            </Typography>
                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <NumberInput
                                        source="quantity"
                                        label="Default Quantity"
                                        fullWidth
                                        defaultValue={1}
                                        validate={[required(), minValue(0)]}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <NumberInput
                                        source="min"
                                        label="Minimum Quantity"
                                        fullWidth
                                        defaultValue={1}
                                        validate={[required(), minValue(0)]}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <NumberInput
                                        source="max"
                                        label="Maximum Quantity"
                                        fullWidth
                                        defaultValue={10}
                                        validate={[required(), minValue(0)]}
                                    />
                                </Grid2>
                            </Grid2>

                            <Box sx={{ my: 2, mt: 5.6 }}>
                                <Divider />
                            </Box>
                        </>
                    )}
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color: 'primary.main',
                            fontWeight: 500,
                        }}
                    >
                        Service & Package Association
                    </Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                            <ReferenceInput
                                source="coreServiceId"
                                perPage={1000}
                                reference="core-service"
                            >
                                <AutocompleteInput
                                    optionText="name"
                                    fullWidth
                                    label="Core Service"
                                    helperText="Select the core service this feature belongs to"
                                    validate={required()}
                                />
                            </ReferenceInput>
                        </Grid2>
                    </Grid2>
                    <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                            <ReferenceArrayInput
                                source="packages"
                                perPage={1000}
                                reference="package"
                                filter={{
                                    coreServiceId: {
                                        $eq: coreServiceId,
                                    },
                                }}
                            >
                                <AutocompleteArrayInput
                                    optionText="name"
                                    fullWidth
                                    label="Packages"
                                    helperText="Select the packages this addon belongs to"
                                    validate={required()}
                                />
                            </ReferenceArrayInput>
                        </Grid2>
                        <Grid2 size={12}>
                            <ReferenceArrayInput
                                source="dependencies"
                                perPage={1000}
                                reference="addon"
                                filter={{
                                    coreServiceId: {
                                        $eq: coreServiceId,
                                    },
                                    // Exclude the current addon from the list to prevent self-dependency
                                    id: {
                                        $ne: record?.id,
                                    },
                                }}
                            >
                                <AutocompleteArrayInput
                                    optionText="name"
                                    fullWidth
                                    label="Dependencies"
                                    helperText="Select addons that this addon depends on (must be selected first)"
                                />
                            </ReferenceArrayInput>
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default AddonFormFields;
