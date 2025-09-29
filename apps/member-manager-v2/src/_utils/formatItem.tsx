export const formatItem = (value: string, dataType: string, category: string) => {
    if (dataType === 'keyValue' && category) {
        return `${value} [${category}]`;
    }
    return value;
};
