import React from 'react';

export const handleDeleteItem = (
    itemToDelete: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    saveItems: (newItems: string[]) => void,
    unique: boolean,
    setShowInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const newItems = items.filter(item => item !== itemToDelete);
    setItems(newItems);
    saveItems(newItems);
    if (unique) setShowInput(true);
};
