import {
    Delete as DeleteIcon,
    InsertDriveFile as FileIcon,
    CloudUpload as UploadIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    LinearProgress,
    Typography,
} from '@mui/material';
import { config } from '../../../config';
import React, { useCallback, useState } from 'react';
import { useNotify } from 'react-admin';
import { clearResourceCache } from '../../../dataProvider/ciWebServices';
import { useAssetProvider } from '../context/AssetProvider';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
    onUploadComplete: () => void;
}

interface UploadingFile {
    file: File;
    progress: number;
    error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    onUploadComplete,
}) => {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const notify = useNotify();
    const { currentPath, selectedBucket} = useAssetProvider();

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

            // Upload file to the content API
            const result = await fetch(`${config.VITE_ASSET_API_URL}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!result.ok) {
                throw new Error(
                    `Upload failed: ${result.status} ${result.statusText}`
                );
            }

            const responseData = await result.json();
            console.log('Upload successful:', responseData);

            // Update progress to 100%
            setUploadingFiles(prev =>
                prev.map((f, i) => (i === index ? { ...f, progress: 100 } : f))
            );

            notify('File uploaded successfully', { type: 'success' });
            
            // Clear React Admin cache for immediate UI update
            clearResourceCache('asset');
            onUploadComplete();

            // Remove from uploading files after a short delay
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
                              error:
                                  error instanceof Error
                                      ? error.message
                                      : 'Upload failed',
                          }
                        : f
                )
            );
            notify('Upload failed', { type: 'error' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBucket, currentPath]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (!selectedBucket) {
                notify('Please select a bucket first', { type: 'warning' });
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
        [selectedBucket, notify, uploadingFiles.length, uploadFile]
    );

    const removeFile = (index: number) => {
        setUploadingFiles(prev => prev.filter((_, i) => i !== index));
    };

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
        <Box>
            {!selectedBucket && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Please select a bucket before uploading files.
                </Alert>
            )}

            <Card
                {...getRootProps()}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    backgroundColor: isDragActive
                        ? 'action.hover'
                        : 'background.paper',
                    cursor: selectedBucket ? 'pointer' : 'not-allowed',
                    opacity: selectedBucket ? 1 : 0.5,
                    transition: 'all 0.2s',
                    p: 3,
                    textAlign: 'center',
                }}
            >
                <input {...getInputProps()} disabled={!selectedBucket} />
                <UploadIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                    {isDragActive
                        ? 'Drop files here'
                        : 'Drag & drop files here'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    or click to browse files
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    disabled={!selectedBucket}
                    sx={{ mt: 2 }}
                >
                    Choose Files
                </Button>
            </Card>

            {uploadingFiles.length > 0 && (
                <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                        Uploading Files
                    </Typography>
                    {uploadingFiles.map((uploadingFile, index) => (
                        <Card key={index} sx={{ mb: 1 }}>
                            <CardContent sx={{ py: 1 }}>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        flex={1}
                                    >
                                        <FileIcon sx={{ mr: 1 }} />
                                        <Box flex={1}>
                                            <Typography variant="body2" noWrap>
                                                {uploadingFile.file.name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {formatFileSize(
                                                    uploadingFile.file.size
                                                )}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        {uploadingFile.progress === 100 ? (
                                            <Chip
                                                label="Complete"
                                                color="success"
                                                size="small"
                                            />
                                        ) : uploadingFile.error ? (
                                            <Chip
                                                label="Failed"
                                                color="error"
                                                size="small"
                                            />
                                        ) : (
                                            <Box width={100}>
                                                <LinearProgress
                                                    variant="indeterminate"
                                                    sx={{
                                                        height: 4,
                                                        borderRadius: 2,
                                                    }}
                                                />
                                            </Box>
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={() => removeFile(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
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
