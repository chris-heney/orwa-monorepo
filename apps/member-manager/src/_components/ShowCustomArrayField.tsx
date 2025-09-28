import React from 'react';
import { useRecordContext, ArrayField as RAArrayField } from 'react-admin';

export const CustomArrayField = ({ source, children }: { source: string, children: React.ReactNode }) => {
    const record = useRecordContext();
    if (!record || !Array.isArray(record[source])) {
        return null;
    }
    return (
        <RAArrayField source={source}>
            {children}
        </RAArrayField>
    );
};

export default CustomArrayField;
