import { DataProvider, RaRecord, useDataProvider, useRecordContext } from 'react-admin';
import { formatResourceTitle } from './formatResourceTitle';

export const validateModelField = async (
    value: string,
    model: string,
    field: string,
    dataProvider: DataProvider,
    record?: RaRecord
) => {
    const modelList = await dataProvider.getList(model, {
        pagination: { page: 1, perPage: 1000 },
    });

    if (!value) return `${field} is required`;

    if (modelList) {
        const existingModel = modelList?.data?.find(
            (model: RaRecord) =>
                model[field].toLowerCase() === value.toLowerCase() &&
                model.id !== record?.id
        );

        if (existingModel) {
            // Reset the input to trigger a re-render
            return `A ${formatResourceTitle(model)} with this name already exists`;
        }
    }

    return undefined;
};

export const useValidateModelField = (model: string, field: string) => {
    const dataProvider = useDataProvider();
    const record = useRecordContext();

    return (value: string) => validateModelField(value, model, field, dataProvider, record);
};