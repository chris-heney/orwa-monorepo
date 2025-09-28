import { InsertDriveFile as FileIcon, Folder as FolderIcon } from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material';
import { ConfirmDeleteButton } from './ConfirmDeleteButton';
import { useAssetProvider } from '../context/AssetProvider';
import { useRedirect } from 'react-admin';

interface FileGridCardProps {
    record: any;
}

export const FileGridCard = ({ record }: FileGridCardProps) => {
    const { setCurrentPath } = useAssetProvider();
    const redirect = useRedirect();
    if (!record) return null;

    const isFolder = record.mimeType === 'application/x-directory' || /\/$/.test(record.fileName || '')
    const isImage = record.mimeType?.startsWith('image/');
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleOpen = () => {
        if (isFolder) {
            const normalized = (record.fileName || '').replace(/\/+$/, '')
            setCurrentPath(normalized)
        } else {
            redirect(`/asset/${record.id}/show`)
        }
    }

    return (
        <Card onClick={handleOpen} sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
            {isFolder ? (
                <Box
                    sx={{
                        height: 220,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100',
                    }}
                >
                    <FolderIcon sx={{ fontSize: 60, color: 'grey.500' }} />
                </Box>
            ) : isImage ? (
                <CardMedia
                    component="img"
                    height="240"
                    image={record.fileUrl}
                    alt={record.originalName}
                    sx={{ objectFit: 'cover' }}
                />
            ) : (
                <Box
                    sx={{
                        height: 220,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100',
                    }}
                >
                    <FileIcon sx={{ fontSize: 60, color: 'grey.500' }} />
                </Box>
            )}
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" noWrap>
                    {record.originalName}
                </Typography>
                <Box display="flex" gap={0.5} mt={1} mb={1}>
                    <Typography
                        variant="caption"
                        sx={{
                            bgcolor: 'primary.light',
                            color: 'white',
                            px: 0.5,
                            borderRadius: 0.5,
                        }}
                    >
                        {record.bucketName}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            bgcolor: 'secondary.light',
                            color: 'white',
                            px: 0.5,
                            borderRadius: 0.5,
                        }}
                    >
                        {record.mimeType}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {formatFileSize(record.fileSize)}
                </Typography>
                {record.description && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {record.description}
                    </Typography>
                )}
            </CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1, pb: 1 }} onClick={(e) => e.stopPropagation()}>
                <ConfirmDeleteButton size="small" />
            </Box>
        </Card>
    );
};