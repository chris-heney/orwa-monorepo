import React from 'react';

export const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    saveItems: (newItems: string[]) => void
) => {
    if (event.target.files) {
        const newItems = [...items, ...Array.from(event.target.files).map(file => URL.createObjectURL(file))];
        setItems(newItems);
        saveItems(newItems);
    }
};
