import { Box} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useRecordContext,  Button } from 'react-admin';

export const LogoFileField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const handleDownload = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop() || 'logo';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Box component="img" src={record.src} alt="Logo" sx={{ maxHeight: '50px' }} />
            <Button 
                variant="contained" 
                startIcon={<DownloadIcon />} 
                onClick={() => handleDownload(record.src)}
                label='Download'
            >
              
            </Button>
        </Box>
    );
};

export default LogoFileField