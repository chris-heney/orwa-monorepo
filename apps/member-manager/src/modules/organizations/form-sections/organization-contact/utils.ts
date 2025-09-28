import { RaRecord } from 'react-admin';
import { FieldValues } from 'react-hook-form';

export const transform = (data: FieldValues, record?: RaRecord) => {
    return {
        ...data,
        organizationContacts: !data?.organizationContacts[0]?.id
            ? {
                  title: record?.title || 'Developer',
                  organizationId: record?.id,
                  contactType: data.organizationContacts.contactType,
              }
            : {
                  id: data.organizationContacts[0].id ?? null,
                  title: record?.title || 'Developer',
                  organizationId: record?.id,
                  contactType: data.organizationContacts.contactType,
              },
    };
};

export const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    
    // Extract only digits from the input (handles both formatted and unformatted numbers)
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Handle partial inputs
    if (digitsOnly.length < 4) {
        return digitsOnly.length ? `(${digitsOnly}` : '';
    } else if (digitsOnly.length < 7) {
        return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
    } else {
        return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
    }
};