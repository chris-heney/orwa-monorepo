import React from 'react';
import { Box, TextField as MuiTextField, FormControl, InputLabel, Select, MenuItem, IconButton, Chip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import { handleAddItem, addItem, formatItem, handleDeleteItem, handleEditItem, saveItems } from '../_utils';


interface EditInputSelectProps {
    source: string;
    items: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
    dataType: string;
    field: any;
    unique: boolean;
    showInput: boolean;
    setShowInput: React.Dispatch<React.SetStateAction<boolean>>;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    editIndex: number | null;
    setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
    label?: string;
    category?: string;
    categoryOptions?: string[];
    setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const EditInputSelect: React.FC<EditInputSelectProps> = ({
    source,
    items,
    setItems,
    dataType,
    field,
    unique,
    showInput,
    setShowInput,
    inputValue,
    setInputValue,
    editIndex,
    setEditIndex,
    label,
    category = '',
    categoryOptions,
    setCategory
}) => {
    const theme = useTheme();
    return (
        <Box>
            {showInput && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MuiTextField
                        sx={{ 
                            flex: 6,
                            '& .MuiFilledInput-root': {
                                borderBottomLeftRadius: '10px',
                                borderBottomRightRadius: '10px',
                            },
                            '& ::before': {
                                display: 'none',
                            }
                        }}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => handleAddItem(e, inputValue, () => addItem(items, setItems, inputValue, setInputValue, editIndex, setEditIndex, (value) => formatItem(value, dataType, category), (newItems) => saveItems(newItems, dataType, field), unique, setShowInput))}
                        label={`Add ${label}`}
                        fullWidth
                    />
                    <FormControl sx={{ flex: 3, minWidth: 120 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            sx={{
                                borderBottomLeftRadius: '10px',
                                borderBottomRightRadius: '10px',
                            }}
                            disableUnderline
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categoryOptions?.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton
                        color="primary"
                        sx={{
                            backgroundColor: `${theme.palette.primary.main}95`,
                            color: "black",
                            borderRadius: '5px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                        }}
                        onClick={() => addItem(items, setItems, inputValue, setInputValue, editIndex, setEditIndex, (value) => formatItem(value, dataType, category), (newItems) => saveItems(newItems, dataType, field), unique, setShowInput)} 
                    >
                        <AddCircleIcon />
                    </IconButton>
                </Box>
            )}

            <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {items.map((item, index) => (
                    <Chip
                        sx={{
                            backgroundColor: `${theme.palette.primary.main}95`, 
                            '& .MuiChip-icon': { color: 'black', fontSize: '1rem' },
                            '& .MuiChip-label': { color: 'black' },
                            '&:hover': {
                                backgroundColor: `${theme.palette.secondary.dark}80` 
                            },
                            '& .MuiFilledInput-root': {
                                borderBottomLeftRadius: '10px',
                                borderBottomRightRadius: '10px',
                            },
                            '& ::before': {
                                display: 'none',
                            }
                        }}
                        key={index}
                        label={item}
                        onDelete={() => handleDeleteItem(item, items, setItems, (newItems) => saveItems(newItems, dataType, field), unique, setShowInput)}
                        deleteIcon={<DeleteIcon sx={{ fill: 'black' }} />}
                        icon={
                            <IconButton onClick={() => handleEditItem(index, items, setInputValue, setEditIndex, unique, setShowInput)}>
                                <EditIcon sx={{ color: 'black' }} />
                            </IconButton>
                        }
                    />
                ))}
            </Box>
        </Box>
    );
};

export default EditInputSelect;
