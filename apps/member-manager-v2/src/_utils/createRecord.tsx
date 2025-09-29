import { FieldValues } from 'react-hook-form';
import {
    DataProvider,
    RaRecord,
} from 'react-admin';
import { formatResourceTitle } from './formatResourceTitle';
import { UseNotifyFunction } from './types';


export const createRecord = async (
    data: FieldValues,
    dataProvider: DataProvider,
    notify: UseNotifyFunction,
    refresh: () => any,
    resource: string,
    onCreate?: (record: RaRecord) => void,
    meta?: Record<string, any>
) => {
    const title = resource
        .split('-')
        .map((word, index) =>
            index === 0
                ? word.charAt(0).toUpperCase() + word.slice(1)
                : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(' ')
        .replace(/(?:s)$/, '');
    const recordData = {
        ...data,
    };
    try {
        const response = await dataProvider.create(`${resource}`, { data: recordData, meta });
        if (onCreate) {
            onCreate(response.data as RaRecord);
        }
        notify(`${formatResourceTitle(resource)} was Created`, { type: 'success' });
        refresh();
    } catch (error: any) {
        notify(`Error creating ${title}: ${error.message}`, { type: 'error' });
        console.log(error);
    }
};
