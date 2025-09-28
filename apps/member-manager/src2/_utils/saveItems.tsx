export const saveItems = (
    newItems: string[],
    dataType: string,
    field: any
) => {
    let formattedValue;
    switch (dataType) {
        case 'commaString':
            formattedValue = newItems.join(', ');
            break;
        case 'array':
            formattedValue = newItems;
            break;
        case 'string':
            formattedValue = newItems[0] || '';
            break;
        default:
            formattedValue = newItems;
    }
    field.onChange(formattedValue);
};
