import { AutocompleteInput, ReferenceInput, SelectInput } from 'react-admin';
import { RowForm } from '@react-admin/ra-editable-datagrid';
import { NumberInput, useRecordContext } from 'react-admin';
import { FeatureRecord } from '../types';

const EditAddonPackage = () => {
    const record = useRecordContext<FeatureRecord>();

    if (!record) return null;

    return (
        <RowForm>
            <ReferenceInput source="packageId" reference="package">
                <AutocompleteInput
                    optionText="name"
                    fullWidth
                    label="Package"
                    helperText="Select the package to associate with this addon"
                />
            </ReferenceInput>
            <NumberInput 
                source="investmentSetup" 
                fullWidth 
                label="Setup"
            />
            <NumberInput 
                source="investmentRecurring" 
                fullWidth 
                label="Recurring"
            />
            <NumberInput 
                source="investmentEa" 
                fullWidth 
                label="Per Unit"
            />
            <NumberInput 
                source="quantity" 
                fullWidth 
                label="Default Quantity"
                // helperText="-1: unlimited, 0: N/A, >0: specific qty"
            />
            <NumberInput 
                source="min" 
                fullWidth 
                label="Minimum Quantity"
            />
            <NumberInput 
                source="max" 
                fullWidth 
                label="Maximum Quantity"
            />
            <SelectInput
                fullWidth
                source="investmentFrequency"
                label="Billing Frequency"
                // helperText="Billing frequency"
                choices={[
                    { id: 'MONTHLY', name: 'Monthly' },
                    { id: 'ANNUALLY', name: 'Annually' },
                ]}
            />
        </RowForm>
    );
};

export default EditAddonPackage;
