import React from 'react';
import { Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';

interface EditableChipProps {
    item: string;
    index: number;
    onDelete: (item: string) => void;
    onEdit?: (index: number) => void;
    showEditIcon?: boolean;
    unique?: boolean;
    element?: string;
    dataType?: string;
}

const EditableChip: React.FC<EditableChipProps> = ({ item, index, onDelete, onEdit, showEditIcon, unique, element, dataType }) => {
    const theme = useTheme();
    const showDeleteIcon = !(unique && element === 'inputText' && dataType === 'string');

    return (
        <Chip
            sx={{
                backgroundColor: `${theme.palette.primary.main}95`,
                '& .MuiChip-icon': { color: 'black', fontSize: '1rem' },
                '& .MuiChip-label': { color: 'black' },
                '&:hover': {
                    backgroundColor: `${theme.palette.secondary.dark}80`
                },
            }}
            key={index}
            label={item}
            onDelete={showDeleteIcon ? () => onDelete(item) : undefined}
            deleteIcon={showDeleteIcon ? <DeleteIcon sx={{ fill: 'black' }} /> : undefined}
            icon={
                showEditIcon && onEdit ? (
                    <IconButton onClick={() => onEdit(index)}>
                        <EditIcon sx={{ color: 'black' }} />
                    </IconButton>
                ) : undefined
            }
        />
    );
};

export default EditableChip;
