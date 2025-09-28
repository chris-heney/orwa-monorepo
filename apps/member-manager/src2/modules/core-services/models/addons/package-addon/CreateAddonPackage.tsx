import React, { useState } from 'react';
import {
    AutocompleteInput,
    Create,
    NumberInput,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRecordContext,
    required,
    useGetList,
    useRefresh,
    minValue,
} from 'react-admin';
import { Grid2, Box, Typography, Checkbox, Divider } from '@mui/material';
import { createRecord } from '../../../../../_utils/createRecord';
import ModalHeader from '../../../../../_components/ModalHeader';
import { useFormContext } from 'react-hook-form';
import { Addon } from '@ci-connect/types';

const CreateAddonPackage = ({
    setIsCreating,
}: {
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const record = useRecordContext<Addon>();
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const refresh = useRefresh();

    const [packageInputKey, setPackageInputKey] = useState(0);

    const packageAddons = record?.packageAddons?.map((addon: any) => addon.packageId);

    // Add the same checkbox logic from AddonFormFields
    const [isRecurring, setIsRecurring] = useState(
        (record?.investmentRecurring || 0) > 0 ? true : false
    );
    const [enableQty, setEnableQty] = useState(
        (record?.quantity || 0) > 0 || (record?.min || 0) > 0 || (record?.max || 0) > 0
            ? true
            : false
    );

    // Fetch existing package features to check for duplicates
    const { data: packageFeatures } = useGetList('package-addon', {
        pagination: { page: 1, perPage: 1000 },
        filter: { featureId: record?.id },
    });

    if (!record) return null;

    const validatePackageFeature = async (values: any) => {
        const errors: Record<string, any> = {};

        // Required field validations
        if (!values.packageId) {
            errors.packageId = 'Package is required';
        }
        // Check for duplicate package and feature combination
        if (values.packageId && packageFeatures) {
            const existingFeature = packageFeatures.find(
                (feature: any) =>
                    feature.packageId === values.packageId &&
                    feature.featureId === record.id
            );

            if (existingFeature) {
                errors.packageId =
                    'This feature is already assigned to this package';
                // Force the packageId field to rerender
                setTimeout(() => setPackageInputKey(prev => prev + 1), 0);
            }
        }

        return errors;
    };

    const CreateFormContent = () => {
        const { watch, setValue } = useFormContext();

        return (
            <>
                <Grid2 size={{ xs: 12, md: 6 }} hidden>
                    <NumberInput
                        source="addonId"
                        defaultValue={record.id}
                    />
                </Grid2>
             
                <ReferenceInput
                    source="packageId"
                    reference="package"
                    key={packageInputKey}
                    filter={{
                        'coreServiceId': {
                            $eq: record.coreServiceId ,
                        },
                        ...(packageAddons?.length ? {
                            'id': {
                                $notIn: packageAddons,
                            },
                        } : {}),
                    }}
                >
                    <AutocompleteInput
                        optionText="name"
                        fullWidth
                        label="Package"
                        helperText="Select the package to associate with this feature"
                        validate={required()}
                    />
                </ReferenceInput>

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
                                defaultChecked={isRecurring}
                                checked={isRecurring}
                                onChange={() => {
                                    setIsRecurring(!isRecurring);

                                    if (!isRecurring) {
                                        // Enabling recurring - set default values
                                        setValue('investmentRecurring', record.investmentRecurring || 1, {
                                            shouldDirty: true,
                                        });
                                        setValue(
                                            'investmentFrequency',
                                            record.investmentFrequency || 'MONTHLY',
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
                                defaultChecked={enableQty}
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
                                        setValue('quantity', record.quantity || 1, {
                                            shouldDirty: true,
                                        });
                                        setValue('min', record.min || 1, {
                                            shouldDirty: true,
                                        });
                                        setValue('max', record.max || 2, {
                                            shouldDirty: true,
                                        });
                                        // Only set per-unit cost if not recurring
                                        if (!isRecurring) {
                                            setValue('investmentEa', record.investmentEa || 1, {
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
                
                <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Investment Details
                    </Typography>
                </Box>

                <Grid2 container spacing={2}>
                    <Grid2
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <NumberInput
                            source="investmentSetup"
                            fullWidth
                            label="Setup Cost"
                            helperText="One-time setup cost. If set to 0 with no Per Unit Cost, feature will display as 'Included'"
                            defaultValue={record.investmentSetup}
                            validate={[
                                // Only required if there's no per-unit cost AND no recurring cost
                                watch('investmentEa') === 0 && watch('investmentRecurring') === 0 ? required('Setup Cost is required when no other costs are set') : () => undefined,
                                minValue(0),
                            ]}
                        />
                    </Grid2>
                    {isRecurring && (
                        <Grid2
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <NumberInput
                                source="investmentRecurring"
                                label={`Recurring Cost ${enableQty ? 'Per Unit' : ''}`}
                                helperText="Regular recurring cost"
                                fullWidth
                                defaultValue={record.investmentRecurring}
                                validate={[required(), minValue(0)]}
                            />
                        </Grid2>
                    )}
                    {enableQty && !isRecurring && (
                        <Grid2
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <NumberInput
                                source="investmentEa"
                                label="Per Unit Cost"
                                helperText="Cost per additional unit. If provided, will display as '$/ea' in pricing"
                                fullWidth
                                defaultValue={record.investmentEa}
                                validate={[required(), minValue(0)]}
                            />
                        </Grid2>
                    )}
                    {isRecurring && (
                        <Grid2
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <SelectInput
                                fullWidth
                                source="investmentFrequency"
                                label="Billing Frequency"
                                helperText="How often the recurring cost is billed"
                                choices={[
                                    { id: 'MONTHLY', name: 'Monthly' },
                                    { id: 'ANNUALLY', name: 'Annually' },
                                ]}
                                defaultValue={record.investmentFrequency}
                                validate={required()}
                            />
                        </Grid2>
                    )}
                </Grid2>

                {enableQty && (
                    <>
                        <Box sx={{ mt: 2, mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                Quantity Settings
                            </Typography>
                        </Box>

                        <Grid2 container spacing={2}>
                            <Grid2
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <NumberInput
                                    source="quantity"
                                    label="Default Quantity"
                                    helperText="Set to -1 for unlimited, 0 if quantity doesn't apply, or positive value for specific quantity"
                                    fullWidth
                                    defaultValue={record.quantity}
                                    validate={[required(), minValue(0)]}
                                />
                            </Grid2>
                            <Grid2
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <NumberInput
                                    source="min"
                                    label="Minimum Quantity"
                                    helperText="Minimum allowed quantity. When min=max, quantity can't be edited"
                                    fullWidth
                                    defaultValue={record.min}
                                    validate={[required(), minValue(0)]}
                                />
                            </Grid2>
                            <Grid2
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <NumberInput
                                    source="max"
                                    label="Maximum Quantity"
                                    helperText="Maximum allowed quantity. Set same as min to lock quantity"
                                    fullWidth
                                    defaultValue={record.max}
                                    validate={[required(), minValue(0)]}
                                />
                            </Grid2>
                        </Grid2>
                    </>
                )}
            </>
        );
    };

        return (
        <Create redirect={false} resource="package-addon">
            <ModalHeader
                title="Add Package Addon"
                onClose={() => setIsCreating(false)}
            />
            <SimpleForm
                onSubmit={(data: any) =>
                    createRecord(
                        data,
                        dataProvider,
                        notify,
                        refresh,
                        'package-addon',
                        () => setIsCreating(false),
                    )
                }
                validate={validatePackageFeature}
            >
                <CreateFormContent />
            </SimpleForm>
        </Create>
    );
};

export default CreateAddonPackage;
