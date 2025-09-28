import { Avatar, Box, Tooltip } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { Apps as AppsIcon } from '@mui/icons-material';

interface AppIconFieldProps {
    record?: any;
    size?: 'small' | 'medium' | 'large';
}

export const AppIconField = ({ record: recordProp, size = 'small' }: AppIconFieldProps) => {
    const recordFromContext = useRecordContext();
    const record = recordProp || recordFromContext;

    if (!record) return null;

    // Define sizes for different size options
    const sizeMap = {
        small: { width: 32, height: 32, fontSize: '18px', iconSize: 'small' },
        medium: { width: 40, height: 40, fontSize: '22px', iconSize: 'small' },
        large: { width: 56, height: 56, fontSize: '32px', iconSize: 'large' },
    };

    const { width, height, fontSize, iconSize } = sizeMap[size];

    // If no icon is present, use a default icon
    if (!record.icon) {
        return (
            <Avatar sx={{ bgcolor: record.color || 'primary.main', width, height }}>
                <AppsIcon fontSize={iconSize as any} />
            </Avatar>
        );
    }

    // If icon is an emoji or a character
    return (
        <Tooltip title={record.name} arrow>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: record.color || 'primary.main',
                    color: '#fff',
                    borderRadius: '50%',
                    width,
                    height,
                    fontSize,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                }}
            >
                {record.icon}
            </Box>
        </Tooltip>
    );
};
