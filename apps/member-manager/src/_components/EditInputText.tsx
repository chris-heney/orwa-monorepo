import React from 'react';
import { Box, TextField as MuiTextField, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditableChip from './editableChip';
import { useTheme } from '@mui/material/styles';
    import { handleAddItem, addItem, formatItem, handleDeleteItem, handleEditItem, saveItems } from '../_utils';

interface EditInputTextProps {
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

const EditInputText: React.FC<EditInputTextProps> = ({
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
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => handleAddItem(e, inputValue, () => addItem(items, setItems, inputValue, setInputValue, editIndex, setEditIndex, (value) => formatItem(value, dataType, category), (newItems) => saveItems(newItems, dataType, field), unique, setShowInput))}
                    label={`Add ${label}`}
                    fullWidth
                    sx={{
                        '& .MuiFilledInput-root': {
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px',
                        },
                        '& ::before': {
                            display: 'none',
                        }
                    }}
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
                <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                    {items.filter(item => item.trim() !== '').map((item, index) => (
                        <EditableChip
                            item={item}
                            index={index}
                            onDelete={(itemToDelete) => handleDeleteItem(itemToDelete, items, setItems, (newItems) => saveItems(newItems, dataType, field), unique, setShowInput)}
                            onEdit={(index) => handleEditItem(index, items, setInputValue, setEditIndex, unique, setShowInput)}
                            showEditIcon={true}
                            unique={unique}
                            element="inputText"
                            dataType={dataType}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default EditInputText;
