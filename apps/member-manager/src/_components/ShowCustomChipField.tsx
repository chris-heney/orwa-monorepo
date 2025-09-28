import DownloadIcon from '@mui/icons-material/Download';
import { useRecordContext} from 'react-admin';
import { Chip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTheme } from '@mui/material/styles';

export const CustomChipField = ({ iconType }: { iconType?: 'copy' | 'download' | 'launch' }) => {
    const record = useRecordContext();
    const theme = useTheme();

    if (!record) return null;

    const value = typeof record === 'object' && record !== null ? record.src || record.title : record;

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        if (iconType === 'copy') {
            navigator.clipboard.writeText(value);
        } else if (iconType === 'launch') {
            window.open(value, '_blank');
        }
        // Download icon does nothing for now
    };

    return (
        <Chip
            label={value}
            {...(iconType && {
                icon: iconType === 'copy' ? (
                    <ContentCopyIcon />
                ) : iconType === 'download' ? (
                    <DownloadIcon />
                ) : iconType === 'launch' ? (
                    <LaunchIcon />
                ) : undefined
            })}
            clickable
            onClick={handleClick}
            sx={{
                backgroundColor: `${theme.palette.primary.main}95`,
                '& .MuiChip-icon': { color: 'black', fontSize: '1rem' },
                '& .MuiChip-label': {  color: 'black' },
                '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}50`
                },
            }}
        />
    );
};

export default CustomChipField;