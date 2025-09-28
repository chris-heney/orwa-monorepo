import { InsertDriveFile as FileIcon, Folder as FolderIcon } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

export const FilePreview = () => {
    const record = useRecordContext();
    if (!record) return null;

    const isFolder = record.mimeType === 'application/x-directory' || /\/$/.test(record.fileName || '')
    const isImage = record.mimeType?.startsWith('image/');

    return (
        <Box display="flex" alignItems="center" gap={1}>
            {isFolder ? (
                <Avatar sx={{ width: 40, height: 40 }} variant="rounded">
                    <FolderIcon />
                </Avatar>
            ) : isImage ? (
                <Avatar
                    src={record.fileUrl}
                    sx={{ width: 40, height: 40 }}
                    variant="rounded"
                >
                    <FileIcon />
                </Avatar>
            ) : (
                <Avatar sx={{ width: 40, height: 40 }} variant="rounded">
                    <FileIcon />
                </Avatar>
            )}
            <Box>
                <Typography variant="body2" fontWeight="bold">
                    {record.originalName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {record.bucketName}
                </Typography>
            </Box>
        </Box>
    );
};