import React from 'react';
import { Box, TextField as MuiTextField, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { handleAddItem, addItem, formatItem, handleDeleteItem, handleEditItem, saveItems } from '../_utils';

interface EditLongInputTextProps {
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
}

const EditLongInputText: React.FC<EditLongInputTextProps> = ({
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
    category = ''
}) => {
    const theme = useTheme();

    return (
        <Box>
            {showInput && (
                <Box display="flex" alignItems="center" gap={1}>
                    <MuiTextField
                        sx={{
                            '& .MuiFilledInput-root': {
                                borderBottomLeftRadius: '10px',
                                borderBottomRightRadius: '10px',
                            },
                            '& ::before': {
                                display: 'none',
                            }
                        }}
                        multiline
                        rows={4}
                        variant="filled"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => handleAddItem(e, inputValue, () => addItem(items, setItems, inputValue, setInputValue, editIndex, setEditIndex, (value) => formatItem(value, dataType, category), (newItems) => saveItems(newItems, dataType, field), unique, setShowInput))}
                        label={`Add ${label}`}
                        fullWidth
                    />
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
            {items.filter(item => item.trim() !== '').length > 0 && (
                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    {items.filter(item => item.trim() !== '').map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                backgroundColor: `${theme.palette.primary.main}95`,
                                borderRadius: '16px',
                                padding: '8px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                '&:hover': {
                                    backgroundColor: `${theme.palette.secondary.dark}80`
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    color: 'black',
                                    wordBreak: 'break-word',
                                    flexGrow: 1,
                                    marginRight: '8px'
                                }}
                            >
                                {item}
                            </Typography>
                            <Box>
                                <IconButton onClick={() => handleEditItem(index, items, setInputValue, setEditIndex, unique, setShowInput)}>
                                    <EditIcon sx={{ color: 'black' }} />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteItem(item, items, setItems, (newItems) => saveItems(newItems, dataType, field), unique, setShowInput)}>
                                    <DeleteIcon sx={{ color: 'black' }} />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default EditLongInputText;
