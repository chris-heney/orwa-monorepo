import React from 'react';
import { useDataProvider, useRecordContext } from 'react-admin';
import { TextInput } from 'react-admin';
import { validateModelField } from '../_utils/validateModelName';

const ValidateEmailInput = ({required = true}: {required?: boolean}) => {
    const dataProvider = useDataProvider();
    const record = useRecordContext();

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;   

    return (
        <TextInput
            required={required}
            source="email"
            validate={(value: string) => {
                if (required && !value) {
                    return 'Email is required';
                }
                if (!regex.test(value)) {
                    return 'Invalid email address';
                }
                return validateModelField(
                    value,
                    'contact',
                    'email',
                    dataProvider,
                    record
                )
            }}  
            fullWidth
        />
    );
};

export default ValidateEmailInput;
