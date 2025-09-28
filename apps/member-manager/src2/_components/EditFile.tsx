import React from 'react';
import { FileInput } from 'react-admin';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditableChip from './editableChip';
import {
    handleFileSelect,
    handleDeleteItem,
    saveItems
} from '../_utils';

interface EditFileProps {
    source: string;
    items: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
    dataType: string;
    field: any;
    unique: boolean;
    showInput: boolean;
    setShowInput: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditFile: React.FC<EditFileProps> = ({
    source,
    items,
    setItems,
    dataType,
    field,
    unique,
    showInput,
    setShowInput
}) => {
    const theme = useTheme();

    return unique ? (
        showInput && (
            <FileInput
                sx={{
                    "& .RaFileInput-dropZone": {
                        background: `${theme.palette.primary.main}30`,
                    }
                }}
                source={source}
                onChange={(e) => handleFileSelect(e, items, setItems, (newItems) => saveItems(newItems, dataType, field))}
                inputProps={{ multiple: true }}
                label={false}
            />
        )
    ) : (
        <Box>
            <FileInput
                sx={{
                    "& .RaFileInput-dropZone": {
                        background: `${theme.palette.primary.main}30`,
                    }
                }}
                source={source}
                onChange={(e) => handleFileSelect(e, items, setItems, (newItems) => saveItems(newItems, dataType, field))}
                inputProps={{ multiple: true }}
                label={false}
            />
            {items.filter(item => item.trim() !== '').length > 0 && (
                <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                    {items.filter(item => item.trim() !== '').map((item, index) => (
                        <EditableChip
                            item={item}
                            index={index}
                            onDelete={(itemToDelete) => handleDeleteItem(itemToDelete, items, setItems, (newItems) => saveItems(newItems, dataType, field), unique, setShowInput)}
                            showEditIcon={false}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default EditFile;
