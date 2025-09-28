export const handleAddButtonClick = (inputValue: string, addItem: () => void) => {
    if (inputValue.trim() !== '') {
        addItem();
    }
};
