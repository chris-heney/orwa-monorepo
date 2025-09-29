import React from 'react';

export const handleAddItem = (
    event: React.KeyboardEvent,
    inputValue: string,
    addItem: () => void
) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
        event.preventDefault();
        addItem();
    }
};
