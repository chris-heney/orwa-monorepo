import { SelectChangeEvent } from '@mui/material';
import React from 'react';

export const handleCategoryChange = (
    event: SelectChangeEvent<string>,
    setCategory: React.Dispatch<React.SetStateAction<string>>
) => {
    setCategory(event.target.value);
};
