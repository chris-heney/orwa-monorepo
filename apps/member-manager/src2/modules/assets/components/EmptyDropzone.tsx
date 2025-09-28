import {
    CloudUpload as UploadIcon,
    InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNotify, useRefresh } from 'react-admin';
import { useAssetProvider } from '../context/AssetProvider';
import { config } from '../../../config';
import { clearResourceCache } from '../../../dataProvider/ciWebServices';

interface EmptyDropzoneProps {
    onUploadClick: () => void;
}

interface UploadingFile {
    file: File;
    progress: number;
    error?: string;
}

export const EmptyDropzone = ({ onUploadClick }: EmptyDropzoneProps) => {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const notify = useNotify();
    const refresh = useRefresh();
    const { selectedBucket, currentPath } = useAssetProvider();

    const displayPath = selectedBucket ? `${selectedBucket}${currentPath ? `/${currentPath}` : ''}` : '';

    const uploadFile = useCallback(async (file: File, index: number) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucketName', selectedBucket);
            formData.append('description', '');
            formData.append('tags', JSON.stringify([]));
            if (currentPath) {
                formData.append('folderPath', currentPath);
            }

            const result = await fetch(`${config.VITE_ASSET_API_URL}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!result.ok) {
                throw new Error(`Upload failed: ${result.status} ${result.statusText}`);
            }

            await result.json();

            // Update progress to 100%
            setUploadingFiles(prev =>
                prev.map((f, i) => (i === index ? { ...f, progress: 100 } : f))
            );

            notify('File uploaded successfully', { type: 'success' });
            
            // Clear React Admin cache and refresh
            clearResourceCache("asset");
            refresh();

            // Remove from uploading files after a delay
            setTimeout(() => {
                setUploadingFiles(prev => prev.filter((_, i) => i !== index));
            }, 2000);
        } catch (error) {
            setUploadingFiles(prev =>
                prev.map((f, i) =>
                    i === index
                        ? {
                              ...f,
                              progress: 0,
                              error: error instanceof Error ? error.message : 'Upload failed',
                          }
                        : f
                )
            );
            notify('Upload failed', { type: 'error' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayPath, currentPath]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (!selectedBucket) {
                onUploadClick(); // Open dialog to select bucket
                return;
            }

            const newUploadingFiles = acceptedFiles.map(file => ({
                file,
                progress: 0,
            }));

            setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

            // Upload each file
            newUploadingFiles.forEach((uploadingFile, index) => {
                uploadFile(uploadingFile.file, index + uploadingFiles.length);
            });
        },
        [selectedBucket, uploadingFiles.length, onUploadClick, uploadFile]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
                width: '100%',
                height: '100%',
                minHeight: '60vh',
            }}
        >
            {!selectedBucket && (
                <Alert severity="info" sx={{ mb: 3, maxWidth: 500 }}>
                    Drop files here to select a bucket, or click the upload button to choose one first.
                </Alert>
            )}

            <Card
                {...getRootProps()}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    p: 4,
                    width: '100%',
                    maxWidth: 800,
                    minHeight: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                    }
                }}
            >
                <input {...getInputProps()} />
                <CardContent>
                    <UploadIcon
                        sx={{ 
                            fontSize: 64, 
                            color: isDragActive ? 'primary.main' : 'text.secondary', 
                            mb: 2 
                        }}
                    />
                    <Typography variant="h5" gutterBottom>
                        {isDragActive ? 'Drop files here' : 'No files found'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        {selectedBucket ? `Upload files to "${displayPath}"` : 'Upload files to get started'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        {isDragActive 
                            ? 'Release to upload files'
                            : 'Drag and drop files here or click to browse'
                        }
                    </Typography>
                </CardContent>
            </Card>

            {/* Show uploading files */}
            {uploadingFiles.length > 0 && (
                <Box sx={{ mt: 3, width: '100%', maxWidth: 600 }}>
                    <Typography variant="h6" gutterBottom>
                        Uploading Files
                    </Typography>
                    {uploadingFiles.map((uploadingFile, index) => (
                        <Card key={index} sx={{ mb: 1 }}>
                            <CardContent sx={{ py: 1 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center" flex={1}>
                                        <FileIcon sx={{ mr: 1 }} />
                                        <Box flex={1}>
                                            <Typography variant="body2" noWrap>
                                                {uploadingFile.file.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatFileSize(uploadingFile.file.size)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {uploadingFile.progress === 100 ? (
                                            <Chip label="Complete" color="success" size="small" />
                                        ) : uploadingFile.error ? (
                                            <Chip label="Failed" color="error" size="small" />
                                        ) : (
                                            <Box width={100}>
                                                <LinearProgress
                                                    variant="indeterminate"
                                                    sx={{ height: 4, borderRadius: 2 }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                                {uploadingFile.error && (
                                    <Alert severity="error" sx={{ mt: 1 }}>
                                        {uploadingFile.error}
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
};