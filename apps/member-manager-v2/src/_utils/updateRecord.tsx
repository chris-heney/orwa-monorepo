import { DataProvider } from 'react-admin';
import { FieldValues } from 'react-hook-form';
import { UseNotifyFunction } from './types';


export const updateRecord = async (
    data: FieldValues,
    record: FieldValues,
    dataProvider: DataProvider,
    notify: UseNotifyFunction,
    //   remove: UseRemove,
    refresh: () => void,
    resource: string,
    onUpdate?: (updatedRecord?: any) => void
) => {
    const recordData = {
        ...data,
    };
    const title = resource
        .split('-')
        .map((word, index) =>
            index === 0
                ? word.charAt(0).toUpperCase() + word.slice(1)
                : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(' ')
        .replace(/(?:s)$/, '');

    try {
       const response = await dataProvider.update(`${resource}`, {
            id: !record ? recordData.id : record.id,
            data: recordData,
            previousData: !record ? recordData : record,
        })
        if (onUpdate) {
            onUpdate(response.data);
        }
        notify(`${title} was Updated`, { type: 'success' });
        refresh();
    } catch (error: any) {  
        console.error('Error updating conference attendee:', error);
        notify(`Error updating ${title}: ${error.message}`, { type: 'error' });
    }
    //   remove(`${resource}.datagrid.expanded`)
};
