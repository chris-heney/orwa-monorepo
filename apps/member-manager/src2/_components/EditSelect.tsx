import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditableChip from './editableChip';
import { handleSelectChange, handleDeleteItem, saveItems, handleEditItem } from '../_utils';

interface EditSelectProps {
    source: string;
    items: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
    dataType: string;
    field: any;
    unique: boolean;
    showInput: boolean;
    setShowInput: React.Dispatch<React.SetStateAction<boolean>>;
    selectOptions?: string[];
    label?: string;
    category?: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
    onChange?: (e: any) => void;
}

const EditSelect: React.FC<EditSelectProps> = ({
    source,
    items,
    setItems,
    dataType,
    field,
    unique,
    showInput,
    setShowInput,
    selectOptions,
    label,
    category = '',
    setInputValue,
    setEditIndex,
    onChange
}) => {
    const theme = useTheme();

    return unique ? (
        <Box>
            {showInput && (
                <FormControl>
                    <InputLabel>{`Select ${label}`}</InputLabel>
                    <Select
                        sx={{
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px',
                        }}
                        disableUnderline
                        value={items}
                        onChange={(e) => {
                            handleSelectChange(e, setItems, (newItems) => saveItems(newItems, dataType, field), unique, setShowInput);
                            if (onChange) {
                                onChange(e);
                            }
                        }}
                    >
                        {selectOptions?.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {items.filter(item => item.trim() !== '').map((item, index) => (
                    <EditableChip
                        item={item}
                        index={index}
                        onDelete={(itemToDelete) => handleDeleteItem(itemToDelete, items, setItems, (newItems) => saveItems(newItems, dataType, field), unique, setShowInput)}
                        onEdit={(index) => handleEditItem(index, items, setInputValue, setEditIndex, unique, setShowInput)}
                        showEditIcon={true}
                    />
                ))}
            </Box>
        </Box>
    ) : (
        <Box>
            <FormControl>
                <InputLabel>{`Select ${label}`}</InputLabel>
                <Select
                    sx={{
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                    }}
                    disableUnderline
                    multiple
                    value={items}
                    onChange={(e) => {
                        handleSelectChange(e, setItems, (newItems) => saveItems(newItems, dataType, field), unique, setShowInput);
                        if (onChange) {
                            onChange(e);
                        }
                    }}
                    renderValue={(selected) => (
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {(selected as string[]).filter(value => value.trim() !== '').map((value) => (
                                <Chip
                                    sx={{
                                        backgroundColor: `${theme.palette.primary.main}95`,
                                    }}
                                    key={value} label={value} />
                            ))}
                        </Box>
                    )}
                >
                    {selectOptions?.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default EditSelect;
