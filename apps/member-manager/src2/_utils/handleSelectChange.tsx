import { SelectChangeEvent } from '@mui/material';
import React from 'react';

export const handleSelectChange = (
    event: SelectChangeEvent<string[]>,
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    saveItems: (newItems: string[]) => void,
    unique: boolean,
    setShowInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const newItems = Array.isArray(event.target.value) ? event.target.value as string[] : [event.target.value as string];
    setItems(newItems);
    saveItems(newItems);
    if (unique) setShowInput(false);
};
