import { Grid2 } from '@mui/material';
import {
    NumberInput,
    required,
    SelectInput,
    TextInput,
    useRecordContext,
} from 'react-admin';
import ArrayPhoneInput from '../../../../_components/ArrayPhoneInput';
import { AutofillAddressInput } from '../../../../_components/AutofillAddressInput';
import ValidateEmailInput from '../../../../_components/ValidateEmailInput';

const CONTACT_TYPES = [
    { id: 'VENDOR', name: 'Vendor' },
    { id: 'EMPLOYEE', name: 'Employee' },
    { id: 'CONTRACTOR', name: 'Contractor' },
    { id: 'CUSTOMER', name: 'Customer' },
    { id: 'PARTNER', name: 'Partner' },
    { id: 'CONSULTANT', name: 'Consultant' },
    { id: 'INVESTOR', name: 'Investor' },
    { id: 'ADVISOR', name: 'Advisor' },
];

export const OrganizationContactFormFields = () => {
    const record = useRecordContext();
    console.log(record);

    return (
        <Grid2 container spacing={2} p={2}>
            <Grid2
                size={{
                    xs: 12,
                    md: 4,
                }}
            >
                <TextInput
                    source="first"
                    validate={required()}
                    fullWidth
                    helperText={false}
                />
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                    md: 4,
                }}
            >
                <TextInput
                    source="last"
                    validate={required()}
                    fullWidth
                    helperText={false}
                />
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                    md: 4,
                }}
            >
                <TextInput
                    source="title"
                    defaultValue="Developer"
                    fullWidth
                    helperText={false}
                />
            </Grid2>

            <Grid2
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <ValidateEmailInput />
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <SelectInput
                    source="organizationContacts.contactType"
                    choices={CONTACT_TYPES}
                    defaultValue={
                        record?.organizationContacts.find((contact: any) => {
                            return contact.contactId === record.id;
                        })?.contactType
                    }
                    validate={required('Contact Type is required')}
                    helperText="What type of contact is this?"
                    label="Contact Type"
                    fullWidth
                />
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <ArrayPhoneInput source="phones" />
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <AutofillAddressInput source="address" />
            </Grid2>

            <Grid2
                hidden
                size={{
                    xs: 12,
                }}
            >
                <NumberInput
                    source="organizationContacts.id"
                    defaultValue={
                        record?.organizationContacts.find(
                            (contact: any) => contact.id === record.id
                        )?.id
                    }
                    helperText="Contact ID"
                    label="Contact ID"
                    fullWidth
                    hidden
                />
            </Grid2>
        </Grid2>
    );
};
