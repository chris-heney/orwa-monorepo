import { Chip } from '@mui/material';
import { useRecordContext } from 'react-admin';

// Category color mapping
export const getCategoryColor = (category: string) => {
    const colors = {
        CONTENT: '#FF6B6B',
        DESIGN: '#4ECDC4',
        DEVELOPMENT: '#45B7D1',
        SUPPORT: '#96CEB4',
        MARKETING: '#FECA57',
        ADMIN: '#FF9FF3',
        OTHER: '#95A5A6',
    };
    return colors[category as keyof typeof colors] || colors.OTHER;
};

export const AppCategoryField = () => {
    const record = useRecordContext();

    if (!record || !record.category) return null;

    return (
        <Chip
            label={record.category.toLowerCase()}
            size="small"
            sx={{
                backgroundColor: getCategoryColor(record.category),
                color: 'white',
                textTransform: 'capitalize',
                fontWeight: 500,
            }}
        />
    );
};
