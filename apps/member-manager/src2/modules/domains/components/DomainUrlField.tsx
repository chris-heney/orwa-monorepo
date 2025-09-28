import { Box, Typography, IconButton } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { OpenInNew as ExternalLinkIcon } from '@mui/icons-material';

export const DomainUrlField = () => {
    const record = useRecordContext();
    
    if (!record?.url) {
        return (
            <Typography variant="body2" color="textSecondary">
                No URL
            </Typography>
        );
    }
    
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" component="a" href={record.url} target="_blank" rel="noopener noreferrer">{record.url}</Typography>
            <IconButton 
                size="small" 
                onClick={() => window.open(record.url, '_blank')}
                sx={{ padding: 0.25 }}
            >
                <ExternalLinkIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}; 