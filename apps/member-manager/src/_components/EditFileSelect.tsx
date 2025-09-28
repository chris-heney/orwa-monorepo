import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, IconButton, Chip } from '@mui/material';
import { FileInput } from 'react-admin';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

interface EditFileSelectProps {
    source: string;
    items: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
    categoryOptions: string[];
    field: any;
    unique: boolean;
}

const EditFileSelect: React.FC<EditFileSelectProps> = ({
    source,
    items,
    setItems,
    categoryOptions,
    field,
    unique
}) => {
    const theme = useTheme();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const handleAddFile = () => {
        if (selectedFile && selectedCategory) {
            const newItem = `${selectedFile.name}[${selectedCategory}]`;
            setItems([...items, newItem]);
            setSelectedFile(null);
            setSelectedCategory('');
        }
    };

    const handleDeleteItem = (itemToDelete: string) => {
        setItems(items.filter(item => item !== itemToDelete));
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileInput
                    sx={{
                        "& .RaFileInput-dropZone": {
                            background: `${theme.palette.primary.main}30`,
                        },
                        flex: 6
                    }}
                    source={source}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    inputProps={{ multiple: false }}
                    label={false}
                />
                <FormControl sx={{ flex: 3, minWidth: 120 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        sx={{
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px',
                        }}
                        disableUnderline
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categoryOptions.map((option) => (
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
                    onClick={handleAddFile}
                >
                    <AddCircleIcon />
                </IconButton>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {items.map((item, index) => (
                    <Chip
                        key={index}
                        label={item}
                        onDelete={() => handleDeleteItem(item)}
                        deleteIcon={<DeleteIcon sx={{ fill: 'black' }} />}
                        sx={{
                            backgroundColor: `${theme.palette.primary.main}95`,
                            '& .MuiChip-label': { color: 'black' },
                            '&:hover': {
                                backgroundColor: `${theme.palette.secondary.dark}80`
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default EditFileSelect;
