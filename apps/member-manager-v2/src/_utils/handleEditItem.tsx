import React from 'react';

export const handleEditItem = (
    index: number,
    items: string[],
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    setEditIndex: React.Dispatch<React.SetStateAction<number | null>>,
    unique: boolean,
    setShowInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setInputValue(items[index]);
    setEditIndex(index);
    if (unique) setShowInput(true);
};
