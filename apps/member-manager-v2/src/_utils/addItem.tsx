import React from 'react';

export const addItem = (
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    inputValue: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    editIndex: number | null,
    setEditIndex: React.Dispatch<React.SetStateAction<number | null>>,
    formatItem: (value: string) => string,
    saveItems: (newItems: string[]) => void,
    unique: boolean,
    setShowInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (editIndex !== null) {
        const newItems = items.map((item, index) => (index === editIndex ? formatItem(inputValue) : item));
        setEditIndex(null);
        saveItems(newItems);
    } else {
        const newItems = [...items, formatItem(inputValue)];
        setItems(newItems);
        saveItems(newItems);
    }
    setInputValue('');
    if (unique) setShowInput(false);
};
