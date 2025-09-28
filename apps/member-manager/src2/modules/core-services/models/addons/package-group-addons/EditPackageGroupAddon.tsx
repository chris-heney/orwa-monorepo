import { RowForm } from '@react-admin/ra-editable-datagrid';
import {
    AutocompleteInput,
    NumberInput,
    SelectInput,
    useRecordContext,
} from 'react-admin';
import { ReferenceInput } from 'react-admin';

const EditPackageGroupAddon = () => {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <RowForm>
            <ReferenceInput source="packageGroupId" reference="package-group">
                <AutocompleteInput
                    optionText="name"
                    fullWidth
                    label="Package Group"
                    helperText="Select the package group to associate with this feature"
                />
            </ReferenceInput>
            <NumberInput
                source="investmentSetup"
                label="Setup Cost"
                defaultValue={record.investmentSetup}
            />
            <NumberInput
                source="investmentRecurring"
                label="Recurring Cost"
                defaultValue={record.investmentRecurring}
            />
            <NumberInput
                source="investmentEa"
                label="Per Unit Cost"
                defaultValue={record.investmentEa}
            />
            <NumberInput 
                source="quantity" 
                defaultValue={record.quantity} 
                label="Default Quantity"
                // helperText="-1: unlimited, 0: N/A, >0: specific qty"
            />
            <NumberInput 
                source="min" 
                defaultValue={record.min} 
                label="Minimum Quantity"
            />
            <NumberInput 
                source="max" 
                defaultValue={record.max} 
                label="Maximum Quantity"
            />
            <SelectInput
                source="investmentFrequency"
                label="Billing Frequency"
                // helperText="How often the recurring cost is billed"
                choices={[
                    { id: 'MONTHLY', name: 'Monthly' },
                    { id: 'ANNUALLY', name: 'Annually' },
                ]}
                defaultValue={record.investmentFrequency}
            />
        </RowForm>
    );
};

export default EditPackageGroupAddon;
